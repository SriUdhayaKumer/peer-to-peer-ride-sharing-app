import { useParams, Link } from 'react-router-dom'
import {
  UserCircleIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
} from '@heroicons/react/24/solid'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { sampleRideListings } from '../data/dummyData'

export default function RideDetailsPage() {
  const { id } = useParams()
  const ride = sampleRideListings.find((r) => r.id === parseInt(id))

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
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Driver Profile</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
                  <UserCircleIcon className="w-10 h-10 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{ride.driverName}</h3>
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-5 h-5 text-amber-400" />
                    <span className="text-gray-600">{ride.driverRating} rating</span>
                  </div>
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
                    <p className="font-medium text-gray-900">{ride.source}</p>
                  </div>
                </div>
                <div className="h-6 w-0.5 bg-gray-200 ml-1.5" />
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Drop</p>
                    <p className="font-medium text-gray-900">{ride.destination}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-6">
                <span className="flex items-center gap-2 text-gray-600">
                  <CalendarIcon className="w-5 h-5" />
                  {ride.date}
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  <ClockIcon className="w-5 h-5" />
                  {ride.time}
                </span>
              </div>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Details</h2>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center text-2xl">
                  {ride.vehicleType === 'Bike' && '🏍️'}
                  {ride.vehicleType === 'Car' && '🚗'}
                  {ride.vehicleType === 'Auto' && '🛺'}
                  {ride.vehicleType === 'Van' && '🚐'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{ride.vehicleType} - {ride.vehicleModel}</p>
                  <p className="text-sm text-gray-500">{ride.seatsAvailable} seats available</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Price Breakdown</h3>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Fare per seat</span>
                  <span>₹{ride.pricePerSeat}</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Platform fee</span>
                  <span>₹10</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>₹{ride.pricePerSeat + 10}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button to="/live-tracking" variant="primary" size="full">
                  Accept & Continue
                </Button>
                <Button to="/search" variant="outline" size="full">
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
