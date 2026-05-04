import mysql from 'mysql2/promise';

async function checkUsers() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Satyam@123',
    database: 'burnit_db',
  });

  try {
    const [rows] = await db.query("SELECT id, name, email, role FROM users");
    console.table(rows);
    process.exit(0);
  } catch (error) {
    console.error('Failed to query users:', error);
    process.exit(1);
  } finally {
    await db.end();
  }
}

checkUsers();
