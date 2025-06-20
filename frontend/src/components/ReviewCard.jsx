import { Star } from "lucide-react"

const ReviewCard = ({ review }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {renderStars(review.rating)}
          <span className="text-sm font-medium">{review.rating}/5</span>
        </div>
        <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
      </div>

      {review.comment && <p className="text-gray-700 text-sm">{review.comment}</p>}
    </div>
  )
}

export default ReviewCard
