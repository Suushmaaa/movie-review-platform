# 🎬 Movie Review Platform

A comprehensive full-stack movie review application built with React, Node.js, Express, and MongoDB. Users can browse movies, write reviews, maintain watchlists, and discover new films through an intuitive interface.

![Movie Review Platform](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Movie+Review+Platform)

## ✨ Features

### 🎭 User Features
- **Browse & Search**: Discover movies with advanced search and filtering
- **Movie Details**: View comprehensive movie information, cast, and trailers
- **Reviews & Ratings**: Read and write detailed movie reviews with 5-star ratings
- **Personal Watchlist**: Save movies to watch later
- **User Profiles**: Manage profile and view review history
- **Responsive Design**: Seamless experience across all devices

### 🛠️ Technical Features
- **Authentication**: Secure JWT-based user authentication
- **Real-time Updates**: Dynamic content updates
- **Pagination**: Efficient data loading with pagination
- **Input Validation**: Comprehensive client and server-side validation
- **Error Handling**: Robust error handling throughout the application
- **TMDB Integration**: Optional integration with The Movie Database API

## 🚀 Technology Stack

### Frontend
- **React 18** with Hooks and Context API
- **React Router DOM** for navigation
- **Axios** for API communication
- **Tailwind CSS** for responsive styling
- **React Hook Form** for form management
- **React Query** for server state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Joi** for input validation
- **CORS** for cross-origin requests

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **MongoDB** (v5.0 or higher) - Local installation or MongoDB Atlas account
- **Git** for version control

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/movie-review-platform.git
cd movie-review-platform
```

### 2. Install Root Dependencies

```bash
npm install
```

### 3. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/moviereview

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRE=7d

# TMDB API (Optional - for movie data)
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3

# File Upload
MAX_FILE_SIZE=1000000
FILE_UPLOAD_PATH=./public/uploads

# Email Configuration (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@moviereview.com
FROM_NAME=Movie Review Platform
```

### 4. Frontend Setup

Navigate to the client directory and install dependencies:

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BASE_URL=http://localhost:3000

# TMDB API (Optional)
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500

# App Configuration
REACT_APP_NAME=Movie Review Platform
REACT_APP_VERSION=1.0.0
```

### 5. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb/brew/mongodb-community
   
   # On Windows
   net start MongoDB
   
   # On Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/moviereview?retryWrites=true&w=majority
   ```

### 6. Seed Initial Data (Optional)

To populate your database with sample data:

```bash
cd server
npm run seed
```

## 🚀 Running the Application

### Development Mode

From the root directory:

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately:
# Backend only
npm run server

# Frontend only
npm run client
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs (if Swagger is implemented)

### Production Mode

```bash
# Build the frontend
cd client
npm run build

# Start the production server
cd ../server
npm start
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/updateprofile` | Update user profile | Yes |
| PUT | `/api/auth/updatepassword` | Update password | Yes |

### Movie Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/movies` | Get all movies | No |
| GET | `/api/movies/:id` | Get movie by ID | No |
| POST | `/api/movies` | Create new movie | Admin |
| PUT | `/api/movies/:id` | Update movie | Admin |
| DELETE | `/api/movies/:id` | Delete movie | Admin |
| GET | `/api/movies/search` | Search movies | No |
| GET | `/api/movies/featured` | Get featured movies | No |

### Review Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/movies/:movieId/reviews` | Get movie reviews | No |
| POST | `/api/movies/:movieId/reviews` | Create review | Yes |
| PUT | `/api/reviews/:id` | Update review | Yes (Owner) |
| DELETE | `/api/reviews/:id` | Delete review | Yes (Owner/Admin) |
| POST | `/api/reviews/:id/helpful` | Mark review helpful | Yes |

### User & Watchlist Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/:id` | Get user profile | No |
| GET | `/api/users/:id/reviews` | Get user reviews | No |
| GET | `/api/users/me/watchlist` | Get user watchlist | Yes |
| POST | `/api/users/me/watchlist` | Add to watchlist | Yes |
| DELETE | `/api/users/me/watchlist/:movieId` | Remove from watchlist | Yes |

### Query Parameters for Movies

```
GET /api/movies?page=1&limit=10&genre=action&year=2023&sort=-rating&search=batman
```

| Parameter | Description | Example |
|-----------|-------------|---------|
| `page` | Page number | `1` |
| `limit` | Items per page | `10` |
| `genre` | Filter by genre | `action` |
| `year` | Filter by release year | `2023` |
| `sort` | Sort criteria | `-rating` (desc), `title` (asc) |
| `search` | Search in title/description | `batman` |
| `rating` | Minimum rating | `4` |

### Request/Response Examples

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Create Review
```bash
POST /api/movies/60d5ecb74d4b2a001f5e4b1a/reviews
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "rating": 4,
  "reviewText": "Great movie with excellent cinematography!"
}
```

#### Search Movies
```bash
GET /api/movies?search=inception&genre=sci-fi&sort=-rating&page=1&limit=5
```

