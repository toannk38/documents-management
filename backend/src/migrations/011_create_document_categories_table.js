module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('document_categories', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      name: { type: Sequelize.STRING, unique: true },
      description: Sequelize.STRING,
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('document_categories', ['name']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('document_categories');
  },
};
