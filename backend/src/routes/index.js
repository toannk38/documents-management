const express = require('express');
const router = express.Router();

const users = require('./users');
// Import other route modules as needed

router.use('/users', users);
// Add more routes: roles, documents, etc.

module.exports = router;
