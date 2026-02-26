import { useState } from 'react'
import { MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline'
import RideCard from '../components/RideCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import { sampleRideListings } from '../data/dummyData'

const vehicleFilters = [
  { value: 'All', label: 'All' },
  { value: 'Bike', label: 'Bike' },
  { value: 'Car', label: 'Car' },
  { value: 'Auto', label: 'Auto' },
  { value: 'Van', label: 'Van' },
]

export default function SearchRidePage() {
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    source: '',
    destination: '',
    date: '',
    vehicleFilter: 'All',
  })

  const filteredRides = sampleRideListings.filter((ride) => {
    if (filters.vehicleFilter !== 'All' && ride.vehicleType !== filters.vehicleFilter)
      return false
    return true
  })

  const handleSearch = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 800)
  }

  return (
    <div className="py-8">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a ride</h1>
          <p className="text-gray-600">Search for available rides on your route</p>
        </div>

        <form onSubmit={handleSearch}>
          <Card className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
              <div className="flex-1">
                <Input
                  label="Source"
                  value={filters.source}
                  onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                  placeholder="From"
                  icon={MapPinIcon}
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Destination"
                  value={filters.destination}
                  onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                  placeholder="To"
                  icon={MapPinIcon}
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Date"
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  icon={CalendarIcon}
                />
              </div>
              <div className="flex-1">
                <Select
                  label="Vehicle"
                  value={filters.vehicleFilter}
                  onChange={(e) => setFilters({ ...filters, vehicleFilter: e.target.value })}
                  options={vehicleFilters}
                />
              </div>
              <Button type="submit" variant="primary" size="md">
                Search
              </Button>
            </div>
          </Card>
        </form>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Available Rides ({filteredRides.length})
          </h2>
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <LoadingSkeleton key={i} type="card" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredRides.map((ride) => (
                <RideCard key={ride.id} ride={ride} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
