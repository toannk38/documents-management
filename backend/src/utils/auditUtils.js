const maskSensitive = (obj, fields = ['password', 'token']) => {
  const clone = { ...obj };
  fields.forEach(f => { if (clone[f]) clone[f] = '***'; });
  return clone;
};

const formatAuditLog = (log) => {
  return {
    ...log,
    timestamp: new Date(log.created_at).toISOString(),
  };
};

module.exports = {
  maskSensitive,
  formatAuditLog,
};
