const User = require('../models/User');

// @desc    Send SOS notification
// @route   POST /api/notifications/sos
// @access  Private
const sendSOSNotification = async (req, res) => {
  try {
    const { location, message, userId } = req.body;

    if (!location || !message || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Location, message, and userId are required'
      });
    }

    // Get user with emergency contacts
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Send notifications to emergency contacts
    const notifications = [];
    
    if (user.emergencyContacts && user.emergencyContacts.length > 0) {
      for (const contact of user.emergencyContacts) {
        // In a real app, you would send SMS/email here
        notifications.push({
          contact: contact.phone,
          message: `🚨 EMERGENCY ALERT 🚨\n\n${user.name} is in an emergency!\n\nMessage: ${message}\n\nLocation: https://maps.google.com/?q=${location.latitude},${location.longitude}\n\nTime: ${new Date().toLocaleString()}`,
          type: 'sos',
          timestamp: new Date()
        });
      }
    }

    // Log SOS alert
    console.log('SOS Alert Triggered:', {
      userId,
      userName: user.name,
      location,
      message,
      emergencyContacts: user.emergencyContacts.length,
      timestamp: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'SOS notifications sent successfully',
      notificationsSent: notifications.length,
      emergencyContacts: (user.emergencyContacts || []).map(c => ({
        name: c.name,
        phone: c.phone,
        relation: c.relation
      }))
    });

  } catch (error) {
    console.error('SOS notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during SOS notification'
    });
  }
};

// @desc    Send ride notification
// @route   POST /api/notifications/ride
// @access  Private
const sendRideNotification = async (req, res) => {
  try {
    const { rideId, type, message, recipientId } = req.body;

    if (!rideId || !type || !recipientId) {
      return res.status(400).json({
        success: false,
        message: 'Ride ID, type, and recipient ID are required'
      });
    }

    // Get recipient user
    const recipient = await User.findById(recipientId);
    
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Create notification
    const notification = {
      type: type,
      message: message,
      rideId: rideId,
      userId: recipientId,
      read: false,
      timestamp: new Date()
    };

    // In a real app, you would store this in a Notification model
    // For now, just log it
    console.log('Ride notification created:', notification);

    // Send push notification if available
    if (recipient.pushToken) {
      // Send push notification here
      console.log('Push notification would be sent to:', recipient.pushToken);
    }

    res.status(200).json({
      success: true,
      message: 'Ride notification sent successfully',
      notification
    });

  } catch (error) {
    console.error('Ride notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during ride notification'
    });
  }
};

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    // In a real app, you would fetch from Notification model
    // For now, return mock data
    const notifications = [
      {
        id: '1',
        type: 'ride_accepted',
        message: 'Your ride request has been accepted',
        rideId: 'ride-123',
        read: false,
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        type: 'ride_completed',
        message: 'Your ride has been completed',
        rideId: 'ride-123',
        read: true,
        timestamp: new Date(Date.now() - 7200000)
      }
    ];

    res.status(200).json({
      success: true,
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: notifications.length
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching notifications'
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Notification ID is required'
      });
    }

    // In a real app, you would update Notification model
    console.log(`Notification ${id} marked as read by user ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking notification as read'
    });
  }
};

module.exports = {
  sendSOSNotification,
  sendRideNotification,
  getNotifications,
  markAsRead
};
