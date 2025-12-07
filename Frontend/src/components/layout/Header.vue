<template>
  <header class="bg-white/95 backdrop-blur-md shadow-soft border-b border-gray-100 sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-3 cursor-pointer group">
          <div class="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
            <BookOpenIcon class="w-7 h-7 text-white" />
          </div>
          <span class="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">Thư viện</span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-2">
          <router-link
            to="/books"
            class="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 cursor-pointer font-medium"
            active-class="text-primary-600 bg-primary-50"
          >
            Sách
          </router-link>
          
          <template v-if="authStore.isAuthenticated">
            <router-link
              v-if="authStore.isReader"
              to="/my-requests"
              class="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 cursor-pointer font-medium"
              active-class="text-primary-600 bg-primary-50"
            >
              Yêu cầu của tôi
            </router-link>
            <router-link
              v-if="authStore.isReader"
              to="/my-history"
              class="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 cursor-pointer font-medium"
              active-class="text-primary-600 bg-primary-50"
            >
              Lịch sử
            </router-link>
            <router-link
              v-if="authStore.isStaff"
              to="/admin/books"
              class="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 cursor-pointer font-medium"
              active-class="text-primary-600 bg-primary-50"
            >
              Quản lý sách
            </router-link>
            <router-link
              v-if="authStore.isStaff"
              to="/admin"
              class="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 cursor-pointer font-medium"
              active-class="text-primary-600 bg-primary-50"
            >
              Quản trị
            </router-link>
            <router-link
              v-if="!authStore.isStaff"
              to="/dashboard"
              class="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 cursor-pointer font-medium"
              active-class="text-primary-600 bg-primary-50"
            >
              Dashboard
            </router-link>
          </template>
        </div>

        <!-- Auth Buttons -->
        <div class="flex items-center space-x-3">
          <template v-if="!authStore.isAuthenticated">
            <router-link
              to="/login"
              class="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 cursor-pointer"
            >
              Đăng nhập
            </router-link>
            <router-link
              to="/register"
              class="btn-primary"
            >
              Đăng ký
            </router-link>
          </template>
          <template v-else>
            <div class="relative">
              <button
                data-user-menu-button
                @click.stop="showMenu = !showMenu"
                class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
              >
                <div class="w-10 h-10 gradient-primary rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                  <span class="text-white text-sm font-semibold">
                    {{ authStore.user?.fullName?.charAt(0)?.toUpperCase() || 'U' }}
                  </span>
                </div>
                <ChevronDownIcon 
                  :class="['w-4 h-4 text-gray-600 transition-transform duration-200', showMenu ? 'rotate-180' : '']" 
                />
              </button>
              
              <!-- Dropdown Menu with Animation -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 scale-95 translate-y-1"
                enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 scale-100 translate-y-0"
                leave-to-class="opacity-0 scale-95 translate-y-1"
              >
                <div
                  v-if="showMenu"
                  v-click-outside="() => showMenu = false"
                  @click.stop
                  class="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-hover border border-gray-100 z-50 overflow-hidden"
                >
                  <!-- User Info Section -->
                  <div class="px-4 py-4 bg-gradient-to-br from-primary-50 to-primary-100 border-b border-gray-100">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 gradient-primary rounded-full flex items-center justify-center shadow-md">
                        <span class="text-white text-base font-bold">
                          {{ authStore.user?.fullName?.charAt(0)?.toUpperCase() || 'U' }}
                        </span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="font-semibold text-gray-900 truncate">
                          {{ authStore.user?.fullName || 'Người dùng' }}
                        </p>
                        <p class="text-xs text-gray-600 truncate">
                          {{ authStore.user?.email }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Menu Items -->
                  <div class="py-2">
                    <router-link
                      to="/profile"
                      class="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 cursor-pointer font-medium group/item"
                      @click="showMenu = false"
                    >
                      <UserIcon class="w-5 h-5 text-gray-400 group-hover/item:text-primary-600 transition-colors" />
                      <span>Hồ sơ cá nhân</span>
                    </router-link>
                    
                    <router-link
                      v-if="authStore.isStaff"
                      to="/admin/books"
                      class="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 cursor-pointer font-medium group/item"
                      @click="showMenu = false"
                    >
                      <BookOpenIcon class="w-5 h-5 text-gray-400 group-hover/item:text-primary-600 transition-colors" />
                      <span>Quản lý sách</span>
                    </router-link>
                    <router-link
                      v-if="authStore.isStaff"
                      to="/admin"
                      class="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 cursor-pointer font-medium group/item"
                      @click="showMenu = false"
                    >
                      <ChartBarIcon class="w-5 h-5 text-gray-400 group-hover/item:text-primary-600 transition-colors" />
                      <span>Quản trị</span>
                    </router-link>
                    <router-link
                      v-if="!authStore.isStaff"
                      to="/dashboard"
                      class="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 cursor-pointer font-medium group/item"
                      @click="showMenu = false"
                    >
                      <ChartBarIcon class="w-5 h-5 text-gray-400 group-hover/item:text-primary-600 transition-colors" />
                      <span>Dashboard</span>
                    </router-link>

                    <div class="border-t border-gray-100 my-1"></div>

                    <button
                      @click="handleLogout"
                      class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer font-medium group/item text-left"
                    >
                      <ArrowRightOnRectangleIcon class="w-5 h-5 text-red-400 group-hover/item:text-red-600 transition-colors" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  BookOpenIcon, 
  ChevronDownIcon,
  UserIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const showMenu = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/')
  showMenu.value = false
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      // Kiểm tra xem click có nằm trong element hoặc button trigger không
      const button = document.querySelector('[data-user-menu-button]')
      if (
        !(el === event.target || el.contains(event.target)) &&
        !(button && (button === event.target || button.contains(event.target)))
      ) {
        binding.value()
      }
    }
    // Sử dụng setTimeout để tránh event bubble ngay lập tức
    setTimeout(() => {
      document.addEventListener('click', el.clickOutsideEvent)
    }, 0)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}
</script>

