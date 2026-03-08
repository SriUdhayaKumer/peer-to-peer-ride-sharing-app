import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'
import { rideService } from '../services/rideService'

export default function MyRidesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [postedRides, setPostedRides] = useState([])
  const [bookedRides, setBookedRides] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('booked')

  useEffect(() => {
    const fetchUserRides = async () => {
      try {
        setLoading(true)
        
        const result = await rideService.getMyRides()
        
        if (result.success) {
          setPostedRides(result.postedRides || [])
          setBookedRides(result.bookedRides || [])
        } else {
          console.error('Failed to fetch rides:', result.message)
        }
      } catch (error) {
        console.error('Error fetching rides:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchUserRides()
    }
  }, [user])

  const getStatusColor = (status) => {
    switch (status) {
      case 'posted': return 'bg-blue-100 text-blue-800'
      case 'booked': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDateTime = (scheduledTime) => {
    const date = new Date(scheduledTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <p className="text-gray-600">Loading your rides...</p>
      </div>
    )
  }

  const ridesToShow = activeTab === 'posted' ? postedRides : bookedRides

  return (
    <div className="py-8">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Rides</h1>
          <p className="text-gray-600">Manage your ride history and bookings</p>
        </div>

        <div className="flex rounded-xl bg-gray-100 p-1 mb-8">
          <button
            onClick={() => setActiveTab('booked')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'booked' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Booked Rides ({bookedRides.length})
          </button>
          <button
            onClick={() => setActiveTab('posted')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'posted' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Posted Rides ({postedRides.length})
          </button>
        </div>

        <div className="space-y-4">
          {ridesToShow.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-600">
                {activeTab === 'posted' ? "You haven't posted any rides yet." : "You haven't booked any rides yet."}
              </p>
              <div className="mt-4 space-x-4">
                {activeTab === 'posted' && (
                  <Button onClick={() => navigate('/post-ride')} variant="primary">
                    Post a Ride
                  </Button>
                )}
                {activeTab === 'booked' && (
                  <Button onClick={() => navigate('/search')} variant="primary">
                    Find a Ride
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            ridesToShow.map((ride) => {
              const { date, time } = formatDateTime(ride.scheduledTime)
              const isDriver = activeTab === 'posted'
              
              return (
                <Card key={ride._id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                          🚗
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {isDriver ? 'Your Posted Ride' : 'Your Booked Ride'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {ride.vehicleType?.toUpperCase()} • {ride.availableSeats} seats
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">From:</span> {ride.pickupLocation?.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">To:</span> {ride.dropLocation?.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">When:</span> {date} at {time}
                        </p>
                        {!isDriver && ride.driver && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Driver:</span> {ride.driver.name} • ⭐ {ride.driver.rating}
                          </p>
                        )}
                        {isDriver && ride.passenger && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Passenger:</span> {ride.passenger.name}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-primary-600 text-xl mb-3">
                        ₹{ride.totalFare || ride.baseFare}
                      </p>
                      <div className="space-y-2">
                        <Button
                          onClick={() => navigate(`/ride-view/${ride._id}`)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          View Details
                        </Button>
                        {ride.status === 'booked' && !isDriver && (
                          <Button
                            onClick={() => navigate(`/payment/${ride._id}`)}
                            variant="primary"
                            size="sm"
                            className="w-full"
                          >
                            Complete Payment
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
