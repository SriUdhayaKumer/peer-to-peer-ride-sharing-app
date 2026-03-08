import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline'
import RideCard from '../components/RideCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import { rideService } from '../services/rideService'

const vehicleFilters = [
  { value: 'All', label: 'All' },
  { value: 'Bike', label: 'Bike' },
  { value: 'Car', label: 'Car' },
  { value: 'Auto', label: 'Auto' },
  { value: 'Van', label: 'Van' },
]

export default function SearchRidePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [rides, setRides] = useState([])
  const [filters, setFilters] = useState({
    source: '',
    destination: '',
    date: '',
    vehicleFilter: 'All',
  })

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // If no filters are provided, search for all rides
      const searchParams = {
        source: filters.source || undefined,
        destination: filters.destination || undefined,
        date: filters.date || undefined,
        vehicleType: filters.vehicleFilter === 'All' ? undefined : filters.vehicleFilter
      }
      
      console.log('🔍 Searching with params:', searchParams)
      
      const result = await rideService.searchRides(searchParams)
      
      if (result.success) {
        setRides(result.rides)
        console.log(`✅ Found ${result.rides.length} rides`)
      } else {
        alert('Failed to search rides. Please try again.')
        setRides([])
      }
    } catch (error) {
      console.error('❌ Search error:', error)
      alert('Error searching rides. Please try again.')
      setRides([])
    } finally {
      setLoading(false)
    }
  }

  const handleShowAllRides = async () => {
    console.log('🔍 Loading all rides...')
    setLoading(true)
    
    try {
      // Search without any filters
      const result = await rideService.searchRides({})
      
      console.log('📊 Search result:', result)
      
      if (result.success) {
        setRides(result.rides)
        console.log(`✅ Found ${result.rides.length} all rides`)
        console.log('📝 Ride data:', result.rides)
      } else {
        console.error('❌ Search failed:', result)
        alert(`Failed to load rides: ${result.message || 'Unknown error'}`)
        setRides([])
      }
    } catch (error) {
      console.error('❌ Error loading all rides:', error)
      alert(`Error loading rides: ${error.message}`)
      setRides([])
    } finally {
      setLoading(false)
    }
  }

  const handleShowMyRides = () => {
    navigate('/my-rides')
  }

  const handleRideClick = (ride) => {
    console.log('🔍 Ride clicked:', ride._id)
    navigate(`/ride-view/${ride._id}`)
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
                  placeholder="Where are you starting from?"
                  icon={MapPinIcon}
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Destination"
                  value={filters.destination}
                  onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                  placeholder="Where are you going?"
                  icon={MapPinIcon}
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
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
                  label="Vehicle Type"
                  value={filters.vehicleFilter}
                  onChange={(e) => setFilters({ ...filters, vehicleFilter: e.target.value })}
                  options={vehicleFilters}
                />
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-6 flex-wrap">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  'Search Rides'
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleShowAllRides}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Loading...
                  </>
                ) : (
                  'Show All Rides'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleShowMyRides}
                disabled={loading}
              >
                My Rides
              </Button>
            </div>
          </Card>
        </form>

        <div className="space-y-4">
          {loading ? (
            <LoadingSkeleton />
          ) : rides.length > 0 ? (
            rides.map((ride) => (
              <RideCard
                key={ride._id}
                ride={ride}
                onClick={handleRideClick}
              />
            ))
          ) : (
            <Card className="text-center py-12">
              <p className="text-gray-600">No rides found matching your criteria.</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your search filters or dates.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
