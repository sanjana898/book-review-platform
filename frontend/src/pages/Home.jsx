
import { useState, useEffect } from "react"
import { booksAPI } from "../services/api"
import BookCard from "../components/BookCard"
import { Search, Star, User } from "lucide-react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [activeFilter, setActiveFilter] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [popularBooks, setPopularBooks] = useState([])
  const [pagination, setPagination] = useState({
  page: 1,
  totalPages: 1,
  total: 0,
});



  const genres = ["Fiction", "Dystopian", "Romance", "Mystery", "Sci-Fi", "Fantasy", "Biography", "History"]
  const quickFilters = [
    { label: "Popular", value: "popular" },
    { label: "Featured", value: "featured" },
    { label: "Highest Rated", value: "rating" },
    { label: "Recent", value: "recent" },
    { label: "Fiction", value: "fiction" },
  ]

  useEffect(() => {
    fetchPopularBooks()
  }, [])




  const fetchPopularBooks = async () => {
  try {
    const res = await fetch(
      'https://openlibrary.org/search.json?subject=bestseller&limit=6'
    );
    const data = await res.json();
    setPopularBooks(data.docs || []);
  } catch (error) {
    console.error('Error fetching popular books:', error);
  }
};

const fetchBooks = async () => {
  setLoading(true);
  try {
    const params = { page: pagination.page, limit: 12 };

    if (selectedGenre) {
      params.genre = selectedGenre;
    }

    const response = await booksAPI.getAll(params);
    setBooks(response.data.books);
    setPagination({
      page: response.data.page,
      totalPages: response.data.totalPages,
      total: response.data.total,
    });
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  fetchBooks();
}, [searchTerm, selectedGenre, activeFilter, pagination.page]);


  const handleSearch = async () => {
    if (!searchTerm.trim() && !selectedGenre && !activeFilter) {
      toast.error("Please enter a search term or select a filter")
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const params = {
        limit: 12,
        page: 1,
      }

      if (searchTerm.trim()) {
        // For title search, we'll use a simple approach since the backend expects exact matches
        params.title = searchTerm.trim()
      }

      if (selectedGenre) {
        params.genre = selectedGenre
      }

      // Handle quick filters
      switch (activeFilter) {
        case "popular":
        case "rating":
          params.sort = "-rating"
          break
        case "featured":
          params.featured = true
          break
        case "recent":
          params.sort = "-createdAt"
          break
        case "fiction":
          params.genre = "Fiction"
          break
      }

      const response = await booksAPI.getAll(params)
      setBooks(response.data.books || [])
    } catch (error) {
      toast.error("Failed to search books")
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleQuickFilter = (filterValue) => {
    setActiveFilter(filterValue === activeFilter ? "" : filterValue)
    setSearchTerm("")
    setSelectedGenre("")
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 text-yellow-400 fill-current opacity-50" />)
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLoginClick = () => navigate("/login");

  



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-end items-center">
          {isAuthenticated && user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center space-x-2 hover:underline"
              >
                <User className="h-6 w-6 text-gray-700" />
                <span className="font-medium text-gray-800 ml-2">
                  {user.name}
                </span>
              </Link>

              <button
                onClick={logout}
                className="ml-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLoginClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Find Your Next Great Read
        </h1>

        {/* Search Section */}
        <section className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
              value={selectedGenre}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedGenre(val);
                setPagination((prev) => ({ ...prev, page: 1 })); // 💡 Reset to page 1
              }}
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleQuickFilter(filter.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        {/* Results Section */}
        <section className="bg-white rounded-lg shadow-sm border p-8">
          {!hasSearched ? (
            <div className="text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Start your search above
              </h3>
              <p className="text-gray-600 mb-8">
                Enter a book title, author name, or choose a genre to get
                started
              </p>

              <h4 className="text-lg font-semibold text-gray-700 mb-6">
                Popular Books
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularBooks.length > 0 ? (
                  popularBooks.map((book) => (
                    <div
                      key={book.key}
                      className="border p-4 rounded-lg bg-white shadow-sm"
                    >
                      {book.cover_i ? (
                        <img
                          src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                          alt={book.title}
                          className="mb-2 w-full h-40 object-cover rounded"
                        />
                      ) : (
                        <div className="mb-2 w-full h-40 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-sm">
                            No Cover
                          </span>
                        </div>
                      )}
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {book.author_name?.[0] || "Unknown Author"}
                      </p>
                      {book.first_publish_year && (
                        <p className="text-xs text-gray-500 mt-1">
                          Published: {book.first_publish_year}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500">
                    No popular books available
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Searching...</p>
                </div>
              ) : books.length > 0 ? (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Found {books.length} book{books.length !== 1 ? "s" : ""}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.map((book) => (
                      <Link
                        key={book._id}
                        to={`/books/${book._id}`}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-500 transition-all cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                            {book.title}
                          </h4>
                          {book.featured && (
                            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          by {book.author}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700">
                            {book.genre}
                          </span>
                          {book.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">
                                {book.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No books found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or browse our popular books
                    below
                  </p>
                  <button
                    onClick={() => {
                      setHasSearched(false);
                      setSearchTerm("");
                      setSelectedGenre("");
                      setActiveFilter("");
                      setBooks([]);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Browse Popular Books
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home




