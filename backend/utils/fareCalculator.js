// Fare calculation utilities for SafeRide

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
  GST_RATE: 0.18, // 18% GST
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

/**
 * Estimate ride time based on distance and vehicle type
 * @param {number} distanceInKm - Distance in kilometers
 * @param {string} vehicleType - Type of vehicle
 * @returns {object} Time estimates
 */
const estimateRideTime = (distanceInKm, vehicleType) => {
  // Average speeds in km/h considering city traffic
  const AVERAGE_SPEEDS = {
    bike: 25,
    auto: 20,
    car: 18,
    suv: 16,
    van: 14,
  };
  
  const averageSpeed = AVERAGE_SPEEDS[vehicleType] || AVERAGE_SPEEDS.car;
  const timeInHours = distanceInKm / averageSpeed;
  const timeInMinutes = Math.round(timeInHours * 60);
  
  // Add buffer time for traffic and stops
  const bufferTime = Math.round(timeInMinutes * 0.2); // 20% buffer
  const totalTime = timeInMinutes + bufferTime;
  
  return {
    durationMinutes: timeInMinutes,
    estimatedMinutes: totalTime,
    formattedTime: `${Math.floor(totalTime / 60)}h ${totalTime % 60}m`,
  };
};

/**
 * Calculate fare breakdown for a ride
 * @param {number} distanceInKm - Distance in kilometers
 * @param {string} vehicleType - Type of vehicle
 * @param {number} duration - Duration in minutes (optional)
 * @returns {object} Fare breakdown
 */
const calculateFare = (distanceInKm, vehicleType, duration = 0) => {
  const baseFare = FARE_CONFIG.BASE_FARE[vehicleType] || FARE_CONFIG.BASE_FARE.car;
  const perKmRate = FARE_CONFIG.PER_KM_RATE[vehicleType] || FARE_CONFIG.PER_KM_RATE.car;
  const minimumFare = FARE_CONFIG.MINIMUM_FARE[vehicleType] || FARE_CONFIG.MINIMUM_FARE.car;
  
  // Calculate distance cost
  const distanceCost = distanceInKm * perKmRate;
  
  // Calculate subtotal (base fare + distance cost)
  const subtotal = baseFare + distanceCost;
  
  // Calculate platform fee
  const platformFee = subtotal * FARE_CONFIG.PLATFORM_FEE_PERCENTAGE;
  
  // Calculate GST
  const gst = (subtotal + platformFee) * FARE_CONFIG.GST_RATE;
  
  // Calculate total fare
  let totalFare = subtotal + platformFee + gst;
  
  // Apply minimum fare if applicable
  totalFare = Math.max(totalFare, minimumFare);
  
  return {
    baseFare,
    distanceCost,
    platformFee,
    gst,
    subtotal,
    totalFare: Math.round(totalFare),
    breakdown: {
      'Base Fare': `₹${baseFare}`,
      'Distance Cost': `₹${Math.round(distanceCost)} (${distanceInKm.toFixed(1)} km × ₹${perKmRate}/km)`,
      'Platform Fee': `₹${Math.round(platformFee)} (10%)`,
      'GST': `₹${Math.round(gst)} (18%)`,
      'Total': `₹${Math.round(totalFare)}`,
    }
  };
};

/**
 * Estimate fuel cost for driver
 * @param {number} distanceInKm - Distance in kilometers
 * @param {string} vehicleType - Type of vehicle
 * @returns {object} Fuel cost estimate
 */
const estimateFuelCost = (distanceInKm, vehicleType) => {
  // Average mileage in km/liter for different vehicles
  const MILEAGE = {
    bike: 40,
    auto: 25,
    car: 15,
    suv: 12,
    van: 10,
  };
  
  // Average fuel price per liter (can be updated dynamically)
  const FUEL_PRICE = 100; // ₹100 per liter
  
  const mileage = MILEAGE[vehicleType] || MILEAGE.car;
  const fuelConsumed = distanceInKm / mileage;
  const fuelCost = fuelConsumed * FUEL_PRICE;
  
  return {
    mileage,
    fuelConsumed: fuelConsumed.toFixed(2),
    fuelCost: Math.round(fuelCost),
    fuelPrice: FUEL_PRICE,
  };
};

/**
 * Calculate driver earnings after deductions
 * @param {number} totalFare - Total fare from passenger
 * @param {string} vehicleType - Type of vehicle
 * @returns {object} Driver earnings breakdown
 */
const calculateDriverEarnings = (totalFare, vehicleType) => {
  // Platform commission varies by vehicle type
  const COMMISSION_PERCENTAGE = {
    bike: 0.15,  // 15%
    auto: 0.20,  // 20%
    car: 0.25,   // 25%
    suv: 0.25,   // 25%
    van: 0.30,   // 30%
  };
  
  const commission = COMMISSION_PERCENTAGE[vehicleType] || COMMISSION_PERCENTAGE.car;
  const platformCommission = totalFare * commission;
  const driverEarnings = totalFare - platformCommission;
  
  return {
    totalFare,
    platformCommission: Math.round(platformCommission),
    driverEarnings: Math.round(driverEarnings),
    commissionRate: `${(commission * 100).toFixed(0)}%`,
  };
};

/**
 * Calculate refund amount for cancelled rides
 * @param {number} totalFare - Total fare
 * @param {string} cancelledBy - Who cancelled ('driver' or 'passenger')
 * @param {number} timeBeforeRide - Hours before scheduled ride
 * @returns {object} Refund details
 */
const calculateRefund = (totalFare, cancelledBy, timeBeforeRide) => {
  let refundPercentage = 0;
  let refundReason = '';
  
  if (cancelledBy === 'driver') {
    // Driver cancels - full refund to passenger
    refundPercentage = 1.0;
    refundReason = 'Driver cancelled - Full refund';
  } else if (cancelledBy === 'passenger') {
    // Passenger cancels - refund depends on timing
    if (timeBeforeRide >= 2) {
      refundPercentage = 0.8; // 80% refund
      refundReason = 'Passenger cancelled 2+ hours before - 80% refund';
    } else if (timeBeforeRide >= 1) {
      refundPercentage = 0.5; // 50% refund
      refundReason = 'Passenger cancelled 1-2 hours before - 50% refund';
    } else {
      refundPercentage = 0.2; // 20% refund
      refundReason = 'Passenger cancelled < 1 hour before - 20% refund';
    }
  }
  
  const refundAmount = totalFare * refundPercentage;
  
  return {
    refundAmount: Math.round(refundAmount),
    refundPercentage: refundPercentage * 100,
    refundReason,
    platformFee: totalFare - refundAmount,
  };
};

module.exports = {
  calculateDistance,
  estimateRideTime,
  calculateFare,
  estimateFuelCost,
  calculateDriverEarnings,
  calculateRefund,
  FARE_CONFIG
};
