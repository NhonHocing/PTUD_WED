<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          Chào mừng, {{ authStore.user?.fullName || 'Quản trị viên' }}!
        </h1>
        <p class="text-gray-600">Quản lý và theo dõi hoạt động thư viện</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
        <p class="text-gray-600 mt-4">Đang tải dữ liệu...</p>
      </div>

      <div v-else>
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Books -->
          <router-link to="/admin/books" class="card hover:shadow-hover transition-all duration-300 group cursor-pointer">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm text-gray-600 mb-1 font-medium">Tổng sách</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.totalBooks }}</p>
                <p class="text-xs text-gray-500 mt-1">Trong kho</p>
              </div>
              <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                <BookOpenIcon class="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </router-link>

          <!-- Pending Requests -->
          <div class="card hover:shadow-hover transition-all duration-300 group cursor-pointer border-2 border-yellow-200">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm text-gray-600 mb-1 font-medium">Yêu cầu chờ</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.pendingRequests }}</p>
                <p class="text-xs text-yellow-600 mt-1 font-semibold" v-if="stats.pendingRequests > 0">
                  Cần xử lý ngay
                </p>
                <p class="text-xs text-gray-500 mt-1" v-else>Đã xử lý hết</p>
              </div>
              <div class="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                <ClockIcon class="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <!-- Borrowed Books -->
          <div class="card hover:shadow-hover transition-all duration-300 group cursor-pointer">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm text-gray-600 mb-1 font-medium">Đang mượn</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.borrowedBooks }}</p>
                <p class="text-xs text-gray-500 mt-1">Sách đang cho mượn</p>
              </div>
              <div class="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                <CheckCircleIcon class="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <!-- Total Readers -->
          <div class="card hover:shadow-hover transition-all duration-300 group cursor-pointer">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm text-gray-600 mb-1 font-medium">Độc giả</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.totalReaders }}</p>
                <p class="text-xs text-gray-500 mt-1">Tổng số độc giả</p>
              </div>
              <div class="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                <UserGroupIcon class="w-8 h-8 text-accent-600" />
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content: Requests & Stats -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Yêu cầu duyệt sách (2/3 width) -->
          <div class="lg:col-span-2">
            <AdminRequestsView />
          </div>

          <!-- Thống kê và thông tin (1/3 width) -->
          <div class="space-y-6">
            <!-- Quick Stats -->
            <div class="card">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <ChartBarIcon class="w-6 h-6 text-primary-600" />
                </div>
                <h2 class="text-xl font-bold text-gray-900">Thống kê nhanh</h2>
              </div>
              <div class="space-y-4">
                <div class="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <p class="text-sm text-blue-700 mb-1 font-medium">Sách có sẵn</p>
                  <p class="text-2xl font-bold text-blue-900">{{ stats.availableBooks || 0 }}</p>
                </div>
                <div class="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <p class="text-sm text-green-700 mb-1 font-medium">Đã trả hôm nay</p>
                  <p class="text-2xl font-bold text-green-900">{{ stats.returnedToday || 0 }}</p>
                </div>
                <div class="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <p class="text-sm text-purple-700 mb-1 font-medium">Yêu cầu đã duyệt</p>
                  <p class="text-2xl font-bold text-purple-900">{{ stats.approvedRequests || 0 }}</p>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="card">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <BoltIcon class="w-6 h-6 text-primary-600" />
                </div>
                <h2 class="text-xl font-bold text-gray-900">Thao tác nhanh</h2>
              </div>
              <div class="space-y-2">
                <router-link
                  to="/admin/books"
                  class="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg hover:from-primary-100 hover:to-primary-200 transition-all duration-200 cursor-pointer font-medium group"
                >
                  <BookOpenIcon class="w-5 h-5 text-primary-600 group-hover:scale-110 transition-transform" />
                  <span class="text-sm text-gray-900">Quản lý sách</span>
                </router-link>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="card">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                  <BoltIcon class="w-6 h-6 text-accent-600" />
                </div>
                <h2 class="text-xl font-bold text-gray-900">Hoạt động gần đây</h2>
              </div>
              <div class="space-y-3">
                <div v-if="recentActivity.length > 0">
                  <div
                    v-for="(activity, index) in recentActivity.slice(0, 5)"
                    :key="index"
                    class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div class="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                      <p class="text-xs text-gray-500">{{ activity.time }}</p>
                    </div>
                  </div>
                </div>
                <p v-else class="text-sm text-gray-500 text-center py-4">Chưa có hoạt động</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'
