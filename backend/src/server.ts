import { mkdirSync } from "fs";
import { dirname } from "path";
import { buildApp } from "./app.js";
import { openDb, getDbPath } from "./db.js";
import { runSeed } from "./seed.js";

async function main() {
  mkdirSync(dirname(getDbPath()), { recursive: true });
  const db = openDb();
  runSeed(db);
  const app = await buildApp(db);
  const port = Number(process.env.PORT ?? "3001");
  await app.listen({ port, host: "0.0.0.0" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
