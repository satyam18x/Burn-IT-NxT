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
    // Check if user has access to this course
    const [assignments] = await db.query(
      "SELECT id FROM user_courses WHERE user_id = ? AND course_id = ?",
      [user.id, id]
    );

    if (assignments.length === 0 && user.role !== 'admin') {
      return Response.json({ message: "Access denied. Course not assigned." }, { status: 403 });
    }

    const [courses] = await db.query("SELECT * FROM courses WHERE id = ?", [id]);
    if (courses.length === 0) return Response.json({ message: "Course not found" }, { status: 404 });

    const [modules] = await db.query("SELECT * FROM modules WHERE course_id = ? ORDER BY id ASC", [id]);
    const [allVideos] = await db.query(
      "SELECT id, title, module_id, order_index FROM videos WHERE course_id = ? ORDER BY order_index ASC",
      [id]
    );

    // Group videos by module_id
    const modulesWithVideos = modules.map(mod => ({
      ...mod,
      videos: allVideos.filter(v => v.module_id === mod.id)
    }));

    // Check for videos without a valid module_id
    const moduleIds = modules.map(m => m.id);
    const unassignedVideos = allVideos.filter(v => !moduleIds.includes(v.module_id));

    if (unassignedVideos.length > 0) {
      modulesWithVideos.push({
        id: 0,
        title: "Course Content",
        videos: unassignedVideos
      });
    }

    const courseData = { ...courses[0], modules: modulesWithVideos };
    return Response.json(courseData);

  } catch (error) {
    console.error("Course error:", error);
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}

