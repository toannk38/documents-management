const { Permission } = require('../models');

module.exports = async () => {
  await Permission.bulkCreate([
    { name: 'read_documents', description: 'Read documents' },
    { name: 'write_documents', description: 'Create and update documents' },
    { name: 'delete_documents', description: 'Delete documents' },
    { name: 'manage_users', description: 'Manage users and roles' },
    { name: 'view_audit_logs', description: 'View audit logs' },
  ], { ignoreDuplicates: true });
};
