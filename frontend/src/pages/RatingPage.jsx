import { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid, CheckCircleIcon } from '@heroicons/react/24/solid'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function RatingPage() {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="py-16 flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md mx-auto px-4">
          <Card className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
            <p className="text-gray-600 mb-8">Your feedback helps us improve. We appreciate your time.</p>
            <Button to="/dashboard" variant="primary" size="full">
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Rate Your Ride</h1>
            <p className="text-gray-600">How was your experience with Rahul Sharma?</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Your Rating</label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      {(hoverRating || rating) >= star ? (
                        <StarIconSolid className="w-12 h-12 text-amber-400" />
                      ) : (
                        <StarIcon className="w-12 h-12 text-gray-300" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  {rating === 0 ? 'Tap to rate' : `${rating} out of 5`}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Feedback (optional)</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  placeholder="Share your experience..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              <Button type="submit" variant="primary" size="full">
                Submit
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
