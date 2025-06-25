const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');

router.get('/', permissionController.getAllPermissions);
// Add more permission routes here

module.exports = router;
