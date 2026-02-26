import { Link } from 'react-router-dom'
import { StarIcon } from '@heroicons/react/24/solid'
import Card from './ui/Card'

export default function RideCard({ ride }) {
  const getVehicleIcon = (type) => {
    const icons = { Car: '🚗', Bike: '🏍️', Auto: '🛺', Van: '🚐' }
    return icons[type] || '🚗'
  }

  return (
    <Card variant="elevated" hover>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900">{ride.driverName}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <StarIcon className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-gray-600">{ride.driverRating}</span>
          </div>
        </div>
        <div className="text-right text-sm text-gray-500">
          {ride.date}
          <br />
          {ride.time}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-block px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm truncate max-w-full">
          From: {ride.source}
        </span>
        <span className="inline-block px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm truncate max-w-full">
          To: {ride.destination}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <span>{getVehicleIcon(ride.vehicleType)} {ride.vehicleType}</span>
        <span>{ride.seatsAvailable} seats</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
        <p className="font-bold text-primary-600 text-xl">₹{ride.pricePerSeat}</p>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/ride-details/${ride.id}`}
            className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:border-primary-300 hover:text-primary-600 transition-colors text-sm"
          >
            View details
          </Link>
          <Link
            to={`/ride-details/${ride.id}`}
            className="px-4 py-2 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors text-sm"
          >
            Request ride
          </Link>
        </div>
      </div>
    </Card>
  )
}
