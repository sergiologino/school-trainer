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

type SubjectSlug = "math" | "russian" | "english";

type LeaderboardRow = {
  user_id: string;
  subject_slug: SubjectSlug;
  name: string;
  avatar: string;
  score: number;
  level: number;
  streak: number;
  updated_at: string;
};

const SUBJECTS = new Set(["math", "russian", "english"]);

export function registerRoutes(app: Fastify.FastifyInstance, db: Database) {
  app.get("/api/health", async () => ({ ok: true }));

  app.post<{
    Body: {
      userId?: string;
      subject?: string;
      name?: string;
      avatar?: string;
      score?: number;
      level?: number;
      streak?: number;
    };
  }>("/api/leaderboard/score", async (req, reply) => {
    const userId = String(req.body.userId ?? "").trim();
    const subject = String(req.body.subject ?? "").trim();
    const name = String(req.body.name ?? "").trim();
    const avatar = String(req.body.avatar ?? "").trim();
    const score = Math.max(0, Math.floor(Number(req.body.score ?? 0)));
    const level = Math.max(1, Math.floor(Number(req.body.level ?? 1)));
    const streak = Math.max(0, Math.floor(Number(req.body.streak ?? 0)));

    if (!userId || !name || !avatar || !SUBJECTS.has(subject)) {
      return reply.code(400).send({ error: "invalid_leaderboard_score" });
    }

    db.prepare(
      `
      INSERT INTO leaderboard_score (user_id, subject_slug, name, avatar, score, level, streak, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, subject_slug) DO UPDATE SET
        name = excluded.name,
        avatar = excluded.avatar,
        score = excluded.score,
        level = excluded.level,
        streak = excluded.streak,
        updated_at = CURRENT_TIMESTAMP
    `
    ).run(userId, subject, name.slice(0, 80), avatar.slice(0, 16), score, level, streak);

    return { ok: true };
  });

  app.get<{ Querystring: { subject?: string; limit?: string } }>("/api/leaderboard", async (req, reply) => {
    const subject = req.query.subject ?? "global";
    const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 50) || 50));

    if (subject === "global") {
      const rows = db
        .prepare(
          `
          SELECT
            user_id,
            MAX(name) AS name,
            MAX(avatar) AS avatar,
            SUM(score) AS total_score,
            SUM(CASE WHEN subject_slug = 'math' THEN score ELSE 0 END) AS math_score,
            SUM(CASE WHEN subject_slug = 'russian' THEN score ELSE 0 END) AS russian_score,
            SUM(CASE WHEN subject_slug = 'english' THEN score ELSE 0 END) AS english_score,
            MAX(level) AS level,
            MAX(streak) AS streak,
            MAX(updated_at) AS updated_at
          FROM leaderboard_score
          GROUP BY user_id
          ORDER BY total_score DESC, updated_at DESC
          LIMIT ?
        `
        )
        .all(limit) as Array<{
        user_id: string;
        name: string;
        avatar: string;
        total_score: number;
        math_score: number;
        russian_score: number;
        english_score: number;
        level: number;
        streak: number;
        updated_at: string;
      }>;

      return {
        subject: "global",
        entries: rows.map((row, index) => ({
          rank: index + 1,
          id: row.user_id,
          name: row.name,
          avatar: row.avatar,
          totalScore: row.total_score,
          mathScore: row.math_score,
          russianScore: row.russian_score,
          englishScore: row.english_score,
          level: row.level,
          streak: row.streak,
          updatedAt: row.updated_at,
        })),
      };
    }

    if (!SUBJECTS.has(subject)) return reply.code(400).send({ error: "invalid_subject" });

    const rows = db
      .prepare(
        `
        SELECT user_id, subject_slug, name, avatar, score, level, streak, updated_at
        FROM leaderboard_score
        WHERE subject_slug = ?
        ORDER BY score DESC, updated_at DESC
        LIMIT ?
      `
      )
      .all(subject, limit) as LeaderboardRow[];

    return {
      subject,
      entries: rows.map((row, index) => ({
        rank: index + 1,
        id: row.user_id,
        name: row.name,
        avatar: row.avatar,
        score: row.score,
        level: row.level,
        streak: row.streak,
        updatedAt: row.updated_at,
      })),
    };
  });

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
