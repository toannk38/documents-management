const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class DocumentWorkflow extends Model {}

DocumentWorkflow.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  document_id: DataTypes.UUID,
  step: DataTypes.STRING,
  assignee_role: DataTypes.STRING,
  status: DataTypes.STRING,
  started_at: DataTypes.DATE,
  completed_at: DataTypes.DATE,
}, {
  sequelize,
  modelName: 'DocumentWorkflow',
  tableName: 'document_workflows',
  timestamps: false,
});

module.exports = DocumentWorkflow;
