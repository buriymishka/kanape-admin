import Vue from 'vue'
import VueRouter from 'vue-router'
import EntranceLayout from '@/layouts/Entrance.vue'
import AdminLayout from '@/layouts/Admin.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: AdminLayout,
    redirect: { name: 'Orders' },
    children: [
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/pages/orders/Index.vue')
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/pages/products/Index.vue')
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/pages/categories/Index.vue')
      },
      {
        path: 'info',
        name: 'Info',
        component: () => import('@/pages/Info.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/pages/Profile.vue')
      }
    ]
  },
  {
    path: '',
    component: EntranceLayout,
    name: 'EntranceLayout',
    redirect: { name: 'Login' },
    beforeEnter(to, from, next) {
      console.log(store.getters['user/user'])
      if (store.getters['user/user']){
        next({ name: 'Orders' })
      } else {
        next()
      }
    },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/pages/entrance/Login.vue')
      },
      {
        path: 'recover',
        name: 'Recover',
        component: () => import('@/pages/entrance/Recover.vue')
      }
    ]
  },
  {
    path: '*',
    redirect: { name: 'Orders' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
