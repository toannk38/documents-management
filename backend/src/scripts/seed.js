const { User, Role, Permission } = require('../models');

(async () => {
  try {
    await Role.bulkCreate([
      { name: 'admin', description: 'Administrator' },
      { name: 'manager', description: 'Department Manager' },
      { name: 'editor', description: 'Editor' },
      { name: 'reviewer', description: 'Reviewer' },
      { name: 'viewer', description: 'Viewer' },
    ], { ignoreDuplicates: true });
    await Permission.bulkCreate([
      { name: 'documents.create', description: 'Create documents' },
      { name: 'documents.read', description: 'Read documents' },
      { name: 'documents.update', description: 'Update documents' },
      { name: 'documents.delete', description: 'Delete documents' },
    ], { ignoreDuplicates: true });
    await User.create({
      username: 'admin',
      password: 'admin', // Should be hashed in real app
      email: 'admin@example.com',
      full_name: 'System Admin',
      status: 'active',
    });
    console.log('Seed data created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
})();
