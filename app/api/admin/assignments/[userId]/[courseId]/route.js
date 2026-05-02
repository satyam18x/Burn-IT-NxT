import { db } from "@/lib/db";
import { authorizeAdmin } from "@/lib/auth";

export async function DELETE(req, { params }) {
  const admin = await authorizeAdmin(req);
  if (!admin) return Response.json({ message: "Forbidden" }, { status: 403 });

  const { userId, courseId } = await params;

  try {
    await db.query(
      "DELETE FROM user_courses WHERE user_id = ? AND course_id = ?",
      [userId, courseId]
    );
    
    return Response.json({ message: "Assignment removed successfully" });
  } catch (error) {
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}
