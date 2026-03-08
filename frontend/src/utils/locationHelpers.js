// Location utilities for SafeRide

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    )
  })
}

export const getAddressFromCoordinates = async (lat, lng) => {
  try {
    // This would typically use a geocoding API like Google Maps or OpenStreetMap
    // For now, return a mock address
    return {
      address: 'Sample Address',
      area: 'Sample Area',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    }
  } catch (error) {
    throw new Error('Failed to get address from coordinates')
  }
}

export const getCoordinatesFromAddress = async (address) => {
  try {
    // This would typically use a geocoding API
    // For now, return mock coordinates for Bangalore
    return {
      latitude: 12.9716,
      longitude: 77.5946,
    }
  } catch (error) {
    throw new Error('Failed to get coordinates from address')
  }
}

export const calculateETA = (distanceInKm, vehicleType) => {
  // Average speeds in km/h considering city traffic conditions
  const AVERAGE_SPEEDS = {
    bike: 25,
    auto: 20,
    car: 18,
    suv: 16,
    van: 14,
  }
  
  const averageSpeed = AVERAGE_SPEEDS[vehicleType] || AVERAGE_SPEEDS.car
  const timeInMinutes = Math.round((distanceInKm / averageSpeed) * 60)
  
  return {
    etaMinutes: timeInMinutes,
    formattedETA: `${timeInMinutes} mins`,
  }
}

export const formatAddress = (address) => {
  if (!address) return 'Unknown Location'
  
  if (typeof address === 'string') {
    return address
  }
  
  // If address is an object with components
  const { street, area, city, state, pincode } = address
  const components = [street, area, city].filter(Boolean)
  const mainAddress = components.join(', ')
  
  if (state && pincode) {
    return `${mainAddress}, ${state} ${pincode}`
  } else if (state) {
    return `${mainAddress}, ${state}`
  }
  
  return mainAddress
}

export const isLocationNearby = (lat1, lng1, lat2, lng2, thresholdInMeters = 100) => {
  const R = 6371e3 // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c
  
  return distance <= thresholdInMeters
}

export const generateRouteCoordinates = (startLat, startLng, endLat, endLng, numPoints = 10) => {
  const coordinates = []
  
  for (let i = 0; i <= numPoints; i++) {
    const fraction = i / numPoints
    const lat = startLat + (endLat - startLat) * fraction
    const lng = startLng + (endLng - startLng) * fraction
    
    // Add some randomness to make it look more realistic
    const randomOffset = (Math.random() - 0.5) * 0.001
    coordinates.push({
      latitude: lat + randomOffset,
      longitude: lng + randomOffset,
    })
  }
  
  return coordinates
}

export const getPopularLocations = () => {
  return [
    { name: 'MG Road', latitude: 12.9766, longitude: 77.5753 },
    { name: 'Koramangala', latitude: 12.9279, longitude: 77.6271 },
    { name: 'Indiranagar', latitude: 12.9784, longitude: 77.6408 },
    { name: 'Whitefield', latitude: 12.9698, longitude: 77.7500 },
    { name: 'Electronic City', latitude: 12.8444, longitude: 77.6777 },
    { name: 'Jayanagar', latitude: 12.9293, longitude: 77.5803 },
    { name: 'BTM Layout', latitude: 12.9166, longitude: 77.6102 },
    { name: 'HSR Layout', latitude: 12.9118, longitude: 77.6475 },
  ]
}

export const searchLocations = (query) => {
  const popularLocations = getPopularLocations()
  
  if (!query) return popularLocations
  
  return popularLocations.filter(location => 
    location.name.toLowerCase().includes(query.toLowerCase())
  )
}
