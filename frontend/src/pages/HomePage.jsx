import { Link } from 'react-router-dom'
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  MapIcon,
  UserGroupIcon,
  BoltIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline'
import { StarIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import FeatureCard from '../components/FeatureCard'
import SOSButton from '../components/SOSButton'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { verificationService } from '../services/verificationService'

const features = [
  { 
    icon: ShieldCheckIcon, 
    title: 'Emergency Safety', 
    description: 'SOS button and emergency contacts for instant help during your journey.' 
  },
  { 
    icon: StarIcon, 
    title: 'Verified Drivers', 
    description: 'Government ID verification ensures safe, trusted drivers.' 
  },
  { 
    icon: MapIcon, 
    title: 'Live Tracking', 
    description: 'Track your ride in real-time and share location with family.' 
  },
  { 
    icon: CreditCardIcon, 
    title: 'Transparent Pricing', 
    description: 'Clear fare breakdown with no hidden charges.' 
  },
  { 
    icon: ShieldCheckIcon, 
    title: 'Secure Payments', 
    description: 'Multiple payment options with secure processing.' 
  },
  { 
    icon: MapPinIcon, 
    title: 'Smart Pickup', 
    description: 'AI-powered pickup points for convenient boarding.' 
  },
  { 
    icon: BoltIcon, 
    title: 'AI Route Optimization', 
    description: 'Machine learning algorithms find the safest and fastest routes.' 
  },
  { 
    icon: PhoneIcon, 
    title: 'Smart Matching', 
    description: 'AI matches you with the most compatible drivers based on preferences.' 
  },
  { 
    icon: UserGroupIcon, 
    title: 'Voice Assistant', 
    description: 'AI-powered voice commands for hands-free ride management.' 
  },
]

// Mock recent rides data
const recentRides = [
  {
    id: 1,
    driverName: 'Raj Kumar',
    driverRating: 4.8,
    vehicleType: 'car',
    pickupLocation: 'MG Road',
    dropLocation: 'Koramangala',
    price: 150,
    status: 'completed',
    date: '2024-03-07',
  },
  {
    id: 2,
    driverName: 'Priya Sharma',
    driverRating: 4.9,
    vehicleType: 'auto',
    pickupLocation: 'Indiranagar',
    dropLocation: 'Whitefield',
    price: 200,
    status: 'completed',
    date: '2024-03-06',
  },
]

export default function HomePage() {
  const { user } = useAuth()
  const [verificationStatus, setVerificationStatus] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch verification status on component mount
  useEffect(() => {
    const fetchVerificationData = async () => {
      try {
        console.log('Fetching verification data...')
        const statusData = await verificationService.getVerificationStatus()
        console.log('Verification status response:', statusData)
        setVerificationStatus(statusData.verificationStatus)
        
        const recommendationsData = await verificationService.getRecommendations()
        console.log('Recommendations response:', recommendationsData)
        setRecommendations(recommendationsData.recommendations)
      } catch (error) {
        console.error('Failed to fetch verification data:', error)
        // Set default values if API fails
        setVerificationStatus({
          status: 'Not Started',
          score: 0,
          identityVerified: user?.identityVerified || false,
          driverVerified: user?.driverVerified || false,
          profilePhoto: !!user?.profilePhoto,
          nextSteps: ['Complete verification to get started']
        })
        setRecommendations([])
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchVerificationData()
    }
  }, [user])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Welcome Hero */}
      <section className="pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent leading-tight mb-6">
              Hello, {user?.name || 'User'}!
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Welcome back to SafeRide! Ready for your next safe and affordable journey?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button to="/search" variant="primary" size="lg" icon={MagnifyingGlassIcon}>
                Find Ride
              </Button>
              <Button to="/post-ride" variant="outline" size="lg" icon={MapPinIcon}>
                Post Ride
              </Button>
            </div>
          </div>

          {/* Live Tracking Preview */}
          <Card className="max-w-4xl mx-auto p-6 bg-white/80 backdrop-blur-sm border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-blue-600" />
                Live Tracking
              </h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
            
            {/* Mock Map Preview */}
            <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                <div className="absolute top-4 right-4 w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  <path d="M 50 50 Q 200 100 350 150" stroke="#3B82F6" strokeWidth="2" fill="none" strokeDasharray="5,5" className="animate-pulse"/>
                </svg>
              </div>
              <div className="text-center z-10">
                <MapIcon className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Real-time Location Tracking</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">2.5 km</p>
                <p className="text-sm text-gray-600">Distance</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">8 mins</p>
                <p className="text-sm text-gray-600">ETA</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">Live</p>
                <p className="text-sm text-gray-600">Status</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Account Verification Status */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">Account Status</h2>
            <p className="text-gray-600 mb-6">Complete your verification for enhanced safety features</p>
            {loading && (
              <div className="text-sm text-blue-500 mb-4">
                Loading verification status...
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="p-4 text-center">
              <ShieldCheckIcon className={`w-8 h-8 mx-auto mb-2 ${verificationStatus?.identityVerified ? 'text-green-600' : 'text-gray-400'}`} />
              <h4 className="font-semibold text-gray-900 mb-1">Identity Verified</h4>
              <p className={`text-sm ${verificationStatus?.identityVerified ? 'text-green-600' : 'text-gray-500'}`}>
                {verificationStatus?.identityVerified ? 'Verified' : 'Not Verified'}
              </p>
            </Card>
            
            <Card className="p-4 text-center">
              <TruckIcon className={`w-8 h-8 mx-auto mb-2 ${verificationStatus?.driverVerified ? 'text-green-600' : 'text-gray-400'}`} />
              <h4 className="font-semibold text-gray-900 mb-1">Driver Verified</h4>
              <p className={`text-sm ${verificationStatus?.driverVerified ? 'text-green-600' : 'text-gray-500'}`}>
                {verificationStatus?.driverVerified ? 'Verified' : 'Not Verified'}
              </p>
            </Card>
            
            <Card className="p-4 text-center">
              <UserCircleIcon className={`w-8 h-8 mx-auto mb-2 ${verificationStatus?.profilePhoto ? 'text-green-600' : 'text-gray-400'}`} />
              <h4 className="font-semibold text-gray-900 mb-1">Profile Complete</h4>
              <p className="text-sm text-gray-600">
                {verificationStatus?.profilePhoto ? 'Photo Added' : 'Add Photo'}
              </p>
            </Card>
            
            <Card className="p-4 text-center">
              <BoltIcon className={`w-8 h-8 mx-auto mb-2 text-purple-600`} />
              <h4 className="font-semibold text-gray-900 mb-1">AI Safety Score</h4>
              <p className="text-sm text-gray-600">
                {verificationStatus?.score ? `${verificationStatus.score}%` : '0%'}
              </p>
            </Card>
          </div>
          
          {/* Verification Actions */}
          <div className="mt-8 text-center">
            {!verificationStatus?.identityVerified && (
              <div className="mb-6">
                <Button to="/profile" variant="primary" size="lg" icon={ShieldCheckIcon}>
                  Verify Your Identity Now
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Upload your ID to unlock all safety features and increase trust
                </p>
              </div>
            )}
            
            {verificationStatus?.identityVerified && !verificationStatus?.driverVerified && (
              <div className="mb-6">
                <Button to="/profile" variant="outline" size="lg" icon={TruckIcon}>
                  Become a Verified Driver
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Complete driver verification to start earning and get premium rides
                </p>
              </div>
            )}
            
            {verificationStatus?.score === 100 && (
              <div className="mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-semibold">Fully Verified - All Features Unlocked!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SOS Emergency Button */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Emergency Support</h2>
            <p className="text-gray-600">One-tap emergency assistance when you need it most</p>
          </div>
          
          <div className="flex justify-center">
            <SOSButton />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
            <Card className="p-4 text-center">
              <PhoneIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Emergency Contacts</h4>
              <p className="text-sm text-gray-600">Quick access to your emergency contacts</p>
            </Card>
            <Card className="p-4 text-center">
              <ShieldCheckIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Location Sharing</h4>
              <p className="text-sm text-gray-600">Share live location with trusted contacts</p>
            </Card>
            <Card className="p-4 text-center">
              <UserGroupIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">24/7 Support</h4>
              <p className="text-sm text-gray-600">Round-the-clock assistance available</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{recentRides.length}</h3>
              <p className="text-slate-600">Total Rides</p>
            </Card>
            
            <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCardIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">₹350</h3>
              <p className="text-slate-600">Total Spent</p>
            </Card>
            
            <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">100%</h3>
              <p className="text-slate-600">Safety Score</p>
            </Card>

            <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border border-gray-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">4.8</h3>
              <p className="text-slate-600">Your Rating</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why SafeRide?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the future of ride sharing with our safety-first approach.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Rides */}
      {recentRides.length > 0 && (
        <section className="py-24 lg:py-32 bg-slate-50/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Recent Rides
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Your recent journey history
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {recentRides.map((ride) => (
                <Card key={ride.id} className="p-6 bg-white/80 backdrop-blur-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{ride.driverName}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-slate-600">{ride.driverRating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">₹{ride.price}</p>
                      <p className="text-sm text-slate-600 capitalize">{ride.vehicleType}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{ride.pickupLocation} → {ride.dropLocation}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{ride.date}</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {ride.status}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button to="/dashboard" variant="outline" size="lg">
                View All Rides
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How SafeRide Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get started in just 4 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Find Ride', description: 'Search for available rides on your route' },
              { step: '2', title: 'Book & Pay', description: 'Secure booking with transparent pricing' },
              { step: '3', title: 'Track Live', description: 'Real-time tracking with safety features' },
              { step: '4', title: 'Rate & Review', description: 'Share your experience with the community' },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
