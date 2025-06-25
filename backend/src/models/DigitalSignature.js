const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class DigitalSignature extends Model {}

DigitalSignature.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  document_id: DataTypes.UUID,
  version_id: DataTypes.UUID,
  signer_id: DataTypes.UUID,
  signature_data: DataTypes.BLOB,
  certificate_serial: DataTypes.STRING,
  signature_timestamp: DataTypes.DATE,
  signature_type: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'DigitalSignature',
  tableName: 'digital_signatures',
  timestamps: true,
});

module.exports = DigitalSignature;
