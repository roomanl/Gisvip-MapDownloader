<template>
    <div class="header-container">
        <div class="right-container">
            <el-button text plain icon="SemiSelect" @click="minimize" />
            <el-button text plain icon="FullScreen" @click="toggleMaximize" />
            <el-button text plain icon="CloseBold" @click="close" />
        </div>
    </div>
    <div class="top-title" id="layout-toptitle-subpanel">

    </div>
</template>

<script setup lang="ts">
import{ref, onMounted } from 'vue'
import { getCurrentWindow } from '@tauri-apps/api/window';
import { ElMessageBox } from 'element-plus'

const appWindow = getCurrentWindow();
const isMaximized = ref(false)


const minimize = async () => {
  await appWindow.minimize()
}
const maximize = async () => {
  await appWindow.maximize()
  isMaximized.value = true
}
const unmaximize = async () => {
  await appWindow.unmaximize()
  isMaximized.value = false
}
const toggleMaximize = async () => {
    isMaximized.value = await appWindow.isMaximized()
    if (isMaximized.value) {
        await unmaximize()
    } else {
        await maximize()
    }
}
const close = async () => {
   ElMessageBox.confirm(
    '确定要关闭应用吗？',
    '提示',
    {
      confirmButtonText: '确 定',
      cancelButtonText: '取 消',
      type: 'warning',
      showClose:false,
      lockScroll:false,
      closeOnClickModal: false
    }
  ).then(() => {
    appWindow.close()
  }).catch(() => {})

}
onMounted(() => {
    // createTray()
})

</script>

<style scoped>
.header-container{
    position: relative;
    height: 30px;
    -webkit-app-region: drag;
}
.right-container{
    position: absolute;
    right: 0;
}
.top-title{
    padding: 0 20px;
    height: 30px;
    max-height: 30px;
    /* padding-bottom: 10px; */
    border-bottom: 1px solid var(--el-menu-border-color);
    -webkit-app-region: drag;
}
</style>