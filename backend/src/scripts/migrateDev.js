const { sequelize } = require('../config/database');

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Development database migrated (force sync) successfully');
    process.exit(0);
  } catch (err) {
    console.error('Dev migration failed:', err);
    process.exit(1);
  }
})();
