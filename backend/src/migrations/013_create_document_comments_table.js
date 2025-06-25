module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('document_comments', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      document_id: { type: Sequelize.UUID, references: { model: 'documents', key: 'id' }, onDelete: 'CASCADE' },
      user_id: { type: Sequelize.UUID, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      comment: Sequelize.TEXT,
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('document_comments', ['document_id']);
    await queryInterface.addIndex('document_comments', ['user_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('document_comments');
  },
};
