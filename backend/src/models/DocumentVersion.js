const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class DocumentVersion extends Model {}

DocumentVersion.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  document_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  version_number: DataTypes.STRING,
  change_type: DataTypes.STRING,
  content: DataTypes.TEXT,
  is_current: DataTypes.BOOLEAN,
  created_by: DataTypes.UUID,
}, {
  sequelize,
  modelName: 'DocumentVersion',
  tableName: 'document_versions',
  timestamps: true,
});

module.exports = DocumentVersion;
