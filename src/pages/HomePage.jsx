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
} from '@heroicons/react/24/outline'
import { StarIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { sampleRideListings, testimonials } from '../data/dummyData'

const liveRide = sampleRideListings[0]

const features = [
  { icon: MapIcon, title: 'Real-Time Tracking', description: 'Track your ride live on the map. Share trip details with loved ones.' },
  { icon: ShieldCheckIcon, title: 'Verified Riders', description: 'Government ID verification ensures safe, trusted journeys.' },
  { icon: CreditCardIcon, title: 'Digital Payments', description: 'Cashless payments. Instant receipts. Multiple payment options.' },
  { icon: TruckIcon, title: 'Multi-Vehicle Support', description: 'Choose from bikes, cars, autos, and vans for any trip.' },
  { icon: UserGroupIcon, title: 'Smart Matching', description: 'AI-powered matching finds the best ride for your route.' },
  { icon: BoltIcon, title: 'Quick Bookings', description: 'Book a ride in seconds. No hassle, no waiting.' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="max-w-container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-display font-bold text-slate-900 leading-tight mb-6">
                Smart Peer-to-Peer
                <span className="text-primary-600"> Ride Sharing</span>
              </h1>
              <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
                Connect with fellow travelers, share rides, and save on your daily commute.
                Your journey, your way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button to="/search" variant="primary" size="lg" icon={MagnifyingGlassIcon}>
                  Find a Ride
                </Button>
                <Button to="/post-ride" variant="outline" size="lg" icon={MapPinIcon}>
                  Post a Ride
                </Button>
              </div>
            </div>

            <div className="lg:pl-8">
              <Card variant="elevated" className="overflow-hidden" hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-slate-900">Live Ride</h3>
                  <span className="px-3 py-1.5 rounded-full bg-primary-100 text-primary-600 text-sm font-medium">
                    ETA 12 min
                  </span>
                </div>
                <div className="h-64 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                  <div className="text-center">
                    <MapIcon className="w-20 h-20 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">Interactive Map</p>
                    <p className="text-sm text-slate-400">Live GPS tracking</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500 mb-1">Driver</p>
                    <p className="font-semibold text-slate-900 truncate">{liveRide?.driverName}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500 mb-1">Vehicle</p>
                    <p className="font-semibold text-slate-900">{liveRide?.vehicleType}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500 mb-1">Fare</p>
                    <p className="font-semibold text-primary-600">₹{liveRide?.pricePerSeat}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Why Choose Us</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Built for safety, convenience, and a seamless ride-sharing experience.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} variant="elevated" hover className="group">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">What Our Users Say</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Trusted by thousands of travelers across the country.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.id} variant="elevated" hover>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <UserCircleIcon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={`w-5 h-5 ${i < t.rating ? 'text-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-slate-600">"{t.text}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-container mx-auto px-4 sm:px-6">
          <div className="rounded-2xl bg-primary-600 shadow-lg py-20 px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/90 mb-10 max-w-lg mx-auto text-lg">
              Join thousands of travelers. Post or find rides in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-primary-600 font-semibold hover:bg-slate-50 transition-all duration-200"
              >
                Get Started
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl border-2 border-white/50 text-white font-semibold hover:bg-white/10 transition-all duration-200"
              >
                Browse Rides
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
