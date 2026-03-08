import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  MapPinIcon,
  ExclamationTriangleIcon,
  ShareIcon,
  CheckCircleIcon,
  PhoneIcon,
  UserCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import SOSButton from '../components/SOSButton'
import GoogleMap from '../components/GoogleMap'
import { rideService } from '../services/rideService'
import { useRide } from '../context/RideContext'

const rideStatuses = [
  { id: 'searching', label: 'Finding Driver', icon: '🔍' },
  { id: 'confirmed', label: 'Driver Confirmed', icon: '✅' },
  { id: 'on_the_way', label: 'On the Way', icon: '🚗' },
  { id: 'reached_pickup', label: 'Reached Pickup', icon: '📍' },
  { id: 'in_progress', label: 'Ride in Progress', icon: '🛣️' },
  { id: 'completed', label: 'Completed', icon: '🎉' }
]

export default function LiveTrackingPage() {
  const { rideId } = useParams()
  const navigate = useNavigate()
  const { currentRide } = useRide()
  
  const [rideData, setRideData] = useState(currentRide || null)
  const [loading, setLoading] = useState(true)
  const [driverLocation, setDriverLocation] = useState(null)
  const [eta, setEta] = useState(0)
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0)

  // Mock ride data for demonstration
  const mockRideData = {
    id: rideId || 'demo-ride-123',
    driverName: 'Raj Kumar',
    driverRating: 4.8,
    driverPhone: '+91 98765 43210',
    driverPhoto: null,
    vehicleType: 'car',
    vehicleNumber: 'KA-01-AB-1234',
    vehicleModel: 'Honda City',
    pickupLocation: 'MG Road, Bangalore',
    dropLocation: 'Koramangala, Bangalore',
    distance: 12.5,
    estimatedTime: 25,
    fare: 150,
    status: 'confirmed',
    paymentStatus: 'pending',
    qrCode: 'QR-123456',
  }

  useEffect(() => {
    // Load ride data
    const loadRideData = async () => {
      try {
        if (rideId && rideId !== 'demo-ride-123') {
          const result = await rideService.getRideDetails(rideId)
          if (result.success) {
            setRideData(result.ride)
          }
        } else {
          setRideData(mockRideData)
        }
      } catch (error) {
        console.error('Error loading ride data:', error)
        setRideData(mockRideData)
      } finally {
        setLoading(false)
      }
    }

    loadRideData()
  }, [rideId])

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (rideData?.status === 'in_progress') {
        // Update driver location (mock)
        setDriverLocation({
          lat: 12.9716 + Math.random() * 0.01,
          lng: 77.5946 + Math.random() * 0.01,
        })
        
        // Update ETA
        setEta(prev => Math.max(0, prev - 1))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [rideData?.status])

  const handleShareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SafeRide - Live Tracking',
        text: `Track my ride from ${rideData?.pickupLocation} to ${rideData?.dropLocation}`,
        url: window.location.href
      })
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href)
      alert('Tracking link copied to clipboard!')
    }
  }

  const handleCallDriver = () => {
    window.open(`tel:${rideData?.driverPhone}`)
  }

  const handleEmergency = () => {
    // SOS functionality handled by SOSButton component
  }

  const getStatusIndex = (status) => {
    return rideStatuses.findIndex(s => s.id === status) || 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!rideData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Ride not found</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const currentStatus = getStatusIndex(rideData.status)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Live Tracking</h1>
              <p className="text-sm text-gray-600">Ride ID: {rideData.id}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShareLocation}>
                <ShareIcon className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="relative">
        <Card className="m-4 overflow-hidden" padding={false}>
          <GoogleMap
            pickupLocation={{ lat: 12.9716, lng: 77.5946 }}
            dropLocation={{ lat: 12.9352, lng: 77.6245 }}
            driverLocation={driverLocation}
            height="400px"
            showRoute={true}
            showDriver={rideData.status === 'in_progress'}
          />
        </Card>

        {/* SOS Button */}
        <SOSButton />
      </div>

      {/* Driver Info */}
      {rideData.status !== 'searching' && (
        <Card className="mx-4 mb-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{rideData.driverName}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-yellow-500">★ {rideData.driverRating}</span>
                  <span>•</span>
                  <span>{rideData.vehicleModel}</span>
                  <span>•</span>
                  <span>{rideData.vehicleNumber}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleCallDriver}>
              <PhoneIcon className="w-4 h-4 mr-2" />
              Call
            </Button>
          </div>
        </Card>
      )}

      {/* Ride Details */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Ride Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">From</span>
                <span className="font-medium">{rideData.pickupLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To</span>
                <span className="font-medium">{rideData.dropLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Distance</span>
                <span className="font-medium">{rideData.distance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fare</span>
                <span className="font-medium text-green-600">₹{rideData.fare}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Trip Status</h3>
            <div className="space-y-3">
              {rideStatuses.map((status, index) => (
                <div key={status.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStatus ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index < currentStatus ? <CheckCircleIcon className="w-5 h-5" /> : status.icon}
                  </div>
                  <div className="flex-1">
                    <span className={`font-medium ${index <= currentStatus ? 'text-gray-900' : 'text-gray-500'}`}>
                      {status.label}
                    </span>
                    {index === currentStatus && (
                      <div className="flex items-center gap-2 mt-1">
                        <ClockIcon className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          {eta > 0 ? `ETA: ${eta} mins` : 'In progress...'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <Button variant="outline" className="flex-1" onClick={handleEmergency}>
            <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
            Emergency
          </Button>
          <Button variant="primary" className="flex-1" onClick={() => navigate('/payment')}>
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  )
}

            
