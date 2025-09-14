import React, { useState, useEffect } from 'react';
import { movieAPI } from './services/api';
import { Search, Filter, Star, Heart, User, Home, Film, Plus, X, Calendar, Clock, Users, Play } from 'lucide-react';

// Interfaces
interface Movie {
  _id: string;
  title: string;
  genre: string;
  releaseYear: number;
  director?: string;
  cast?: string[];
  synopsis?: string;
  description?: string;
  posterUrl?: string;
  averageRating?: number;
  duration?: number;
  trailer?: string;
}

interface Review {
  _id: string;
  userId: string;
  movieId: string;
  rating: number;
  reviewText: string;
  timestamp: string;
  username: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  joinDate: string;
  watchlist: string[];
}

// Star Rating Component
const StarRating: React.FC<{ rating: number; onRate?: (rating: number) => void; readonly?: boolean }> = ({ 
  rating, 
  onRate, 
  readonly = false 
}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 cursor-pointer transition-colors ${
            star <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onRate && onRate(star)}
        />
      ))}
    </div>
  );
};

// Movie Card Component
const MovieCard: React.FC<{ 
  movie: Movie; 
  onMovieClick: (movie: Movie) => void;
  onWatchlistToggle: (movieId: string) => void;
  isInWatchlist: boolean;
}> = ({ movie, onMovieClick, onWatchlistToggle, isInWatchlist }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div onClick={() => onMovieClick(movie)}>
        <div className="h-64 bg-gray-200 relative">
          {movie.posterUrl ? (
            <img 
              src={movie.posterUrl} 
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Film className="w-16 h-16" />
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatchlistToggle(movie._id);
            }}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isInWatchlist ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
            } hover:scale-110 transition-transform`}
          >
            <Heart className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{movie.title}</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{movie.genre}</span>
            <span className="text-sm text-gray-500">{movie.releaseYear}</span>
          </div>
          {movie.averageRating && (
            <div className="flex items-center space-x-2">
              <StarRating rating={movie.averageRating} readonly />
              <span className="text-sm text-gray-600">({movie.averageRating.toFixed(1)})</span>
            </div>
          )}
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
            {movie.synopsis || movie.description}
          </p>
        </div>
      </div>
    </div>
  );
};

// Review Form Component
const ReviewForm: React.FC<{ 
  movie: Movie; 
  onSubmit: (rating: number, text: string) => void;
  onClose: () => void;
}> = ({ movie, onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit(rating, reviewText);
      setRating(0);
      setReviewText('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Review: {movie.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Rating</label>
            <StarRating rating={rating} onRate={setRating} />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Share your thoughts about this movie..."
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={rating === 0}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Movie Details Component
const MovieDetails: React.FC<{ 
  movie: Movie; 
  onClose: () => void;
  onReviewClick: () => void;
  onWatchlistToggle: (movieId: string) => void;
  isInWatchlist: boolean;
  reviews: Review[];
}> = ({ movie, onClose, onReviewClick, onWatchlistToggle, isInWatchlist, reviews }) => {
  const movieReviews = reviews.filter(r => r.movieId === movie._id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
        <div className="relative">
          {/* Header */}
          <div className="flex justify-between items-start p-6 border-b">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.releaseYear}</span>
                </span>
                {movie.duration && (
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{movie.duration} min</span>
                  </span>
                )}
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{movie.genre}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Poster */}
              <div className="md:col-span-1">
                <div className="aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden">
                  {movie.posterUrl ? (
                    <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Film className="w-16 h-16" />
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => onWatchlistToggle(movie._id)}
                    className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                      isInWatchlist 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
                    <span>{isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
                  </button>
                  
                  <button
                    onClick={onReviewClick}
                    className="w-full flex items-center justify-center space-x-2 bg-green-100 text-green-700 py-2 px-4 rounded-md hover:bg-green-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Write Review</span>
                  </button>
                  
                  {movie.trailer && (
                    <button className="w-full flex items-center justify-center space-x-2 bg-purple-100 text-purple-700 py-2 px-4 rounded-md hover:bg-purple-200">
                      <Play className="w-4 h-4" />
                      <span>Watch Trailer</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="md:col-span-2">
                {movie.averageRating && (
                  <div className="flex items-center space-x-2 mb-4">
                    <StarRating rating={movie.averageRating} readonly />
                    <span className="text-lg font-semibold">{movie.averageRating.toFixed(1)}/5</span>
                    <span className="text-gray-500">({movieReviews.length} reviews)</span>
                  </div>
                )}

                <div className="space-y-4">
                  {movie.director && (
                    <div>
                      <h4 className="font-semibold text-gray-700">Director</h4>
                      <p>{movie.director}</p>
                    </div>
                  )}

                  {movie.cast && movie.cast.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>Cast</span>
                      </h4>
                      <p>{movie.cast.join(', ')}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-700">Synopsis</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {movie.synopsis || movie.description || 'No synopsis available.'}
                    </p>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-8">
                  <h4 className="font-semibold text-gray-700 mb-4">Reviews ({movieReviews.length})</h4>
                  {movieReviews.length > 0 ? (
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {movieReviews.map((review) => (
                        <div key={review._id} className="border-l-4 border-blue-200 pl-4 py-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{review.username}</span>
                              <StarRating rating={review.rating} readonly />
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-600">{review.reviewText}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Profile Component
const UserProfile: React.FC<{ 
  user: User; 
  onClose: () => void;
  userReviews: Review[];
  watchlistMovies: Movie[];
  onMovieClick: (movie: Movie) => void;
}> = ({ user, onClose, userReviews, watchlistMovies, onMovieClick }) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'watchlist'>('reviews');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.username} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-gray-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-gray-600">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'reviews' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reviews ({userReviews.length})
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'watchlist' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Watchlist ({watchlistMovies.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'reviews' ? (
            <div className="space-y-4">
              {userReviews.length > 0 ? (
                userReviews.map((review) => (
                  <div key={review._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Movie Title</h4>
                      <div className="flex items-center space-x-2">
                        <StarRating rating={review.rating} readonly />
                        <span className="text-sm text-gray-500">
                          {new Date(review.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.reviewText}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reviews yet</p>
                  <p className="text-sm text-gray-400">Start watching movies and share your thoughts!</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {watchlistMovies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {watchlistMovies.map((movie) => (
                    <div
                      key={movie._id}
                      onClick={() => onMovieClick(movie)}
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-16 bg-gray-300 rounded flex-shrink-0">
                          {movie.posterUrl ? (
                            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover rounded" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Film className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium truncate">{movie.title}</h5>
                          <p className="text-sm text-gray-600">{movie.genre} • {movie.releaseYear}</p>
                          {movie.averageRating && (
                            <div className="flex items-center space-x-1 mt-1">
                              <StarRating rating={movie.averageRating} readonly />
                              <span className="text-xs text-gray-500">({movie.averageRating.toFixed(1)})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your watchlist is empty</p>
                  <p className="text-sm text-gray-400">Add movies you want to watch later!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  // State
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'movies' | 'profile'>('home');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal states
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewMovie, setReviewMovie] = useState<Movie | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  
  // Data states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<User>({
    _id: '1',
    username: 'MovieLover',
    email: 'movielover@example.com',
    joinDate: '2024-01-15',
    watchlist: []
  });

  // Get unique genres and years for filters
  const genres = [...new Set(movies.map(movie => movie.genre))];
  const years = [...new Set(movies.map(movie => movie.releaseYear))].sort((a, b) => b - a);

  // Featured movies (highest rated)
  const featuredMovies = movies
    .filter(movie => movie.averageRating && movie.averageRating >= 4.0)
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 6);

  // Trending movies (recent releases)
  const trendingMovies = movies
    .filter(movie => movie.releaseYear >= 2020)
    .sort((a, b) => b.releaseYear - a.releaseYear)
    .slice(0, 6);

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await movieAPI.getMovies();
        console.log('API Response:', response);
        
        let movieData: Movie[] = [];
        if (Array.isArray(response.data)) {
          movieData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          movieData = response.data.data;
        } else if (response.data && Array.isArray(response.data.movies)) {
          movieData = response.data.movies;
        }
        
        setMovies(movieData);
        setFilteredMovies(movieData);
      } catch (err: any) {
        console.error('API Error:', err);
        setError(`Failed to fetch movies: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Filter movies based on search and filters
  useEffect(() => {
    let filtered = movies;

    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter(movie => movie.genre === selectedGenre);
    }

    if (selectedYear) {
      filtered = filtered.filter(movie => movie.releaseYear.toString() === selectedYear);
    }

    if (minRating > 0) {
      filtered = filtered.filter(movie => (movie.averageRating || 0) >= minRating);
    }

    setFilteredMovies(filtered);
  }, [movies, searchTerm, selectedGenre, selectedYear, minRating]);

  // Event handlers
  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleReviewSubmit = (rating: number, text: string) => {
    if (reviewMovie) {
      const newReview: Review = {
        _id: Date.now().toString(),
        userId: user._id,
        movieId: reviewMovie._id,
        rating,
        reviewText: text,
        timestamp: new Date().toISOString(),
        username: user.username
      };
      
      setReviews([...reviews, newReview]);
      setShowReviewForm(false);
      setReviewMovie(null);
      
      // Update movie average rating (simple calculation)
      const movieReviews = reviews.filter(r => r.movieId === reviewMovie._id);
      const totalRating = movieReviews.reduce((sum, r) => sum + r.rating, 0) + rating;
      const newAverage = totalRating / (movieReviews.length + 1);
      
      setMovies(movies.map(movie => 
        movie._id === reviewMovie._id 
          ? { ...movie, averageRating: newAverage }
          : movie
      ));
    }
  };

  const handleWatchlistToggle = (movieId: string) => {
    const isInWatchlist = user.watchlist.includes(movieId);
    const newWatchlist = isInWatchlist
      ? user.watchlist.filter(id => id !== movieId)
      : [...user.watchlist, movieId];
    
    setUser({ ...user, watchlist: newWatchlist });
  };

  const handleWriteReview = (movie: Movie) => {
    setReviewMovie(movie);
    setShowReviewForm(true);
    setSelectedMovie(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSelectedYear('');
    setMinRating(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">CineReview</h1>
              <div className="hidden md:flex space-x-6">
                <button
                  onClick={() => setCurrentView('home')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'home' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => setCurrentView('movies')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'movies' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span>Movies</span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <Filter className="w-5 h-5" />
              </button>

              {/* User Profile */}
              <button
                onClick={() => setShowProfile(true)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-1">Genre</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Min Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Any Rating</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' ? (
          <>
            {/* Featured Movies */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Featured Movies</h2>
                <button 
                  onClick={() => setCurrentView('movies')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredMovies.map(movie => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    onMovieClick={handleMovieClick}
                    onWatchlistToggle={handleWatchlistToggle}
                    isInWatchlist={user.watchlist.includes(movie._id)}
                  />
                ))}
              </div>
            </section>

            {/* Trending Movies */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
                <button 
                  onClick={() => setCurrentView('movies')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingMovies.map(movie => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    onMovieClick={handleMovieClick}
                    onWatchlistToggle={handleWatchlistToggle}
                    isInWatchlist={user.watchlist.includes(movie._id)}
                  />
                ))}
              </div>
            </section>
          </>
        ) : (
          /* Movies View */
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Movies</h2>
              <span className="text-gray-600">{filteredMovies.length} movies found</span>
            </div>

            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredMovies.map(movie => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    onMovieClick={handleMovieClick}
                    onWatchlistToggle={handleWatchlistToggle}
                    isInWatchlist={user.watchlist.includes(movie._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No movies found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Modals */}
      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onReviewClick={() => handleWriteReview(selectedMovie)}
          onWatchlistToggle={handleWatchlistToggle}
          isInWatchlist={user.watchlist.includes(selectedMovie._id)}
          reviews={reviews}
        />
      )}

      {showReviewForm && reviewMovie && (
        <ReviewForm
          movie={reviewMovie}
          onSubmit={handleReviewSubmit}
          onClose={() => {
            setShowReviewForm(false);
            setReviewMovie(null);
          }}
        />
      )}

      {showProfile && (
        <UserProfile
          user={user}
          onClose={() => setShowProfile(false)}
          userReviews={reviews.filter(r => r.userId === user._id)}
          watchlistMovies={movies.filter(m => user.watchlist.includes(m._id))}
          onMovieClick={handleMovieClick}
        />
      )}
    </div>
  );
}

export default App;