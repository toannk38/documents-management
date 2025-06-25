const express = require('express');
const router = express.Router();
const signatureController = require('../controllers/signatureController');

router.post('/verify', signatureController.verifySignature);
// Add more signature routes here

module.exports = router;
