const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-jwt-secret',
  expiresIn: process.env.JWT_EXPIRE || '24h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  saltRounds: Number(process.env.BCRYPT_ROUNDS) || 10
};

function hashPassword(password) {
  return bcrypt.hashSync(password, jwtConfig.saltRounds);
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function signJwt(payload, options = {}) {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn, ...options });
}

function verifyJwt(token) {
  return jwt.verify(token, jwtConfig.secret);
}

module.exports = {
  jwt: jwtConfig,
  hashPassword,
  comparePassword,
  signJwt,
  verifyJwt
};
