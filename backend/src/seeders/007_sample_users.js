const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = async () => {
  const users = [
    {
      username: 'user1',
      password: await bcrypt.hash('password1', 10),
      email: 'user1@example.com',
      full_name: 'User One',
      status: 'active',
    },
    {
      username: 'user2',
      password: await bcrypt.hash('password2', 10),
      email: 'user2@example.com',
      full_name: 'User Two',
      status: 'active',
    },
    {
      username: 'user3',
      password: await bcrypt.hash('password3', 10),
      email: 'user3@example.com',
      full_name: 'User Three',
      status: 'inactive',
    },
  ];
  await User.bulkCreate(users, { ignoreDuplicates: true });
};
