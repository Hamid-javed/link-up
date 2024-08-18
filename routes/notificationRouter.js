const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationControl');
const { verifyUserToken } = require('../middleware/authUser');

module.exports = (io) => {

    router.post('/add', verifyUserToken, (req, res) => {
        notificationController.addNotification(req, res, io);
    });
    router.post('/like', verifyUserToken, (req, res) => {
        notificationController.likeNotification(req, res, io);
    });

    router.post('/follow', verifyUserToken, (req, res) => {
        notificationController.followNotification(req, res, io);
    });

    router.post('/comment', verifyUserToken, (req, res) => {
        notificationController.commentNotification(req, res, io);
    });

    router.get('/get-all-notifications', verifyUserToken, notificationController.getNotifications);
    router.patch('/:notificationId/mark-as-read', verifyUserToken, notificationController.markAsRead);
    router.delete('/:notificationId/delete', verifyUserToken, notificationController.deleteNotification);
    router.patch('/mark-all-as-read', verifyUserToken, notificationController.markAllAsRead);
    router.get('/unread-count', verifyUserToken, notificationController.getUnreadCount);
    router.get('/filter', verifyUserToken, notificationController.filterNotifications);

    return router;
};
