const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationControl');
const {verifyUserToken} = require('../middleware/authUser')

router.post('/add', verifyUserToken, notificationController.addNotification);
router.get('/get-all-notifications', verifyUserToken, notificationController.getNotifications);
router.patch('/:notificationId/mark-as-read',verifyUserToken,  notificationController.markAsRead);
router.delete('/:notificationId/delete',verifyUserToken,  notificationController.deleteNotification);
router.patch('/mark-all-as-read',verifyUserToken, notificationController.markAllAsRead);
router.get('/unread-count',verifyUserToken, notificationController.getUnreadCount);
router.get('/filter',verifyUserToken, notificationController.filterNotifications);

module.exports = router;