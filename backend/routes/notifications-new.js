const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Send SOS notification
router.post('/sos', auth, notificationController.sendSOSNotification);

// Send ride notification
router.post('/ride', auth, notificationController.sendRideNotification);

// Get user notifications
router.get('/', auth, notificationController.getNotifications);

// Mark notification as read
router.put('/:id/read', auth, notificationController.markAsRead);

module.exports = router;
