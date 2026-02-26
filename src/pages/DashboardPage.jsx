import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TruckIcon,
  BanknotesIcon,
  MapPinIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { sampleRideHistory } from '../data/dummyData'

export default function DashboardPage() {
  const [role, setRole] = useState('provider')
  const providerHistory = sampleRideHistory.filter((r) => r.role === 'provider')
  const seekerHistory = sampleRideHistory.filter((r) => r.role === 'seeker')

  const providerStats = { totalPosted: 12, completed: 8, earnings: 2450 }
  const seekerStats = { ridesTaken: 6, totalSpent: 1250 }

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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ride History</h2>
              <Card padding={false}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Route</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Date</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Seats</th>
                        <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {providerHistory.map((ride) => (
                        <tr key={ride.id} className="border-b border-gray-50 last:border-0">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{ride.source}</p>
                            <p className="text-sm text-gray-500">{ride.destination}</p>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{ride.date} {ride.time}</td>
                          <td className="px-6 py-4 text-gray-600">{ride.seatsBooked} seats</td>
                          <td className="px-6 py-4 text-right font-semibold text-primary-600">₹{ride.amount}</td>
                        </tr>
                      ))}
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ride History</h2>
              <div className="space-y-4">
                {seekerHistory.map((ride) => (
                  <Card key={ride.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                        <MapPinIcon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{ride.source} → {ride.destination}</p>
                        <p className="text-sm text-gray-500">{ride.driverName} · {ride.vehicleType}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{ride.date} at {ride.time}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-primary-600">₹{ride.amount}</p>
                      <Link to="/rating" className="text-sm text-primary-600 hover:underline">Rate ride</Link>
                    </div>
                  </Card>
                ))}
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
