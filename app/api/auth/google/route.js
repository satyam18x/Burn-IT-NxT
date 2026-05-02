import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req) {
  try {
    const { token: googleToken } = await req.json();

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const { email } = ticket.getPayload();

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = users[0];

    if (!user) {
      return Response.json(
        { message: "This email is not authorized. Please contact administrator." },
        { status: 403 }
      );
    }

    if (!user.is_active) {
      return Response.json({ message: "Account is deactivated. Contact admin." }, { status: 403 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return Response.json({
      message: "Google login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Google login error:", error);
    return Response.json({ message: "Invalid Google token" }, { status: 401 });
  }
}
