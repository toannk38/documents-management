const { Role, Permission } = require('../models');
const { Op } = require('sequelize');

exports.getAllRoles = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, is_active, is_system, include_permissions, sort_by = 'name', sort_order = 'asc' } = req.query;
    const where = {};
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (is_active !== undefined) where.is_active = is_active === 'true';
    if (is_system !== undefined) where.is_system = is_system === 'true';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const include = include_permissions === 'true' ? [Permission] : [];
    const roles = await Role.findAndCountAll({
      where,
      include,
      limit: parseInt(limit),
      offset,
      order: [[sort_by, sort_order]]
    });
    res.json({ success: true, message: 'Lấy danh sách vai trò thành công', data: { roles: roles.rows, total: roles.count } });
  } catch (err) {
    next(err);
  }
};

// ...existing code...
// Add role CRUD and permission assignment endpoints as needed
