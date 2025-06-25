module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('system_settings', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      key: { type: Sequelize.STRING, allowNull: false, unique: true },
      value: Sequelize.STRING,
      description: Sequelize.STRING,
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('system_settings', ['key']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('system_settings');
  },
};
