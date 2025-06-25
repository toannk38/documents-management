module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('document_files', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      document_id: { type: Sequelize.UUID, references: { model: 'documents', key: 'id' }, onDelete: 'CASCADE' },
      version_id: { type: Sequelize.UUID, references: { model: 'document_versions', key: 'id' }, onDelete: 'CASCADE' },
      file_path: Sequelize.STRING,
      file_name: Sequelize.STRING,
      file_size: Sequelize.INTEGER,
      file_type: Sequelize.STRING,
      uploaded_by: { type: Sequelize.UUID, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      uploaded_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('document_files', ['document_id']);
    await queryInterface.addIndex('document_files', ['version_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('document_files');
  },
};
