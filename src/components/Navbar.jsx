import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ChevronDownIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import Button from './ui/Button'

const isLoggedIn = false

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Post Ride', path: '/post-ride' },
    { name: 'Find Ride', path: '/search' },
    { name: 'Dashboard', path: '/dashboard' },
  ]

  const isActive = (path) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path))

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-nav border-b border-slate-100">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-slate-900">P2P Smart Ride</span>
          </Link>

          <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            {isLoggedIn ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                    className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 relative"
                    aria-label="Notifications"
                  >
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
                  </button>
                  {notifOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-slate-100 py-2 z-20">
                        <p className="px-4 py-3 text-sm text-slate-500">No new notifications</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <UserCircleIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="font-medium text-slate-700">Profile</span>
                    <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-slate-100 py-2 z-20">
                        <Link to="/profile-setup" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50">
                          <UserCircleIcon className="w-5 h-5" /> Profile
                        </Link>
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50">
                          <Cog6ToothIcon className="w-5 h-5" /> Dashboard
                        </Link>
                        <hr className="my-2 border-slate-100" />
                        <Link to="/login" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-danger-600 hover:bg-danger-50">
                          <ArrowRightOnRectangleIcon className="w-5 h-5" /> Logout
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button to="/login" variant="secondary" size="sm">
                  Login
                </Button>
                <Button to="/register" variant="primary" size="sm">
                  Register
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {!isLoggedIn && (
              <Button to="/login" variant="primary" size="sm">
                Login
              </Button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Menu"
            >
              {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl font-medium ${
                    isActive(link.path) ? 'text-primary-600 bg-primary-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/profile-setup" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <UserCircleIcon className="w-5 h-5" /> Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
