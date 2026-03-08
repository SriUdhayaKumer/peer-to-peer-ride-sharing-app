import api from './api'

export const paymentService = {
  // Get Razorpay key
  getRazorpayKey: async () => {
    try {
      const response = await api.get('/payment/key')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Create payment order
  createPaymentOrder: async (paymentData) => {
    try {
      const response = await api.post('/payment/create-order', paymentData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    try {
      const response = await api.post('/payment/verify', paymentData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get payment details
  getPaymentDetails: async (paymentId) => {
    try {
      const response = await api.get(`/payment/${paymentId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get payment history
  getPaymentHistory: async (filters = {}) => {
    try {
      const response = await api.get('/payment/history/me', { params: filters })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Process refund
  processRefund: async (paymentId, refundData) => {
    try {
      const response = await api.post(`/payment/${paymentId}/refund`, refundData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get wallet balance
  getWalletBalance: async () => {
    try {
      const response = await api.get('/payment/wallet')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Add money to wallet
  addMoneyToWallet: async (amount, paymentData) => {
    try {
      const response = await api.post('/payment/wallet/add', {
        amount,
        ...paymentData,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Pay from wallet
  payFromWallet: async (amount, rideId) => {
    try {
      const response = await api.post('/payment/wallet/pay', {
        amount,
        rideId,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}
