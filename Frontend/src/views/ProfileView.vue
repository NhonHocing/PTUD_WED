<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Hồ sơ cá nhân</h1>
        <p class="text-gray-600">Quản lý thông tin tài khoản và cài đặt của bạn</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Profile Info & Password -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Avatar & Basic Info Card -->
          <div class="card">
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-gray-100">
              <div class="relative">
                <div class="w-24 h-24 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <span class="text-3xl font-bold text-white">
                    {{ authStore.user?.fullName?.charAt(0)?.toUpperCase() || 'U' }}
                  </span>
                </div>
                <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
              </div>
              <div class="flex-1 text-center sm:text-left">
                <h2 class="text-2xl font-bold text-gray-900 mb-1">{{ authStore.user?.fullName || 'Người dùng' }}</h2>
                <p class="text-gray-600 mb-3">{{ authStore.user?.email }}</p>
                <span
                  :class="authStore.user?.role === 'staff' ? 'bg-accent-100 text-accent-700' : 'bg-primary-100 text-primary-700'"
                  class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold"
                >
                  <UserIcon class="w-4 h-4 mr-2" />
                  {{ authStore.user?.role === 'staff' ? 'Nhân viên thư viện' : 'Độc giả' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Personal Information Card -->
          <div class="card">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <UserIcon class="w-6 h-6 text-primary-600" />
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
            </div>
            <form @submit.prevent="updateProfile" class="space-y-5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="label">Họ và tên</label>
                  <input
                    v-model="profileForm.fullName"
                    type="text"
                    required
                    class="input-field"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label class="label">Số điện thoại</label>
                  <input
                    v-model="profileForm.phone"
                    type="tel"
                    class="input-field"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
              <div>
                <label class="label">Email</label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  disabled
                  class="input-field bg-gray-50 cursor-not-allowed"
                />
                <p class="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
              </div>
              <div>
                <label class="label">Địa chỉ</label>
                <textarea
                  v-model="profileForm.address"
                  rows="3"
                  class="input-field resize-none"
                  placeholder="Nhập địa chỉ"
                ></textarea>
              </div>
              <div class="flex justify-end pt-2">
                <button
                  type="submit"
                  :disabled="updating"
                  class="btn-primary disabled:opacity-50 min-w-[160px]"
                >
                  <span v-if="updating" class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang cập nhật...
                  </span>
                  <span v-else>Cập nhật thông tin</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Change Password Card -->
          <div class="card">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                <LockClosedIcon class="w-6 h-6 text-accent-600" />
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Đổi mật khẩu</h2>
            </div>
            <form @submit.prevent="changePassword" class="space-y-5">
              <div>
                <label class="label">Mật khẩu hiện tại</label>
                <div class="relative">
                  <input
                    v-model="passwordForm.currentPassword"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    required
                    class="input-field pr-10"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    @click="showCurrentPassword = !showCurrentPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon v-if="!showCurrentPassword" class="w-5 h-5" />
                    <EyeSlashIcon v-else class="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div>
                <label class="label">Mật khẩu mới</label>
                <div class="relative">
                  <input
                    v-model="passwordForm.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    required
                    minlength="6"
                    class="input-field pr-10"
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  />
                  <button
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon v-if="!showNewPassword" class="w-5 h-5" />
                    <EyeSlashIcon v-else class="w-5 h-5" />
                  </button>
                </div>
                <div class="mt-2">
                  <div class="flex items-center gap-2 text-xs text-gray-500">
                    <div class="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        :class="getPasswordStrength(passwordForm.newPassword).color"
                        class="h-full transition-all duration-300"
                        :style="{ width: getPasswordStrength(passwordForm.newPassword).width + '%' }"
                      ></div>
                    </div>
                    <span :class="getPasswordStrength(passwordForm.newPassword).textColor">
                      {{ getPasswordStrength(passwordForm.newPassword).text }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex justify-end pt-2">
                <button
                  type="submit"
                  :disabled="changingPassword || !isPasswordValid"
                  class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
                >
                  <span v-if="changingPassword" class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang đổi...
                  </span>
                  <span v-else>Đổi mật khẩu</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Right Column: Account Info & Stats -->
        <div class="space-y-6">
          <!-- Account Info Card -->
          <div class="card">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <IdentificationIcon class="w-6 h-6 text-primary-600" />
              </div>
              <h2 class="text-xl font-bold text-gray-900">Thông tin tài khoản</h2>
            </div>
            <div class="space-y-4">
              <div class="p-4 bg-gray-50 rounded-xl">
                <p class="text-sm text-gray-600 mb-1">Tên đăng nhập</p>
                <p class="font-semibold text-gray-900">{{ authStore.user?.username }}</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-xl">
                <p class="text-sm text-gray-600 mb-1">Vai trò</p>
                <span
                  :class="authStore.user?.role === 'staff' ? 'bg-accent-100 text-accent-700' : 'bg-primary-100 text-primary-700'"
                  class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold"
                >
                  {{ authStore.user?.role === 'staff' ? 'Nhân viên' : 'Độc giả' }}
                </span>
              </div>
              <div class="p-4 bg-gray-50 rounded-xl">
                <p class="text-sm text-gray-600 mb-1">Ngày tham gia</p>
                <p class="font-semibold text-gray-900">
                  {{ formatDate(authStore.user?.createdAt) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Quick Stats (for readers) -->
          <div v-if="authStore.isReader" class="card">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                <ChartBarIcon class="w-6 h-6 text-accent-600" />
              </div>
              <h2 class="text-xl font-bold text-gray-900">Thống kê</h2>
            </div>
            <div class="space-y-4">
              <div class="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border border-primary-200">
                <p class="text-sm text-primary-700 mb-1">Sách đang mượn</p>
                <p class="text-2xl font-bold text-primary-900">{{ stats.activeBorrows || 0 }}</p>
              </div>
              <div class="p-4 bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl border border-accent-200">
                <p class="text-sm text-accent-700 mb-1">Yêu cầu chờ duyệt</p>
                <p class="text-2xl font-bold text-accent-900">{{ stats.pendingRequests || 0 }}</p>
              </div>
              <div class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <p class="text-sm text-gray-700 mb-1">Tổng số lần mượn</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.totalBorrows || 0 }}</p>
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
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'
import { 
  UserIcon, 
  LockClosedIcon, 
  IdentificationIcon, 
  ChartBarIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const updating = ref(false)
const changingPassword = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const stats = ref({
  activeBorrows: 0,
  pendingRequests: 0,
  totalBorrows: 0,
})

const profileForm = ref({
  fullName: '',
  phone: '',
  address: '',
  email: '',
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
})

const isPasswordValid = computed(() => {
  return passwordForm.value.newPassword.length >= 6 && passwordForm.value.currentPassword.length > 0
})

const loadProfile = () => {
  if (authStore.user) {
    profileForm.value = {
      fullName: authStore.user.fullName || '',
      phone: authStore.user.phone || '',
      address: authStore.user.address || '',
      email: authStore.user.email || '',
    }
  }
}

const loadStats = async () => {
  if (!authStore.isReader) return
  
  try {
    // Load borrow requests
    const requestsRes = await api.get('/borrow-requests/my-requests')
    const requests = requestsRes.data.data || []
    stats.value.pendingRequests = requests.filter(r => r.status === 'pending').length
    
    // Load borrow history
    const historyRes = await api.get('/borrow-slips/my-history')
    const history = historyRes.data.data || []
    stats.value.activeBorrows = history.filter(h => h.status === 'borrowed').length
    stats.value.totalBorrows = history.length
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const updateProfile = async () => {
  updating.value = true
  try {
    await api.put('/users/profile', {
      fullName: profileForm.value.fullName,
      phone: profileForm.value.phone,
      address: profileForm.value.address,
    })
    await authStore.fetchUser()
    loadProfile()
    alert('✅ Cập nhật thông tin thành công!')
  } catch (error) {
    alert(error.response?.data?.message || '❌ Có lỗi xảy ra')
  } finally {
    updating.value = false
  }
}

const changePassword = async () => {
  if (!isPasswordValid.value) return
  
  changingPassword.value = true
  try {
    await api.put('/users/change-password', passwordForm.value)
    passwordForm.value = { currentPassword: '', newPassword: '' }
    alert('✅ Đổi mật khẩu thành công!')
  } catch (error) {
    alert(error.response?.data?.message || '❌ Có lỗi xảy ra')
  } finally {
    changingPassword.value = false
  }
}

const getPasswordStrength = (password) => {
  if (!password) return { width: 0, text: '', color: '', textColor: '' }
  
  const length = password.length
  let strength = 0
  let text = 'Yếu'
  let color = 'bg-red-500'
  let textColor = 'text-red-600'
  
  if (length >= 6) strength++
  if (length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  if (strength >= 4) {
    text = 'Mạnh'
    color = 'bg-green-500'
    textColor = 'text-green-600'
  } else if (strength >= 2) {
    text = 'Trung bình'
    color = 'bg-yellow-500'
    textColor = 'text-yellow-600'
  }
  
  return {
    width: (strength / 5) * 100,
    text,
    color,
    textColor,
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  loadProfile()
  loadStats()
})
</script>

