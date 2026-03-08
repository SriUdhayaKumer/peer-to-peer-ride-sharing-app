import { useState, useEffect } from 'react'
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'

const MapComponent = ({ 
  pickupLocation, 
  dropLocation, 
  driverLocation, 
  showDriver = false,
  height = '400px',
  className = ''
}) => {
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!mapLoaded) {
    return (
      <div 
        className={`bg-gray-100 rounded-2xl flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl overflow-hidden ${className}`} style={{ height }}>
      {/* Mock Map */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-100">
        {/* Grid lines to simulate map */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full border-b border-gray-400" style={{ top: `${i * 10}%` }} />
          ))}
          {[...Array(10)].map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full border-r border-gray-400" style={{ left: `${i * 10}%` }} />
          ))}
        </div>

        {/* Route Line */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#3B82F6"
              />
            </marker>
          </defs>
          <path
            d="M 30 70 Q 50 50 70 80"
            stroke="#3B82F6"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
            markerEnd="url(#arrowhead)"
          />
        </svg>

        {/* Pickup Marker */}
        {pickupLocation && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ top: '70%', left: '30%' }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                <MapPinIcon className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                Pickup
              </div>
            </div>
          </div>
        )}

        {/* Drop Marker */}
        {dropLocation && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ top: '80%', left: '70%' }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                <MapPinIcon className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                Drop
              </div>
            </div>
          </div>
        )}

        {/* Driver Marker */}
        {showDriver && driverLocation && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ top: '50%', left: '50%' }}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <PhoneIcon className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                Driver
              </div>
            </div>
          </div>
        )}

        {/* Current Location Indicator */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 z-20">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="font-medium">Live Tracking</span>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-1 z-20">
          <button className="p-2 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Map Attribution */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded z-20">
        SafeRide Maps
      </div>
    </div>
  )
}

export default MapComponent
