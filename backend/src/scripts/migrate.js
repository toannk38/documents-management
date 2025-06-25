const { sequelize } = require('../config/database');

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database migrated successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
})();
