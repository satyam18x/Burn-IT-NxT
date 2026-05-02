import { db } from "@/lib/db";
import { authorizeAdmin } from "@/lib/auth";

export async function PATCH(req) {
  const admin = await authorizeAdmin(req);
  if (!admin) return Response.json({ message: "Forbidden" }, { status: 403 });

  try {
    const { userId, isActive } = await req.json();
    
    await db.query(
      "UPDATE users SET is_active = ? WHERE id = ?",
      [isActive ? 1 : 0, userId]
    );
    
    return Response.json({ message: "User status updated" });
  } catch (error) {
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}
