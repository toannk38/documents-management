const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);
router.post('/', roleController.createRole);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);
router.post('/:id/permissions', roleController.assignPermissionsToRole);
router.delete('/:id/permissions/:permission_id', roleController.revokePermissionFromRole);

module.exports = router;
