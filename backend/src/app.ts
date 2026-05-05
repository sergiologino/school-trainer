import Fastify from "fastify";
import cors from "@fastify/cors";
import type { Database } from "better-sqlite3";

type ContentPackageRow = {
  key: string;
  subject_slug: string | null;
  grade: number | null;
  package_type: string;
  format: string;
  version: number;
  checksum: string;
  size_bytes: number;
  published_at: string;
};

export function registerRoutes(app: Fastify.FastifyInstance, db: Database) {
  app.get("/api/health", async () => ({ ok: true }));

  app.get<{ Querystring: { subject?: string; grade?: string } }>(
    "/api/topics",
    async (req) => {
      const subject = req.query.subject ?? "math";
      const grade = Number(req.query.grade ?? "5") || 5;
      const rows = db
        .prepare(
          `SELECT id, title, emoji, description, color, bg_gradient, lessons_json
           FROM curriculum_topic WHERE subject_slug = ? AND grade = ? ORDER BY id`
        )
        .all(subject, grade) as Array<{
          id: string;
          title: string;
          emoji: string;
          description: string;
          color: string;
          bg_gradient: string;
          lessons_json: string;
        }>;

      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        emoji: r.emoji,
        description: r.description,
        color: r.color,
        bgGradient: r.bg_gradient,
        lessons: JSON.parse(r.lessons_json ?? "[]"),
      }));
    }
  );

  app.get("/api/bundle/russian", async (_req, reply) => {
    const row = db.prepare(`SELECT payload_json FROM content_bundle WHERE key = ?`).get(
      "russian_grade5"
    ) as { payload_json?: string } | undefined;
    if (!row?.payload_json) return reply.code(404).send({ error: "not_found" });
    return JSON.parse(row.payload_json);
  });

  app.get("/api/bundle/english", async (_req, reply) => {
    const row = db.prepare(`SELECT payload_json FROM content_bundle WHERE key = ?`).get(
      "english_vocab_grade5"
    ) as { payload_json?: string } | undefined;
    if (!row?.payload_json) return reply.code(404).send({ error: "not_found" });
    return JSON.parse(row.payload_json);
  });

  app.get<{
    Querystring: { grade?: string; subject?: string; platform?: "web" | "mobile" };
  }>("/api/content/manifest", async (req) => {
    const grade = req.query.grade ? Number(req.query.grade) : undefined;
    const subject = req.query.subject;
    const conditions = [`status = 'published'`];
    const params: Array<string | number> = [];

    if (Number.isFinite(grade)) {
      conditions.push(`grade = ?`);
      params.push(Number(grade));
    }
    if (subject) {
      conditions.push(`subject_slug = ?`);
      params.push(subject);
    }

    const rows = db
      .prepare(
        `
        SELECT key, subject_slug, grade, package_type, format, version, checksum, size_bytes, published_at
        FROM content_package
        WHERE ${conditions.join(" AND ")}
        ORDER BY grade, subject_slug, package_type, key
      `
      )
      .all(...params) as ContentPackageRow[];

    return {
      schemaVersion: 1,
      platform: req.query.platform ?? "web",
      generatedAt: new Date().toISOString(),
      packages: rows.map((row) => ({
        key: row.key,
        subject: row.subject_slug,
        grade: row.grade,
        type: row.package_type,
        format: row.format,
        version: row.version,
        checksum: row.checksum,
        sizeBytes: row.size_bytes,
        publishedAt: row.published_at,
        downloadUrl: `/api/content/packages/${encodeURIComponent(row.key)}`,
      })),
    };
  });

  app.get<{ Params: { key: string } }>("/api/content/packages/:key", async (req, reply) => {
    const row = db
      .prepare(
        `
        SELECT key, subject_slug, grade, package_type, format, version, checksum, size_bytes, payload_json, published_at
        FROM content_package
        WHERE key = ? AND status = 'published'
      `
      )
      .get(req.params.key) as (ContentPackageRow & { payload_json: string }) | undefined;

    if (!row?.payload_json) return reply.code(404).send({ error: "not_found" });
    reply.header("etag", `"${row.checksum}"`);
    reply.header("x-content-version", String(row.version));
    return JSON.parse(row.payload_json);
  });
}

export async function buildApp(db: Database) {
  const app = Fastify({ logger: false });
  await app.register(cors, { origin: true });
  registerRoutes(app, db);
  return app;
}
