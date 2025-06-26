// Master Seeder Runner: Runs all seeders in src/seeders in order, safely and idempotently
const path = require('path');
const fs = require('fs');
const { sequelize } = require('../models');

async function runSeeders() {
  const seedersDir = path.join(__dirname, '../seeders');
  const files = fs.readdirSync(seedersDir)
    .filter(f => f.endsWith('.js'))
    .sort();

  for (const file of files) {
    const seederPath = path.join(seedersDir, file);
    try {
      console.log(`Running seeder: ${file}`);
      const seeder = require(seederPath);
      if (typeof seeder === 'function') {
        await seeder();
      }
      console.log(`Seeder ${file} completed.`);
    } catch (err) {
      console.error(`Error running seeder ${file}:`, err);
    }
  }
}

runSeeders()
  .then(() => {
    console.log('All seeders executed.');
    return sequelize.close();
  })
  .catch(err => {
    console.error('Error running seeders:', err);
    process.exit(1);
  });
