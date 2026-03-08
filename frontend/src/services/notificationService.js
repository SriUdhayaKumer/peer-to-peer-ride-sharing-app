import api from './api'

export const notificationService = {
  // Request notification permission
  requestPermission: async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  },

  // Show browser notification
  showNotification: (title, options = {}) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      })
    }
    return null
  },

  // Send SOS notification to backend
  sendSOSNotification: async (emergencyData) => {
    try {
      const response = await api.post('/notifications/sos', emergencyData)
      return response.data
    } catch (error) {
      console.error('SOS notification error:', error)
      throw error.response?.data || error
    }
  },

  // Send ride notification
  sendRideNotification: async (notificationData) => {
    try {
      const response = await api.post('/notifications/ride', notificationData)
      return response.data
    } catch (error) {
      console.error('Ride notification error:', error)
      throw error.response?.data || error
    }
  },

  // Get user notifications
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications')
      return response.data
    } catch (error) {
      console.error('Get notifications error:', error)
      throw error.response?.data || error
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`)
      return response.data
    } catch (error) {
      console.error('Mark notification as read error:', error)
      throw error.response?.data || error
    }
  }
}
