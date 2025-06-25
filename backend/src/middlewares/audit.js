const { AuditLog } = require('../models');

module.exports = (req, res, next) => {
  // Log every request (customize as needed)
  Promise.resolve().then(async () => {
    try {
      await AuditLog.create({
        user_id: req.user?.id,
        action: req.method + ' ' + req.originalUrl,
        resource_type: req.baseUrl,
        ip_address: req.ip,
        module: 'api',
        created_at: new Date(),
      });
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Audit log error:', err);
      }
    }
  });
  next();
};
