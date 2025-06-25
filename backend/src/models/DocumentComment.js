const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class DocumentComment extends Model {}

DocumentComment.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  document_id: DataTypes.UUID,
  user_id: DataTypes.UUID,
  comment: DataTypes.TEXT,
  created_at: DataTypes.DATE,
}, {
  sequelize,
  modelName: 'DocumentComment',
  tableName: 'document_comments',
  timestamps: false,
});

module.exports = DocumentComment;
