<template>
  <AppLayout>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 py-24 overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center">
          <div class="inline-block mb-6">
            <div class="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center shadow-lg mx-auto">
              <BookOpenIcon class="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Chào mừng đến với<br />
            <span class="text-primary-600">Thư viện</span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Khám phá kho tàng tri thức với hàng nghìn đầu sách đa dạng.<br />
            Mượn sách trực tuyến dễ dàng và tiện lợi.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/books"
              class="btn-primary text-lg px-10 py-4 shadow-lg hover:shadow-xl"
            >
              Khám phá sách
            </router-link>
            <router-link
              v-if="!authStore.isAuthenticated"
              to="/register"
              class="btn-outline text-lg px-10 py-4"
            >
              Đăng ký ngay
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-center text-gray-900 mb-16">
          Tại sao chọn chúng tôi?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center group">
            <div class="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              <BookOpenIcon class="w-10 h-10 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Kho sách phong phú</h3>
            <p class="text-gray-600 leading-relaxed">
              Hàng nghìn đầu sách đa dạng về nhiều lĩnh vực khác nhau
            </p>
          </div>
          
          <div class="text-center group">
            <div class="w-20 h-20 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              <ClockIcon class="w-10 h-10 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Mượn sách 24/7</h3>
            <p class="text-gray-600 leading-relaxed">
              Đặt mượn sách trực tuyến bất cứ lúc nào, mọi nơi
            </p>
          </div>
          
          <div class="text-center group">
            <div class="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              <UserIcon class="w-10 h-10 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Dễ sử dụng</h3>
            <p class="text-gray-600 leading-relaxed">
              Giao diện thân thiện, quy trình đơn giản và nhanh chóng
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Books Section -->
    <section class="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900">Sách phổ biến</h2>
          <router-link
            to="/books"
            class="text-primary-600 hover:text-primary-700 font-semibold cursor-pointer flex items-center gap-2 group"
          >
            Xem tất cả
            <span class="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </router-link>
        </div>
        <div v-if="loading" class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600"></div>
        </div>
        <div v-else-if="books.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="book in books.slice(0, 4)"
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
            <p class="text-sm text-gray-600 mb-3">{{ book.author }}</p>
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <span class="text-xs text-gray-500 font-medium">
                Còn lại: {{ book.availableCopies }}
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
        <div v-else class="text-center py-16 text-gray-600">
          <BookOpenIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-lg">Chưa có sách nào</p>
        </div>
      </div>
    </section>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'
import { BookOpenIcon, ClockIcon, UserIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const books = ref([])
const loading = ref(true)

const handleImageError = (event) => {
  // Nếu ảnh không load được, ẩn img và hiển thị icon
  event.target.style.display = 'none'
  const parent = event.target.parentElement
  if (parent && !parent.querySelector('svg')) {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    icon.setAttribute('class', 'w-16 h-16 text-gray-400')
    icon.setAttribute('fill', 'none')
    icon.setAttribute('viewBox', '0 0 24 24')
    icon.setAttribute('stroke', 'currentColor')
    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />'
    parent.appendChild(icon)
  }
}

onMounted(async () => {
  try {
    const response = await api.get('/books?limit=4&available=true')
    books.value = response.data.data
  } catch (error) {
    console.error('Error fetching books:', error)
  } finally {
    loading.value = false
  }
})
</script>

