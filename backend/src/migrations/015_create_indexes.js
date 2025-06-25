module.exports = {
  up: async (queryInterface) => {
    // Add indexes as needed
    await queryInterface.addIndex('users', ['username']);
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('documents', ['document_number']);
    await queryInterface.addIndex('documents', ['created_by']);
    await queryInterface.addIndex('document_versions', ['document_id']);
    await queryInterface.addIndex('document_files', ['document_id']);
    await queryInterface.addIndex('document_files', ['version_id']);
    await queryInterface.addIndex('digital_signatures', ['document_id']);
    await queryInterface.addIndex('digital_signatures', ['signer_id']);
    await queryInterface.addIndex('audit_logs', ['user_id']);
    await queryInterface.addIndex('audit_logs', ['created_at']);
    await queryInterface.addIndex('document_comments', ['document_id']);
    await queryInterface.addIndex('document_comments', ['user_id']);
    await queryInterface.addIndex('system_settings', ['key']);
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
