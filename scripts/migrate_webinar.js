import mysql from 'mysql2/promise';

async function migrate() {
  try {
    const db = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'Satyam@123',
      database: 'burnit_db',
    });

    await db.query(`
      CREATE TABLE IF NOT EXISTS \`webinar_registrations\` (
        \`id\`           INT(11)      NOT NULL AUTO_INCREMENT,
        \`name\`         VARCHAR(255) NOT NULL,
        \`email\`        VARCHAR(255) NOT NULL,
        \`age\`          INT(11),
        \`phone\`        VARCHAR(50),
        \`region\`       VARCHAR(255),
        \`message\`      TEXT,
        \`created_at\`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    
    console.log('Migration successful: webinar_registrations table created.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
