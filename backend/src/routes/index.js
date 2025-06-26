const express = require('express');
const router = express.Router();

const users = require('./users');
const auth = require('./auth');
const documents = require('./documents');
const auditLogs = require('./audit-logs'); // Import the audit logs route module
// Import other route modules as needed

router.use('/users', users);
router.use('/auth', auth);
router.use('/documents', documents);
router.use('/audit-logs', auditLogs); // Register the audit logs route
// Add more routes: roles, etc.

module.exports = router;
