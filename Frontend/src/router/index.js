import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/books',
    name: 'books',
    component: () => import('@/views/books/BooksView.vue'),
  },
  {
    path: '/books/:id',
    name: 'book-detail',
    component: () => import('@/views/books/BookDetailView.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/my-requests',
    name: 'my-requests',
    component: () => import('@/views/borrow/MyRequestsView.vue'),
    meta: { requiresAuth: true, requiresReader: true },
  },
  {
    path: '/my-history',
    name: 'my-history',
    component: () => import('@/views/borrow/MyHistoryView.vue'),
    meta: { requiresAuth: true, requiresReader: true },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, requiresStaff: true },
  },
  {
    path: '/admin/books',
    name: 'admin-books',
    component: () => import('@/views/admin/AdminBooksView.vue'),
    meta: { requiresAuth: true, requiresStaff: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } else if (to.meta.requiresStaff && authStore.user?.role !== 'staff') {
    next({ name: 'dashboard' })
  } else if (to.meta.requiresReader && authStore.user?.role !== 'reader') {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router

