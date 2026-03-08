import { useState } from 'react'
import { MapPinIcon } from '@heroicons/react/24/outline'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'

const vehicleTypes = ['Bike', 'Car', 'Auto', 'Van'].map((v) => ({ value: v, label: v }))

export default function PostRidePage() {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    date: '',
    time: '',
    vehicleType: '',
    seats: '',
    fare: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className="py-8">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Ride</h1>
          <p className="text-gray-600">Share your ride and earn while you travel</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Source"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="Where are you starting from?"
                  icon={MapPinIcon}
                  required
                />
                <Input
                  label="Destination"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="Where are you going?"
                  icon={MapPinIcon}
                  required
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                  <Input
                    label="Time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    label="Vehicle Type"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    options={vehicleTypes}
                    placeholder="Select"
                    required
                  />
                  <Input
                    label="Available Seats"
                    type="number"
                    min={1}
                    max={20}
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                    placeholder="e.g., 3"
                    required
                  />
                </div>
                <Input
                  label="Fare per Seat (₹)"
                  type="number"
                  min={1}
                  value={formData.fare}
                  onChange={(e) => setFormData({ ...formData, fare: e.target.value })}
                  placeholder="e.g., 150"
                  required
                />
                <Button type="submit" variant="primary" size="full">
                  Post Ride
                </Button>
              </form>
            </Card>
          </div>

          <div>
            <Card className="overflow-hidden sticky top-24" padding={false}>
              <div className="h-64 bg-gray-50 flex items-center justify-center">
                <div className="text-center p-4">
                  <MapPinIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">Map Placeholder</p>
                  <p className="text-sm text-gray-400">Route preview</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
