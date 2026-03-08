import { Link } from 'react-router-dom'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  const footerLinks = {
    Product: [
      { name: 'Find a Ride', path: '/search' },
      { name: 'Post a Ride', path: '/post-ride' },
      { name: 'Dashboard', path: '/dashboard' },
    ],
    Company: [
      { name: 'About Us', path: '/' },
      { name: 'Contact', path: '/' },
    ],
    Legal: [
      { name: 'Privacy Policy', path: '/' },
      { name: 'Terms of Service', path: '/' },
    ],
  }

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="font-bold text-lg text-gray-900 mb-4 block">
              P2P Smart Ride
            </Link>
            <p className="text-gray-600 mb-4 max-w-sm text-sm">
              Smart Peer-to-Peer Ride Sharing. Connect with fellow travelers and save on your commute.
            </p>
            <div className="space-y-2">
              <a href="mailto:support@smartride.com" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors text-sm">
                <EnvelopeIcon className="w-5 h-5" />
                support@smartride.com
              </a>
              <a href="tel:+911234567890" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors text-sm">
                <PhoneIcon className="w-5 h-5" />
                +91 123 456 7890
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-gray-900 mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} P2P Smart Ride. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-primary-600 text-sm">Twitter</a>
            <a href="#" className="text-gray-500 hover:text-primary-600 text-sm">Facebook</a>
            <a href="#" className="text-gray-500 hover:text-primary-600 text-sm">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
