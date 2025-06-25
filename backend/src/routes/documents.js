const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

router.get('/', documentController.getAllDocuments);
router.get('/:id', documentController.getDocumentById);
router.post('/', documentController.createDocument);
router.put('/:id', documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);
router.get('/:id/versions', documentController.getDocumentVersions);
router.post('/:id/upload-pdf', documentController.uploadPdfFile);
router.get('/:id/download', documentController.downloadDocumentFile);
router.post('/search', documentController.advancedSearchDocuments);
router.patch('/:id/status', documentController.changeDocumentStatus);

module.exports = router;
