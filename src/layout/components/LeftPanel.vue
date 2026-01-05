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
   
                <el-menu-item 
                    v-for="(menu,index) in appStore.leftBottomMenu" 
                    :key="menu.key" 
                    :index="menu.key" 
                    @click="()=>menuClick(menu)"
                    class="bottom-menu"
                    :style="{
                        bottom:((appStore.leftBottomMenu.length-(index+1))*56)+'px'
                    }">
                    <svg-icon  :icon-class="menu.icon" />
                    <template #title>{{ menu.title }}</template>
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
import { ref,computed, getCurrentInstance, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import logo from '@/assets/logo.png'
import { useAppStore } from '@/store/modules/app'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const route = useRoute()
const appStore = useAppStore()


const menuactive = computed(() => appStore.selectLeftMenu?.key);

const menuClick = (menu: ILeftMenu) => {
    if(route.path!=menu.router){
        proxy?.$router.push(menu.router)
    }
    appStore.selectLeftMenu = menu
    proxy?.$EventBus.emit('leftmenu-click', menu);
}

const init = () => { 
    const topMeun =appStore.leftTopMenu.find((item:ILeftMenu) => item.router === route.path)
    const bottomMeun =appStore.leftBottomMenu.find((item:ILeftMenu) => item.router === route.path)
    appStore.selectLeftMenu = topMeun || bottomMeun
}

onMounted(() => {
    init()
})

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
.bottom-menu{
    position: absolute;
    width: 100%;
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