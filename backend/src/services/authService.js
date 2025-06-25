const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/auth');
const { User } = require('../models');
const bcrypt = require('bcrypt');

const login = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: user.id, username: user.username }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
  return { user, token };
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};

module.exports = {
  login,
  verifyToken,
};
