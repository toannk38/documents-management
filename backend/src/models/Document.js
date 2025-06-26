const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Document extends Model {}

Document.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  document_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  title: DataTypes.STRING,
  document_type: DataTypes.STRING,
  issuing_agency: DataTypes.STRING,
  signer: DataTypes.STRING,
  signer_position: DataTypes.STRING,
  issue_date: DataTypes.DATE,
  effective_date: DataTypes.DATE,
  expiry_date: DataTypes.DATE,
  status: DataTypes.STRING,
  confidentiality_level: DataTypes.STRING,
  impact_level: DataTypes.STRING,
  legal_basis: DataTypes.STRING,
  parent_document_id: DataTypes.UUID,
  created_by: DataTypes.UUID,
}, {
  sequelize,
  modelName: 'Document',
  tableName: 'documents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Document;
