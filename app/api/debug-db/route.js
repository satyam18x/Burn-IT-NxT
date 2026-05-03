import { db } from "@/lib/db";

export async function GET() {
  try {
    const [tables] = await db.query("SHOW TABLES");
    const result = {};

    for (const table of tables) {
      const tableName = Object.values(table)[0];
      const [columns] = await db.query(`DESCRIBE ${tableName}`);
      result[tableName] = columns;
    }
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
