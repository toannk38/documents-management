// audit.integration.test.js
const request = require('supertest');
const app = require('../../../../app');

describe('Audit Log API Integration', () => {
  let token;
  beforeAll(async () => {
    // TODO: Authenticate and get token
    token = 'Bearer test-token';
  });

  test('GET /api/audit-logs should return logs', async () => {
    const res = await request(app)
      .get('/api/audit-logs')
      .set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('logs');
  });

  test('POST /api/audit-logs (system) should create log', async () => {
    const res = await request(app)
      .post('/api/audit-logs')
      .set('Authorization', token)
      .set('X-System-Call', 'true')
      .send({
        action: 'test.create',
        resource_type: 'test',
        module: 'test',
        severity_level: 'info',
        created_at: new Date()
      });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('log');
  });
});
