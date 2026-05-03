import { db } from "@/lib/db";
import { authorizeAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await authorizeAdmin();
  if (!admin) return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const [rows] = await db.query("SELECT * FROM videos ORDER BY course_id, module_id, order_index");
    return Response.json(rows);
  } catch (error) {
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}

export async function POST(req) {
  const admin = await authorizeAdmin();
  if (!admin) return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { title, youtube_id, course_id, module_id, order_index } = await req.json();
    const [result] = await db.query(
      "INSERT INTO videos (title, youtube_id, course_id, module_id, order_index) VALUES (?, ?, ?, ?, ?)",
      [title, youtube_id, course_id, module_id || null, order_index || 0]
    );


    return Response.json({ message: "Video added successfully", id: result.insertId });
  } catch (error) {
    console.error("Video Add Error:", error);
    return Response.json({ message: "Database error", error: error.message }, { status: 500 });
  }

}
