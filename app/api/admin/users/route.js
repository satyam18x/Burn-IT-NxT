import { db } from "@/lib/db";
import { authorizeAdmin } from "@/lib/auth";

export async function GET(req) {
  const user = await authorizeAdmin(req);
  if (!user) return Response.json({ message: "Forbidden" }, { status: 403 });

  try {
    const [rows] = await db.query("SELECT id, name, email, role, is_active FROM users");
    return Response.json(rows);
  } catch (error) {
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}
