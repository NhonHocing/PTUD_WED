<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <BookOpenIcon class="w-10 h-10 text-white" />
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Đăng ký</h2>
        <p class="mt-2 text-gray-600">Tạo tài khoản mới</p>
      </div>

      <div class="card">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <div>
            <label class="label">Tên đăng nhập</label>
            <input
              v-model="form.username"
              type="text"
              required
              class="input-field"
              placeholder="Nhập tên đăng nhập"
            />
          </div>

          <div>
            <label class="label">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="Nhập email"
            />
          </div>

          <div>
            <label class="label">Họ và tên</label>
            <input
              v-model="form.fullName"
              type="text"
              required
              class="input-field"
              placeholder="Nhập họ và tên"
            />
          </div>

          <div>
            <label class="label">Mật khẩu</label>
            <input
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="input-field"
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            />
          </div>

          <div>
            <label class="label">Số điện thoại (tùy chọn)</label>
            <input
              v-model="form.phone"
              type="tel"
              class="input-field"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div>
            <label class="label">Địa chỉ (tùy chọn)</label>
            <input
              v-model="form.address"
              type="text"
              class="input-field"
              placeholder="Nhập địa chỉ"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Đang đăng ký...</span>
            <span v-else>Đăng ký</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Đã có tài khoản?
            <router-link
              to="/login"
              class="text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
            >
              Đăng nhập
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { BookOpenIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  email: '',
  password: '',
  fullName: '',
  phone: '',
  address: '',
})

const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  const result = await authStore.register(form.value)

  if (result.success) {
    router.push('/dashboard')
  } else {
    error.value = result.message
  }

  loading.value = false
}
</script>

