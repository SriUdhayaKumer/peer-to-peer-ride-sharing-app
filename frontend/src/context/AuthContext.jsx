import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for stored auth data on mount
    const token = localStorage.getItem('safaride_token')
    const storedUser = localStorage.getItem('safaride_user')
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password)
      
      if (result.success) {
        setUser(result.user)
        setIsAuthenticated(true)
        navigate('/home') // Navigate to home page after successful login
        return { success: true }
      } else {
        return { success: false, error: result.message || 'Login failed' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' }
    }
  }

  const register = async (userData) => {
    try {
      const result = await authService.register(userData)
      
      if (result.success) {
        setUser(result.user)
        setIsAuthenticated(true)
        navigate('/home') // Navigate to home page after successful registration
        return { success: true }
      } else {
        return { success: false, error: result.message || 'Registration failed' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' }
    }
  }

  const loginWithOTP = async (phone, otp) => {
    try {
      const result = await authService.verifyOTP(phone, otp)
      
      if (result.success) {
        setUser(result.user)
        setIsAuthenticated(true)
        return { success: true }
      } else {
        return { success: false, error: result.message || 'OTP verification failed' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'OTP verification failed' }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
    navigate('/')
  }

  const updateProfile = async (profileData) => {
    try {
      const result = await authService.updateProfile(profileData)
      
      if (result.success) {
        setUser(result.user)
        return { success: true }
      } else {
        return { success: false, error: result.message || 'Profile update failed' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Profile update failed' }
    }
  }

  const completeProfileSetup = (profileData) => {
    // This is now handled by register API
    // Keeping for backward compatibility
    const newUser = {
      id: 'user_' + Date.now(),
      ...profileData,
      isVerified: false,
      idVerified: false,
      selfieVerified: false,
    }
    
    setUser(newUser)
    localStorage.setItem('safaride_user', JSON.stringify(newUser))
  }

  const verifyIdentity = async (verificationData) => {
    try {
      const result = await authService.verifyIdentity(verificationData)
      
      if (result.success) {
        setUser(result.user)
        return { success: true }
      } else {
        return { success: false, error: result.message || 'Identity verification failed' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Identity verification failed' }
    }
  }

  const verifyDriver = async (driverData) => {
    try {
      const result = await authService.verifyDriver(driverData)
      
      if (result.success) {
        setUser(result.user)
        return { success: true }
      } else {
        return { success: false, error: result.message || 'Driver verification failed' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Driver verification failed' }
    }
  }

  const sendOTP = async (phone) => {
    try {
      const result = await authService.sendOTP(phone)
      return result
    } catch (error) {
      return { success: false, error: error.message || 'Failed to send OTP' }
    }
  }

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('safaride_token')
      if (token) {
        const result = await authService.getCurrentUser()
        if (result.success) {
          setUser(result.user)
          localStorage.setItem('safaride_user', JSON.stringify(result.user))
        }
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error)
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
