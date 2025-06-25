const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/:id/roles', userController.assignRoles);
router.delete('/:id/roles/:role_id', userController.revokeRole);
router.post('/:id/reset-password', userController.resetPassword);
router.get('/:id/activities', userController.getUserActivities);
router.patch('/:id/toggle-status', userController.toggleUserStatus);

module.exports = router;
