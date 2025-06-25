const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');

router.post('/start', workflowController.startWorkflow);
// Add more workflow routes here

module.exports = router;
