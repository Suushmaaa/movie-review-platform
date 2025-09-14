import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust if backend port differs

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor for auth token if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
};

// Movie endpoints
export const movieAPI = {
  getMovies: (params?: any) => api.get('/movies', { params }),
  getMovie: (id: string) => api.get(`/movies/${id}`),
  createMovie: (data: any) => api.post('/movies', data),
  updateMovie: (id: string, data: any) => api.put(`/movies/${id}`, data),
  deleteMovie: (id: string) => api.delete(`/movies/${id}`),
};

// Review endpoints
export const reviewAPI = {
  getReviews: (movieId: string) => api.get(`/reviews?movieId=${movieId}`),
  createReview: (data: any) => api.post('/reviews', data),
  updateReview: (id: string, data: any) => api.put(`/reviews/${id}`, data),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
};

export default api;
