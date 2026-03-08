import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPinIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { rideService } from '../services/rideService'
import { useAuth } from '../context/AuthContext'

const vehicleTypes = [
  { value: 'bike', label: 'Bike', capacity: 2, icon: '🏍️' },
  { value: 'auto', label: 'Auto', capacity: 3, icon: '🛺' },
  { value: 'car', label: 'Car', capacity: 4, icon: '🚗' },
  { value: 'suv', label: 'SUV', capacity: 6, icon: '🚙' },
  { value: 'van', label: 'Van', capacity: 8, icon: '🚐' }
]

export default function PostRidePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    date: '',
    time: '',
    vehicleType: 'car',
    availableSeats: 1,
    farePerSeat: '',
    description: '',
  })

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if user is driver verified
    if (!user?.driverVerified) {
      setError('You must be a verified driver to post rides. Please complete driver verification first.')
      return
    }
    
    if (!formData.source || !formData.destination || !formData.date || !formData.time || !formData.farePerSeat) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const rideData = {
        source: formData.source,
        destination: formData.destination,
        departureDate: formData.date,
        departureTime: formData.time,
        vehicleType: formData.vehicleType,
        availableSeats: parseInt(formData.availableSeats),
        farePerSeat: parseFloat(formData.farePerSeat),
        description: formData.description,
      }

      const result = await rideService.postRide(rideData)
      
      if (result.success) {
        setSuccess('Ride posted successfully!')
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      } else {
        setError(result.message || 'Failed to post ride')
      }
    } catch (error) {
      setError(error.message || 'Failed to post ride')
    } finally {
      setLoading(false)
    }
  }

  const selectedVehicle = vehicleTypes.find(v => v.value === formData.vehicleType)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Ride</h1>
          <p className="text-gray-600">Share your ride and earn while you travel</p>
        </div>

        {/* Driver Verification Warning */}
        {!user?.driverVerified && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Driver Verification Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You must complete driver verification to post rides. Please go to your profile and complete the driver verification process.
                </p>
                <button
                  onClick={() => navigate('/profile')}
                  className="mt-2 text-sm text-yellow-800 underline hover:text-yellow-900"
                >
                  Go to Profile → Complete Driver Verification
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className={`p-6 ${!user?.driverVerified ? 'opacity-50 pointer-events-none' : ''}`}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source *
                    </label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.source}
                        onChange={handleInputChange('source')}
                        placeholder="Where are you starting from?"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination *
                    </label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.destination}
                        onChange={handleInputChange('destination')}
                        placeholder="Where are you going?"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange('date')}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <div className="relative">
                      <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        value={formData.time}
                        onChange={handleInputChange('time')}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type
                    </label>
                    <select
                      value={formData.vehicleType}
                      onChange={handleInputChange('vehicleType')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {vehicleTypes.map(vehicle => (
                        <option key={vehicle.value} value={vehicle.value}>
                          {vehicle.icon} {vehicle.label} (Capacity: {vehicle.capacity})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Seats
                    </label>
                    <input
                      type="number"
                      value={formData.availableSeats}
                      onChange={handleInputChange('availableSeats')}
                      min="1"
                      max={selectedVehicle?.capacity || 4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fare per Seat (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.farePerSeat}
                      onChange={handleInputChange('farePerSeat')}
                      min="1"
                      placeholder="50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    placeholder="Add any additional details about your ride..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Posting Ride...
                      </>
                    ) : (
                      'Post Ride'
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ride Preview</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Route</p>
                  <p className="font-medium">
                    {formData.source || 'Source'} → {formData.destination || 'Destination'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Vehicle</p>
                  <p className="font-medium">
                    {selectedVehicle?.icon} {selectedVehicle?.label}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium">
                    {formData.date || 'Date'} at {formData.time || 'Time'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Earnings per Seat</p>
                  <p className="font-medium text-green-600">₹{formData.farePerSeat || '0'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="font-bold text-green-600 text-lg">
                    ₹{formData.farePerSeat && formData.availableSeats ? 
                      (parseFloat(formData.farePerSeat) * parseInt(formData.availableSeats)).toFixed(2) : '0'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 mt-6 bg-yellow-50 border-yellow-200">
              <h4 className="font-semibold text-gray-900 mb-2">Posting Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Be accurate with pickup locations</li>
                <li>• Set reasonable fares for your route</li>
                <li>• Be on time for departures</li>
                <li>• Keep your vehicle clean</li>
                <li>• Drive safely and responsibly</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
