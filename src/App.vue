<script setup lang="ts">
import { onMounted } from 'vue'
import { createTray } from './utils/tray'
onMounted(() => {
  // 初始化
  createTray()
  .then(() => {
    console.log("创建托盘成功");
  })
  .catch((error: any) => {
    console.log("error", error);
  });
})
</script>

<template>
  <transition name="fade-transform" mode="out-in">
    <router-view />
  </transition>
</template>

<style lang="scss">
body{
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden;
}
</style>