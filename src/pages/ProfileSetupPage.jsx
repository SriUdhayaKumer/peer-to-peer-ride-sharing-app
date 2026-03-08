import { useState } from 'react'
import { UserCircleIcon, PhotoIcon, IdentificationIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'

const vehicleTypes = ['Bike', 'Car', 'Auto', 'Van'].map((v) => ({ value: v, label: v }))

export default function ProfileSetupPage() {
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    vehicleType: '',
    seats: '',
    licenseNumber: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaved(true)
  }

  return (
    <div className="py-12">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Help others know more about you for a safer ride sharing experience</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-6 lg:p-8">
            {saved ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Saved Successfully!</h2>
                <p className="text-gray-600 mb-6">Your profile is now complete. You can start posting or finding rides.</p>
                <Button to="/dashboard" variant="primary" size="md">
                  Go to Dashboard
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  icon={UserCircleIcon}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary-300 transition-colors cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <PhotoIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">Click to upload profile photo</p>
                    <p className="text-sm text-gray-500 mt-1">JPG or PNG (max 2MB)</p>
                  </div>
                </div>
                <Select
                  label="Vehicle Type"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  options={vehicleTypes}
                  placeholder="Select vehicle type"
                />
                <Input
                  label="Number of Seats"
                  type="number"
                  min={1}
                  max={20}
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                  placeholder="e.g., 4"
                />
                <Input
                  label="License Number"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="e.g., DL01CA1234"
                  icon={IdentificationIcon}
                />
                <Button type="submit" variant="primary" size="full">
                  Save Profile
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
