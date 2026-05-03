import { db } from "@/lib/db";

export async function GET() {
  try {
    // Check if course_id already exists in videos
    const [columns] = await db.query(`DESCRIBE videos`);
    const hasCourseId = columns.some(col => col.Field === 'course_id');
    const hasVideoUrl = columns.some(col => col.Field === 'video_url');

    if (!hasCourseId) {
      await db.query(`ALTER TABLE videos ADD COLUMN course_id INT(11) AFTER id`);
      console.log("Added course_id to videos");
    }

    if (hasVideoUrl) {
      await db.query(`ALTER TABLE videos CHANGE COLUMN video_url youtube_id VARCHAR(255)`);
      console.log("Renamed video_url to youtube_id");
    }

    // Populate course_id from modules table
    await db.query(`
      UPDATE videos v
      JOIN modules m ON v.module_id = m.id
      SET v.course_id = m.course_id
      WHERE v.course_id IS NULL OR v.course_id = 0
    `);

    return Response.json({ message: "Database schema updated successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
