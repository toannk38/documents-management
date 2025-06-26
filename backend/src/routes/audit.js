const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');

router.get('/', auditController.getAuditLogs);
router.get('/statistics', auditController.getAuditLogStatistics);
router.get('/export', auditController.exportAuditLogs);
router.get('/:id', auditController.getAuditLogDetail);
router.post('/', auditController.createAuditLog);

module.exports = router;
