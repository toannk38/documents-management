module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('document_versions', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      document_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'documents', key: 'id' }, onDelete: 'CASCADE' },
      version_number: Sequelize.STRING,
      change_type: Sequelize.STRING,
      content: Sequelize.TEXT,
      is_current: Sequelize.BOOLEAN,
      created_by: { type: Sequelize.UUID, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('document_versions', ['document_id']);
    await queryInterface.addIndex('document_versions', ['is_current']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('document_versions');
  },
};
