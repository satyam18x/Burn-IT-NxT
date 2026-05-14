import mysql from 'mysql2/promise';

async function checkVideos() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Satyam@123',
    database: 'burnit_db',
  });

  try {
    const [rows] = await db.query("SELECT id, title, youtube_id FROM videos");
    console.log('--- Video List ---');
    console.table(rows);
    process.exit(0);
  } catch (error) {
    console.error('Failed to query videos:', error);
    process.exit(1);
  } finally {
    await db.end();
  }
}

checkVideos();
