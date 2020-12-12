import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../views/login/Login.vue')
  },
  {
    path: '/home',
    component: () => import('../views/home/home.vue')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

/**
 * 路由导航守卫 控制登录是否放行
 */
router.beforeEach((to, form, next) => {
  if (to.path == '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
