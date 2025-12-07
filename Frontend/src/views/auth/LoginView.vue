<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <BookOpenIcon class="w-10 h-10 text-white" />
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Đăng nhập</h2>
        <p class="mt-2 text-gray-600">Vào tài khoản của bạn</p>
      </div>

      <div class="card">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <div>
            <label class="label">Tên đăng nhập hoặc Email</label>
            <input
              v-model="form.username"
              type="text"
              required
              class="input-field"
              placeholder="Nhập tên đăng nhập hoặc email"
            />
          </div>

          <div>
            <label class="label">Mật khẩu</label>
            <input
              v-model="form.password"
              type="password"
              required
              class="input-field"
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Đang đăng nhập...</span>
            <span v-else>Đăng nhập</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Chưa có tài khoản?
            <router-link
              to="/register"
              class="text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
            >
              Đăng ký ngay
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { BookOpenIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: '',
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  const result = await authStore.login(form.value)

  if (result.success) {
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } else {
    error.value = result.message
  }

  loading.value = false
}
</script>

