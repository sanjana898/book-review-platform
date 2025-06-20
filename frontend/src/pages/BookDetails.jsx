

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import api, {reviewsAPI} from "../services/api"
import ReviewCard from "../components/ReviewCard"
import ReviewForm from "../components/ReviewForm"
import { Star, Badge } from "lucide-react"
import toast from "react-hot-toast"

const BookDetails = () => {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookDetails()
    fetchReviews()
  }, [id])

  const fetchBookDetails = async () => {
    try {
      const response = await api.get(`/books/${id}`);
      setBook(response.data);
    } catch (error) {
      toast.error("Failed to fetch book details")
    }
  }

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewsAPI.getByBookId(id);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewAdded = () => {
    fetchReviews()
  }


  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Book not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Book Header */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
          </div>
          {book.featured && <Badge className="h-6 w-6 text-yellow-500" />}
        </div>

        <div className="flex items-center space-x-6 mb-6">
          <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-4 py-2 text-sm font-medium">
            {book.genre}
          </span>

          {book.rating && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(book.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{book.rating.toFixed(1)}</span>
              <span className="text-gray-500">({reviews.length} reviews)</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reviews Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>

        {/* Add Review Form */}
        <div>
          <ReviewForm bookId={id} onReviewAdded={handleReviewAdded} />
          {/* {reviews.map(r => <ReviewCard key={r._id} review={r} />)} */}
        </div>
      </div>
    </div>
  )
}

export default BookDetails
