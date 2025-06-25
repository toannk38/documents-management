const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class AuditLog extends Model {}

AuditLog.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: DataTypes.UUID,
  action: DataTypes.STRING,
  resource_type: DataTypes.STRING,
  resource_id: DataTypes.STRING,
  old_values: DataTypes.JSONB,
  new_values: DataTypes.JSONB,
  ip_address: DataTypes.STRING,
  user_agent: DataTypes.STRING,
  request_method: DataTypes.STRING,
  request_url: DataTypes.STRING,
  response_status: DataTypes.INTEGER,
  execution_time: DataTypes.INTEGER,
  error_message: DataTypes.STRING,
  severity_level: DataTypes.STRING,
  module: DataTypes.STRING,
  sub_module: DataTypes.STRING,
  context: DataTypes.JSONB,
  created_at: DataTypes.DATE,
}, {
  sequelize,
  modelName: 'AuditLog',
  tableName: 'audit_logs',
  timestamps: false,
});

module.exports = AuditLog;
