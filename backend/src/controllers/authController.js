const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role, Permission } = require('../models');
const { jwt: jwtConfig } = require('../config/auth');
const { Op } = require('sequelize');
const AuditLog = require('../models/AuditLog');
const { isEmail } = require('../utils/validation');
const crypto = require('crypto');
const { sendResetPasswordEmail } = require('../services/emailService');

// Helper: generate tokens
function generateTokens(user) {
  const accessToken = jwt.sign({ id: user.id, username: user.username, roles: user.roles }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
  const refreshToken = jwt.sign({ id: user.id }, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpiresIn });
  return { access_token: accessToken, refresh_token: refreshToken, expires_in: jwtConfig.expiresIn, token_type: 'Bearer' };
}

// Helper: password strength
function isStrongPassword(password) {
  return /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password) && password.length >= 8;
}

// Helper: audit log
async function logAudit(userId, action, req, extra = {}) {
  await AuditLog.create({
    user_id: userId,
    action,
    resource_type: 'auth',
    resource_id: userId,
    ip_address: req.ip,
    user_agent: req.headers['user-agent'],
    request_method: req.method,
    request_url: req.originalUrl,
    ...extra,
    created_at: new Date(),
  });
}

exports.login = async (req, res, next) => {
  try {
    const { username, password, remember_me } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password required' });
    const user = await User.findOne({ where: { username }, include: [Role, Permission] });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    // Compose user info for response
    const userInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      roles: user.roles ? user.roles.map(r => r.name) : [],
      permissions: user.permissions ? user.permissions.map(p => p.name) : [],
      last_login: user.last_login
    };
    // Generate tokens
    const tokens = generateTokens(user);
    // Optionally update last_login
    user.last_login = new Date();
    await user.save();
    res.json({ success: true, message: 'Đăng nhập thành công', data: { user: userInfo, tokens } });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  // For JWT, logout is handled on client side (token removal)
  res.json({ success: true, message: 'Logged out' });
};

exports.refreshToken = (req, res) => {
  // Implement refresh token logic
  const { refresh_token } = req.body;
  if (!refresh_token) return res.status(400).json({ success: false, message: 'Refresh token required' });
  try {
    const payload = jwt.verify(refresh_token, jwtConfig.refreshSecret);
    User.findByPk(payload.id, { include: [Role, Permission] }).then(user => {
      if (!user) return res.status(401).json({ success: false, message: 'Invalid refresh token' });
      const tokens = generateTokens(user);
      res.json({ success: true, tokens });
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

exports.me = async (req, res) => {
  const user = await User.findByPk(req.user.id, { include: [Role, Permission] });
  if (!user) return res.status(401).json({ success: false, message: 'Token không hợp lệ', error_code: 'INVALID_TOKEN', data: null });
  res.json({
    success: true,
    message: 'Lấy thông tin thành công',
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        department: user.department,
        position: user.position,
        roles: user.roles ? user.roles.map(r => ({ id: r.id, name: r.name, display_name: r.display_name })) : [],
        permissions: user.permissions ? user.permissions.map(p => p.name) : [],
        last_login: user.last_login,
        created_at: user.createdAt
      }
    }
  });
};

exports.changePassword = async (req, res) => {
  const { current_password, new_password, confirm_password } = req.body;
  if (!current_password || !new_password || !confirm_password)
    return res.status(400).json({ success: false, message: 'Missing fields' });
  if (new_password !== confirm_password)
    return res.status(400).json({ success: false, message: 'Mật khẩu xác nhận không khớp', error_code: 'PASSWORD_MISMATCH' });
  if (!isStrongPassword(new_password))
    return res.status(400).json({ success: false, message: 'Mật khẩu mới không đủ mạnh', error_code: 'WEAK_PASSWORD' });
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(401).json({ success: false, message: 'Token không hợp lệ', error_code: 'INVALID_TOKEN' });
  const valid = await bcrypt.compare(current_password, user.password);
  if (!valid)
    return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng', error_code: 'INVALID_CURRENT_PASSWORD' });
  user.password = await bcrypt.hash(new_password, jwtConfig.saltRounds);
  await user.save();
  // TODO: Revoke all tokens for this user
  await logAudit(user.id, 'change_password', req);
  res.json({ success: true, message: 'Đổi mật khẩu thành công', data: null });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email || !isEmail(email))
    return res.status(400).json({ success: true, message: 'Email hướng dẫn reset mật khẩu đã được gửi', data: null });
  const user = await User.findOne({ where: { email } });
  if (user) {
    const resetToken = jwt.sign({ id: user.id }, jwtConfig.secret, { expiresIn: '1h' });
    await sendResetPasswordEmail(user.email, resetToken);
    await logAudit(user.id, 'forgot_password', req);
  }
  // Always return success
  res.json({ success: true, message: 'Email hướng dẫn reset mật khẩu đã được gửi', data: null });
};

exports.resetPassword = async (req, res) => {
  const { reset_token, new_password, confirm_password } = req.body;
  if (!reset_token || !new_password || !confirm_password)
    return res.status(400).json({ success: false, message: 'Missing fields' });
  if (new_password !== confirm_password)
    return res.status(400).json({ success: false, message: 'Mật khẩu xác nhận không khớp', error_code: 'PASSWORD_MISMATCH' });
  if (!isStrongPassword(new_password))
    return res.status(400).json({ success: false, message: 'Mật khẩu mới không đủ mạnh', error_code: 'WEAK_PASSWORD' });
  try {
    const payload = jwt.verify(reset_token, jwtConfig.secret);
    const user = await User.findByPk(payload.id);
    if (!user) throw new Error('User not found');
    user.password = await bcrypt.hash(new_password, jwtConfig.saltRounds);
    await user.save();
    // TODO: Revoke all tokens for this user
    await logAudit(user.id, 'reset_password', req);
    res.json({ success: true, message: 'Reset mật khẩu thành công', data: null });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Token reset không hợp lệ hoặc đã hết hạn', error_code: 'INVALID_RESET_TOKEN', data: null });
  }
};
