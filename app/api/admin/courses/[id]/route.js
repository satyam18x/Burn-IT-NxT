import { db } from "@/lib/db";
import { authorizeAdmin } from "@/lib/auth";

export async function PUT(req, { params }) {
  const admin = await authorizeAdmin(req);
  if (!admin) return Response.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;

  try {
    const { title, description, duration, includes, image, recommended } = await req.json();
    
    await db.query(
      "UPDATE courses SET title = ?, description = ?, duration = ?, includes = ?, image = ?, recommended = ? WHERE id = ?",
      [title, description, duration, includes, image, recommended ? 1 : 0, id]
    );
    
    return Response.json({ message: "Course updated successfully" });
  } catch (error) {
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const admin = await authorizeAdmin(req);
  if (!admin) return Response.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;

  try {
    // Delete assignments first (if not cascading)
    await db.query("DELETE FROM user_courses WHERE course_id = ?", [id]);
    await db.query("DELETE FROM courses WHERE id = ?", [id]);
    
    return Response.json({ message: "Course deleted successfully" });
  } catch (error) {
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}
