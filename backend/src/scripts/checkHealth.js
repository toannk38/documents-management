const { sequelize } = require('../config/database');
const os = require('os');
const fs = require('fs');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection: OK');
  } catch (err) {
    console.error('Database connection: FAIL', err);
    process.exit(1);
  }

  try {
    const disk = os.platform() === 'win32' ? 'C:/' : '/';
    const stat = fs.statSync(disk);
    console.log('Disk check: OK');
  } catch (err) {
    console.error('Disk check: FAIL', err);
    process.exit(1);
  }

  console.log('Health check passed.');
  process.exit(0);
})();
