const { AuditLog } = require('../models');

// Audit service logic placeholder
const createLog = async (logData) => {
  return AuditLog.create(logData);
};

module.exports = {
  createLog,
};
