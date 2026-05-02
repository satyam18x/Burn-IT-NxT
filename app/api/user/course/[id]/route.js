import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req, { params }) {
  const user = verifyToken(req);
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const [courses] = await db.query("SELECT * FROM courses WHERE id = ?", [id]);
    if (courses.length === 0) return Response.json({ message: "Course not found" }, { status: 404 });

    const [modules] = await db.query("SELECT * FROM modules WHERE course_id = ? ORDER BY `order` ASC", [id]);
    
    for (let mod of modules) {
      const [videos] = await db.query("SELECT * FROM videos WHERE module_id = ? ORDER BY `order` ASC", [mod.id]);
      mod.videos = videos;
    }

    const courseData = { ...courses[0], modules };
    return Response.json(courseData);
  } catch (error) {
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}
