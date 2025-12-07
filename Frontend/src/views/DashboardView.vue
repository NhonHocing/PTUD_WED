<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          Chào mừng, {{ authStore.user?.fullName || 'Người dùng' }}!
        </h1>
        <p class="text-gray-600">Quản lý và theo dõi hoạt động mượn sách của bạn</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600"></div>
      </div>

      <div v-else>
        <!-- Stats Cards for Reader -->
        <div v-if="authStore.isReader" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="card hover:shadow-hover transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1 font-medium">Yêu cầu đang chờ</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.pendingRequests }}</p>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center shadow-md">
                <ClockIcon class="w-7 h-7 text-yellow-600" />
              </div>
            </div>
          </div>

          <div class="card hover:shadow-hover transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1 font-medium">Sách đang mượn</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.borrowedBooks }}</p>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center shadow-md">
                <BookOpenIcon class="w-7 h-7 text-primary-600" />
              </div>
            </div>
          </div>

          <div class="card hover:shadow-hover transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1 font-medium">Tổng lượt mượn</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.totalBorrows }}</p>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-md">
                <CheckCircleIcon class="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="authStore.isReader" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Recent Requests -->
          <div class="card">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Yêu cầu gần đây</h2>
              <router-link
                to="/my-requests"
                class="text-primary-600 hover:text-primary-700 text-sm font-semibold cursor-pointer flex items-center gap-1 group"
              >
                Xem tất cả
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </router-link>
            </div>
            <div v-if="recentRequests.length > 0" class="space-y-3">
              <div
                v-for="request in recentRequests.slice(0, 5)"
                :key="request._id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                @click="$router.push(`/books/${request.book?._id}`)"
              >
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-900 truncate">{{ request.book?.title || 'N/A' }}</p>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ formatDate(request.requestDate) }}
                  </p>
                </div>
                <span
                  :class="{
                    'bg-yellow-100 text-yellow-700': request.status === 'pending',
                    'bg-green-100 text-green-700': request.status === 'approved',
                    'bg-red-100 text-red-700': request.status === 'rejected',
                    'bg-gray-100 text-gray-700': request.status === 'cancelled',
                  }"
                  class="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ml-3"
                >
                  {{ getStatusText(request.status) }}
                </span>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <ClockIcon class="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p class="text-gray-600">Chưa có yêu cầu nào</p>
            </div>
          </div>

          <!-- Recent History -->
          <div class="card">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Lịch sử mượn</h2>
              <router-link
                to="/my-history"
                class="text-primary-600 hover:text-primary-700 text-sm font-semibold cursor-pointer flex items-center gap-1 group"
              >
                Xem tất cả
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </router-link>
            </div>
            <div v-if="recentHistory.length > 0" class="space-y-3">
              <div
                v-for="slip in recentHistory.slice(0, 5)"
                :key="slip._id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                @click="$router.push(`/books/${slip.book?._id}`)"
              >
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-900 truncate">{{ slip.book?.title || 'N/A' }}</p>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ formatDate(slip.borrowDate) }}
                  </p>
                </div>
                <span
                  :class="{
                    'bg-blue-100 text-blue-700': slip.status === 'borrowed',
                    'bg-green-100 text-green-700': slip.status === 'returned',
                    'bg-red-100 text-red-700': slip.status === 'overdue',
                  }"
                  class="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ml-3"
                >
                  {{ getStatusText(slip.status) }}
                </span>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <BookOpenIcon class="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p class="text-gray-600">Chưa có lịch sử</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'
import { BookOpenIcon, ClockIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const loading = ref(true)
const stats = ref({
  pendingRequests: 0,
  borrowedBooks: 0,
  totalBorrows: 0,
})
const recentRequests = ref([])
const recentHistory = ref([])

const getStatusText = (status) => {
  const statusMap = {
    pending: 'Chờ xử lý',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
    cancelled: 'Đã hủy',
    borrowed: 'Đang mượn',
    returned: 'Đã trả',
    overdue: 'Quá hạn',
  }
  return statusMap[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const fetchDashboardData = async () => {
  if (!authStore.isReader) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    // Fetch requests và history song song
    const [requestsRes, historyRes] = await Promise.all([
      api.get('/borrow-requests/my-requests').catch(() => ({ data: { data: [] } })),
      api.get('/borrow-slips/my-history').catch(() => ({ data: { data: [] } })),
    ])
    
    recentRequests.value = requestsRes.data.data || []
    recentHistory.value = historyRes.data.data || []
    
    // Tính toán stats
    stats.value.pendingRequests = recentRequests.value.filter(
      (r) => r.status === 'pending'
    ).length
    
    stats.value.borrowedBooks = recentHistory.value.filter(
      (s) => s.status === 'borrowed'
    ).length
    
    stats.value.totalBorrows = recentHistory.value.length
    
    // Sắp xếp theo ngày mới nhất
    recentRequests.value.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
    recentHistory.value.sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate))
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

