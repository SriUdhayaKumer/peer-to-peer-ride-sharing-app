import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  TruckIcon,
  BanknotesIcon,
  MapPinIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'
import { rideService } from '../services/rideService'

export default function DashboardPage() {
  const { user } = useAuth()
  const [role, setRole] = useState(user?.role === 'driver' ? 'provider' : 'seeker')
  const [postedRides, setPostedRides] = useState([])
  const [bookedRides, setBookedRides] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUserRides = async () => {
      try {
        setLoading(true)
        
        // Use the new API endpoint to get user's rides
        const result = await rideService.getMyRides()
        
        if (result.success) {
          setPostedRides(result.postedRides || [])
          setBookedRides(result.bookedRides || [])
        } else {
          console.error('Failed to fetch rides:', result.message)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchUserRides()
    }
  }, [user])

  const providerStats = { 
    totalPosted: postedRides.length, 
    completed: postedRides.filter(r => r.status === 'completed').length, 
    earnings: postedRides.reduce((sum, ride) => sum + (ride.totalFare || 0), 0) 
  }
  const seekerStats = { 
    ridesTaken: bookedRides.length, 
    totalSpent: bookedRides.reduce((sum, ride) => sum + (ride.totalFare || 0), 0) 
  }

  return (
    <div className="py-8">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your rides and earnings</p>
          </div>
          <div className="flex rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setRole('provider')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                role === 'provider' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Provider
            </button>
            <button
              onClick={() => setRole('seeker')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                role === 'seeker' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Seeker
            </button>
          </div>
        </div>

        {role === 'provider' && (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-3 gap-6">
              <Card hover>
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  <TruckIcon className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-sm text-gray-500">Total Rides Posted</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{providerStats.totalPosted}</p>
              </Card>
              <Card hover>
                <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center mb-4">
                  <ChartBarIcon className="w-6 h-6 text-accent-600" />
                </div>
                <p className="text-sm text-gray-500">Completed Rides</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{providerStats.completed}</p>
              </Card>
              <Card hover>
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                  <BanknotesIcon className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-primary-600 mt-1">₹{providerStats.earnings}</p>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Posted Rides</h2>
              <Card padding={false}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Route</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Date</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Seats</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                            Loading your rides...
                          </td>
                        </tr>
                      ) : postedRides.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                            You haven't posted any rides yet
                          </td>
                        </tr>
                      ) : (
                        postedRides.map((ride) => (
                          <tr key={ride._id} className="border-b border-gray-50 last:border-0">
                            <td className="px-6 py-4">
                              <p className="font-medium text-gray-900">{ride.pickupLocation?.address || 'Unknown'}</p>
                              <p className="text-sm text-gray-500">{ride.dropLocation?.address || 'Unknown'}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900">
                                {new Date(ride.scheduledTime).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(ride.scheduledTime).toLocaleTimeString()}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900">{ride.availableSeats} seats</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                ride.status === 'posted' ? 'bg-blue-100 text-blue-800' :
                                ride.status === 'booked' ? 'bg-yellow-100 text-yellow-800' :
                                ride.status === 'completed' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <p className="font-medium text-gray-900">₹{ride.totalFare || ride.baseFare}</p>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        )}

        {role === 'seeker' && (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <Card hover>
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  <TruckIcon className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-sm text-gray-500">Rides Taken</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{seekerStats.ridesTaken}</p>
              </Card>
              <Card hover>
                <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center mb-4">
                  <BanknotesIcon className="w-6 h-6 text-accent-600" />
                </div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-primary-600 mt-1">₹{seekerStats.totalSpent}</p>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Booked Rides</h2>
              <div className="space-y-4">
                {loading ? (
                  <Card>
                    <p className="text-center text-gray-500 py-8">Loading your rides...</p>
                  </Card>
                ) : bookedRides.length === 0 ? (
                  <Card>
                    <p className="text-center text-gray-500 py-8">You haven't booked any rides yet</p>
                  </Card>
                ) : (
                  bookedRides.map((ride) => (
                    <Card key={ride._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                          <MapPinIcon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {ride.pickupLocation?.address || 'Unknown'} → {ride.dropLocation?.address || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {ride.driver?.name || 'Unknown'} · {ride.vehicleType?.toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {new Date(ride.scheduledTime).toLocaleDateString()} at {new Date(ride.scheduledTime).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-primary-600">₹{ride.totalFare || ride.baseFare}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          ride.status === 'booked' ? 'bg-yellow-100 text-yellow-800' :
                          ride.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                        </span>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          <Button to="/post-ride" variant="primary" icon={TruckIcon}>
            Post a Ride
          </Button>
          <Button to="/search" variant="secondary" icon={MapPinIcon}>
            Find a Ride
          </Button>
        </div>
      </div>
    </div>
  )
}
