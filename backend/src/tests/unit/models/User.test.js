describe('User Model', () => {
  test('should be defined', () => {
    const User = require('../../../models/User');
    expect(User).toBeDefined();
  });
});
