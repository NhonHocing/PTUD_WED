<template>
  <footer class="bg-gray-50 border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <BookOpenIcon class="w-5 h-5 text-white" />
            </div>
            <span class="text-lg font-bold text-gray-900">Thư viện</span>
          </div>
          <p class="text-gray-600 text-sm">
            Hệ thống quản lý mượn sách thư viện hiện đại và tiện lợi.
          </p>
        </div>
        
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Liên kết nhanh</h3>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/books"
                class="text-gray-600 hover:text-primary-600 text-sm transition-colors duration-200 cursor-pointer"
              >
                Danh mục sách
              </router-link>
            </li>
            <li>
              <router-link
                v-if="authStore.isAuthenticated"
                to="/dashboard"
                class="text-gray-600 hover:text-primary-600 text-sm transition-colors duration-200 cursor-pointer"
              >
                Dashboard
              </router-link>
            </li>
            <li>
              <router-link
                v-if="authStore.isAuthenticated"
                to="/profile"
                class="text-gray-600 hover:text-primary-600 text-sm transition-colors duration-200 cursor-pointer"
              >
                Hồ sơ cá nhân
              </router-link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Thông tin</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li>Email: support@library.com</li>
            <li>Điện thoại: 0123 456 789</li>
            <li>Giờ làm việc: 8:00 - 17:00</li>
          </ul>
        </div>
      </div>
      
      <div class="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
        <p>&copy; 2024 Thư viện. Tất cả quyền được bảo lưu.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { BookOpenIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
</script>

