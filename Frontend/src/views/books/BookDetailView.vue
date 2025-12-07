<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <div v-else-if="book" class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- Book Image -->
        <div class="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden flex items-center justify-center shadow-soft">
          <img
            v-if="book.coverImage"
            :src="book.coverImage"
            :alt="book.title"
            @error="handleImageError($event)"
            class="w-full h-full object-cover"
          />
          <BookOpenIcon v-else class="w-32 h-32 text-gray-400" />
        </div>

        <!-- Book Info -->
        <div>
          <h1 class="text-4xl font-bold text-gray-900 mb-3 leading-tight">{{ book.title }}</h1>
          <p class="text-xl text-gray-600 mb-6 font-medium">Tác giả: {{ book.author }}</p>

          <div class="space-y-4 mb-8 p-6 bg-gray-50 rounded-2xl">
            <div v-if="book.isbn" class="flex items-center">
              <span class="text-sm font-semibold text-gray-700 w-28">ISBN:</span>
              <span class="text-gray-800 font-medium">{{ book.isbn }}</span>
            </div>
            <div v-if="book.category" class="flex items-center">
              <span class="text-sm font-semibold text-gray-700 w-28">Thể loại:</span>
              <span class="text-primary-600 font-semibold">{{ book.category }}</span>
            </div>
            <div v-if="book.publishYear" class="flex items-center">
              <span class="text-sm font-semibold text-gray-700 w-28">Năm XB:</span>
              <span class="text-gray-800 font-medium">{{ book.publishYear }}</span>
            </div>
            <div v-if="book.publisher?.name" class="flex items-center">
              <span class="text-sm font-semibold text-gray-700 w-28">NXB:</span>
              <span class="text-gray-800 font-medium">{{ book.publisher.name }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-sm font-semibold text-gray-700 w-28">Số lượng:</span>
              <span class="text-gray-800 font-medium">
                {{ book.availableCopies }}/{{ book.totalCopies }} bản có sẵn
              </span>
            </div>
            <div class="flex items-center">
              <span class="text-sm font-semibold text-gray-700 w-28">Trạng thái:</span>
              <span
                :class="book.availableCopies > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                class="px-4 py-2 rounded-full text-sm font-semibold"
              >
                {{ book.availableCopies > 0 ? 'Có sẵn' : 'Hết sách' }}
              </span>
            </div>
          </div>

          <div v-if="book.description" class="mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Mô tả</h3>
            <p class="text-gray-700 whitespace-pre-line leading-relaxed">{{ book.description }}</p>
          </div>

          <div v-if="authStore.isAuthenticated && authStore.isReader" class="mt-8">
            <button
              v-if="book.availableCopies > 0"
              @click="showRequestModal = true"
              class="btn-primary w-full py-4 text-lg shadow-lg hover:shadow-xl"
            >
              Yêu cầu mượn sách
            </button>
            <button
              v-else
              disabled
              class="w-full py-4 bg-gray-200 text-gray-500 rounded-xl cursor-not-allowed font-semibold"
            >
              Sách hiện không có sẵn
            </button>
          </div>
        </div>
      </div>

      <!-- Request Modal -->
      <div
        v-if="showRequestModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showRequestModal = false"
      >
        <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-hover">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Yêu cầu mượn sách</h3>
          <form @submit.prevent="submitRequest" class="space-y-4">
            <div>
              <label class="label">Ngày mượn dự kiến</label>
              <input
                v-model="requestForm.expectedBorrowDate"
                type="date"
                :min="minDate"
                required
                class="input-field"
              />
            </div>
            <div>
              <label class="label">Ngày trả dự kiến</label>
              <input
                v-model="requestForm.expectedReturnDate"
                type="date"
                :min="requestForm.expectedBorrowDate || minDate"
                required
                class="input-field"
              />
            </div>
            <div>
              <label class="label">Ghi chú (tùy chọn)</label>
              <textarea
                v-model="requestForm.note"
                rows="3"
                class="input-field"
                placeholder="Nhập ghi chú nếu có"
              ></textarea>
            </div>
            <div class="flex space-x-4 pt-2">
              <button
                type="button"
                @click="showRequestModal = false"
                class="flex-1 btn-secondary"
              >
                Hủy
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="flex-1 btn-primary disabled:opacity-50 shadow-md"
              >
                {{ submitting ? 'Đang gửi...' : 'Gửi yêu cầu' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'
import { BookOpenIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const book = ref(null)
const loading = ref(true)
const showRequestModal = ref(false)
const submitting = ref(false)

const requestForm = ref({
  expectedBorrowDate: '',
  expectedReturnDate: '',
  note: '',
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const fetchBook = async () => {
  try {
    const response = await api.get(`/books/${route.params.id}`)
    book.value = response.data?.data || null
    if (!book.value) {
      router.push('/books')
      return
    }
  } catch (error) {
    console.error('Error fetching book:', error)
    router.push('/books')
  } finally {
    loading.value = false
  }
}

const submitRequest = async () => {
  submitting.value = true
  try {
    await api.post('/borrow-requests', {
      book: book.value._id,
      ...requestForm.value,
    })
    alert('Yêu cầu mượn sách đã được gửi thành công!')
    showRequestModal.value = false
    router.push('/my-requests')
  } catch (error) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra')
  } finally {
    submitting.value = false
  }
}

const handleImageError = (event) => {
  // Nếu ảnh không load được, ẩn img và hiển thị icon
  event.target.style.display = 'none'
  const parent = event.target.parentElement
  if (parent && !parent.querySelector('svg')) {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    icon.setAttribute('class', 'w-32 h-32 text-gray-400')
    icon.setAttribute('fill', 'none')
    icon.setAttribute('viewBox', '0 0 24 24')
    icon.setAttribute('stroke', 'currentColor')
    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />'
    parent.appendChild(icon)
  }
}

onMounted(() => {
  fetchBook()
})
</script>

