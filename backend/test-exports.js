const notificationController = require('./controllers/notificationController');

console.log('Notification controller object:', notificationController);
console.log('sendSOSNotification type:', typeof notificationController.sendSOSNotification);
console.log('sendRideNotification type:', typeof notificationController.sendRideNotification);
console.log('getNotifications type:', typeof notificationController.getNotifications);
console.log('markAsRead type:', typeof notificationController.markAsRead);
