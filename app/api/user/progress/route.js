import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET progress for a specific course or all courses
export async function GET(request) {
  let user;
  try {
    user = await verifyToken();
  } catch (error) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');

  try {
    if (courseId) {
      // Get count of total videos in course
      const [totalRows] = await db.query(
        "SELECT COUNT(*) as total FROM videos WHERE course_id = ?",
        [courseId]
      );
      
      // Get count of watched videos by user in this course
      const [watchedRows] = await db.query(
        "SELECT COUNT(*) as watched FROM user_progress up JOIN videos v ON up.video_id = v.id WHERE up.user_id = ? AND v.course_id = ?",
        [user.id, courseId]
      );

      return Response.json({
        total: totalRows[0].total,
        watched: watchedRows[0].watched,
        percentage: totalRows[0].total > 0 ? Math.round((watchedRows[0].watched / totalRows[0].total) * 100) : 0
      });
    } else {
      // Get all watched video IDs for the user
      const [rows] = await db.query(
        "SELECT video_id FROM user_progress WHERE user_id = ?",
        [user.id]
      );
      return Response.json(rows.map(r => r.video_id));
    }
  } catch (error) {
    console.error('Progress fetch error:', error);
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}

// POST to mark a video as watched
export async function POST(request) {
  let user;
  try {
    user = await verifyToken();
  } catch (error) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { videoId } = await request.json();
    if (!videoId) {
      return Response.json({ message: "Video ID required" }, { status: 400 });
    }

    // Insert or ignore if already watched
    await db.query(
      "INSERT IGNORE INTO user_progress (user_id, video_id) VALUES (?, ?)",
      [user.id, videoId]
    );

    return Response.json({ message: "Progress updated" });
  } catch (error) {
    console.error('Progress update error:', error);
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}
