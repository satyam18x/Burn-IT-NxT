import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req, { params }) {
  let user;
  try {
    user = await verifyToken();
  } catch (error) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // JOIN videos with user_courses to ensure access
    const [rows] = await db.query(`
      SELECT v.youtube_id 
      FROM videos v
      JOIN user_courses uc ON v.course_id = uc.course_id
      WHERE v.id = ? AND uc.user_id = ?
    `, [id, user.id]);

    // Admin bypass
    let youtube_id;
    if (rows.length > 0) {
      youtube_id = rows[0].youtube_id;
    } else if (user.role === 'admin') {
      const [adminRows] = await db.query("SELECT youtube_id FROM videos WHERE id = ?", [id]);
      if (adminRows.length > 0) youtube_id = adminRows[0].youtube_id;
    }

    if (!youtube_id) {
      return Response.json({ message: "Access denied or video not found" }, { status: 403 });
    }

    // Return the YouTube ID. 
    // In a more advanced system, we could return a signed temporary URL or a session token.
    return Response.json({ youtube_id });
  } catch (error) {
    console.error("Video access error:", error);
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}
