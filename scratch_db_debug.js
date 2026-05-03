import { db } from "./lib/db.js";

async function checkSchema() {
  try {
    const [rows] = await db.query("SELECT id, title, youtube_id FROM videos");
    console.log("Videos table data:");
    console.table(rows);
    process.exit(0);
  } catch (err) {
    console.error("Error checking schema:", err);
    process.exit(1);
  }
}

checkSchema();
