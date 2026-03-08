import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  UserCircleIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ShieldCheckIcon,
  TruckIcon,
  DocumentTextIcon,
  PencilIcon,
  CameraIcon,
  IdentificationIcon,
  CheckCircleIcon as CheckCircleSolid,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'
import { getVehicleIcon } from '../utils/fareCalculator'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, updateProfile, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [verificationFiles, setVerificationFiles] = useState({
    profilePhoto: null,
    idProof: null,
    selfie: null,
    drivingLicense: null,
    vehicleRegistration: null,
    vehiclePhoto: null,
  })
  const [showVerificationForm, setShowVerificationForm] = useState(false)
  const [verificationType, setVerificationType] = useState('identity') // 'identity' or 'driver'
  const [vehicleInfo, setVehicleInfo] = useState({
    vehicleType: 'car',
    vehicleNumberPlate: '',
    availableSeats: 1,
  })

  const handleSaveProfile = async () => {
    try {
      updateProfile(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleFileUpload = (fileType) => (e) => {
    const file = e.target.files[0]
    if (file) {
      setVerificationFiles(prev => ({
        ...prev,
        [fileType]: file
      }))
    }
  }

  const handleProfilePhotoUpload = async (file) => {
    try {
      const formData = new FormData()
      formData.append('profilePhoto', file)
      
      const response = await fetch('http://localhost:5000/api/auth/update-profile-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('safaride_token')}`
        },
        body: formData
      })
      
      const result = await response.json()
      
      if (response.ok) {
        alert('Profile photo updated successfully!')
        // Refresh user data instead of page reload
        await refreshUser()
        // Clear the file input
        setVerificationFiles(prev => ({ ...prev, profilePhoto: null }))
      } else {
        alert(result.message || 'Failed to update profile photo')
      }
    } catch (error) {
      console.error('Profile photo upload failed:', error)
      alert('Failed to update profile photo')
    }
  }

  const handleVerificationSubmit = async () => {
    setUploading(true)
    try {
      if (verificationType === 'identity') {
        // Identity verification - at least one document required
        if (!verificationFiles.profilePhoto && !verificationFiles.idProof && !verificationFiles.selfie) {
          alert('Please upload at least one document for identity verification')
          setUploading(false)
          return
        }

        // Create FormData for identity verification
        const formData = new FormData()
        formData.append('idProofType', 'aadhar')
        
        if (verificationFiles.profilePhoto) {
          formData.append('profilePhoto', verificationFiles.profilePhoto)
        }
        if (verificationFiles.idProof) {
          formData.append('idProof', verificationFiles.idProof)
        }
        if (verificationFiles.selfie) {
          formData.append('selfie', verificationFiles.selfie)
        }
        
        // Call identity verification API
        const response = await fetch('http://localhost:5000/api/auth/verify-identity', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('safaride_token')}`
          },
          body: formData
        })
        
        const result = await response.json()
        
        if (response.ok) {
          alert('Identity verification completed successfully!')
          // Refresh user data instead of page reload
          await refreshUser()
          // Clear form
          setVerificationFiles({
            profilePhoto: null,
            idProof: null,
            selfie: null,
            drivingLicense: null,
            vehicleRegistration: null,
            vehiclePhoto: null,
          })
          setShowVerificationForm(false)
        } else {
          alert(result.message || 'Identity verification failed')
        }
      } else if (verificationType === 'driver') {
        // Driver verification - requires license, vehicle registration, vehicle photo, AND vehicle info
        if (!verificationFiles.drivingLicense || !verificationFiles.vehicleRegistration || !verificationFiles.vehiclePhoto) {
          alert('All driver documents (license, vehicle registration, vehicle photo) are required')
          setUploading(false)
          return
        }

        if (!vehicleInfo.vehicleNumberPlate) {
          alert('Vehicle number plate is required')
          setUploading(false)
          return
        }

        // Create FormData for driver verification
        const formData = new FormData()
        
        // Add vehicle info
        formData.append('vehicleType', vehicleInfo.vehicleType)
        formData.append('vehicleNumberPlate', vehicleInfo.vehicleNumberPlate)
        formData.append('availableSeats', vehicleInfo.availableSeats.toString())
        
        // Add driver documents
        if (verificationFiles.drivingLicense) {
          formData.append('drivingLicense', verificationFiles.drivingLicense)
        }
        if (verificationFiles.vehicleRegistration) {
          formData.append('vehicleRegistration', verificationFiles.vehicleRegistration)
        }
        if (verificationFiles.vehiclePhoto) {
          formData.append('vehiclePhoto', verificationFiles.vehiclePhoto)
        }
        
        // Call driver verification API
        const response = await fetch('http://localhost:5000/api/auth/verify-driver', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('safaride_token')}`
          },
          body: formData
        })
        
        const result = await response.json()
        
        if (response.ok) {
          alert('Driver verification completed successfully! You can now post rides.')
          // Refresh user data instead of page reload
          await refreshUser()
          // Clear form
          setVerificationFiles({
            profilePhoto: null,
            idProof: null,
            selfie: null,
            drivingLicense: null,
            vehicleRegistration: null,
            vehiclePhoto: null,
          })
          setVehicleInfo({
            vehicleType: 'car',
            vehicleNumberPlate: '',
            availableSeats: 1,
          })
          setShowVerificationForm(false)
        } else {
          alert(result.message || 'Driver verification failed')
        }
      }
    } catch (error) {
      console.error('Verification failed:', error)
      alert('Verification failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const getVerificationBadge = (isVerified, label) => {
    // For profile photo, check if it's a non-empty string (URL)
    const hasValue = label === 'Profile Photo' 
      ? (typeof isVerified === 'string' && isVerified && isVerified.length > 0)
      : !!isVerified;
    
    if (hasValue) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Verified
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Not Verified
        </span>
      )
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and verification status</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">
              <div className="relative">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {user?.profilePhoto ? (
                    <img 
                      src={user.profilePhoto} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Profile photo load error:', user.profilePhoto);
                        e.target.onerror = null;
                      }}
                    />
                  ) : (
                    <UserCircleIcon className="w-16 h-16 text-white" />
                  )}
                </div>
                <label className="absolute bottom-4 right-1/2 transform translate-x-8 bg-white rounded-full p-2 shadow-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <CameraIcon className="w-4 h-4 text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        handleProfilePhotoUpload(file)
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{user?.name || 'User'}</h2>
              <p className="text-gray-600 mb-4 capitalize">{user?.role || 'passenger'}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheckIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Verification Status</span>
                </div>
                <div className="flex flex-col gap-2">
                  {getVerificationBadge(user?.identityVerified, 'ID Proof')}
                  {getVerificationBadge(user?.profilePhoto, 'Profile Photo')}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  size="sm"
                  icon={PencilIcon}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <UserCircleIcon className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Full Name</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{user?.name || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Email Address</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{user?.email || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Phone Number</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{user?.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={handleSaveProfile}
                    variant="primary"
                    size="sm"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </Card>

            {/* Vehicles */}
            {user?.vehicles && user.vehicles.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">My Vehicles</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {user.vehicles.map((vehicle, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                      <div className="text-2xl">
                        {getVehicleIcon(vehicle)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{vehicle}</p>
                        <p className="text-sm text-gray-600">Available for rides</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Complete Verification Status */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Verification Status</h3>
                <Button
                  onClick={() => setShowVerificationForm(!showVerificationForm)}
                  variant="outline"
                  size="sm"
                  icon={IdentificationIcon}
                >
                  {showVerificationForm ? 'Hide Form' : 'Verify Now'}
                </Button>
              </div>
              
              {/* Verification Upload Form */}
              {showVerificationForm && (
                <Card className="mb-6 p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Complete Your Verification</h4>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setVerificationType('identity')}
                        variant={verificationType === 'identity' ? 'primary' : 'outline'}
                        size="sm"
                      >
                        Identity
                      </Button>
                      <Button
                        onClick={() => setVerificationType('driver')}
                        variant={verificationType === 'driver' ? 'primary' : 'outline'}
                        size="sm"
                      >
                        Driver
                      </Button>
                    </div>
                  </div>
                  
                  {verificationType === 'identity' ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 mb-4">
                        Complete identity verification to unlock all safety features and increase trust.
                      </p>
                      
                      {/* Profile Photo Upload */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <div className="text-center">
                          <CameraIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <label className="cursor-pointer">
                            <span className="text-sm text-gray-600">Upload Profile Photo *</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload('profilePhoto')}
                              className="hidden"
                            />
                          </label>
                          {verificationFiles.profilePhoto && (
                            <p className="text-xs text-green-600 mt-1">✓ {verificationFiles.profilePhoto.name}</p>
                          )}
                        </div>
                      </div>

                      {/* ID Proof Upload */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <div className="text-center">
                          <DocumentTextIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <label className="cursor-pointer">
                            <span className="text-sm text-gray-600">Upload Government ID *</span>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleFileUpload('idProof')}
                              className="hidden"
                            />
                          </label>
                          {verificationFiles.idProof && (
                            <p className="text-xs text-green-600 mt-1">✓ {verificationFiles.idProof.name}</p>
                          )}
                        </div>
                      </div>

                      {/* Selfie Upload */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <div className="text-center">
                          <CameraIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <label className="cursor-pointer">
                            <span className="text-sm text-gray-600">Upload Selfie Photo *</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload('selfie')}
                              className="hidden"
                            />
                          </label>
                          {verificationFiles.selfie && (
                            <p className="text-xs text-green-600 mt-1">✓ {verificationFiles.selfie.name}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 mb-4">
                        Become a verified driver to post rides and start earning money!
                      </p>
                      
                      {/* Vehicle Information */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                          <select
                            value={vehicleInfo.vehicleType}
                            onChange={(e) => setVehicleInfo(prev => ({ ...prev, vehicleType: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="bike">Bike</option>
                            <option value="auto">Auto</option>
                            <option value="car">Car</option>
                            <option value="suv">SUV</option>
                            <option value="van">Van</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Number Plate</label>
                          <input
                            type="text"
                            value={vehicleInfo.vehicleNumberPlate}
                            onChange={(e) => setVehicleInfo(prev => ({ ...prev, vehicleNumberPlate: e.target.value }))}
                            placeholder="e.g., MH-12-AB-1234"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats</label>
                          <select
                            value={vehicleInfo.availableSeats}
                            onChange={(e) => setVehicleInfo(prev => ({ ...prev, availableSeats: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value={1}>1 Seat</option>
                            <option value={2}>2 Seats</option>
                            <option value={3}>3 Seats</option>
                            <option value={4}>4 Seats</option>
                            <option value={5}>5 Seats</option>
                            <option value={6}>6 Seats</option>
                            <option value={7}>7 Seats</option>
                            <option value={8}>8 Seats</option>
                          </select>
                        </div>
                      </div>

                      {/* Driving License Upload */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <div className="text-center">
                          <DocumentTextIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <label className="cursor-pointer">
                            <span className="text-sm text-gray-600">Upload Driving License</span>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleFileUpload('drivingLicense')}
                              className="hidden"
                            />
                          </label>
                          {verificationFiles.drivingLicense && (
                            <p className="text-xs text-green-600 mt-1">✓ {verificationFiles.drivingLicense.name}</p>
                          )}
                        </div>
                      </div>

                      {/* Vehicle Registration Upload */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <div className="text-center">
                          <DocumentTextIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <label className="cursor-pointer">
                            <span className="text-sm text-gray-600">Upload Vehicle Registration</span>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleFileUpload('vehicleRegistration')}
                              className="hidden"
                            />
                          </label>
                          {verificationFiles.vehicleRegistration && (
                            <p className="text-xs text-green-600 mt-1">✓ {verificationFiles.vehicleRegistration.name}</p>
                          )}
                        </div>
                      </div>

                      {/* Vehicle Photo Upload */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <div className="text-center">
                          <TruckIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <label className="cursor-pointer">
                            <span className="text-sm text-gray-600">Upload Vehicle Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload('vehiclePhoto')}
                              className="hidden"
                            />
                          </label>
                          {verificationFiles.vehiclePhoto && (
                            <p className="text-xs text-green-600 mt-1">✓ {verificationFiles.vehiclePhoto.name}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleVerificationSubmit}
                    variant="primary"
                    size="sm"
                    disabled={uploading || (
                      verificationType === 'identity' 
                        ? (!verificationFiles.profilePhoto && !verificationFiles.idProof && !verificationFiles.selfie)
                        : (!verificationFiles.drivingLicense || !verificationFiles.vehicleRegistration || !verificationFiles.vehiclePhoto || !vehicleInfo.vehicleNumberPlate)
                    )}
                    className="w-full"
                  >
                    {uploading ? 'Uploading...' : `Submit ${verificationType === 'identity' ? 'Identity' : 'Driver'} Verification`}
                  </Button>
                </Card>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Government ID</p>
                      <p className="text-sm text-gray-600">Identity verification</p>
                    </div>
                  </div>
                  {getVerificationBadge(user?.identityVerified, 'Government ID')}
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CameraIcon className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Profile Photo</p>
                      <p className="text-sm text-gray-600">Photo verification</p>
                    </div>
                  </div>
                  {getVerificationBadge(user?.profilePhoto, 'Profile Photo')}
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TruckIcon className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Driver Verification</p>
                      <p className="text-sm text-gray-600">Post rides and earn</p>
                    </div>
                  </div>
                  {getVerificationBadge(user?.driverVerified, 'Driver Verification')}
                </div>
              </div>

              {(!user?.identityVerified || !user?.profilePhoto) && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium mb-1">
                        Complete identity verification to unlock all features
                      </p>
                      <p className="text-xs text-yellow-700">
                        Increase trust with other users and get priority access to rides
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setShowVerificationForm(true)
                      setVerificationType('identity')
                    }}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Complete Identity Verification
                  </Button>
                </div>
              )}

              {!user?.driverVerified && user?.identityVerified && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <TruckIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium mb-1">
                        Become a verified driver to post rides
                      </p>
                      <p className="text-xs text-blue-700">
                        Upload your license and vehicle documents to start earning money
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setShowVerificationForm(true)
                      setVerificationType('driver')
                    }}
                    variant="primary"
                    size="sm"
                    className="mt-2"
                  >
                    Become a Driver
                  </Button>
                </div>
              )}

              {user?.identityVerified && user?.profilePhoto && user?.driverVerified && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircleSolid className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-800 font-medium">
                      Fully Verified! All features unlocked. You can post rides and earn money.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
