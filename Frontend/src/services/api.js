import axios from 'axios'

// Use environment variable for API URL
// In production (Vercel), this should be set to your Render backend URL
// In development, fallback to relative path which will use Vite proxy
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL
  
  // If VITE_API_URL is set, use it (production)
  if (envUrl) {
    // Remove trailing slash if exists
    return envUrl.replace(/\/$/, '')
  }
  
  // Development: use relative path (will be proxied by Vite)
  return '/api'
}

const API_URL = getApiUrl()

// Log API URL in development to help debug
if (import.meta.env.DEV) {
  console.log('🔗 API URL:', API_URL)
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

