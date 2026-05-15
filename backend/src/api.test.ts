import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { openDb } from "./db.js";
import { runSeed } from "./seed.js";
import { buildApp } from "./app.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const genDir = join(__dirname, "..", "content", "_generated");

test("API topics and bundles", async () => {
  assert.ok(existsSync(join(genDir, "bundles.json")), "run bundle extract before tests");
  const dir = mkdtempSync(join(tmpdir(), "school-trainer-test-"));
  process.env.DATABASE_PATH = join(dir, "t.db");
  const db = openDb();
  runSeed(db);
  const app = await buildApp(db);

  const h = await app.inject({ method: "GET", url: "/api/topics?subject=math&grade=5" });
  assert.equal(h.statusCode, 200);
  const topics = JSON.parse(h.body) as { id: string; lessons: unknown[] }[];
  assert.ok(topics.length >= 6);
  const pct = topics.find((t) => t.id === "percent-intro");
  assert.ok(pct && Array.isArray(pct.lessons) && pct.lessons.length >= 2);

  const ru = await app.inject({ method: "GET", url: "/api/bundle/russian?grade=5" });
  assert.equal(ru.statusCode, 200);
  const rub = JSON.parse(ru.body) as { tasks: unknown[] };
  assert.ok(rub.tasks.length >= 6);

  const en = await app.inject({ method: "GET", url: "/api/bundle/english?grade=5" });
  assert.equal(en.statusCode, 200);
  const eb = JSON.parse(en.body) as { words: unknown[] };
  assert.ok(eb.words.length >= 20);

  const manifestRes = await app.inject({
    method: "GET",
    url: "/api/content/manifest?grade=5&platform=mobile",
  });
  assert.equal(manifestRes.statusCode, 200);
  const manifest = JSON.parse(manifestRes.body) as {
    schemaVersion: number;
    platform: string;
    packages: Array<{ key: string; checksum: string; version: number; downloadUrl: string }>;
  };
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.platform, "mobile");
  assert.ok(manifest.packages.length >= 3);
  const mathPackage = manifest.packages.find((p) => p.key === "math_grade5_curriculum");
  assert.ok(mathPackage);
  assert.ok(mathPackage.checksum.length >= 32);
  assert.ok(mathPackage.version >= 1);

  const packageRes = await app.inject({
    method: "GET",
    url: mathPackage.downloadUrl,
  });
  assert.equal(packageRes.statusCode, 200);
  assert.equal(packageRes.headers["x-content-version"], String(mathPackage.version));
  const contentPackage = JSON.parse(packageRes.body) as {
    key: string;
    payload: { topics: unknown[] };
  };
  assert.equal(contentPackage.key, "math_grade5_curriculum");
  assert.ok(contentPackage.payload.topics.length >= 6);

  const scoreA = await app.inject({
    method: "POST",
    url: "/api/leaderboard/score",
    payload: { userId: "u1", subject: "english", name: "Иван", avatar: "🦊", score: 1200, level: 4, streak: 3 },
  });
  assert.equal(scoreA.statusCode, 200);

  const scoreB = await app.inject({
    method: "POST",
    url: "/api/leaderboard/score",
    payload: { userId: "u2", subject: "english", name: "Петр", avatar: "🐯", score: 1600, level: 5, streak: 2 },
  });
  assert.equal(scoreB.statusCode, 200);

  const subjectBoardRes = await app.inject({ method: "GET", url: "/api/leaderboard?subject=english" });
  assert.equal(subjectBoardRes.statusCode, 200);
  const subjectBoard = JSON.parse(subjectBoardRes.body) as { entries: Array<{ id: string; score: number; rank: number }> };
  assert.equal(subjectBoard.entries[0].id, "u2");
  assert.equal(subjectBoard.entries[1].id, "u1");

  await app.inject({
    method: "POST",
    url: "/api/leaderboard/score",
    payload: { userId: "u1", subject: "math", name: "Иван", avatar: "🦊", score: 500, level: 2, streak: 0 },
  });
  const globalBoardRes = await app.inject({ method: "GET", url: "/api/leaderboard?subject=global" });
  assert.equal(globalBoardRes.statusCode, 200);
  const globalBoard = JSON.parse(globalBoardRes.body) as { entries: Array<{ id: string; totalScore: number; englishScore: number; mathScore: number }> };
  const ivan = globalBoard.entries.find((entry) => entry.id === "u1");
  assert.equal(ivan?.totalScore, 1700);
  assert.equal(ivan?.englishScore, 1200);
  assert.equal(ivan?.mathScore, 500);

  await app.close();
  db.close();
  rmSync(dir, { recursive: true, force: true });
});
