const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class SystemSetting extends Model {}

SystemSetting.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  value: DataTypes.STRING,
  description: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'SystemSetting',
  tableName: 'system_settings',
  timestamps: true,
});

module.exports = SystemSetting;
