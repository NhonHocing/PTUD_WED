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

// Log API URL to help debug (both dev and production)
console.log('🔗 API Base URL:', API_URL)
console.log('🔗 VITE_API_URL env:', import.meta.env.VITE_API_URL || 'Not set')

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
    // Log error details for debugging
    if (error.response) {
      // Server responded with error
      console.error('❌ API Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        message: error.response.data?.message || error.message,
      })
    } else if (error.request) {
      // Request was made but no response received
      console.error('❌ Network Error:', {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        message: 'No response from server. Check if backend is running and CORS is configured.',
      })
    } else {
      // Something else happened
      console.error('❌ Request Error:', error.message)
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

