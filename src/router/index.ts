/**
 * @description: 路由
 * @return {*}
 */
import { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import Layout from '@/layout/index.vue'

export const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      component: () => import('@/views/welcome/index.vue'),
      name: 'Welcome'
    },{
      path: '/previewTiles',
      component: () => import('@/views/previewTiles/index.vue'),
      name: 'PreviewTiles'
    },{
    path: '/main',
    component: Layout,
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'Home'
      },{
        path: '/download',
        component: () => import('@/views/download/index.vue'),
        name: 'Download'
      },{
        path: '/setting',
        component: () => import('@/views/setting/index.vue'),
        name: 'Setting'
      },{
        path: '/about',
        component: () => import('@/views/about/index.vue'),
        name: 'About'
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
