import { useEffect, useRef } from 'react'

const GoogleMap = ({ 
  pickupLocation, 
  dropLocation, 
  driverLocation, 
  height = '400px',
  showRoute = true,
  showDriver = true 
}) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    // Initialize Google Maps
    const initMap = () => {
      if (!window.google || !mapRef.current) return

      const map = new window.google.maps.Map(mapRef.current, {
        center: pickupLocation || { lat: 12.9716, lng: 77.5946 },
        zoom: 13,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      })

      mapInstanceRef.current = map
      updateMarkers(map)
    }

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWdKzK9rKqCzRnHd5YJ9cB7g&libraries=places&callback=initMap`
      script.async = true
      script.defer = true
      window.initMap = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        markersRef.current.forEach(marker => marker.setMap(null))
        markersRef.current = []
      }
    }
  }, [pickupLocation, dropLocation, driverLocation])

  const updateMarkers = (map) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Add pickup marker
    if (pickupLocation) {
      const pickupMarker = new window.google.maps.Marker({
        position: pickupLocation,
        map: map,
        title: 'Pickup Location',
        icon: {
          url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMDBiMDAwIj48cGF0aCBkPSJNMTIgMEM2LjYyIDYuNjIgMCAxMiAwIDYuNjIgNi42IDEyIDYuNjIgMCAxMi02LjYyLTEyLTEyLTEyem0wIDE4YzMuMzEgMCA2LjI1LTIuOTQgNi4yNS02LjI1IDYuMjUgMCAwIDMuMzEgMi45NCA2LjI1IDIuOTQgMCAwLTItLjk0LTYuMjUtNi4yNXptNi4yNS0xOGMwLTQuMTQtMy4zMS03LjUtNy41LTcuNXoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=',
          scaledSize: new window.google.maps.Size(30, 30),
          anchor: new window.google.maps.Point(15, 15)
        },
        animation: window.google.maps.Animation.DROP
      })
      markersRef.current.push(pickupMarker)
    }

    // Add drop marker
    if (dropLocation) {
      const dropMarker = new window.google.maps.Marker({
        position: dropLocation,
        map: map,
        title: 'Drop Location',
        icon: {
          url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZDAwMDAwIj48cGF0aCBkPSJNMTIgMEM2LjYyIDYuNjIgMCAxMiAwIDYuNjIgNi42IDEyIDYuNjIgMCAxMi02LjYyLTEyLTEyLTEyem0wIDE4YzMuMzEgMCA2LjI1LTIuOTQgNi4yNS02LjI1IDYuMjUgMCAwIDMuMzEgMi45NCA2LjI1IDIuOTQgMCAwLTItLjk0LTYuMjUtNi4yNXptNi4yNS0xOGMwLTQuMTQtMy4zMS03LjUtNy41LTcuNXoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=',
          scaledSize: new window.google.maps.Size(30, 30),
          anchor: new window.google.maps.Point(15, 15)
        },
        animation: window.google.maps.Animation.DROP
      })
      markersRef.current.push(dropMarker)
    }

    // Add driver marker
    if (driverLocation && showDriver) {
      const driverMarker = new window.google.maps.Marker({
        position: driverLocation,
        map: map,
        title: 'Driver Location',
        icon: {
          url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMDA3YmZmIj48cGF0aCBkPSJNMTIgMEM2LjYyIDYuNjIgMCAxMiAwIDYuNjIgNi42IDEyIDYuNjIgMCAxMi02LjYyLTEyLTEyLTEyem0wIDE4YzMuMzEgMCA2LjI1LTIuOTQgNi4yNS02LjI1IDYuMjUgMCAwIDMuMzEgMi45NCA2LjI1IDIuOTQgMCAwLTItLjk0LTYuMjUtNi4yNXptNi4yNS0xOGMwLTQuMTQtMy4zMS03LjUtNy41LTcuNXoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=',
          scaledSize: new window.google.maps.Size(30, 30),
          anchor: new window.google.maps.Point(15, 15)
        },
        animation: window.google.maps.Animation.BOUNCE
      })
      markersRef.current.push(driverMarker)
    }

    // Draw route if both pickup and drop are available
    if (showRoute && pickupLocation && dropLocation) {
      const directionsService = new window.google.maps.DirectionsService()
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#3B82F6',
          strokeWeight: 4,
          strokeOpacity: 0.8
        }
      })

      directionsService.route({
        origin: pickupLocation,
        destination: dropLocation,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (response, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response)
        }
      })
    }

    // Fit bounds to show all markers
    if (pickupLocation && dropLocation) {
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend(pickupLocation)
      bounds.extend(dropLocation)
      if (driverLocation) bounds.extend(driverLocation)
      map.fitBounds(bounds)
    }
  }

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height,
        borderRadius: '12px',
        overflow: 'hidden'
      }} 
    />
  )
}

export default GoogleMap
