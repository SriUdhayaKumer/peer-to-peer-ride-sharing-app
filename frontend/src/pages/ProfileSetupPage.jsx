import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserCircleIcon,
  IdentificationIcon,
  CameraIcon,
  TruckIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'

export default function ProfileSetupPage() {
  const navigate = useNavigate()
  const { register, verifyIdentity, verifyDriver } = useAuth()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Identity Verification
    idProofType: 'aadhar',
    idProof: null,
    selfie: null,
    
    // Step 3: Driver Verification (Optional)
    drivingLicense: null,
    vehicleRegistration: null,
    vehiclePhoto: null,
    vehicleNumberPlate: '',
    vehicleType: 'car',
    availableSeats: 1,
  })

  const [errors, setErrors] = useState({})
  const [uploadedFiles, setUploadedFiles] = useState({})

  const steps = [
    { id: 1, title: 'Basic Info', icon: UserCircleIcon },
    { id: 2, title: 'Identity Verification', icon: IdentificationIcon },
    { id: 3, title: 'Driver Verification (Optional)', icon: TruckIcon },
  ]

  const vehicleTypes = [
    { id: 'bike', name: 'Bike', capacity: 2, icon: '🏍️' },
    { id: 'auto', name: 'Auto', capacity: 3, icon: '🛺' },
    { id: 'car', name: 'Car', capacity: 4, icon: '🚗' },
    { id: 'suv', name: 'SUV', capacity: 6, icon: '🚙' },
    { id: 'van', name: 'Van', capacity: 8, icon: '🚐' },
  ]

  const validateStep = (step) => {
    const newErrors = {}
    
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
      else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits'
      if (!formData.password) newErrors.password = 'Password is required'
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password'
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (step === 2) {
      if (!formData.idProof) newErrors.idProof = 'ID proof is required'
      if (!formData.selfie) newErrors.selfie = 'Selfie is required'
    }
    
    if (step === 3) {
      if (!formData.drivingLicense) newErrors.drivingLicense = 'Driving license is required'
      if (!formData.vehicleRegistration) newErrors.vehicleRegistration = 'Vehicle registration is required'
      if (!formData.vehiclePhoto) newErrors.vehiclePhoto = 'Vehicle photo is required'
      if (!formData.vehicleNumberPlate.trim()) newErrors.vehicleNumberPlate = 'Vehicle number is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const handleFileUpload = (field) => (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, [field]: file })
      setUploadedFiles({ ...uploadedFiles, [field]: file.name })
      if (errors[field]) {
        setErrors({ ...errors, [field]: '' })
      }
    }
  }

  const handleNext = async () => {
    if (!validateStep(currentStep)) return
    
    if (currentStep === 1) {
      // Register user
      setLoading(true)
      setError('')
      
      try {
        const result = await register({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        })
        
        if (result.success) {
          setCurrentStep(currentStep + 1)
        } else {
          setError(result.error || 'Registration failed')
        }
      } catch (error) {
        setError(error.message || 'Registration failed')
      } finally {
        setLoading(false)
      }
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleCompleteIdentityVerification = async () => {
    if (!validateStep(2)) return
    
    setLoading(true)
    setError('')
    
    try {
      const result = await verifyIdentity({
        idProofType: formData.idProofType,
        idProof: formData.idProof,
        selfie: formData.selfie,
      })
      
      if (result.success) {
        setCurrentStep(3) // Go to driver verification
      } else {
        setError(result.error || 'Identity verification failed')
      }
    } catch (error) {
      setError(error.message || 'Identity verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteDriverVerification = async () => {
    if (!validateStep(3)) return
    
    setLoading(true)
    setError('')
    
    try {
      const result = await verifyDriver({
        vehicleType: formData.vehicleType,
        vehicleNumberPlate: formData.vehicleNumberPlate,
        availableSeats: formData.availableSeats,
        drivingLicense: formData.drivingLicense,
        vehicleRegistration: formData.vehicleRegistration,
        vehiclePhoto: formData.vehiclePhoto,
      })
      
      if (result.success) {
        navigate('/login')
      } else {
        setError(result.error || 'Driver verification failed')
      }
    } catch (error) {
      setError(error.message || 'Driver verification failed')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={handleInputChange('fullName')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter 10-digit phone number"
                maxLength={10}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Proof Type
              </label>
              <select
                value={formData.idProofType}
                onChange={handleInputChange('idProofType')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="aadhar">Aadhar Card</option>
                <option value="driving_license">Driving License</option>
                <option value="passport">Passport</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Government ID
              </label>
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                  <IdentificationIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, PDF up to 5MB
                  </p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload('idProof')}
                    className="hidden"
                  />
                </div>
              </label>
              {uploadedFiles.idProof && (
                <div className="mt-2 flex items-center text-green-600">
                  <CheckCircleSolid className="w-4 h-4 mr-2" />
                  <span className="text-sm">{uploadedFiles.idProof}</span>
                </div>
              )}
              {errors.idProof && (
                <p className="text-red-500 text-sm mt-1">{errors.idProof}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Selfie Photo
              </label>
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                  <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    Clear selfie photo required
                  </p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileUpload('selfie')}
                    className="hidden"
                  />
                </div>
              </label>
              {uploadedFiles.selfie && (
                <div className="mt-2 flex items-center text-green-600">
                  <CheckCircleSolid className="w-4 h-4 mr-2" />
                  <span className="text-sm">{uploadedFiles.selfie}</span>
                </div>
              )}
              {errors.selfie && (
                <p className="text-red-500 text-sm mt-1">{errors.selfie}</p>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                Complete driver verification to post rides and earn money
              </p>
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Skip for now
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <select
                value={formData.vehicleType}
                onChange={handleInputChange('vehicleType')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {vehicleTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} (Capacity: {type.capacity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Number Plate
              </label>
              <input
                type="text"
                value={formData.vehicleNumberPlate}
                onChange={handleInputChange('vehicleNumberPlate')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                placeholder="e.g., KA-01-AB-1234"
              />
              {errors.vehicleNumberPlate && (
                <p className="text-red-500 text-sm mt-1">{errors.vehicleNumberPlate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Seats
              </label>
              <input
                type="number"
                value={formData.availableSeats}
                onChange={handleInputChange('availableSeats')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="8"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Driving License
              </label>
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                  <DocumentTextIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Click to upload</p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload('drivingLicense')}
                    className="hidden"
                  />
                </div>
              </label>
              {uploadedFiles.drivingLicense && (
                <div className="mt-2 flex items-center text-green-600">
                  <CheckCircleSolid className="w-4 h-4 mr-2" />
                  <span className="text-sm">{uploadedFiles.drivingLicense}</span>
                </div>
              )}
              {errors.drivingLicense && (
                <p className="text-red-500 text-sm mt-1">{errors.drivingLicense}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Vehicle Registration
              </label>
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                  <DocumentTextIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Click to upload</p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload('vehicleRegistration')}
                    className="hidden"
                  />
                </div>
              </label>
              {uploadedFiles.vehicleRegistration && (
                <div className="mt-2 flex items-center text-green-600">
                  <CheckCircleSolid className="w-4 h-4 mr-2" />
                  <span className="text-sm">{uploadedFiles.vehicleRegistration}</span>
                </div>
              )}
              {errors.vehicleRegistration && (
                <p className="text-red-500 text-sm mt-1">{errors.vehicleRegistration}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Vehicle Photo
              </label>
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                  <TruckIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Click to upload</p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileUpload('vehiclePhoto')}
                    className="hidden"
                  />
                </div>
              </label>
              {uploadedFiles.vehiclePhoto && (
                <div className="mt-2 flex items-center text-green-600">
                  <CheckCircleSolid className="w-4 h-4 mr-2" />
                  <span className="text-sm">{uploadedFiles.vehiclePhoto}</span>
                </div>
              )}
              {errors.vehiclePhoto && (
                <p className="text-red-500 text-sm mt-1">{errors.vehiclePhoto}</p>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {currentStep > step.id ? (
                    <CheckCircleSolid className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-full h-1 mx-4
                    ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <span key={step.id} className="text-xs text-gray-600">
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Verification Benefits */}
        <Card className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <div className="flex items-start space-x-4">
            <ShieldCheckIcon className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Why Complete Verification?
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircleSolid className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">Enhanced Safety Features</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircleSolid className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">Priority Ride Access</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircleSolid className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">Increased Trust Score</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircleSolid className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">More Ride Requests</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircleSolid className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">Emergency SOS Access</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircleSolid className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">AI Route Optimization</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white/60 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>AI Safety Score:</strong> Complete all verification steps to achieve 100% safety score and unlock premium features.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border border-gray-100 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your SafeRide Account
            </h1>
            <p className="text-gray-600">
              {currentStep === 1 && 'Join thousands of safe riders today'}
              {currentStep === 2 && 'Complete identity verification for enhanced safety'}
              {currentStep === 3 && 'Become a verified driver and earn money'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <Button
                onClick={handlePrevious}
                variant="outline"
                size="full"
                disabled={loading}
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            
            {currentStep === 1 && (
              <Button
                onClick={handleNext}
                variant="primary"
                size="full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
            
            {currentStep === 2 && (
              <Button
                onClick={handleCompleteIdentityVerification}
                variant="primary"
                size="full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    Complete Verification
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
            
            {currentStep === 3 && (
              <Button
                onClick={handleCompleteDriverVerification}
                variant="primary"
                size="full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    Complete Driver Verification
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2 inline" />
            Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  )
}
