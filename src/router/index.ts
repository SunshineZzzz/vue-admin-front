import { createRouter, createWebHashHistory } from 'vue-router'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
// 		   redirect: '/login'
//     },
//     {
//       name: 'login',
//       path: '/login',
//       component: () => import('@/views/login/index.vue')
//     },
//     {
//       name: 'menu',
//       path: '/menu',
//       component: () => import('@/views/menu/index.vue'),
//       children: [
//         {
//           name: 'home',
//           path: '/home',
//           component: () => import('@/views/home/index.vue')
//         },
//         {
//           name: 'set',
//           path: '/set',
//           component: () => import('@/views/menu_set/index.vue')
//         },
//         {
//           name: 'overview',
//           path: '/overview',
//           component: () => import('@/views/overview/index.vue')
//         },
//         {
//           name: 'users_manage',
//           path: '/users_manage',
//           component: () => import('@/views/user_manage/users_manage/index.vue')
//         },
//         {
//           name: 'user_list',
//           path: '/user_list',
//           component: () => import('@/views/user_manage/user_list/index.vue')
//         },
//         {
//           name: 'message_manage',
//           path: '/message_manage',
//           component: () => import('@/views/user_manage/message_manage/index.vue')
//         },
//         {
//           name: 'product_manage',
//           path: '/product_manage',
//           component: () => import('@/views/user_manage/product_manage/index.vue')
//         },
//         {
//           name: 'product_manage_list',
//           path: '/product_manage_list',
//           component: () => import('@/views/product/product_manage_list/index.vue')
//         },
//         {
//           name: 'out_product_manage_list',
//           path: '/out_product_manage_list',
//           component: () => import('@/views/product/out_product_manage_list/index.vue')
//         },
//         {
//           name: 'message_list',
//           path: '/message_list',
//           component: () => import('@/views/message/message_list/index.vue')
//         },
//         {
//           name: 'recycle_message_list',
//           path: '/recycle_message_list',
//           component: () => import('@/views/message/recycle_list/index.vue')
//         },
//         {
//           name: 'file',
//           path: '/file',
//           component: () => import('@/views/file/index.vue')
//         },
//         {
//           name: 'operation_log',
//           path: '/operation_log',
//           component: () => import('@/views/operation_log/index.vue')
//         }
//       ]
//     },
//   ],
// })

const routes:any = [
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
    name: '404',
    path: '/:catchAll(.*)',
    component: () => import('@/views/404/index.vue')
  },
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
});

// 全局路由前置守卫
router.beforeEach((to, from, next) => {
  // console.log('所有路由:', router.getRoutes())
	if (to.path === '/login') {
		next();
	} else {
		const token = localStorage.getItem('token');
		if (token) {
			next();
		} else {
			next('/login');
		}
	}
});

export default router
