/**
 * @description: 路由
 * @return {*}
 */
import { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHashHistory } from "vue-router";
import Layout from '@/layout/index.vue'

export const routes: Array<RouteRecordRaw> = [
  {
      path: '/',
      component: () => import('@/views/welcome/index.vue'),
      name: 'Welcome'
    },{
    path: '/main',
    component: Layout,
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'Home'
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
