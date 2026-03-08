import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'

const ProfileDropdown = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const menuItems = [
    {
      label: 'My Rides',
      icon: DocumentTextIcon,
      action: () => {
        navigate('/my-rides')
        setIsOpen(false)
      },
    },
    {
      label: 'Profile',
      icon: UserCircleIcon,
      action: () => {
        navigate('/profile')
        setIsOpen(false)
      },
    },
    {
      label: 'Dashboard',
      icon: DocumentTextIcon,
      action: () => {
        navigate('/dashboard')
        setIsOpen(false)
      },
    },
    {
      label: 'Settings',
      icon: Cog6ToothIcon,
      action: () => {
        // Navigate to settings when implemented
        setIsOpen(false)
      },
    },
    {
      label: 'Verification Status',
      icon: ShieldCheckIcon,
      action: () => {
        navigate('/profile')
        setIsOpen(false)
      },
    },
  ]

  const getVerificationBadge = () => {
    if (user?.identityVerified && user?.driverVerified) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Verified
        </span>
      )
    } else if (user?.identityVerified || user?.driverVerified) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Partial
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Not Verified
        </span>
      )
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <UserCircleIcon className="w-6 h-6 text-white" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-slate-900">{user?.name || 'User'}</p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-slate-600 capitalize">{user?.role || 'passenger'}</p>
            {getVerificationBadge()}
          </div>
        </div>
        <ChevronDownIcon className={`w-4 h-4 text-slate-600 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          {/* Profile Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{user?.name || 'User'}</p>
                <p className="text-sm text-slate-600">{user?.email || 'user@example.com'}</p>
                <div className="mt-1">
                  {getVerificationBadge()}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <item.icon className="w-5 h-5 text-slate-600" />
                <span className="text-slate-900">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors rounded-lg text-red-600"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
