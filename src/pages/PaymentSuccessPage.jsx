import { Link } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function PaymentSuccessPage() {
  return (
    <div className="py-16 flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md mx-auto px-4">
        <Card className="p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-14 h-14 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Thank you for using P2P Smart Ride. Your payment has been processed.</p>

          <div className="bg-gray-50 rounded-xl p-6 text-left mb-8">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono text-sm">TXN7829345671</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid</span>
              <span className="font-bold text-primary-600">₹460</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button to="/rating" variant="ghost" size="full" className="text-primary-600 hover:text-primary-700">
              Rate Your Ride
            </Button>
            <Button to="/dashboard" variant="primary" size="full">
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
