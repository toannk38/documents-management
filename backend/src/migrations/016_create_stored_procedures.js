module.exports = {
  up: async (queryInterface) => {
    // 1. Update document status
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_document_status(doc_id UUID, new_status VARCHAR)
      RETURNS VOID AS $$
      BEGIN
        UPDATE documents SET status = new_status, updated_at = NOW() WHERE id = doc_id;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 2. Create document version
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION create_document_version(doc_id UUID, title VARCHAR, content TEXT)
      RETURNS VOID AS $$
      BEGIN
        INSERT INTO document_versions (document_id, title, content, created_at)
        VALUES (doc_id, title, content, NOW());
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 3. Get latest version
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION get_latest_version(doc_id UUID)
      RETURNS TABLE(id UUID, version_number VARCHAR, created_at TIMESTAMP) AS $$
      BEGIN
        RETURN QUERY
        SELECT id, version_number, created_at
        FROM document_versions
        WHERE document_id = doc_id
        ORDER BY created_at DESC
        LIMIT 1;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 4. Check user permission
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION check_user_permission(user_id UUID, perm_name VARCHAR)
      RETURNS BOOLEAN AS $$
      DECLARE
        perm_count INTEGER;
      BEGIN
        SELECT COUNT(*) INTO perm_count
        FROM user_roles ur
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = user_id AND p.name = perm_name;
        RETURN perm_count > 0;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 5. Get user permissions
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION get_user_permissions(user_id UUID)
      RETURNS TABLE(permission_name VARCHAR) AS $$
      BEGIN
        RETURN QUERY
        SELECT p.name
        FROM user_roles ur
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = user_id;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 6. Assign role to user
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION assign_role_to_user(user_id UUID, role_id UUID)
      RETURNS VOID AS $$
      BEGIN
        INSERT INTO user_roles (user_id, role_id, assigned_at)
        VALUES (user_id, role_id, NOW())
        ON CONFLICT (user_id, role_id) DO NOTHING;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 7. Log activity
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION log_activity(
        p_user_id UUID, p_action VARCHAR, p_resource_type VARCHAR, p_resource_id VARCHAR,
        p_old_values JSONB, p_new_values JSONB, p_ip_address VARCHAR, p_user_agent VARCHAR,
        p_request_method VARCHAR, p_request_url VARCHAR, p_response_status INTEGER,
        p_execution_time INTEGER, p_error_message VARCHAR, p_severity_level VARCHAR,
        p_module VARCHAR, p_sub_module VARCHAR, p_context JSONB
      ) RETURNS VOID AS $$
      BEGIN
        INSERT INTO audit_logs (
          user_id, action, resource_type, resource_id, old_values, new_values, ip_address, user_agent,
          request_method, request_url, response_status, execution_time, error_message, severity_level,
          module, sub_module, context, created_at
        ) VALUES (
          p_user_id, p_action, p_resource_type, p_resource_id, p_old_values, p_new_values, p_ip_address, p_user_agent,
          p_request_method, p_request_url, p_response_status, p_execution_time, p_error_message, p_severity_level,
          p_module, p_sub_module, p_context, NOW()
        );
      END;
      $$ LANGUAGE plpgsql;
    `);
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS update_document_status(UUID, VARCHAR);');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS create_document_version(UUID, VARCHAR, TEXT);');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS get_latest_version(UUID);');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS check_user_permission(UUID, VARCHAR);');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS get_user_permissions(UUID);');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS assign_role_to_user(UUID, UUID);');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS log_activity(UUID, VARCHAR, VARCHAR, VARCHAR, JSONB, JSONB, VARCHAR, VARCHAR, VARCHAR, VARCHAR, INTEGER, INTEGER, VARCHAR, VARCHAR, VARCHAR, JSONB);');
  },
};
