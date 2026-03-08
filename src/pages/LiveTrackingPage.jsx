import { useState } from 'react'
import {
  MapPinIcon,
  ExclamationTriangleIcon,
  ShareIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const rideStatuses = ['On the way', 'Reached pickup', 'Completed']

export default function LiveTrackingPage() {
  const [status, setStatus] = useState(0)

  return (
    <div className="py-8">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Live Tracking</h1>
          <p className="text-gray-600">Track your ride in real-time</p>
        </div>

        <Card className="mb-6 overflow-hidden" padding={false}>
          <div className="h-80 bg-gray-50 flex items-center justify-center">
            <div className="text-center p-6">
              <MapPinIcon className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium text-lg">Map Placeholder</p>
              <p className="text-sm text-gray-500 mt-1">Live GPS tracking</p>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h2 className="font-semibold text-gray-900 mb-4">Ride Status</h2>
            <div className="space-y-3">
              {rideStatuses.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i <= status ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {i < status ? <CheckCircleIcon className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className={i <= status ? 'font-medium text-gray-900' : 'text-gray-500'}>{s}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setStatus((status + 1) % 3)} className="mt-4 text-sm text-primary-600 hover:underline">
              Update status (demo)
            </button>
          </Card>

          <div className="space-y-6">
            <Card>
              <h2 className="font-semibold text-gray-900 mb-2">Estimated Time</h2>
              <p className="text-3xl font-bold text-primary-600">12 min</p>
              <p className="text-sm text-gray-500">ETA to destination</p>
            </Card>

            <div className="flex gap-3">
              <button className="flex-1 py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center justify-center gap-2 transition-colors">
                <ExclamationTriangleIcon className="w-6 h-6" />
                Emergency SOS
              </button>
              <button className="flex-1 py-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold flex items-center justify-center gap-2 transition-colors">
                <ShareIcon className="w-6 h-6" />
                Share Trip
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button to="/payment-success" variant="primary" size="md">
            Complete Ride & Pay
          </Button>
        </div>
      </div>
    </div>
  )
}
