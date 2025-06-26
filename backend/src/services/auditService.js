const { AuditLog } = require('../models');

// Audit service logic
const createAuditLog = async (logData) => {
  return AuditLog.create(logData);
};

const getAuditLogs = async ({ page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;
  const { rows: logs, count } = await AuditLog.findAndCountAll({ offset, limit });
  return {
    logs,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit)
    }
  };
};

module.exports = {
  createAuditLog,
  getAuditLogs,
};