import AdminRequestsView from './AdminRequestsView.vue'
import { 
  BookOpenIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  UserGroupIcon,
  ChartBarIcon,
  BoltIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const loading = ref(true)
const stats = ref({
  totalBooks: 0,
  pendingRequests: 0,
  borrowedBooks: 0,
  totalReaders: 0,
  availableBooks: 0,
  returnedToday: 0,
  approvedRequests: 0,
})
const recentActivity = ref([])
const allRequests = ref([])
const allSlips = ref([])

const fetchStats = async () => {
  loading.value = true
  try {
    // Fetch all data in parallel
    const [booksRes, requestsRes, allRequestsRes, slipsRes, allSlipsRes, readersRes] = await Promise.all([
      api.get('/books?limit=1000').catch(() => ({ data: { pagination: { total: 0 }, data: [] } })),
      api.get('/borrow-requests?status=pending').catch(() => ({ data: { data: [] } })),
      api.get('/borrow-requests').catch(() => ({ data: { data: [] } })),
      api.get('/borrow-slips?status=borrowed').catch(() => ({ data: { data: [] } })),
      api.get('/borrow-slips').catch(() => ({ data: { data: [] } })),
      api.get('/users/readers').catch(() => ({ data: { data: [] } })),
    ])
    
    allRequests.value = allRequestsRes.data.data || []
    allSlips.value = allSlipsRes.data.data || []
    
    // Calculate available books - get all books to calculate total available
    const books = booksRes.data.data || []
    const availableBooks = books.reduce((sum, book) => sum + (book.availableCopies || 0), 0)
    
    // Calculate returned today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const returnedToday = (allSlips.value || []).filter(slip => {
      if (!slip.actualReturnDate) return false
      const returnDate = new Date(slip.actualReturnDate)
      returnDate.setHours(0, 0, 0, 0)
      return returnDate.getTime() === today.getTime() && slip.status === 'returned'
    }).length
    
    // Calculate approved requests
    const approvedRequests = (allRequests.value || []).filter(r => r.status === 'approved').length
    
    stats.value = {
      totalBooks: booksRes.data.pagination?.total || booksRes.data.total || 0,
      pendingRequests: (requestsRes.data.data || []).length,
      borrowedBooks: (slipsRes.data.data || []).length,
      totalReaders: (readersRes.data.data || []).length,
      availableBooks,
      returnedToday,
      approvedRequests,
    }
    
    // Generate recent activity
    generateRecentActivity()
  } catch (error) {
    console.error('Error fetching stats:', error)
    stats.value = {
      totalBooks: 0,
      pendingRequests: 0,
      borrowedBooks: 0,
      totalReaders: 0,
      availableBooks: 0,
      returnedToday: 0,
      approvedRequests: 0,
    }
  } finally {
    loading.value = false
  }
}

const generateRecentActivity = () => {
  const activities = []
  
  // Add recent requests
  const recentRequests = (allRequests.value || [])
    .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
    .slice(0, 3)
    .map(req => ({
      title: `Yêu cầu mượn: ${req.book?.title || 'N/A'}`,
      time: formatTimeAgo(req.requestDate),
    }))
  
  // Add recent returns
  const recentReturns = (allSlips.value || [])
    .filter(s => s.status === 'returned' && s.actualReturnDate)
    .sort((a, b) => new Date(b.actualReturnDate) - new Date(a.actualReturnDate))
    .slice(0, 2)
    .map(slip => ({
      title: `Đã trả: ${slip.book?.title || 'N/A'}`,
      time: formatTimeAgo(slip.actualReturnDate),
    }))
  
  activities.push(...recentRequests, ...recentReturns)
  recentActivity.value = activities.sort((a, b) => {
    // Simple sort - in real app, would use actual timestamps
    return 0
  }).slice(0, 5)
}

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Vừa xong'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Vừa xong'
  if (diffMins < 60) return `${diffMins} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  if (diffDays < 7) return `${diffDays} ngày trước`
  return date.toLocaleDateString('vi-VN')
}

onMounted(() => {
  fetchStats()
})
</script>

