const { Role, UserRole, RolePermission } = require('../models');

const createRole = async (data) => Role.create(data);
const getRoleById = async (id) => Role.findByPk(id);
const updateRole = async (id, data) => Role.update(data, { where: { id } });
const deleteRole = async (id) => Role.destroy({ where: { id } });

const assignRoleToUser = async (userId, roleId) => {
  return UserRole.create({ user_id: userId, role_id: roleId });
};

const assignPermissionToRole = async (roleId, permissionId) => {
  return RolePermission.create({ role_id: roleId, permission_id: permissionId });
};

module.exports = {
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
  assignRoleToUser,
  assignPermissionToRole,
};
