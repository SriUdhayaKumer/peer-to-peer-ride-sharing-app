import { createContext, useContext, useState } from 'react'

const RideContext = createContext()

export const useRide = () => {
  const context = useContext(RideContext)
  if (!context) {
    throw new Error('useRide must be used within a RideProvider')
  }
  return context
}

export const RideProvider = ({ children }) => {
  const [currentRide, setCurrentRide] = useState(null)
  const [rideHistory, setRideHistory] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [paymentStatus, setPaymentStatus] = useState(null)

  const bookRide = (rideDetails) => {
    const newRide = {
      id: 'ride_' + Date.now(),
      ...rideDetails,
      status: 'booked',
      bookingTime: new Date().toISOString(),
    }
    setCurrentRide(newRide)
    setRideHistory(prev => [newRide, ...prev])
  }

  const updateRideStatus = (status, additionalData = {}) => {
    if (currentRide) {
      const updatedRide = {
        ...currentRide,
        status,
        ...additionalData,
      }
      setCurrentRide(updatedRide)
      setRideHistory(prev => 
        prev.map(ride => ride.id === updatedRide.id ? updatedRide : ride)
      )
    }
  }

  const completeRide = () => {
    if (currentRide) {
      updateRideStatus('completed', {
        completionTime: new Date().toISOString(),
      })
      setCurrentRide(null)
    }
  }

  const cancelRide = () => {
    if (currentRide) {
      updateRideStatus('cancelled', {
        cancellationTime: new Date().toISOString(),
      })
      setCurrentRide(null)
    }
  }

  const value = {
    currentRide,
    rideHistory,
    searchResults,
    paymentStatus,
    setCurrentRide,
    setSearchResults,
    setPaymentStatus,
    bookRide,
    updateRideStatus,
    completeRide,
    cancelRide,
  }

  return (
    <RideContext.Provider value={value}>
      {children}
    </RideContext.Provider>
  )
}
