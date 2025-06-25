const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role, Permission } = require('../models');
const { jwt: jwtConfig } = require('../config/auth');

// Helper: generate tokens
function generateTokens(user) {
  const accessToken = jwt.sign({ id: user.id, username: user.username, roles: user.roles }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
  const refreshToken = jwt.sign({ id: user.id }, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpiresIn });
  return { access_token: accessToken, refresh_token: refreshToken, expires_in: jwtConfig.expiresIn, token_type: 'Bearer' };
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
