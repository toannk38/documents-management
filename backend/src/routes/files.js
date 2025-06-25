const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const fileUpload = require('../middlewares/fileUpload');

router.post('/upload', fileUpload, fileController.uploadFile);
// Add more file routes here

module.exports = router;
