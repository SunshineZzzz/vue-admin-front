import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
		  redirect: '/login'
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login/index.vue')
    },
    {
      name: 'menu',
      path: '/menu',
      component: () => import('@/views/menu/index.vue'),
      children: [
        {
          name: 'home',
          path: '/home',
          component: () => import('@/views/home/index.vue')
        },
        {
          name: 'set',
          path: '/set',
          component: () => import('@/views/menu_set/index.vue')
        },
        {
          name: 'overview',
          path: '/overview',
          component: () => import('@/views/overview/index.vue')
        },
        {
          name: 'users_manage',
          path: '/users_manage',
          component: () => import('@/views/user_manager/users_manage/index.vue')
        },
        {
          name: 'user_list',
          path: '/user_list',
          component: () => import('@/views/user_manager/user_list/index.vue')
        },
        {
          name: 'message_manage',
          path: '/message_manage',
          component: () => import('@/views/user_manager/message_manage/index.vue')
        },
        {
          name: 'product_manage',
          path: '/product_manage',
          component: () => import('@/views/user_manager/product_manage/index.vue')
        },
      ]
    },
  ],
})

export default router
