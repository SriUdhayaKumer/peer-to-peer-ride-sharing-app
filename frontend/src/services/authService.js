import api from './api'

export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      
      if (response.data.success) {
        localStorage.setItem('safaride_token', response.data.token)
        localStorage.setItem('safaride_user', JSON.stringify(response.data.user))
        localStorage.setItem('safaride_auth', 'true')
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Login with email/password
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      
      if (response.data.success) {
        localStorage.setItem('safaride_token', response.data.token)
        localStorage.setItem('safaride_user', JSON.stringify(response.data.user))
        localStorage.setItem('safaride_auth', 'true')
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Send OTP for phone verification
  sendOTP: async (phone) => {
    try {
      const response = await api.post('/auth/send-otp', { phone })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Verify OTP and login
  verifyOTP: async (phone, otp) => {
    try {
      const response = await api.post('/auth/verify-otp', { phone, otp })
      
      if (response.data.success) {
        localStorage.setItem('safaride_token', response.data.token)
        localStorage.setItem('safaride_user', JSON.stringify(response.data.user))
        localStorage.setItem('safaride_auth', 'true')
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Complete identity verification
  verifyIdentity: async (formData) => {
    try {
      const data = new FormData()
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'idProof' && key !== 'selfie' && formData[key] !== null) {
          data.append(key, formData[key])
        }
      })
      
      // Add files
      if (formData.idProof) {
        data.append('idProof', formData.idProof)
      }
      
      if (formData.selfie) {
        data.append('selfie', formData.selfie)
      }
      
      const response = await api.post('/auth/verify-identity', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      // Update user data in localStorage
      if (response.data.success) {
        localStorage.setItem('safaride_user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Complete driver verification
  verifyDriver: async (formData) => {
    try {
      const data = new FormData()
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (!['drivingLicense', 'vehicleRegistration', 'vehiclePhoto'].includes(key) && formData[key] !== null) {
          data.append(key, formData[key])
        }
      })
      
      // Add files
      if (formData.drivingLicense) {
        data.append('drivingLicense', formData.drivingLicense)
      }
      
      if (formData.vehicleRegistration) {
        data.append('vehicleRegistration', formData.vehicleRegistration)
      }
      
      if (formData.vehiclePhoto) {
        data.append('vehiclePhoto', formData.vehiclePhoto)
      }
      
      const response = await api.post('/auth/verify-driver', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      // Update user data in localStorage
      if (response.data.success) {
        localStorage.setItem('safaride_user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData)
      
      // Update user data in localStorage
      if (response.data.success) {
        localStorage.setItem('safaride_user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Logout
  logout: async () => {
    try {
      // Clear local storage
      localStorage.removeItem('safaride_token')
      localStorage.removeItem('safaride_user')
      localStorage.removeItem('safaride_auth')
    } catch (error) {
      console.error('Logout error:', error)
    }
  },
}
