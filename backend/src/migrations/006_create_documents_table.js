module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('documents', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      document_number: { type: Sequelize.STRING, allowNull: false, unique: true },
      title: Sequelize.STRING,
      document_type: Sequelize.STRING,
      issuing_agency: Sequelize.STRING,
      signer: Sequelize.STRING,
      signer_position: Sequelize.STRING,
      issue_date: Sequelize.DATE,
      effective_date: Sequelize.DATE,
      expiry_date: Sequelize.DATE,
      status: Sequelize.STRING,
      confidentiality_level: Sequelize.STRING,
      impact_level: Sequelize.STRING,
      legal_basis: Sequelize.STRING,
      parent_document_id: { type: Sequelize.UUID, references: { model: 'documents', key: 'id' }, onDelete: 'SET NULL' },
      created_by: { type: Sequelize.UUID, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('documents', ['created_by']);
    await queryInterface.addIndex('documents', ['status']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('documents');
  },
};
