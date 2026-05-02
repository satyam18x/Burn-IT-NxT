import { db } from "@/lib/db";
import { authorizeAdmin } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const admin = await authorizeAdmin(req);
  if (!admin) return Response.json({ message: "Forbidden" }, { status: 403 });

  try {
    const { name, email, password, role } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role || 'user']
    );
    
    return Response.json({ message: "User added successfully" });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return Response.json({ message: "Email already exists" }, { status: 400 });
    }
    return Response.json({ message: "Database error" }, { status: 500 });
  }
}
