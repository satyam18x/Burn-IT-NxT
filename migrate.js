import mysql from 'mysql2/promise';

async function migrate() {
  try {
    const db = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'Satyam@123',
      database: 'burnit_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    await db.query(`
      CREATE TABLE IF NOT EXISTS \`settings\` (
        \`key_name\`    VARCHAR(100) NOT NULL,
        \`value\`       TEXT,
        \`updated_at\`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`key_name\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    
    await db.query(`
      INSERT IGNORE INTO \`settings\` (\`key_name\`, \`value\`) VALUES
      ('webinar_link', 'https://zoom.us/j/example'),
      ('whatsapp_link', 'https://chat.whatsapp.com/example');
    `);
    
    console.log('Migration successful');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
