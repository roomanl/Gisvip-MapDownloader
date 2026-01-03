<template>
    <el-container>
        <el-aside width="65px" class="aside">
            <div class="logo">
                <img :src="logo">
            </div>
            <el-menu
                :default-active="menuactive"
                background-color="#545c64"
                text-color="#fff"
                class="el-menu-vertical"
                :collapse="true">

                <el-menu-item v-for="menu in appStore.leftTopMenu" :key="menu.key" :index="menu.key" @click="()=>menuClick(menu)">
                    <svg-icon  :icon-class="menu.icon" />
                    <template #title>{{ menu.title }}</template>
                </el-menu-item>
   
                <el-menu-item index="99" class="menu-setting">
                    <el-icon><setting /></el-icon>
                    <template #title>设置</template>
                </el-menu-item>
                <el-menu-item index="100" class="menu-about">
                    <el-icon><InfoFilled /></el-icon>
                    <template #title>关于</template>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main v-show="appStore.selectLeftMenu?.subPanel" class="subpanel">
            <div class="sub-title">
                <el-text class="sub-title-text" tag="b" size="large">{{ appStore.selectLeftMenu?.title }}</el-text>
            </div>
            <div id="layout-leftmenu-subpanel"></div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { ref,computed, getCurrentInstance } from 'vue'
import logo from '@/assets/logo.png'
import { useAppStore } from '@/store/modules/app'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const appStore = useAppStore()


const menuactive = computed(() => appStore.selectLeftMenu?.key);

const menuClick = (menu: ILeftMenu) => {
    appStore.selectLeftMenu = menu
    proxy?.$EventBus.emit('leftmenu-click', menu);
}

</script>

<style lang="scss" scoped>
.aside{
    background-color:#545c64;
    border-right: 1px solid var(--el-menu-border-color);
    overflow: hidden;
}
.el-menu-vertical{
    height: calc(100vh - 70px);
    background-color:#545c64;
}
.logo{
    width: 65px;
    height: 50px;
    background-color:transparent;
    text-align: center;
    margin-top: 20px;
    cursor: pointer;
    -webkit-app-region: drag;
    img{
        width: 40px;
        height: 40px;
    }
}
.el-menu{
    border-right: none;
}
.subpanel{
    padding: 10px;
    overflow: hidden;
}
.sub-title{
    height: 50px;
    // position: relative;
    display: flex;
    -webkit-app-region: drag;
    .sub-title-text{
    //    position: absolute;
    //    bottom: 0;
    }

}
.menu-setting{
    position: absolute;
    width: 100%;
    bottom: 56px;
}
.menu-about{
    position: absolute;
    width: 100%;
    bottom: 0px;
}
</style>