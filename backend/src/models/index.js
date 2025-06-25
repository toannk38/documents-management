const User = require('./User');
const Role = require('./Role');
const Permission = require('./Permission');
const Document = require('./Document');
const DocumentVersion = require('./DocumentVersion');
const DocumentFile = require('./DocumentFile');
const DigitalSignature = require('./DigitalSignature');
const AuditLog = require('./AuditLog');
const DocumentCategory = require('./DocumentCategory');
const DocumentWorkflow = require('./DocumentWorkflow');
const DocumentComment = require('./DocumentComment');
const SystemSetting = require('./SystemSetting');

// Associations
User.belongsToMany(Role, { through: 'user_roles', foreignKey: 'user_id' });
Role.belongsToMany(User, { through: 'user_roles', foreignKey: 'role_id' });
Role.belongsToMany(Permission, { through: 'role_permissions', foreignKey: 'role_id' });
Permission.belongsToMany(Role, { through: 'role_permissions', foreignKey: 'permission_id' });
User.hasMany(Document, { foreignKey: 'created_by' });
Document.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

module.exports = {
  User,
  Role,
  Permission,
  Document,
  DocumentWorkflow,
  DocumentComment,
  SystemSetting,
};
