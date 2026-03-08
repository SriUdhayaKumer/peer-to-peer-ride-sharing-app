import { Link, useNavigate } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function PaymentSuccessPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="py-16 flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md mx-auto px-4">
        <Card className="p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-14 h-14 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Thank you for using SafeRide. Your ride has been booked successfully!</p>

          <div className="bg-gray-50 rounded-xl p-6 text-left mb-8">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Booking Status</span>
              <span className="font-medium text-green-600">Confirmed</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-mono text-sm">Razorpay</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Passenger</span>
              <span className="font-bold text-primary-600">{user?.name || 'Guest User'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              to="/my-rides" 
              variant="primary" 
              size="full"
              className="w-full"
            >
              View My Rides
            </Button>
            <Button 
              to="/dashboard" 
              variant="ghost" 
              size="full"
              className="text-primary-600 hover:text-primary-700 w-full"
            >
              Go to Dashboard
            </Button>
            <Button 
              to="/search" 
              variant="outline" 
              size="full"
              className="w-full"
            >
              Find Another Ride
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
