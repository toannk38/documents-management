module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('document_workflows', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      document_id: { type: Sequelize.UUID, references: { model: 'documents', key: 'id' }, onDelete: 'CASCADE' },
      step: Sequelize.STRING,
      assignee_role: Sequelize.STRING,
      status: Sequelize.STRING,
      started_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      completed_at: Sequelize.DATE,
    });
    await queryInterface.addIndex('document_workflows', ['document_id']);
    await queryInterface.addIndex('document_workflows', ['status']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('document_workflows');
  },
};
