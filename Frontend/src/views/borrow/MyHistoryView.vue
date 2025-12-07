<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Lịch sử mượn-trả</h1>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <div v-else-if="history.length > 0" class="space-y-4">
        <div
          v-for="slip in history"
          :key="slip._id"
          class="card"
        >
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ slip.book?.title }}
                </h3>
                <span class="text-sm text-gray-500">#{{ slip.slipNumber }}</span>
              </div>
              <p class="text-gray-600 mb-1">Tác giả: {{ slip.book?.author }}</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mt-3">
                <div>
                  <span class="font-medium">Mượn:</span>
                  <p>{{ new Date(slip.borrowDate).toLocaleDateString('vi-VN') }}</p>
                </div>
                <div>
                  <span class="font-medium">Dự kiến trả:</span>
                  <p>{{ new Date(slip.expectedReturnDate).toLocaleDateString('vi-VN') }}</p>
                </div>
                <div v-if="slip.actualReturnDate">
                  <span class="font-medium">Trả thực tế:</span>
                  <p>{{ new Date(slip.actualReturnDate).toLocaleDateString('vi-VN') }}</p>
                </div>
                <div v-if="slip.fine > 0">
                  <span class="font-medium">Tiền phạt:</span>
                  <p class="text-red-600">{{ slip.fine.toLocaleString('vi-VN') }} đ</p>
                </div>
              </div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <span
                :class="{
                  'bg-blue-100 text-blue-800': slip.status === 'borrowed',
                  'bg-green-100 text-green-800': slip.status === 'returned',
                  'bg-red-100 text-red-800': slip.status === 'overdue',
                }"
                class="px-4 py-2 rounded-full text-sm font-medium"
              >
                {{ getStatusText(slip.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <BookOpenIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-600">Bạn chưa có lịch sử mượn sách nào</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'
import { BookOpenIcon } from '@heroicons/vue/24/outline'

const history = ref([])
const loading = ref(true)

const getStatusText = (status) => {
  const statusMap = {
    borrowed: 'Đang mượn',
    returned: 'Đã trả',
    overdue: 'Quá hạn',
  }
  return statusMap[status] || status
}

const fetchHistory = async () => {
  loading.value = true
  try {
    const response = await api.get('/borrow-slips/my-history')
    history.value = response.data?.data || []
  } catch (error) {
    console.error('Error fetching history:', error)
    history.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchHistory()
})
</script>

