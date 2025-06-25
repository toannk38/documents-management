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

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { User, Role, Permission } = require('../models');
    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          through: { attributes: [] },
          include: [{ model: Permission, through: { attributes: [] } }]
        }
      ]
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
        error_code: 'USER_NOT_FOUND',
        data: null
      });
    }
    // Flatten permissions
    const permissions = user.Roles.reduce((acc, role) => {
      if (role.Permissions) {
        acc.push(...role.Permissions.map(p => p.name));
      }
      return acc;
    }, []);
    res.json({
      success: true,
      message: 'Lấy thông tin người dùng thành công',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          department: user.department,
          position: user.position,
          is_active: user.is_active,
          roles: user.Roles.map(role => ({
            id: role.id,
            name: role.name,
            display_name: role.display_name,
            assigned_at: role.user_roles?.createdAt,
            assigned_by: null // Needs audit log for full info
          })),
          permissions,
          last_login: user.last_login,
          login_count: user.login_count,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
          created_by: user.created_by,
          updated_by: user.updated_by
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { User, Role } = require('../models');
    const {
      username, email, password, full_name, phone, department, position, role_ids, is_active = true, send_welcome_email
    } = req.body;
    // Validation (basic, should use a validation middleware in production)
    if (!username || !email || !password || !full_name || !Array.isArray(role_ids) || role_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        error_code: 'VALIDATION_ERROR',
        data: { errors: [{ field: 'required', message: 'Missing required fields' }] }
      });
    }
    // Check unique username/email
    const exists = await User.findOne({ where: { [require('sequelize').Op.or]: [{ username }, { email }] } });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        error_code: 'VALIDATION_ERROR',
        data: { errors: [{ field: exists.username === username ? 'username' : 'email', message: exists.username === username ? 'Tên đăng nhập đã tồn tại' : 'Email đã được sử dụng' }] }
      });
    }
    // Hash password (should use bcrypt in production)
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username, email, password: hashedPassword, full_name, phone, department, position, is_active
    });
    // Assign roles
    await user.setRoles(role_ids);
    // Optionally send welcome email (stub)
    if (send_welcome_email) {
      // TODO: Implement email sending
    }
    const userWithRoles = await User.findByPk(user.id, { include: [Role] });
    res.status(201).json({
      success: true,
      message: 'Tạo người dùng thành công',
      data: {
        user: {
          id: userWithRoles.id,
          username: userWithRoles.username,
          email: userWithRoles.email,
          full_name: userWithRoles.full_name,
          phone: userWithRoles.phone,
          department: userWithRoles.department,
          position: userWithRoles.position,
          is_active: userWithRoles.is_active,
          roles: userWithRoles.Roles.map(role => ({ id: role.id, name: role.name, display_name: role.display_name })),
          created_at: userWithRoles.createdAt
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { User, Role } = require('../models');
    const { email, full_name, phone, department, position, is_active } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng', error_code: 'USER_NOT_FOUND', data: null });
    }
    // Prevent username change
    if (req.body.username && req.body.username !== user.username) {
      return res.status(400).json({ success: false, message: 'Không cho phép thay đổi username', error_code: 'USERNAME_CHANGE_NOT_ALLOWED' });
    }
    // Check email uniqueness if changed
    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Email đã được sử dụng', error_code: 'VALIDATION_ERROR', data: { errors: [{ field: 'email', message: 'Email đã được sử dụng' }] } });
      }
    }
    // Only update provided fields
    const updateFields = {};
    if (email) updateFields.email = email;
    if (full_name) updateFields.full_name = full_name;
    if (phone) updateFields.phone = phone;
    if (department) updateFields.department = department;
    if (position) updateFields.position = position;
    if (typeof is_active === 'boolean') updateFields.is_active = is_active;
    await user.update(updateFields);
    const updatedUser = await User.findByPk(id, { include: [Role] });
    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: {
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          full_name: updatedUser.full_name,
          phone: updatedUser.phone,
          department: updatedUser.department,
          position: updatedUser.position,
          is_active: updatedUser.is_active,
          updated_at: updatedUser.updatedAt
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { User, Document } = require('../models');
    // Prevent self-delete (assume req.user.id is available)
    if (req.user && req.user.id === id) {
      return res.status(400).json({ success: false, message: 'Không thể tự xóa chính mình', error_code: 'CANNOT_DELETE_USER', data: { reason: 'Self delete not allowed' } });
    }
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng', error_code: 'USER_NOT_FOUND', data: null });
    }
    // Check if user has documents
    const docCount = await Document.count({ where: { created_by: id } });
    if (docCount > 0) {
      return res.status(400).json({ success: false, message: 'Không thể xóa người dùng này', error_code: 'CANNOT_DELETE_USER', data: { reason: 'User đang có văn bản liên quan' } });
    }
    // Soft delete (set is_active = false)
    await user.update({ is_active: false });
    // TODO: Revoke all tokens/sessions for this user
    res.json({ success: true, message: 'Xóa người dùng thành công', data: null });
  } catch (err) {
    next(err);
  }
};

exports.assignRoles = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role_ids, expires_at } = req.body;
    const { User, Role } = require('../models');
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng', error_code: 'USER_NOT_FOUND', data: null });
    }
    if (!Array.isArray(role_ids) || role_ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Danh sách vai trò không hợp lệ', error_code: 'VALIDATION_ERROR' });
    }
    // Assign roles (overwrite existing)
    await user.setRoles(role_ids);
    // Optionally set expires_at in join table (not implemented here)
    const userRoles = await user.getRoles();
    res.json({
      success: true,
      message: 'Gán vai trò thành công',
      data: {
        user_roles: userRoles.map(role => ({
          role_id: role.id,
          role_name: role.name,
          assigned_at: new Date().toISOString(),
          expires_at: expires_at || null
        }))
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.revokeRole = async (req, res, next) => {
  try {
    const { id, role_id } = req.params;
    const { User, Role } = require('../models');
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng', error_code: 'USER_NOT_FOUND', data: null });
    }
    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy vai trò', error_code: 'ROLE_NOT_FOUND', data: null });
    }
    await user.removeRole(role);
    res.json({ success: true, message: 'Hủy vai trò thành công', data: null });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { new_password, force_change, send_email } = req.body;
    const { User } = require('../models');
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng', error_code: 'USER_NOT_FOUND', data: null });
    }
    let tempPassword = new_password;
    if (!tempPassword) {
      tempPassword = Math.random().toString(36).slice(-10) + 'A1!'; // Simple random password
    }
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    await user.update({ password: hashedPassword });
    // TODO: Set force_change flag and send email if needed
    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công',
      data: {
        temporary_password: new_password ? undefined : tempPassword,
        password_sent_via_email: !!send_email
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserActivities = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, action, date_from, date_to } = req.query;
    const { AuditLog } = require('../models');
    const where = { user_id: id };
    if (action) where.action = action;
    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) where.created_at['$gte'] = date_from;
      if (date_to) where.created_at['$lte'] = date_to;
    }
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'desc']]
    });
    res.json({
      success: true,
      message: 'Lấy lịch sử hoạt động thành công',
      data: {
        activities: rows,
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
