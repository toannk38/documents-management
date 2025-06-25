const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class DocumentFile extends Model {}

DocumentFile.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  document_id: DataTypes.UUID,
  version_id: DataTypes.UUID,
  file_path: DataTypes.STRING,
  file_name: DataTypes.STRING,
  file_size: DataTypes.INTEGER,
  file_type: DataTypes.STRING,
  uploaded_by: DataTypes.UUID,
  uploaded_at: DataTypes.DATE,
}, {
  sequelize,
  modelName: 'DocumentFile',
  tableName: 'document_files',
  timestamps: false,
});

module.exports = DocumentFile;
