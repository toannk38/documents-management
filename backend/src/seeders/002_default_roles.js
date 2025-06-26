const { Role } = require('../models');

module.exports = async () => {
  await Role.bulkCreate([
    { name: 'admin', description: 'Administrator' },
    { name: 'editor', description: 'Document Editor' },
    { name: 'viewer', description: 'Document Viewer' },
  ], { ignoreDuplicates: true });
};
