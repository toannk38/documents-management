const { User, UserRole } = require('../models');

const createUser = async (data) => User.create(data);
const getUserById = async (id) => User.findByPk(id);
const updateUser = async (id, data) => User.update(data, { where: { id } });
const deleteUser = async (id) => User.destroy({ where: { id } });

const assignRole = async (userId, roleId) => {
  return UserRole.create({ user_id: userId, role_id: roleId });
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  assignRole,
};
