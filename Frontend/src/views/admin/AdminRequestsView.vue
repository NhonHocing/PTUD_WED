<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Yêu cầu duyệt sách</h2>
        <p class="text-sm text-gray-600 mt-1">Xử lý các yêu cầu mượn sách đang chờ</p>
      </div>
      <button
        @click="fetchRequests"
        class="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg font-medium cursor-pointer transition-all duration-200"
      >
        <ArrowPathIcon class="w-4 h-4" />
        Làm mới
      </button>
    </div>
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600"></div>
    </div>
    <div v-else-if="requests.length > 0" class="space-y-4">
      <div
        v-for="request in requests.slice(0, 5)"
        :key="request._id"
        class="border-2 border-gray-100 rounded-xl p-5 hover:border-primary-200 hover:shadow-md transition-all duration-200"
      >
        <div class="flex justify-between items-start gap-4">
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-gray-900 mb-2 text-lg">{{ request.book?.title || 'N/A' }}</h3>
            <p class="text-sm text-gray-600 mb-1">
              <span class="font-medium">Độc giả:</span> {{ request.reader?.fullName || 'N/A' }}
            </p>
            <p class="text-sm text-gray-600 mb-1">
              <span class="font-medium">Email:</span> {{ request.reader?.email || 'N/A' }}
            </p>
            <p class="text-sm text-gray-500">
              <span class="font-medium">Ngày yêu cầu:</span> {{ formatDate(request.requestDate) }}
            </p>
            <p v-if="request.expectedReturnDate" class="text-sm text-gray-500">
              <span class="font-medium">Dự kiến trả:</span> {{ formatDate(request.expectedReturnDate) }}
            </p>
          </div>
          <div class="flex flex-col items-end gap-3">
            <span
              :class="{
                'bg-yellow-100 text-yellow-700': request.status === 'pending',
                'bg-green-100 text-green-700': request.status === 'approved',
                'bg-red-100 text-red-700': request.status === 'rejected',
                'bg-gray-100 text-gray-700': request.status === 'cancelled',
              }"
              class="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap"
            >
              {{ getStatusText(request.status) }}
            </span>
            <div v-if="request.status === 'pending'" class="flex gap-2">
              <button
                @click="processRequest(request._id, 'approved')"
                class="btn-primary text-sm px-4 py-2"
              >
                ✓ Duyệt
              </button>
              <button
                @click="showRejectModal(request)"
                class="btn-secondary text-sm px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100"
              >
                ✗ Từ chối
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <ClockIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-600 text-lg">Không có yêu cầu nào</p>
    </div>

    <!-- Reject Modal -->
    <div
      v-if="showRejectDialog"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showRejectDialog = false"
    >
      <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-hover">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Từ chối yêu cầu</h3>
        <div class="mb-4">
          <label class="label">Lý do từ chối</label>
          <textarea
            v-model="rejectReason"
            rows="3"
            class="input-field"
            placeholder="Nhập lý do từ chối..."
          ></textarea>
        </div>
        <div class="flex gap-3">
          <button
            @click="showRejectDialog = false"
            class="flex-1 btn-secondary"
          >
            Hủy
          </button>
          <button
            @click="confirmReject"
            class="flex-1 btn-primary bg-red-600 hover:bg-red-700"
          >
            Xác nhận từ chối
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { ClockIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

const requests = ref([])
const loading = ref(true)
const showRejectDialog = ref(false)
const rejectReason = ref('')
const currentRequestId = ref(null)

const getStatusText = (status) => {
  const statusMap = {
    pending: 'Chờ xử lý',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
    cancelled: 'Đã hủy',
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

const fetchRequests = async () => {
  loading.value = true
  try {
    const response = await api.get('/borrow-requests?status=pending')
    requests.value = response.data.data || []
    // Sắp xếp theo ngày mới nhất
    requests.value.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
  } catch (error) {
    console.error('Error fetching requests:', error)
    requests.value = []
  } finally {
    loading.value = false
  }
}

const processRequest = async (id, status) => {
  try {
    await api.put(`/borrow-requests/${id}/process`, { status })
    await fetchRequests()
    alert('✅ Đã xử lý yêu cầu thành công')
  } catch (error) {
    alert(error.response?.data?.message || '❌ Có lỗi xảy ra')
  }
}

const showRejectModal = (request) => {
  currentRequestId.value = request._id
  rejectReason.value = ''
  showRejectDialog.value = true
}

const confirmReject = async () => {
  if (!currentRequestId.value) return
  
  try {
    await api.put(`/borrow-requests/${currentRequestId.value}/process`, {
      status: 'rejected',
      rejectionReason: rejectReason.value || 'Không có lý do',
    })
    showRejectDialog.value = false
    await fetchRequests()
    alert('✅ Đã từ chối yêu cầu thành công')
  } catch (error) {
    alert(error.response?.data?.message || '❌ Có lỗi xảy ra')
  }
}

onMounted(() => {
  fetchRequests()
})
</script>

