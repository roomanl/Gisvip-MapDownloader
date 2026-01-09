import { createApp } from "vue";

import { invoke } from "@tauri-apps/api/core";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import mitt from 'mitt';

import App from "./App.vue";
import router from "./router";
import store from './store'
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import elementIcons from '@/components/SvgIcon/svgicon'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(router);
app.use(store)
app.use(elementIcons)
app.component('svg-icon', SvgIcon)
app.mount("#app");
app.config.globalProperties.$EventBus = mitt()


window.addEventListener("DOMContentLoaded", () => {
   invoke("show_main_window");;
});
