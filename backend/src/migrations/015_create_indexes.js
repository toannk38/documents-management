module.exports = {
  up: async (queryInterface) => {
    // Add indexes as needed, skip if already exists
    const safeAddIndex = async (table, fields, options = {}) => {
      try {
        await queryInterface.addIndex(table, fields, options);
      } catch (err) {
        if (err.original && err.original.code === '42P07') {
          console.log(`Index on ${table}(${fields}) already exists, skipping.`);
        } else {
          throw err;
        }
      }
    };
    await safeAddIndex('users', ['username']);
    await safeAddIndex('users', ['email']);
    await safeAddIndex('documents', ['document_number']);
    await safeAddIndex('documents', ['created_by']);
    await safeAddIndex('document_versions', ['document_id']);
    await safeAddIndex('document_files', ['document_id']);
    await safeAddIndex('document_files', ['version_id']);
    await safeAddIndex('digital_signatures', ['document_id']);
    await safeAddIndex('digital_signatures', ['signer_id']);
    await safeAddIndex('audit_logs', ['user_id']);
    await safeAddIndex('audit_logs', ['created_at']);
    await safeAddIndex('document_comments', ['document_id']);
    await safeAddIndex('document_comments', ['user_id']);
    await safeAddIndex('system_settings', ['key']);
  },
  down: async (queryInterface) => {
    await queryInterface.removeIndex('users', ['username']);
    await queryInterface.removeIndex('users', ['email']);
    await queryInterface.removeIndex('documents', ['document_number']);
    await queryInterface.removeIndex('documents', ['created_by']);
    await queryInterface.removeIndex('document_versions', ['document_id']);
    await queryInterface.removeIndex('document_files', ['document_id']);
    await queryInterface.removeIndex('document_files', ['version_id']);
    await queryInterface.removeIndex('digital_signatures', ['document_id']);
    await queryInterface.removeIndex('digital_signatures', ['signer_id']);
    await queryInterface.removeIndex('audit_logs', ['user_id']);
    await queryInterface.removeIndex('audit_logs', ['created_at']);
    await queryInterface.removeIndex('document_comments', ['document_id']);
    await queryInterface.removeIndex('document_comments', ['user_id']);
    await queryInterface.removeIndex('system_settings', ['key']);
  },
};
