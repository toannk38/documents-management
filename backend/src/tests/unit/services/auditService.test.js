// auditService.test.js
const { AuditLog } = require('../../../../src/models');
const auditService = require('../../../../src/services/auditService');

describe('AuditService', () => {
  describe('createAuditLog', () => {
    test('should create an audit log with valid data', async () => {
      const logData = {
        user_id: 'test-user-id',
        action: 'test.action',
        resource_type: 'test_resource',
        resource_id: 'test-resource-id',
        old_values: { foo: 'bar' },
        new_values: { foo: 'baz' },
        ip_address: '127.0.0.1',
        user_agent: 'jest-test',
        request_method: 'POST',
        request_url: '/api/test',
        response_status: 200,
        execution_time: 100,
        error_message: null,
        severity_level: 'info',
        module: 'test',
        sub_module: 'unit',
        context: { test: true },
        created_at: new Date()
      };
      const log = await auditService.createAuditLog(logData);
      expect(log).toHaveProperty('id');
      expect(log.action).toBe('test.action');
    });
  });

  describe('getAuditLogs', () => {
    test('should return paginated audit logs', async () => {
      const result = await auditService.getAuditLogs({ page: 1, limit: 10 });
      expect(result).toHaveProperty('logs');
      expect(Array.isArray(result.logs)).toBe(true);
      expect(result).toHaveProperty('pagination');
    });
  });
});
