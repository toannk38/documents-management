// audit.e2e.test.js
const request = require('supertest');
const app = require('../../../app');

describe('Audit Log E2E', () => {
  let token;
  beforeAll(async () => {
    // TODO: Authenticate and get token
    token = 'Bearer test-token';
  });

  test('User action should create audit log and be queryable', async () => {
    // Simulate a user action that triggers audit log (e.g., document creation)
    // This is a placeholder, replace with real action
    await request(app)
      .post('/api/documents')
      .set('Authorization', token)
      .send({ title: 'Audit E2E Test', document_number: 'E2E-001', document_type: 'Test', status: 'draft' });

    // Query audit logs for the action
    const res = await request(app)
      .get('/api/audit-logs')
      .set('Authorization', token)
      .query({ action: 'document.create' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.logs.length).toBeGreaterThanOrEqual(1);
  });
});
