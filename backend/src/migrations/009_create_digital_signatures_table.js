module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('digital_signatures', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      document_id: { type: Sequelize.UUID, references: { model: 'documents', key: 'id' }, onDelete: 'CASCADE' },
      version_id: { type: Sequelize.UUID, references: { model: 'document_versions', key: 'id' }, onDelete: 'CASCADE' },
      signer_id: { type: Sequelize.UUID, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      signature_data: Sequelize.BLOB,
      certificate_serial: Sequelize.STRING,
      signature_timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      signature_type: Sequelize.STRING,
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('digital_signatures', ['document_id']);
    await queryInterface.addIndex('digital_signatures', ['signer_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('digital_signatures');
  },
};
