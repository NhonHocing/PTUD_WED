<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-4xl font-bold text-gray-900 mb-6">Danh mục sách</h1>
        
        <!-- Search and Filters -->
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="searchQuery"
                @input="debouncedSearch"
                type="text"
                placeholder="Tìm kiếm sách, tác giả, ISBN..."
                class="input-field pl-12"
              />
            </div>
          </div>
          
          <select
            v-model="selectedCategory"
            @change="fetchBooks"
            class="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none cursor-pointer bg-white hover:border-gray-300 transition-all duration-200 font-medium"
          >
            <option value="">Tất cả thể loại</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          
          <select
            v-model="statusFilter"
            @change="fetchBooks"
            class="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none cursor-pointer bg-white hover:border-gray-300 transition-all duration-200 font-medium"
          >
            <option value="">Tất cả</option>
            <option value="available">Có sẵn</option>
            <option value="unavailable">Không có sẵn</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <!-- Books Grid -->
      <div v-else-if="books.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="book in books"
          :key="book._id"
          class="card-hover group"
          @click="$router.push(`/books/${book._id}`)"
        >
          <div class="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 overflow-hidden flex items-center justify-center shadow-inner group-hover:shadow-lg transition-all duration-300">
            <img
              v-if="book.coverImage"
              :src="book.coverImage"
              :alt="book.title"
              @error="handleImageError($event)"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <BookOpenIcon v-else class="w-16 h-16 text-gray-400" />
          </div>
          <h3 class="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">{{ book.title }}</h3>
          <p class="text-sm text-gray-600 mb-2">{{ book.author }}</p>
          <p v-if="book.category" class="text-xs text-primary-600 font-medium mb-3">{{ book.category }}</p>
          <div class="flex items-center justify-between pt-3 border-t border-gray-100">
            <span class="text-xs text-gray-500 font-medium">
              Còn lại: {{ book.availableCopies }}/{{ book.totalCopies }}
            </span>
            <span
              v-if="book.availableCopies > 0"
              class="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-semibold"
            >
              Có sẵn
            </span>
            <span
              v-else
              class="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-full font-semibold"
            >
              Hết sách
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <BookOpenIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-600">Không tìm thấy sách nào</p>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.pages > 1" class="mt-8 flex justify-center">
        <div class="flex space-x-2">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            Trước
          </button>
          <span class="px-4 py-2 text-gray-700">
            Trang {{ pagination.page }} / {{ pagination.pages }}
          </span>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.pages"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'
import { BookOpenIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const books = ref([])
const categories = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')
const statusFilter = ref('')
const pagination = ref(null)
const currentPage = ref(1)

let searchTimeout = null

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchBooks()
  }, 500)
}

const fetchBooks = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: 12,
    }
    if (searchQuery.value) params.search = searchQuery.value
    if (selectedCategory.value) params.category = selectedCategory.value
    if (statusFilter.value) params.status = statusFilter.value

    const response = await api.get('/books', { params })
    books.value = response.data?.data || []
    pagination.value = response.data?.pagination || null
    
    // Log success for debugging
    if (books.value.length === 0 && !searchQuery.value && !selectedCategory.value) {
      console.warn('⚠️ No books found. Check if database has data or API is working correctly.')
    }
  } catch (error) {
    console.error('❌ Error fetching books:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    })
    books.value = []
    pagination.value = null
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await api.get('/books/categories/list')
    categories.value = response.data?.data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    categories.value = []
  }
}

const changePage = (page) => {
  currentPage.value = page
  fetchBooks()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleImageError = (event) => {
  // Nếu ảnh không load được, ẩn img và hiển thị icon
  event.target.style.display = 'none'
  const parent = event.target.parentElement
  if (parent && !parent.querySelector('svg')) {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    icon.setAttribute('class', 'w-16 h-16 text-gray-400')
    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />'
    parent.appendChild(icon)
  }
}

onMounted(() => {
  fetchBooks()
  fetchCategories()
})
</script>

