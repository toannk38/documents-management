const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class DocumentCategory extends Model {}

DocumentCategory.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'DocumentCategory',
  tableName: 'document_categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = DocumentCategory;
