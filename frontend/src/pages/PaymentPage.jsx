import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'
import { paymentService } from '../services/paymentService'
import { rideService } from '../services/rideService'

export default function PaymentPage() {
  const navigate = useNavigate()
  const { rideId } = useParams()
  const { user } = useAuth()
  
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [razorpayKey, setRazorpayKey] = useState('')

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        setLoading(true)
        const result = await rideService.getRideDetails(rideId)
        if (result.success) {
          setRide(result.ride)
        } else {
          alert('Failed to load ride details')
          navigate('/search')
        }
      } catch (error) {
        console.error('Error fetching ride details:', error)
        alert('Error loading ride details')
        navigate('/search')
      } finally {
        setLoading(false)
      }
    }

    const loadRazorpay = () => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => {
        setRazorpayLoaded(true)
        setRazorpayKey('rzp_test_1234567890abcdef') // Test key
      }
      document.body.appendChild(script)
    }

    if (rideId) {
      fetchRideDetails()
      loadRazorpay()
    }
  }, [rideId, navigate])

  const handlePayment = async () => {
    if (!ride || !user) {
      alert('Please login to continue with payment')
      return
    }

    setPaymentProcessing(true)
    try {
      // Create payment order
      const orderResult = await paymentService.createPaymentOrder({
        rideId: ride._id,
        amount: ride.totalFare || ride.baseFare
      })

      if (orderResult.success) {
        const options = {
          key: razorpayKey,
          amount: orderResult.order.amount,
          currency: 'INR',
          name: 'SafeRide',
          description: `Payment for ride from ${ride.pickupLocation?.address} to ${ride.dropLocation?.address}`,
          order_id: orderResult.order.id,
          handler: async (response) => {
            // Verify payment
            const verifyResult = await paymentService.verifyPayment({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            })

            if (verifyResult.success) {
              alert('Payment successful! Ride booked.')
              navigate('/my-rides')
            } else {
              alert('Payment verification failed')
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone
          },
          theme: {
            color: '#3B82F6'
          }
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()
      } else {
        alert('Failed to create payment order')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setPaymentProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <p className="text-gray-600">Loading payment details...</p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ride Details</h2>
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
              </div>
            </Card>

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
                    <div className="w-10 h-10 text-primary-600">👤</div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{ride.driver?.name}</h3>
                  <p className="text-sm text-gray-500">⭐ {ride.driver?.rating || '4.5'} rating</p>
                  <p className="text-sm text-gray-500">{ride.driver?.vehicleNumberPlate}</p>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>
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

              <Button
                onClick={handlePayment}
                variant="primary"
                size="full"
                disabled={paymentProcessing || !razorpayLoaded}
              >
                {paymentProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : !razorpayLoaded ? (
                  'Loading Payment...'
                ) : (
                  `Pay ₹${ride.totalFare || (ride.baseFare + 10)}`
                )}
              </Button>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Secured by Razorpay</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
