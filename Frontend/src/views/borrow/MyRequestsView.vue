<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Yêu cầu mượn sách của tôi</h1>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <div v-else-if="requests.length > 0" class="space-y-4">
        <div
          v-for="request in requests"
          :key="request._id"
          class="card"
        >
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ request.book?.title }}
              </h3>
              <p class="text-gray-600 mb-1">Tác giả: {{ request.book?.author }}</p>
              <p class="text-sm text-gray-500">
                Ngày yêu cầu: {{ new Date(request.requestDate).toLocaleDateString('vi-VN') }}
              </p>
              <p v-if="request.expectedReturnDate" class="text-sm text-gray-500">
                Dự kiến trả: {{ new Date(request.expectedReturnDate).toLocaleDateString('vi-VN') }}
              </p>
              <p v-if="request.note" class="text-sm text-gray-600 mt-2">
                Ghi chú: {{ request.note }}
              </p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <span
                :class="{
                  'bg-yellow-100 text-yellow-800': request.status === 'pending',
                  'bg-green-100 text-green-800': request.status === 'approved',
                  'bg-red-100 text-red-800': request.status === 'rejected',
                  'bg-gray-100 text-gray-800': request.status === 'cancelled',
                }"
                class="px-4 py-2 rounded-full text-sm font-medium"
              >
                {{ getStatusText(request.status) }}
              </span>
              <div v-if="request.status === 'pending'" class="flex gap-2">
                <button
                  @click="cancelRequest(request._id)"
                  class="text-sm text-red-600 hover:text-red-700 font-medium cursor-pointer"
                >
                  Hủy yêu cầu
                </button>
              </div>
              <p v-if="request.rejectionReason" class="text-sm text-red-600 mt-2">
                Lý do: {{ request.rejectionReason }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <BookOpenIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-600 mb-4">Bạn chưa có yêu cầu mượn sách nào</p>
        <router-link to="/books" class="btn-primary">
          Khám phá sách
        </router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'
import { BookOpenIcon } from '@heroicons/vue/24/outline'

const requests = ref([])
const loading = ref(true)

const getStatusText = (status) => {
  const statusMap = {
    pending: 'Chờ xử lý',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
    cancelled: 'Đã hủy',
  }
  return statusMap[status] || status
}

const fetchRequests = async () => {
  loading.value = true
  try {
    const response = await api.get('/borrow-requests/my-requests')
    requests.value = response.data?.data || []
  } catch (error) {
    console.error('Error fetching requests:', error)
    requests.value = []
  } finally {
    loading.value = false
  }
}

const cancelRequest = async (id) => {
  if (!confirm('Bạn có chắc muốn hủy yêu cầu này?')) return

  try {
    await api.put(`/borrow-requests/${id}/cancel`)
    await fetchRequests()
    alert('Đã hủy yêu cầu thành công')
  } catch (error) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra')
  }
}

onMounted(() => {
  fetchRequests()
})
</script>

