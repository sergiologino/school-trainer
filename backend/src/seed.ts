import { readFileSync, existsSync } from "fs";
import { createHash } from "crypto";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import type { Database } from "better-sqlite3";

const backendRoot = dirname(fileURLToPath(import.meta.url)); // …/backend/src or …/backend/dist when compiled

interface MathTopicSeed {
  id: string;
  title: string;
  emoji: string;
  color: string;
  bgGradient: string;
  description: string;
  lessons: unknown[];
}

function loadGeneratedBundles() {
  /* dist/seed.js → .. = backend/, src/seed.ts (tsx) → .. = backend/ */
  const root = join(backendRoot, "..");
  const gen = join(root, "content", "_generated");
  const bundlesPath = join(gen, "bundles.json");
  const mathPath = join(gen, "mathTopics.json");
  if (!existsSync(bundlesPath) || !existsSync(mathPath)) {
    throw new Error(
      "Missing generated content. Run: node scripts/extract-client-bundles.mjs (from backend folder)"
    );
  }
  const bundles = JSON.parse(readFileSync(bundlesPath, "utf8")) as {
    vocabulary: unknown[];
    russianTasks: unknown[];
    russianDictants: unknown[];
  };
  const mathTopics = JSON.parse(readFileSync(mathPath, "utf8")) as MathTopicSeed[];
  return { bundles, mathTopics };
}

function stableJson(value: unknown) {
  return JSON.stringify(value);
}

function checksum(payloadJson: string) {
  return createHash("sha256").update(payloadJson).digest("hex");
}

function upsertContentItem(
  db: Database,
  item: {
    id: string;
    subject_slug: string;
    grade: number;
    kind: string;
    title: string;
    payload: unknown;
  }
) {
  const payload_json = stableJson(item.payload);
  db.prepare(
    `
    INSERT INTO content_item (
      id, subject_slug, grade, kind, title, status, version, payload_json, checksum, updated_at
    ) VALUES (
      @id, @subject_slug, @grade, @kind, @title, 'published', 1, @payload_json, @checksum, CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      subject_slug = excluded.subject_slug,
      grade = excluded.grade,
      kind = excluded.kind,
      title = excluded.title,
      status = excluded.status,
      version = content_item.version + CASE
        WHEN content_item.checksum <> excluded.checksum THEN 1
        ELSE 0
      END,
      payload_json = excluded.payload_json,
      checksum = excluded.checksum,
      updated_at = CURRENT_TIMESTAMP
  `
  ).run({ ...item, payload_json, checksum: checksum(payload_json) });
}

function upsertContentPackage(
  db: Database,
  pkg: {
    key: string;
    subject_slug: string | null;
    grade: number | null;
    package_type: string;
    payload: unknown;
  }
) {
  const payload_json = stableJson({
    key: pkg.key,
    subject: pkg.subject_slug,
    grade: pkg.grade,
    type: pkg.package_type,
    format: "json",
    payload: pkg.payload,
  });
  const payloadChecksum = checksum(payload_json);

  db.prepare(
    `
    INSERT INTO content_package (
      key, subject_slug, grade, package_type, format, version, status,
      payload_json, checksum, size_bytes, published_at
    ) VALUES (
      @key, @subject_slug, @grade, @package_type, 'json', 1, 'published',
      @payload_json, @checksum, @size_bytes, CURRENT_TIMESTAMP
    )
    ON CONFLICT(key) DO UPDATE SET
      subject_slug = excluded.subject_slug,
      grade = excluded.grade,
      package_type = excluded.package_type,
      format = excluded.format,
      version = content_package.version + CASE
        WHEN content_package.checksum <> excluded.checksum THEN 1
        ELSE 0
      END,
      status = excluded.status,
      payload_json = excluded.payload_json,
      checksum = excluded.checksum,
      size_bytes = excluded.size_bytes,
      published_at = CURRENT_TIMESTAMP
  `
  ).run({
    ...pkg,
    payload_json,
    checksum: payloadChecksum,
    size_bytes: Buffer.byteLength(payload_json, "utf8"),
  });
}

