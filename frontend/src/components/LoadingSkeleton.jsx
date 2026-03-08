import Card from './ui/Card'

export default function LoadingSkeleton({ type = 'card' }) {
  if (type === 'card') {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-4 mb-4">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
          <div className="h-12 w-full bg-gray-200 rounded-xl" />
        </div>
      </Card>
    )
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  return <div className="w-full h-32 bg-gray-200 rounded-2xl animate-pulse" />
}
