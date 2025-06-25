const { sequelize } = require('../config/database');

const withTransaction = async (fn) => {
  const t = await sequelize.transaction();
  try {
    const result = await fn(t);
    await t.commit();
    return result;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

module.exports = {
  withTransaction,
};
