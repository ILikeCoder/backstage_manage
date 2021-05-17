/*
 * @Author: your name
 * @Date: 2021-03-04 11:33:55
 * @LastEditTime: 2021-05-17 16:05:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage_manage\src\router\index.js
 */
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
    component: () => import('views/login/Login')
  },
  {
    path: '/home',
    redirect: '/users',
    component: () => import('views/home/Home'),
    children: [
      {
        path: '/welcome',
        component: () => import('views/welcome/Welcome')
      },
      {
        path: '/users',
        component: () => import('views/users/Users')
      },
      {
        path: '/roles',
        component: () => import('views/roles/Roles')
      },
      {
        path: '/rights',
        component: () => import('views/rights/Rights')
      },
      {
        path: '/goods',
        component: () => import('views/goods/Goods')
      },
      {
        path: '/goods/add',
        component: () => import('views/goods/Addpage')
      },
      {
        path: '/params',
        component: () => import('views/goods/Params')
      },
      {
        path: '/categories',
        component: () => import('views/goods/Categories')
      },
      {
        path: '/orders',
        component: () => import('views/orders/Orders')
      },
      {
        path: '/reports',
        component: () => import('views/reports/Reports')
      }
    ]
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
