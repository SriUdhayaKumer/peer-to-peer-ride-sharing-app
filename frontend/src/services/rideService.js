import api from './api'

export const rideService = {
  // Search for rides
  searchRides: async (searchParams) => {
    try {
      console.log('🔍 API call to /rides/search with params:', searchParams)
      const response = await api.get('/rides/search', { params: searchParams })
      console.log('📊 API response:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ API error:', error)
      throw error.response?.data || error
    }
  },

  // Book a ride
  bookRide: async (rideId, bookingData) => {
    try {
      const response = await api.post(`/rides/${rideId}/book`, bookingData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get user's rides (both posted and booked)
  getMyRides: async () => {
    try {
      const response = await api.get('/rides/my-rides')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get ride details
  getRideDetails: async (rideId) => {
    try {
      console.log('🔍 API call to get ride details for ID:', rideId)
      const response = await api.get(`/rides/${rideId}`)
      console.log('📊 Ride details API response:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error getting ride details:', error)
      throw error.response?.data || error
    }
  },

  // Post a new ride
  postRide: async (rideData) => {
    try {
      const response = await api.post('/rides', rideData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Book a ride
  bookRide: async (rideId, bookingData) => {
    try {
      const response = await api.post(`/rides/${rideId}/book`, bookingData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Confirm ride (driver action)
  confirmRide: async (rideId) => {
    try {
      const response = await api.post(`/rides/${rideId}/confirm`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Start ride
  startRide: async (rideId) => {
    try {
      const response = await api.post(`/rides/${rideId}/start`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Complete ride
  completeRide: async (rideId, completionData) => {
    try {
      const response = await api.post(`/rides/${rideId}/complete`, completionData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Cancel a ride
  cancelRide: async (rideId, reason) => {
    try {
      const response = await api.post(`/rides/${rideId}/cancel`, { reason })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get user's ride history
  getRideHistory: async (filters = {}) => {
    try {
      const response = await api.get('/rides/history/me', { params: filters })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update driver location (live tracking)
  updateDriverLocation: async (rideId, latitude, longitude) => {
    try {
      const response = await api.post(`/rides/${rideId}/location`, {
        latitude,
        longitude,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Rate ride
  rateRide: async (rideId, rating, review) => {
    try {
      const response = await api.post(`/rides/${rideId}/rate`, {
        rating,
        review,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Report emergency (SOS)
  reportEmergency: async (rideId, emergencyData) => {
    try {
      const response = await api.post(`/rides/${rideId}/sos`, emergencyData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Verify ride with QR code
  verifyRideQR: async (rideId, qrCode) => {
    try {
      const response = await api.post(`/rides/${rideId}/verify`, { qrCode })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Share trip details
  shareTrip: async (rideId, contactData) => {
    try {
      const response = await api.post(`/rides/${rideId}/share`, contactData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}
