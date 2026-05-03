import { db } from "@/lib/db";
import { authorizeAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await authorizeAdmin();
  if (!admin) return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const [rows] = await db.query("SELECT * FROM modules ORDER BY course_id, id");
    return Response.json(rows);
  } catch (error) {
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}
