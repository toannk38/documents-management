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

// Define associations here if needed
// Example: User.belongsToMany(Role, { through: 'user_roles' });

module.exports = {
  User,
  Role,
  Permission,
  Document,
  DocumentVersion,
  DocumentFile,
  DigitalSignature,
  AuditLog,
  DocumentCategory,
  DocumentWorkflow,
  DocumentComment,
  SystemSetting,
};
