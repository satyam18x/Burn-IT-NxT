import { db } from "@/lib/db";
import { authorizeAdmin } from "@/lib/auth";

export async function POST(req) {
  const admin = await authorizeAdmin(req);
  if (!admin) return Response.json({ message: "Forbidden" }, { status: 403 });

  try {
    const { title, description, duration, includes, image, recommended } = await req.json();
    
    await db.query(
      "INSERT INTO courses (title, description, duration, includes, image, recommended) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, duration, includes, image, recommended ? 1 : 0]
    );
    
    return Response.json({ message: "Course created successfully" });
  } catch (error) {
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}
