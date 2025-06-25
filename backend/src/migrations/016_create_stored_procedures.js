module.exports = {
  up: async (queryInterface) => {
    // Example: create a simple stored procedure (PostgreSQL)
    // Add more stored procedures as needed for your business logic
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_document_status(doc_id UUID, new_status VARCHAR)
      RETURNS VOID AS $$
      BEGIN
        UPDATE documents SET status = new_status, updated_at = NOW() WHERE id = doc_id;
      END;
      $$ LANGUAGE plpgsql;
    `);
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS update_document_status(UUID, VARCHAR);');
  },
};
