import api from './api'

export const verificationService = {
  // Get verification status
  getVerificationStatus: async () => {
    try {
      const response = await api.get('/verification/status')
      return response.data
    } catch (error) {
      console.error('Get verification status error:', error)
      throw error.response?.data || error
    }
  },

  // Get AI recommendations
  getRecommendations: async () => {
    try {
      const response = await api.get('/verification/recommendations')
      return response.data
    } catch (error) {
      console.error('Get recommendations error:', error)
      throw error.response?.data || error
    }
  }
}
