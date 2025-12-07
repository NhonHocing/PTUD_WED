import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!token.value)
  const isStaff = computed(() => user.value?.role === 'staff')
  const isReader = computed(() => user.value?.role === 'reader')

  // Set token and update axios default header
  function setToken(newToken) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } else {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    }
  }

  // Set user data
  function setUser(userData) {
    user.value = userData
  }

  // Login
  async function login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      const { data } = response.data
      setToken(data.token)
      setUser(data)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng nhập thất bại',
      }
    }
  }

  // Register
  async function register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      const { data } = response.data
      setToken(data.token)
      setUser(data)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng ký thất bại',
      }
    }
  }

  // Get current user
  async function fetchUser() {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.data)
      return { success: true }
    } catch (error) {
      logout()
      return { success: false }
    }
  }

  // Logout
  function logout() {
    setToken(null)
    setUser(null)
  }

  // Initialize - check if token exists and fetch user
  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    fetchUser()
  }

  return {
    user,
    token,
    isAuthenticated,
    isStaff,
    isReader,
    login,
    register,
    logout,
    fetchUser,
  }
})