## 🗄️ Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  username: String (required, unique, 3-50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  profilePicture: String (URL),
  bio: String (max 500 chars),
  isAdmin: Boolean (default: false),
  watchlist: [ObjectId] (references Movie),
  createdAt: Date,
  updatedAt: Date
}
```

### Movie Model
```javascript
{
  _id: ObjectId,
  title: String (required, 1-200 chars),
  genre: [String] (required),
  releaseYear: Number (1900-current year),
  director: String,
  cast: [String],
  synopsis: String (max 2000 chars),
  posterUrl: String (URL),
  trailerUrl: String (URL),
  duration: Number (minutes),
  language: String,
  country: String,
  averageRating: Number (0-5, default: 0),
  totalReviews: Number (default: 0),
  tmdbId: Number (optional),
  featured: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (required, ref: 'User'),
  movie: ObjectId (required, ref: 'Movie'),
  rating: Number (required, 1-5),
  reviewText: String (max 2000 chars),
  helpful: [ObjectId] (users who found helpful),
  helpfulCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Environment Variables

### Server Environment Variables

Create a `.env` file in the `server` directory:

```env
# Required Variables
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/moviereview
JWT_SECRET=your_jwt_secret_key_here

# Optional Variables
JWT_EXPIRE=7d
TMDB_API_KEY=your_tmdb_api_key
MAX_FILE_SIZE=1000000
FILE_UPLOAD_PATH=./public/uploads

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@moviereview.com
FROM_NAME=Movie Review Platform

# Security (Production)
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### Client Environment Variables

Create a `.env` file in the `client` directory:

```env
# Required Variables
REACT_APP_API_URL=http://localhost:5000/api

# Optional Variables
REACT_APP_TMDB_API_KEY=your_tmdb_api_key
REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
REACT_APP_BASE_URL=http://localhost:3000
REACT_APP_NAME=Movie Review Platform
```

## 🎨 Design Decisions & Architecture

### Frontend Architecture

1. **State Management**: Using React Context API for global state (user authentication, theme)
2. **Component Structure**: Organized by feature (movies, reviews, users) with shared components
3. **Styling**: Tailwind CSS for consistent, responsive design
4. **Form Handling**: React Hook Form for efficient form management
5. **Error Boundaries**: Implemented to catch and handle React errors gracefully

### Backend Architecture

1. **MVC Pattern**: Controllers for business logic, models for data structure, routes for endpoints
2. **Middleware**: Authentication, error handling, validation, and logging middleware
3. **Security**: JWT authentication, bcrypt password hashing, input sanitization
4. **Database**: MongoDB with Mongoose for object modeling and validation
5. **Error Handling**: Centralized error handling with custom error classes

### Performance Optimizations

1. **Pagination**: Implemented for movies and reviews to reduce load times
2. **Lazy Loading**: Components and images loaded on demand
3. **Caching**: Server-side caching for frequently accessed data
4. **Image Optimization**: Optimized image sizes and formats
5. **Database Indexing**: Proper indexing on frequently queried fields

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# Coverage report
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Complete user flow testing

## 🚀 Deployment

### Production Environment Setup

1. **Environment Variables**: Update production URLs and secrets
2. **Database**: Use MongoDB Atlas or production MongoDB instance
3. **SSL/TLS**: Configure HTTPS certificates
4. **Process Manager**: Use PM2 for Node.js process management

### Deployment Options

#### Option 1: Heroku
```bash
# Install Heroku CLI
# Create Heroku app
heroku create movie-review-app

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_production_db_uri
heroku config:set JWT_SECRET=your_production_jwt_secret

# Deploy
git push heroku main
```

#### Option 2: Vercel (Frontend) + Railway (Backend)
- Deploy React app to Vercel
- Deploy Node.js API to Railway
- Update environment variables accordingly

#### Option 3: AWS/Digital Ocean
- Use Docker containers for consistent deployment
- Configure load balancing and auto-scaling

### Docker Support (Optional)

Create `Dockerfile` in root:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/moviereview
    depends_on:
      - mongo
  mongo:
    image: mongo:5.0
    volumes:
      - mongo-data:/data/db
    ports:
      - "27017:27017"
volumes:
  mongo-data:
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   - Ensure MongoDB is running
   - Check connection string format
   - Verify network access for Atlas

2. **CORS Errors**
   - Verify CORS configuration in server
   - Check API URL in client environment variables

3. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Verify token format in requests

4. **File Upload Issues**
   - Check file size limits
   - Verify upload directory permissions
   - Ensure multer configuration

### Debug Mode

Enable debug logging:

```bash
# Server debug mode
DEBUG=app:* npm run dev

# Client debug mode
REACT_APP_DEBUG=true npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use ESLint and Prettier for code formatting
- Follow conventional commit messages
- Write descriptive variable and function names
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 📞 Support

For support and questions:

- **Email**: sushmarachakonda98@gmail.com
- **Documentation**: [API Docs](http://localhost:5000/api-docs)
- **Issues**: [GitHub Issues](https://github.com/yourusername/movie-review-platform/issues)

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie data and images
- [React](https://reactjs.org/) for the amazing frontend framework
- [Express.js](https://expressjs.com/) for the robust backend framework
- [MongoDB](https://www.mongodb.com/) for the flexible database solution
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

**Made with ❤️ for movie enthusiasts**

## 📈 Roadmap

### Version 2.0 (Future Features)
- [ ] Advanced recommendation system using ML
- [ ] Social features (follow users, activity feed)
- [ ] Movie discussions and forums
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Real-time notifications
- [ ] Movie streaming integration
- [ ] Advanced search with filters
