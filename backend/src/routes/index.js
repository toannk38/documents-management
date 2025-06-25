const express = require('express');
const router = express.Router();

const users = require('./users');
const auth = require('./auth');
const documents = require('./documents');
// Import other route modules as needed

router.use('/users', users);
router.use('/auth', auth);
router.use('/documents', documents);
// Add more routes: roles, etc.

module.exports = router;
