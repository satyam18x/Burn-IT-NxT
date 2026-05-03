import { db } from "@/lib/db";
import { authorizeAdmin } from "@/lib/auth";

export async function PUT(req, { params }) {
  const admin = await authorizeAdmin();
  if (!admin) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const { title, youtube_id, course_id, module_id, order_index } = await req.json();
    await db.query(
      "UPDATE videos SET title = ?, youtube_id = ?, course_id = ?, module_id = ?, order_index = ? WHERE id = ?",
      [title, youtube_id, course_id, module_id || null, order_index || 0, id]
    );

    return Response.json({ message: "Video updated successfully" });
  } catch (error) {
    console.error("Video Update Error:", error);
    return Response.json({ message: "Database error", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const admin = await authorizeAdmin();
  if (!admin) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await db.query("DELETE FROM videos WHERE id = ?", [id]);
    return Response.json({ message: "Video deleted successfully" });
  } catch (error) {
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}
