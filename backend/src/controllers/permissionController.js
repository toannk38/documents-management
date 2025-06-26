const { Permission, Role, User } = require('../models');
const { Op } = require('sequelize');

exports.getAllPermissions = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search, module, action, is_system, group_by_module } = req.query;
    const where = {};
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (module) where.module = module;
    if (action) where.action = action;
    if (is_system !== undefined) where.is_system = is_system === 'true';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const permissions = await Permission.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['name', 'asc']]
    });
    let grouped_permissions = undefined;
    if (group_by_module === 'true') {
      grouped_permissions = {};
      permissions.rows.forEach(p => {
        if (!grouped_permissions[p.module]) grouped_permissions[p.module] = [];
        grouped_permissions[p.module].push({ id: p.id, name: p.name, display_name: p.display_name });
      });
    }
    res.json({
      success: true,
      message: 'Lấy danh sách quyền hạn thành công',
      data: {
        permissions: permissions.rows,
        grouped_permissions,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: permissions.count,
          total_pages: Math.ceil(permissions.count / limit)
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getPermissionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const permission = await Permission.findByPk(id, {
      include: [{ model: Role, through: { attributes: ['createdAt'] } }]
    });
    if (!permission) return res.status(404).json({ success: false, message: 'Không tìm thấy quyền' });
    res.json({
      success: true,
      message: 'Lấy thông tin quyền thành công',
      data: {
        permission: {
          ...permission.toJSON(),
          roles: permission.Roles?.map(r => ({
            id: r.id,
            name: r.name,
            display_name: r.display_name,
            granted_at: r.role_permissions?.createdAt || null
          })) || [],
          user_count: 0 // You can implement user count if needed
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.createPermission = async (req, res, next) => {
  try {
    const { name, display_name, description, module, action, resource } = req.body;
    if (!name || !display_name || !module || !action) {
      return res.status(400).json({ success: false, message: 'Thiếu trường bắt buộc' });
    }
    if (!/^([a-z0-9_]+)\.([a-z0-9_]+)(\.[a-z0-9_]+)?$/.test(name)) {
      return res.status(400).json({ success: false, message: 'Tên quyền không đúng định dạng module.action' });
    }
    const exists = await Permission.findOne({ where: { name } });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Tên quyền đã tồn tại', error_code: 'VALIDATION_ERROR' });
    }
    const permission = await Permission.create({ name, display_name, description, module, action, resource, is_system: false });
    res.status(201).json({
      success: true,
      message: 'Tạo quyền thành công',
      data: { permission }
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { display_name, description } = req.body;
    const permission = await Permission.findByPk(id);
    if (!permission) return res.status(404).json({ success: false, message: 'Không tìm thấy quyền' });
    if (permission.is_system) {
      return res.status(400).json({ success: false, message: 'Không thể cập nhật quyền hệ thống', error_code: 'CANNOT_UPDATE_SYSTEM_PERMISSION' });
    }
    if (display_name) permission.display_name = display_name;
    if (description) permission.description = description;
    await permission.save();
    res.json({
      success: true,
      message: 'Cập nhật quyền thành công',
      data: { permission }
    });
  } catch (err) {
    next(err);
  }
};

exports.deletePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const permission = await Permission.findByPk(id);
    if (!permission) return res.status(404).json({ success: false, message: 'Không tìm thấy quyền' });
    if (permission.is_system) {
      return res.status(400).json({ success: false, message: 'Không thể xóa quyền hệ thống', error_code: 'CANNOT_DELETE_SYSTEM_PERMISSION' });
    }
    await permission.destroy();
    res.json({ success: true, message: 'Xóa quyền thành công', data: null });
  } catch (err) {
    next(err);
  }
};
