// Fare calculation utility for SafeRide

const FARE_CONFIG = {
  BASE_FARE: {
    bike: 20,
    auto: 30,
    car: 50,
    suv: 70,
    van: 90,
  },
  PER_KM_RATE: {
    bike: 8,
    auto: 12,
    car: 15,
    suv: 20,
    van: 25,
  },
  PLATFORM_FEE_PERCENTAGE: 0.10, // 10% platform fee
  MINIMUM_FARE: {
    bike: 30,
    auto: 40,
    car: 60,
    suv: 80,
    van: 100,
  },
}

export const calculateFare = (distanceInKm, vehicleType, duration = 0) => {
  const baseFare = FARE_CONFIG.BASE_FARE[vehicleType] || FARE_CONFIG.BASE_FARE.car
  const perKmRate = FARE_CONFIG.PER_KM_RATE[vehicleType] || FARE_CONFIG.PER_KM_RATE.car
  const minimumFare = FARE_CONFIG.MINIMUM_FARE[vehicleType] || FARE_CONFIG.MINIMUM_FARE.car
  
  // Calculate distance cost
  const distanceCost = distanceInKm * perKmRate
  
  // Calculate subtotal (base fare + distance cost)
  const subtotal = baseFare + distanceCost
  
  // Calculate platform fee
  const platformFee = subtotal * FARE_CONFIG.PLATFORM_FEE_PERCENTAGE
  
  // Calculate total fare
  let totalFare = subtotal + platformFee
  
  // Apply minimum fare if applicable
  totalFare = Math.max(totalFare, minimumFare)
  
  return {
    baseFare,
    distanceCost,
    platformFee,
    subtotal,
    totalFare: Math.round(totalFare),
    breakdown: {
      'Base Fare': `₹${baseFare}`,
      'Distance Cost': `₹${Math.round(distanceCost)} (${distanceInKm.toFixed(1)} km × ₹${perKmRate}/km)`,
      'Platform Fee': `₹${Math.round(platformFee)} (10%)`,
      'Total': `₹${Math.round(totalFare)}`,
    }
  }
}

export const estimateRideTime = (distanceInKm, vehicleType) => {
  // Average speeds in km/h for different vehicle types (considering city traffic)
  const AVERAGE_SPEEDS = {
    bike: 25,
    auto: 20,
    car: 18,
    suv: 16,
    van: 14,
  }
  
  const averageSpeed = AVERAGE_SPEEDS[vehicleType] || AVERAGE_SPEEDS.car
  const timeInHours = distanceInKm / averageSpeed
  const timeInMinutes = Math.round(timeInHours * 60)
  
  return {
    durationMinutes: timeInMinutes,
    formattedTime: `${Math.floor(timeInMinutes / 60)}h ${timeInMinutes % 60}m`,
  }
}

export const calculateDistance = (pickupLat, pickupLng, dropLat, dropLng) => {
  // Haversine formula to calculate distance between two points
  const R = 6371 // Earth's radius in kilometers
  const dLat = (dropLat - pickupLat) * Math.PI / 180
  const dLng = (dropLng - pickupLng) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(pickupLat * Math.PI / 180) * Math.cos(dropLat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c
  
  return distance
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export const getVehicleIcon = (vehicleType) => {
  const icons = {
    bike: '🏍️',
    auto: '🛺',
    car: '🚗',
    suv: '🚙',
    van: '🚐',
  }
  return icons[vehicleType] || '🚗'
}

export const getVehicleCapacity = (vehicleType) => {
  const capacities = {
    bike: 1,
    auto: 3,
    car: 4,
    suv: 6,
    van: 8,
  }
  return capacities[vehicleType] || 4
}
