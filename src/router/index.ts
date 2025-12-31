/**
 * @description: 路由
 * @return {*}
 */
import { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHashHistory } from "vue-router";
import Layout from '@/layout'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home'),
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
