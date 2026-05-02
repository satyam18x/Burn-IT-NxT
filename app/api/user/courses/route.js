import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  const user = verifyToken(req);
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const [rows] = await db.query(
      "SELECT c.* FROM courses c JOIN user_courses uc ON c.id = uc.course_id WHERE uc.user_id = ?",
      [user.id]
    );
    return Response.json(rows);
  } catch (error) {
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}