export function runSeed(db: Database) {
  const { bundles, mathTopics } = loadGeneratedBundles();

  const now = new Date().toISOString();
  const subjects = [
    { slug: "math", title: "Математика" },
    { slug: "russian", title: "Русский язык" },
    { slug: "english", title: "Английский язык" },
  ];
  const grades = [4, 5, 6, 7, 8, 9, 10, 11];

  const upsertSubject = db.prepare(`
    INSERT INTO subject (slug, title, status, updated_at)
    VALUES (@slug, @title, 'active', @now)
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      status = excluded.status,
      updated_at = excluded.updated_at
  `);
  for (const subject of subjects) upsertSubject.run({ ...subject, now });

  const upsertGrade = db.prepare(`
    INSERT INTO grade (number, title, status, updated_at)
    VALUES (@number, @title, 'active', @now)
    ON CONFLICT(number) DO UPDATE SET
      title = excluded.title,
      status = excluded.status,
      updated_at = excluded.updated_at
  `);
  for (const number of grades) upsertGrade.run({ number, title: `${number} класс`, now });

  db.exec(`DELETE FROM curriculum_topic WHERE subject_slug = 'math' AND grade = 5`);
  const ins = db.prepare(`
    INSERT INTO curriculum_topic (
      id, subject_slug, grade, title, emoji, description, color, bg_gradient, lessons_json
    ) VALUES (
      @id, 'math', 5, @title, @emoji, @description, @color, @bg_gradient, @lessons_json
    )
  `);

  const insertMany = db.transaction((topics: MathTopicSeed[]) => {
    for (const t of topics) {
      ins.run({
        id: t.id,
        title: t.title,
        emoji: t.emoji,
        description: t.description,
        color: t.color,
        bg_gradient: t.bgGradient,
        lessons_json: JSON.stringify(t.lessons),
      });
    }
  });
  insertMany(mathTopics);

  for (const t of mathTopics) {
    upsertContentItem(db, {
      id: `math_grade5_topic_${t.id}`,
      subject_slug: "math",
      grade: 5,
      kind: "topic",
      title: t.title,
      payload: t,
    });
  }
  for (const task of bundles.russianTasks as Array<{ id: string; title: string }>) {
    upsertContentItem(db, {
      id: `russian_grade5_task_${task.id}`,
      subject_slug: "russian",
      grade: 5,
      kind: "task",
      title: task.title,
      payload: task,
    });
  }
  for (const dictant of bundles.russianDictants as Array<{ id: string; title: string }>) {
    upsertContentItem(db, {
      id: `russian_grade5_dictation_${dictant.id}`,
      subject_slug: "russian",
      grade: 5,
      kind: "dictation",
      title: dictant.title,
      payload: dictant,
    });
  }
  for (const word of bundles.vocabulary as Array<{ id: string; english: string; grade?: number }>) {
    upsertContentItem(db, {
      id: `english_grade${word.grade ?? 5}_word_${word.id}`,
      subject_slug: "english",
      grade: word.grade ?? 5,
      kind: "vocabulary_word",
      title: word.english,
      payload: word,
    });
  }

  upsertContentPackage(db, {
    key: "math_grade5_curriculum",
    subject_slug: "math",
    grade: 5,
    package_type: "curriculum",
    payload: { topics: mathTopics },
  });
  upsertContentPackage(db, {
    key: "russian_grade5_core",
    subject_slug: "russian",
    grade: 5,
    package_type: "core",
    payload: { tasks: bundles.russianTasks, dictants: bundles.russianDictants },
  });
  upsertContentPackage(db, {
    key: "english_grade5_vocabulary",
    subject_slug: "english",
    grade: 5,
    package_type: "vocabulary",
    payload: {
      words: (bundles.vocabulary as Array<{ grade?: number }>).filter((word) => word.grade === 5),
    },
  });

  db.prepare(`INSERT OR REPLACE INTO content_bundle (key, payload_json) VALUES (?, ?)`).run(
    "english_vocab_grade5",
    JSON.stringify({ words: bundles.vocabulary })
  );
  db.prepare(`INSERT OR REPLACE INTO content_bundle (key, payload_json) VALUES (?, ?)`).run(
    "russian_grade5",
    JSON.stringify({ tasks: bundles.russianTasks, dictants: bundles.russianDictants })
  );
}
