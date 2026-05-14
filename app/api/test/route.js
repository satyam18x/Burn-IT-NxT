// app/api/test/route.js
import { db } from "@/lib/db";

export async function GET() {
  const [rows] = await db.query("SELECT 1 as test");
  return Response.json(rows);
}