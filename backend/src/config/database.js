const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
    pool: {
      min: Number(process.env.DB_POOL_MIN) || 2,
      max: Number(process.env.DB_POOL_MAX) || 10,
    },
  }
);

async function connectDatabase() {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');
  } catch (err) {
    logger.error('Database connection error:', err);
    throw err;
  }
}

module.exports = { sequelize, connectDatabase };
