import mysql from 'mysql2/promise';

async function fixCoursesTable() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Satyam@123',
    database: 'burnit_db',
  });

  try {
    console.log('Adding missing columns to courses table...');
    
    // Check if columns exist first or use ALTER TABLE with potential error suppression
    // Using a more manual approach to be safe with MySQL versions
    
    const [columns] = await db.query('SHOW COLUMNS FROM courses');
    const columnNames = columns.map(c => c.Field);

    if (!columnNames.includes('duration')) {
      await db.query('ALTER TABLE courses ADD COLUMN duration VARCHAR(255) AFTER description');
      console.log('Added duration column');
    }
    if (!columnNames.includes('includes')) {
      await db.query('ALTER TABLE courses ADD COLUMN includes TEXT AFTER duration');
      console.log('Added includes column');
    }
    if (!columnNames.includes('image')) {
      await db.query('ALTER TABLE courses ADD COLUMN image VARCHAR(255) AFTER includes');
      console.log('Added image column');
    }
    if (!columnNames.includes('recommended')) {
      await db.query('ALTER TABLE courses ADD COLUMN recommended TINYINT(1) DEFAULT 0 AFTER image');
      console.log('Added recommended column');
    }

    console.log('Table check/update complete.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to update table:', error);
    process.exit(1);
  } finally {
    await db.end();
  }
}

fixCoursesTable();
