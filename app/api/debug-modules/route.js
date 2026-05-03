import { db } from "@/lib/db";

export async function GET() {
  try {
    const [columns] = await db.query(`DESCRIBE modules`);
    return Response.json(columns);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
