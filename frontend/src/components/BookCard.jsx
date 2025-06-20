import { Link } from "react-router-dom"
import { Star, Badge } from "lucide-react"

const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
          {book.featured && <Badge className="h-4 w-4 text-yellow-500" />}
        </div>

        <p className="text-gray-600 mb-2">by {book.author}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700">{book.genre}</span>

          {book.rating && (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{book.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <Link
          to={`/books/${book._id}`}
          className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default BookCard
