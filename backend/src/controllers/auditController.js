const { AuditLog } = require('../models');
const { Op } = require('sequelize');

exports.getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, user_id, action, resource_type, resource_id, from, to, sort_by = 'created_at', sort_order = 'desc' } = req.query;
    const where = {};
    if (user_id) where.user_id = user_id;
    if (action) where.action = action;
    if (resource_type) where.resource_type = resource_type;
    if (resource_id) where.resource_id = resource_id;
    if (from || to) {
      where.created_at = {};
      if (from) where.created_at[Op.gte] = from;
      if (to) where.created_at[Op.lte] = to;
    }
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const logs = await AuditLog.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sort_by, sort_order]]
    });
    res.json({ success: true, message: 'Lấy danh sách audit logs thành công', data: { logs: logs.rows, total: logs.count } });
  } catch (err) {
    next(err);
  }
};

// Add audit log detail, export, and statistics endpoints as needed
