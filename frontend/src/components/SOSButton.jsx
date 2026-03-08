import { useState } from 'react'
import { PhoneIcon, XMarkIcon, MapPinIcon, ShieldCheckIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import api from '../services/api'
import { notificationService } from '../services/notificationService'

const SOSButton = ({ className = '' }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isTriggered, setIsTriggered] = useState(false)
  const [location, setLocation] = useState(null)
  const [message, setMessage] = useState('Emergency! I need help immediately!')
  const [showMessageDialog, setShowMessageDialog] = useState(false)

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  const handleSOSClick = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmEmergency = async () => {
    setIsTriggered(true)
    setShowConfirmDialog(false)
    
    try {
      // Request notification permission
      await notificationService.requestPermission()
      
      // Get current location
      const currentLocation = await getCurrentLocation()
      setLocation(currentLocation)
      
      // Send emergency alert to backend
      const emergencyData = {
        type: 'sos_emergency',
        location: currentLocation,
        message: message,
        timestamp: new Date().toISOString(),
        userId: JSON.parse(localStorage.getItem('safaride_user'))?.id
      }
      
      // Call emergency endpoint
      const response = await api.post('/rides/sos', emergencyData)
      
      // Send notification to emergency contacts
      await notificationService.sendSOSNotification(emergencyData)
      
      // Show browser notification
      notificationService.showNotification('🚨 Emergency Alert Sent!', {
        body: 'Your location has been shared with emergency contacts and authorities. Help is on the way.',
        requireInteraction: true,
        tag: 'emergency'
      })
      
      console.log('Emergency alert sent:', response.data)
      
      // Show success message
      alert('🚨 Emergency Alert Sent!\n\nYour location has been shared with emergency contacts and authorities. Help is on the way.\n\nMessage: ' + message)
      
    } catch (error) {
      console.error('Emergency alert failed:', error)
      
      // Fallback emergency actions
      alert('🚨 Emergency Alert!\n\nUnable to connect to server. Please call emergency services immediately.\n\n📞 Police: 100\n📞 Ambulance: 108\n\nMessage: ' + message)
    }

    // Reset after 10 seconds
    setTimeout(() => {
      setIsTriggered(false)
      setLocation(null)
    }, 10000)
  }

  const handleCancelEmergency = () => {
    setShowConfirmDialog(false)
  }

  const handleSendMessage = () => {
    setShowMessageDialog(true)
  }

  const handleSendMessageConfirm = () => {
    setShowMessageDialog(false)
    setShowConfirmDialog(true)
  }

  return (
    <>
      {/* SOS Button */}
      <button
        onClick={handleSOSClick}
        disabled={isTriggered}
        className={`
          fixed bottom-6 right-6 z-50 
          w-16 h-16 ${isTriggered ? 'bg-orange-600 animate-pulse' : 'bg-red-600 hover:bg-red-700'} 
          text-white rounded-full 
          shadow-lg hover:shadow-xl 
          transition-all duration-200 
          flex items-center justify-center
          ${className}
        `}
      >
        {isTriggered ? (
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold">SOS</span>
            <span className="text-xs">ACTIVE</span>
          </div>
        ) : (
          <span className="text-2xl font-bold">SOS</span>
        )}
      </button>

      {/* Message Button */}
      <button
        onClick={handleSendMessage}
        disabled={isTriggered}
        className={`
          fixed bottom-24 right-6 z-50 
          w-12 h-12 bg-blue-600 hover:bg-blue-700 
          text-white rounded-full 
          shadow-lg hover:shadow-xl 
          transition-all duration-200 
          flex items-center justify-center
        `}
        title="Add emergency message"
      >
        <ChatBubbleLeftIcon className="w-5 h-5" />
      </button>

      {/* Message Dialog */}
      {showMessageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChatBubbleLeftIcon className="w-8 h-8 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Emergency Message
              </h3>
              
              <p className="text-gray-600 mb-4">
                Add a custom message to send with your emergency alert.
              </p>
              
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your emergency..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={200}
              />
              
              <div className="text-xs text-gray-500 mt-2">
                {message.length}/200 characters
              </div>
              
              <div className="space-y-3 mt-4">
                <button
                  onClick={handleSendMessageConfirm}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                  Send Emergency Alert
                </button>
                
                <button
                  onClick={() => setShowMessageDialog(false)}
                  className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneIcon className="w-8 h-8 text-red-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Emergency Alert
              </h3>
              
              <p className="text-gray-600 mb-2">
                Are you in an emergency? This will alert your emergency contacts and share your location.
              </p>

              {message && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Message:</strong> {message}
                  </p>
                </div>
              )}
              
              <div className="text-sm text-gray-600 mb-6">
                This will:
              </div>
              
              <ul className="text-sm text-gray-600 space-y-2 mb-6 text-left">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Notify emergency services
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Share your location with contacts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Alert the SafeRide team
                </li>
                {message && (
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Send your emergency message
                  </li>
                )}
              </ul>
              
              <div className="space-y-3">
                <button
                  onClick={handleConfirmEmergency}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors font-semibold"
                >
                  Yes, Send Emergency Alert
                </button>
                
                <button
                  onClick={handleCancelEmergency}
                  className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Emergency Indicator */}
      {isTriggered && (
        <div className="fixed top-20 right-4 bg-orange-600 text-white p-4 rounded-lg shadow-lg z-40 max-w-xs">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Emergency Active</p>
              <p className="text-sm opacity-90">Help is on the way</p>
              {location && (
                <p className="text-xs opacity-75 mt-1">
                  Location shared: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SOSButton
