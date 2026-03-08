import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  UserCircleIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/solid'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { rideService } from '../services/rideService'

export default function RideViewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        console.log('🔍 Fetching ride view details for ID:', id)
        setLoading(true)
        const result = await rideService.getRideDetails(id)
        console.log('📊 Ride view details result:', result)
        
        if (result.success) {
          setRide(result.ride)
          console.log('✅ Ride view details loaded:', result.ride._id)
        } else {
          console.error('❌ Failed to load ride view details:', result.message)
          alert(`Failed to load ride details: ${result.message}`)
        }
      } catch (error) {
        console.error('❌ Error fetching ride view details:', error)
        alert(`Error loading ride details: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRideDetails()
    }
  }, [id])

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <p className="text-gray-600">Loading ride details...</p>
      </div>
    )
  }

  if (!ride) {
    return (
      <div className="py-20 flex items-center justify-center">
        <p className="text-gray-600">Ride not found</p>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Search
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Driver Information</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center overflow-hidden">
                  {ride.driver?.profilePhoto ? (
                    <img 
                      src={ride.driver.profilePhoto} 
                      alt="Driver" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-10 h-10 text-primary-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{ride.driver?.name}</h3>
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-5 h-5 text-amber-400" />
                    <span className="text-sm text-gray-600">{ride.driver?.rating || '4.5'} rating</span>
                  </div>
                  <p className="text-sm text-gray-500">{ride.driver?.vehicleNumberPlate}</p>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Route Details</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Pickup</p>
                    <p className="font-medium text-gray-900">{ride.pickupLocation?.address}</p>
                  </div>
                </div>
                <div className="h-6 w-0.5 bg-gray-200 ml-1.5" />
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Drop</p>
                    <p className="font-medium text-gray-900">{ride.dropLocation?.address}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-6">
                <span className="flex items-center gap-2 text-gray-600">
                  📅 {new Date(ride.scheduledTime).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  🕐 {new Date(ride.scheduledTime).toLocaleTimeString()}
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  🚗 {ride.vehicleType?.toUpperCase()}
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  👥 {ride.availableSeats} seats available
                </span>
              </div>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Trip Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Fare per seat</span>
                  <span>₹{ride.baseFare || ride.totalFare}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform fee</span>
                  <span>₹{ride.platformFee || '10'}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total Amount</span>
                  <span>₹{ride.totalFare || (ride.baseFare + 10)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate(`/request-ride/${ride._id}`)}
                  variant="primary"
                  size="full"
                >
                  Request This Ride
                </Button>
                <Button
                  onClick={() => navigate('/search')}
                  variant="outline"
                  size="full"
                >
                  Back to Search
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
