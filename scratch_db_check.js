import { db } from './lib/db.js';

async function checkSchema() {
  try {
    const [tables] = await db.query("SHOW TABLES");
    console.log("Tables:", tables);

    for (const table of tables) {
      const tableName = Object.values(table)[0];
      const [columns] = await db.query(`DESCRIBE ${tableName}`);
      console.log(`\nColumns for ${tableName}:`, columns);
    }
    process.exit(0);
  } catch (error) {
    console.error("Error checking schema:", error);
    process.exit(1);
  }
}

checkSchema();
