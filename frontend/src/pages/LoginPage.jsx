import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { EnvelopeIcon, LockClosedIcon, ArrowLeftIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showVerificationReminder, setShowVerificationReminder] = useState(false)

  // Check if user needs verification after login
  useEffect(() => {
    if (user) {
      const needsVerification = !user.identityVerified || !user.profilePhoto
      setShowVerificationReminder(needsVerification)
    }
  }, [user])

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        // Login successful, navigation handled by AuthContext
      } else {
        setError(result.error || 'Login failed. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Login to your SafeRide account</p>
        </div>

        <Card className="p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder="Enter your email"
              icon={EnvelopeIcon}
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              placeholder="Enter your password"
              icon={LockClosedIcon}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>

            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/profile-setup" className="text-blue-600 hover:text-blue-500 font-medium">
                  Complete Profile Setup
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Verification Reminder */}
        <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <ShieldCheckIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Verify Your Account for Enhanced Safety
              </h3>
              <p className="text-gray-600 mb-4">
                Complete identity verification to unlock all safety features, increase trust, and get priority access to rides.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircleSolid className="w-4 h-4 text-green-500 mr-2" />
                  Identity Verification (ID + Selfie)
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircleSolid className="w-4 h-4 text-green-500 mr-2" />
                  Profile Photo Upload
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircleSolid className="w-4 h-4 text-green-500 mr-2" />
                  Optional Driver Verification
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                <Button to="/profile-setup" variant="primary" size="sm">
                  Verify Now
                </Button>
                <Button to="/login" variant="outline" size="sm">
                  Skip for Now
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  )
}
