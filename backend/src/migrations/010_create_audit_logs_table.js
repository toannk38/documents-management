module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('audit_logs', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      user_id: { type: Sequelize.UUID, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      action: Sequelize.STRING,
      resource_type: Sequelize.STRING,
      resource_id: Sequelize.STRING,
      old_values: Sequelize.JSONB,
      new_values: Sequelize.JSONB,
      ip_address: Sequelize.STRING,
      user_agent: Sequelize.STRING,
      request_method: Sequelize.STRING,
      request_url: Sequelize.STRING,
      response_status: Sequelize.INTEGER,
      execution_time: Sequelize.INTEGER,
      error_message: Sequelize.STRING,
      severity_level: Sequelize.STRING,
      module: Sequelize.STRING,
      sub_module: Sequelize.STRING,
      context: Sequelize.JSONB,
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('audit_logs', ['user_id']);
    await queryInterface.addIndex('audit_logs', ['created_at']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('audit_logs');
  },
};
