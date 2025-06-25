const { Permission, RolePermission } = require('../models');

const getPermissionsByRole = async (roleId) => {
  return RolePermission.findAll({ where: { role_id: roleId }, include: [Permission] });
};

const hasPermission = async (userPermissions, required) => {
  return userPermissions.includes(required);
};

module.exports = {
  getPermissionsByRole,
  hasPermission,
};
