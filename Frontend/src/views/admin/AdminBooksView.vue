<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="card">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Quản lý sách</h2>
      <button
        @click="openAddModal"
        class="btn-primary flex items-center gap-2"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Thêm sách mới
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="md:col-span-2">
        <input
          v-model="searchQuery"
          @input="debounceSearch"
          type="text"
          placeholder="Tìm kiếm theo tên, tác giả, ISBN..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <select
          v-model="filterCategory"
          @change="fetchBooks"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tất cả thể loại</option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>
      <div>
        <select
          v-model="filterStatus"
          @change="fetchBooks"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="available">Có sẵn</option>
          <option value="unavailable">Không có sẵn</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Đang tải...</p>
    </div>

    <!-- Books Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hình ảnh
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên sách
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tác giả
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nhà xuất bản
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Số lượng
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="books.length === 0">
            <td colspan="7" class="px-6 py-8 text-center text-gray-500">
              Không có sách nào
            </td>
          </tr>
          <tr
            v-for="book in books"
            :key="book._id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <img
                v-if="book.coverImage"
                :src="book.coverImage"
                :alt="book.title"
                class="w-16 h-20 object-cover rounded"
              />
              <div
                v-else
                class="w-16 h-20 bg-gray-200 rounded flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">
                {{ book.title }}
              </div>
              <div class="text-sm text-gray-500">
                ISBN: {{ book.isbn || 'N/A' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ book.author }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ book.publisher?.name || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div>Có sẵn: <span class="font-semibold">{{ book.availableCopies }}</span></div>
              <div class="text-gray-500">Tổng: <span class="font-semibold">{{ book.totalCopies }}</span></div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'bg-green-100 text-green-800': book.status === 'available',
                  'bg-red-100 text-red-800': book.status === 'unavailable',
                }"
                class="px-2 py-1 text-xs font-semibold rounded-full"
              >
                {{ book.status === 'available' ? 'Có sẵn' : 'Không có sẵn' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex gap-2">
                <button
                  @click="openEditModal(book)"
                  class="text-blue-600 hover:text-blue-900"
                  title="Sửa"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(book)"
                  class="text-red-600 hover:text-red-900"
                  title="Xóa"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination && pagination.pages > 1"
      class="mt-6 flex justify-center items-center gap-2"
    >
      <button
        @click="changePage(pagination.page - 1)"
        :disabled="pagination.page === 1"
        class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Trước
      </button>
      <span class="px-4 py-2 text-sm text-gray-700">
        Trang {{ pagination.page }} / {{ pagination.pages }}
      </span>
      <button
        @click="changePage(pagination.page + 1)"
        :disabled="pagination.page === pagination.pages"
        class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Sau
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
        @click.stop
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-gray-900">
              {{ editingBook ? 'Sửa thông tin sách' : 'Thêm sách mới' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveBook" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tên sách <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.title"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tác giả <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.author"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  ISBN
                </label>
                <input
                  v-model="formData.isbn"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nhà xuất bản <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.publisher"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn nhà xuất bản</option>
                  <option
                    v-for="publisher in publishers"
                    :key="publisher._id"
                    :value="publisher._id"
                  >
                    {{ publisher.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Năm xuất bản
                </label>
                <input
                  v-model.number="formData.publishYear"
                  type="number"
                  :min="1000"
                  :max="new Date().getFullYear() + 1"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Thể loại
                </label>
                <input
                  v-model="formData.category"
                  type="text"
                  list="categories-list"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <datalist id="categories-list">
                  <option
                    v-for="category in categories"
                    :key="category"
                    :value="category"
                  />
                </datalist>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tổng số lượng <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="formData.totalCopies"
                  type="number"
                  required
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng có sẵn
                </label>
                <input
                  v-model.number="formData.availableCopies"
                  type="number"
                  min="0"
                  :max="formData.totalCopies"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  v-model="formData.status"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="available">Có sẵn</option>
                  <option value="unavailable">Không có sẵn</option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  URL hình ảnh bìa
                </label>
                <input
                  v-model="formData.coverImage"
                  type="url"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  v-model="formData.description"
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="saving">Đang lưu...</span>
                <span v-else>{{ editingBook ? 'Cập nhật' : 'Thêm mới' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeDeleteModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-md m-4"
        @click.stop
      >
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">
            Xác nhận xóa sách
          </h3>
          <p class="text-gray-600 mb-6">
            Bạn có chắc chắn muốn xóa sách "<strong>{{ bookToDelete?.title }}</strong>"?
            Hành động này không thể hoàn tác.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="closeDeleteModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              @click="deleteBook"
              :disabled="deleting"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="deleting">Đang xóa...</span>
              <span v-else>Xóa</span>
            </button>
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
import api from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'

// Data
const books = ref([])
const publishers = ref([])
const categories = ref([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const pagination = ref(null)

// Search and filters
const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
let searchTimeout = null

// Modal states
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingBook = ref(null)
const bookToDelete = ref(null)

// Form data
const formData = ref({
  title: '',
  author: '',
  isbn: '',
  publisher: '',
  publishYear: '',
  category: '',
  description: '',
  totalCopies: 0,
  availableCopies: 0,
  coverImage: '',
  status: 'available',
})

// Fetch books
const fetchBooks = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      limit: 10,
    }
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    if (filterCategory.value) {
      params.category = filterCategory.value
    }
    if (filterStatus.value) {
      params.status = filterStatus.value
    }

    const response = await api.get('/books', { params })
    books.value = response.data.data
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('Error fetching books:', error)
    alert('Có lỗi xảy ra khi tải danh sách sách')
  } finally {
    loading.value = false
  }
}

// Fetch publishers
const fetchPublishers = async () => {
  try {
    const response = await api.get('/publishers')
    publishers.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching publishers:', error)
  }
}

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await api.get('/books/categories/list')
    categories.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// Debounce search
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchBooks(1)
  }, 500)
}

// Change page
const changePage = (page) => {
  fetchBooks(page)
}

// Open add modal
const openAddModal = () => {
  editingBook.value = null
  formData.value = {
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publishYear: '',
    category: '',
    description: '',
    totalCopies: 0,
    availableCopies: 0,
    coverImage: '',
    status: 'available',
  }
  showModal.value = true
}

// Open edit modal
const openEditModal = (book) => {
  editingBook.value = book
  formData.value = {
    title: book.title,
    author: book.author,
    isbn: book.isbn || '',
    publisher: book.publisher?._id || book.publisher || '',
    publishYear: book.publishYear || '',
    category: book.category || '',
    description: book.description || '',
    totalCopies: book.totalCopies,
    availableCopies: book.availableCopies,
    coverImage: book.coverImage || '',
    status: book.status,
  }
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  editingBook.value = null
}

// Save book
const saveBook = async () => {
  saving.value = true
  try {
    const data = { ...formData.value }
    // Convert empty strings to undefined for optional fields
    if (!data.isbn) data.isbn = undefined
    if (!data.publishYear) data.publishYear = undefined
    if (!data.category) data.category = undefined
    if (!data.description) data.description = undefined
    if (!data.coverImage) data.coverImage = undefined

    if (editingBook.value) {
      await api.put(`/books/${editingBook.value._id}`, data)
      alert('Cập nhật sách thành công!')
    } else {
      await api.post('/books', data)
      alert('Thêm sách thành công!')
    }
    closeModal()
    fetchBooks(pagination.value?.page || 1)
  } catch (error) {
    console.error('Error saving book:', error)
    const message =
      error.response?.data?.message || 'Có lỗi xảy ra khi lưu sách'
    alert(message)
  } finally {
    saving.value = false
  }
}

// Confirm delete
const confirmDelete = (book) => {
  bookToDelete.value = book
  showDeleteModal.value = true
}

// Close delete modal
const closeDeleteModal = () => {
  showDeleteModal.value = false
  bookToDelete.value = null
}

// Delete book
const deleteBook = async () => {
  if (!bookToDelete.value) return

  deleting.value = true
  try {
    await api.delete(`/books/${bookToDelete.value._id}`)
    alert('Xóa sách thành công!')
    closeDeleteModal()
    fetchBooks(pagination.value?.page || 1)
  } catch (error) {
    console.error('Error deleting book:', error)
    const message =
      error.response?.data?.message || 'Có lỗi xảy ra khi xóa sách'
    alert(message)
  } finally {
    deleting.value = false
  }
}

// Initialize
onMounted(() => {
  fetchBooks()
  fetchPublishers()
  fetchCategories()
})
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
}

.card {
  @apply bg-white rounded-lg shadow p-6;
}
</style>
