const { User, Role } = require('../models');
const { Op } = require('sequelize');

exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, department, role, status, sort_by = 'created_at', sort_order = 'desc', created_from, created_to } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { full_name: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (department) where.department = department;
    if (status) where.is_active = status === 'active';
    if (created_from || created_to) {
      where.created_at = {};
      if (created_from) where.created_at[Op.gte] = created_from;
      if (created_to) where.created_at[Op.lte] = created_to;
    }
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.findAndCountAll({
      where,
      include: role ? [{ model: Role, where: { name: role } }] : [Role],
      limit: parseInt(limit),
      offset,
      order: [[sort_by, sort_order]]
    });
    res.json({ success: true, message: 'Lấy danh sách người dùng thành công', data: { users: users.rows, total: users.count } });
  } catch (err) {
    next(err);
  }
};

// Add user CRUD, profile, and status endpoints as needed
