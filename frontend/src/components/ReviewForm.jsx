import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { reviewsAPI } from "../services/api"
import toast from "react-hot-toast"
import { Star } from "lucide-react"

const ReviewForm = ({ bookId, onReviewAdded }) => {
  const { user, isAuthenticated } = useAuth()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast.error("Please login to add a review")
      return
    }

    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }

    setLoading(true)
    try {
      const reviewData = {
        bookId,
        userId: user._id,
        rating,
        comment: comment.trim(),
      }

      await reviewsAPI.create(bookId, reviewData)
      toast.success("Review added successfully!")

      

      // Reset form
      setRating(0)
      setComment("")

      // Notify parent component
      if (onReviewAdded) {
        onReviewAdded()
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add review")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">Please login to add a review</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Add Your Review</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }, (_, i) => (
            <button key={i} type="button" onClick={() => setRating(i + 1)} className="focus:outline-none">
              <Star
                className={`h-6 w-6 ${
                  i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                } hover:text-yellow-400 transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Comment (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Share your thoughts about this book..."
        />
      </div>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Adding Review..." : "Add Review"}
      </button>
    </form>
  )
}

export default ReviewForm
