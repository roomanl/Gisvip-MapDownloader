<template>
    <div class="app-main">
        <el-container class="container">
            <el-aside :width="appStore.leftMenuPanelWidth" class="aside">
                <LeftPanel></LeftPanel>
            </el-aside>
             <el-container>
                <el-header>
                    <topHeader></topHeader>
                </el-header>
                <el-main class="main-container">
                    <router-view v-slot="{ Component, route }">
                        <transition name="fade-transform" mode="out-in">
                            <keep-alive>
                            <component :is="Component" :key="route.path"/>
                            </keep-alive>
                        </transition>
                    </router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import topHeader from './components/Header.vue';
import LeftPanel from './components/LeftPanel.vue';
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.app-main,.container {
  /* 50= navbar  50  */
  min-height: calc(100vh - 0px);
  width: 100%;
  padding: 0;
  position: relative;
  overflow: hidden;
}
.main-container{
    padding: 0;
}
.aside{
    border-right: 1px solid var(--el-menu-border-color);
    overflow: hidden;
}
.el-header{
    padding: 0;
}
</style>

