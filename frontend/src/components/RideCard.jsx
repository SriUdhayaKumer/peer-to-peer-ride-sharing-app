import { Link, useNavigate } from 'react-router-dom'
import { StarIcon } from '@heroicons/react/24/solid'
import Card from './ui/Card'

export default function RideCard({ ride, onClick }) {
  const navigate = useNavigate()
  
  const getVehicleIcon = (type) => {
    const icons = { car: '🚗', bike: '🏍️', auto: '🛺', suv: '🚙', van: '🚐' }
    return icons[type] || '🚗'
  }

  // Format date and time
  const formatDateTime = (scheduledTime) => {
    const date = new Date(scheduledTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date, time } = formatDateTime(ride.scheduledTime);

  const handleViewDetails = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/ride-view/${ride._id}`)
  }

  const handleRequestRide = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/request-ride/${ride._id}`)
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(ride)
    } else {
      navigate(`/ride-view/${ride._id}`)
    }
  }

  return (
    <Card variant="elevated" hover className="cursor-pointer" onClick={handleCardClick}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900">{ride.driver?.name || 'Unknown Driver'}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <StarIcon className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-gray-600">{ride.driver?.rating || '4.5'}</span>
          </div>
        </div>
        <div className="text-right text-sm text-gray-500">
          {date}
          <br />
          {time}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-block px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm truncate max-w-full">
          From: {ride.pickupLocation?.address || 'Unknown'}
        </span>
        <span className="inline-block px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm truncate max-w-full">
          To: {ride.dropLocation?.address || 'Unknown'}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <span>{getVehicleIcon(ride.vehicleType)} {ride.vehicleType?.toUpperCase()}</span>
        <span>{ride.availableSeats} seats</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
        <p className="font-bold text-primary-600 text-xl">₹{ride.totalFare || ride.baseFare}</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleViewDetails}
            className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:border-primary-300 hover:text-primary-600 transition-colors text-sm"
          >
            View details
          </button>
          <button
            onClick={handleRequestRide}
            className="px-4 py-2 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors text-sm"
          >
            Request ride
          </button>
        </div>
      </div>
    </Card>
  )
}
