const { Role, Permission, User } = require('../models');
const { Op } = require('sequelize');

exports.getAllRoles = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, is_active, is_system, include_permissions, sort_by = 'name', sort_order = 'asc' } = req.query;
    const where = {};
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (is_active !== undefined) where.is_active = is_active === 'true';
    if (is_system !== undefined) where.is_system = is_system === 'true';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const include = [];
    if (include_permissions === 'true') {
      include.push({ model: Permission });
    }
    include.push({ model: User, through: { attributes: [] } });
    const { rows, count } = await Role.findAndCountAll({
      where,
      include,
      limit: parseInt(limit),
      offset,
      order: [[sort_by, sort_order]]
    });
    const roles = rows.map(role => {
      const r = role.toJSON();
      r.user_count = r.Users ? r.Users.length : 0;
      delete r.Users;
      return r;
    });
    res.json({
      success: true,
      message: 'Lấy danh sách vai trò thành công',
      data: {
        roles,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: count,
          total_pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getRoleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id, {
      include: [
        { model: Permission },
        { model: User, through: { attributes: ['createdAt'] } }
      ]
    });
    if (!role) return res.status(404).json({ success: false, message: 'Không tìm thấy vai trò' });
    const r = role.toJSON();
    r.permissions = r.Permissions || [];
    r.users = (r.Users || []).map(u => ({
      id: u.id,
      username: u.username,
      full_name: u.full_name,
      assigned_at: u.user_roles?.createdAt || null
    }));
    res.json({
      success: true,
      message: 'Lấy thông tin vai trò thành công',
      data: { role: r }
    });
  } catch (err) {
    next(err);
  }
};

exports.createRole = async (req, res, next) => {
  try {
    const { name, display_name, description, permission_ids, is_active = true } = req.body;
    if (!name || !display_name) {
      return res.status(400).json({ success: false, message: 'Thiếu trường bắt buộc' });
    }
    if (!/^[a-z0-9_]{3,50}$/.test(name)) {
      return res.status(400).json({ success: false, message: 'Tên vai trò không hợp lệ', error_code: 'VALIDATION_ERROR' });
    }
    if (display_name.length < 3 || display_name.length > 100) {
      return res.status(400).json({ success: false, message: 'Tên hiển thị không hợp lệ', error_code: 'VALIDATION_ERROR' });
    }
    if (description && description.length > 500) {
      return res.status(400).json({ success: false, message: 'Mô tả quá dài', error_code: 'VALIDATION_ERROR' });
    }
    const exists = await Role.findOne({ where: { name } });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Tên vai trò đã tồn tại', error_code: 'VALIDATION_ERROR', data: { errors: [{ field: 'name', message: 'Tên vai trò đã tồn tại' }] } });
    }
    const role = await Role.create({ name, display_name, description, is_active, is_system: false });
    if (Array.isArray(permission_ids) && permission_ids.length > 0) {
      const permissions = await Permission.findAll({ where: { id: permission_ids } });
      await role.setPermissions(permissions);
    }
    const created = await Role.findByPk(role.id, { include: [Permission] });
    res.status(201).json({
      success: true,
      message: 'Tạo vai trò thành công',
      data: { role: created }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { display_name, description, is_active } = req.body;
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ success: false, message: 'Không tìm thấy vai trò' });
    if (role.is_system) {
      return res.status(400).json({ success: false, message: 'Không thể cập nhật vai trò hệ thống', error_code: 'CANNOT_UPDATE_SYSTEM_ROLE' });
    }
    if (display_name) role.display_name = display_name;
    if (description) role.description = description;
    if (is_active !== undefined) role.is_active = is_active;
    await role.save();
    res.json({
      success: true,
      message: 'Cập nhật vai trò thành công',
      data: { role }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id, { include: [User] });
    if (!role) return res.status(404).json({ success: false, message: 'Không tìm thấy vai trò' });
    if (role.is_system) {
      return res.status(400).json({ success: false, message: 'Không thể xóa vai trò hệ thống', error_code: 'CANNOT_DELETE_SYSTEM_ROLE' });
    }
    if (role.Users && role.Users.length > 0) {
      return res.status(409).json({ success: false, message: 'Không thể xóa vai trò đang được sử dụng', error_code: 'ROLE_IN_USE', data: { user_count: role.Users.length } });
    }
    await role.destroy();
    res.json({ success: true, message: 'Xóa vai trò thành công', data: null });
  } catch (err) {
    next(err);
  }
};

exports.assignPermissionsToRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { permission_ids, replace_existing = false } = req.body;
    if (!Array.isArray(permission_ids) || permission_ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Danh sách quyền không hợp lệ' });
    }
    const role = await Role.findByPk(id, { include: [Permission] });
    if (!role) return res.status(404).json({ success: false, message: 'Không tìm thấy vai trò' });
    const permissions = await Permission.findAll({ where: { id: permission_ids } });
    if (replace_existing) {
      await role.setPermissions(permissions);
    } else {
      await role.addPermissions(permissions);
    }
    const now = new Date();
    res.json({
      success: true,
      message: 'Gán quyền thành công',
      data: {
        role_permissions: permissions.map(p => ({
          permission_id: p.id,
          permission_name: p.name,
          granted_at: now
        }))
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.revokePermissionFromRole = async (req, res, next) => {
  try {
    const { id, permission_id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ success: false, message: 'Không tìm thấy vai trò' });
    const permission = await Permission.findByPk(permission_id);
    if (!permission) return res.status(404).json({ success: false, message: 'Không tìm thấy quyền' });
    await role.removePermission(permission);
    res.json({ success: true, message: 'Hủy quyền thành công', data: null });
  } catch (err) {
    next(err);
  }
};
