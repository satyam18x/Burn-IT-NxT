import { db } from "@/lib/db";
import { authorizeAdmin } from "@/lib/auth";

export async function GET(req) {
  const user = await authorizeAdmin(req);
  if (!user) return Response.json({ message: "Forbidden" }, { status: 403 });

  try {
    const [rows] = await db.query(`
      SELECT uc.user_id as userId, u.name as userName, u.email as userEmail, 
             uc.course_id as courseId, c.title as courseTitle, uc.assigned_at as assignedAt
      FROM user_courses uc
      JOIN users u ON uc.user_id = u.id
      JOIN courses c ON uc.course_id = c.id
      ORDER BY uc.assigned_at DESC
    `);
    return Response.json(rows);
  } catch (error) {
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}
