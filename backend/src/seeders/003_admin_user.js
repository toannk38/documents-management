const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = async () => {
  const passwordHash = await bcrypt.hash('adminpassword', 10);
  await User.bulkCreate([
    {
      username: 'admin',
      password: passwordHash,
      email: 'admin@example.com',
      full_name: 'Admin User',
      status: 'active',
    },
  ], { ignoreDuplicates: true });
};
