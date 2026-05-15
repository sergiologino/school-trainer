import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function getDbPath() {
  const env = process.env.DATABASE_PATH;
  if (env) return env;
  return join(__dirname, "..", "..", "data", "school.db");
}

export function openDb() {
  const path = getDbPath();
  mkdirSync(dirname(path), { recursive: true });
  const db = new Database(path);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS curriculum_topic (
      id TEXT PRIMARY KEY,
      subject_slug TEXT NOT NULL,
      grade INTEGER NOT NULL,
      title TEXT NOT NULL,
      emoji TEXT,
      description TEXT,
      color TEXT,
      bg_gradient TEXT NOT NULL,
      lessons_json TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_curriculum_subject_grade
      ON curriculum_topic(subject_slug, grade);

    CREATE TABLE IF NOT EXISTS content_bundle (
      key TEXT PRIMARY KEY,
      payload_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS subject (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS grade (
      number INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS content_item (
      id TEXT PRIMARY KEY,
      subject_slug TEXT NOT NULL,
      grade INTEGER NOT NULL,
      kind TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'published',
      version INTEGER NOT NULL DEFAULT 1,
      payload_json TEXT NOT NULL,
      checksum TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(subject_slug) REFERENCES subject(slug),
      FOREIGN KEY(grade) REFERENCES grade(number)
    );
    CREATE INDEX IF NOT EXISTS idx_content_item_subject_grade_kind
      ON content_item(subject_slug, grade, kind, status);

    CREATE TABLE IF NOT EXISTS content_package (
      key TEXT PRIMARY KEY,
      subject_slug TEXT,
      grade INTEGER,
      package_type TEXT NOT NULL,
      format TEXT NOT NULL DEFAULT 'json',
      version INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'published',
      payload_json TEXT NOT NULL,
      checksum TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      published_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(subject_slug) REFERENCES subject(slug),
      FOREIGN KEY(grade) REFERENCES grade(number)
    );
    CREATE INDEX IF NOT EXISTS idx_content_package_manifest
      ON content_package(grade, subject_slug, package_type, status);

    CREATE TABLE IF NOT EXISTS leaderboard_score (
      user_id TEXT NOT NULL,
      subject_slug TEXT NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      streak INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(user_id, subject_slug)
    );
    CREATE INDEX IF NOT EXISTS idx_leaderboard_subject_score
      ON leaderboard_score(subject_slug, score DESC, updated_at DESC);
  `);

  return db;
}
