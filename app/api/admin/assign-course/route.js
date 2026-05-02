import { db } from "@/lib/db";
import { authorizeAdmin } from "@/lib/auth";

export async function POST(req) {
  const admin = await authorizeAdmin(req);
  if (!admin) return Response.json({ message: "Forbidden" }, { status: 403 });

  try {
    const { userId, courseId } = await req.json();
    
    await db.query(
      "INSERT INTO user_courses (user_id, course_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE assigned_at = CURRENT_TIMESTAMP",
      [userId, courseId]
    );
    
    return Response.json({ message: "Course assigned successfully" });
  } catch (error) {
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}
