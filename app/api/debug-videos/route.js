import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`SELECT id, title, youtube_id FROM videos`);
    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
