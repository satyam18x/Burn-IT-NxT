import { db } from "@/lib/db";

export async function GET() {
  try {
    // Make module_id nullable
    await db.query("ALTER TABLE videos MODIFY COLUMN module_id INT NULL");
    
    // Also ensure youtube_id is what we expect
    await db.query("ALTER TABLE videos MODIFY COLUMN youtube_id VARCHAR(255) NOT NULL");
    
    return Response.json({ message: "Database updated: module_id is now nullable" });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Migration failed", error: error.message }, { status: 500 });
  }
}
