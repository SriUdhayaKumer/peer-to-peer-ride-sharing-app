import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  DocumentTextIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import Button from './ui/Button'
import ProfileDropdown from './ProfileDropdown'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const publicNavLinks = [
    { name: 'Home', path: '/' },
  ]

  const authNavLinks = [
    { name: 'Home', path: '/home', icon: UserCircleIcon },
    { name: 'Find Ride', path: '/search', icon: MagnifyingGlassIcon },
    { name: 'Post Ride', path: '/post-ride', icon: MapPinIcon },
    { name: 'My Rides', path: '/my-rides', icon: DocumentTextIcon },
    { name: 'Dashboard', path: '/dashboard', icon: DocumentTextIcon },
    { name: 'Profile', path: '/profile', icon: UserGroupIcon },
  ]

  const isActive = (path) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path))

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = isAuthenticated ? authNavLinks : publicNavLinks

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-slate-900">SafeRide</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive(link.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <>
                <Button to="/login" variant="outline" size="sm">
                  Login
                </Button>
                <Button to="/profile-setup" variant="primary" size="sm">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors
                    ${isActive(link.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  {link.icon && <link.icon className="w-5 h-5" />}
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-sm text-gray-600 capitalize">{user?.role || 'passenger'}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <UserCircleIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    to="/login"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Button>
                  <Button
                    to="/profile-setup"
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
