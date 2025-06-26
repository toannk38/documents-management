const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const queryInterface = sequelize.getQueryInterface();
  const migrationsDir = path.join(__dirname, '../migrations');
  const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.js'));

  try {
    for (const file of migrationFiles) {
      const migration = require(path.join(migrationsDir, file));
      if (migration.up) {
        console.log(`Running migration: ${file}`);
        await migration.up(queryInterface, sequelize.constructor);
      }
    }
    console.log('All migrations executed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigrations();
