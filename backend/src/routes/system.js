const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

router.get('/config', systemController.getSystemConfig);
// Add more system routes here

module.exports = router;
