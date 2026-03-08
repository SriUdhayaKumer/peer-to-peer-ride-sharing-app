import { Link } from 'react-router-dom'
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  MapIcon,
  UserGroupIcon,
  BoltIcon,
  TruckIcon,
  PhoneIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import Button from '../components/ui/Button'

const features = [
  { 
    icon: ShieldCheckIcon, 
    title: 'Emergency Safety', 
    description: 'SOS button and emergency contacts for instant help during your journey.' 
  },
  { 
    icon: CheckCircleIcon, 
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
]

const howItWorks = [
  { step: '1', title: 'Create Profile', description: 'Set up your profile with identity verification for safety.' },
  { step: '2', title: 'Find or Post Rides', description: 'Search for available rides or post your own ride details.' },
  { step: '3', title: 'Book & Pay', description: 'Secure payment with transparent pricing breakdown.' },
  { step: '4', title: 'Track & Ride', description: 'Live tracking ensures safe journey from start to finish.' },
]

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-20 pb-24 lg:pt-28 lg:pb-32 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                SafeRide – Smart & Safe
                <span className="text-blue-600"> Ride Sharing</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
                Smart, Safe & Fair Ride Sharing
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button to="/profile-setup" variant="primary" size="lg" icon={UserGroupIcon}>
                  Get Started
                </Button>
                <Button to="/login" variant="outline" size="lg" icon={PhoneIcon}>
                  Login
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl p-8 lg:p-12">
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <MapPinIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Current Location</p>
                        <p className="text-sm text-slate-600">MG Road, Bangalore</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <MapPinIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Destination</p>
                        <p className="text-sm text-slate-600">Koramangala, Bangalore</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <TruckIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">Car Ride</p>
                          <p className="text-sm text-slate-600">3 seats available</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">₹150</p>
                        <p className="text-sm text-slate-600">per seat</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why Choose SafeRide?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the future of ride sharing with our safety-first approach and smart features.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How SafeRide Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get started in just 4 simple steps and enjoy safe, affordable rides.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-12 lg:p-16 text-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Your Safety is Our Priority
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Identity Verification</h3>
                      <p className="text-blue-100">All users undergo government ID verification</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">24/7 Emergency Support</h3>
                      <p className="text-blue-100">SOS button with instant emergency contacts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Live Trip Sharing</h3>
                      <p className="text-blue-100">Share your trip details with family and friends</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <PhoneIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Emergency SOS</h3>
                  <p className="text-blue-100 mb-6">
                    One-tap emergency assistance available during every ride
                  </p>
                  <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    Learn More About Safety
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Ride Safely?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of users who trust SafeRide for their daily commute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/profile-setup" variant="primary" size="lg" icon={UserGroupIcon}>
              Get Started Now
            </Button>
            <Button to="/login" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900">
              Login to Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
