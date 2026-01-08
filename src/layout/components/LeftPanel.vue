<template>
    <el-container>
        <el-aside width="65px" class="aside">
            <div class="logo">
                <img :src="logo">
            </div>
            <el-menu
                default-active="2"
                background-color="#545c64"
                text-color="#fff"
                class="el-menu-vertical"
                :collapse="true">

                <el-menu-item index="2">
                <el-icon><icon-menu /></el-icon>
                <template #title>Navigator Two</template>
                </el-menu-item>
                <el-menu-item index="3" >
                <el-icon><document /></el-icon>
                <template #title>Navigator Three</template>
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
        <el-main>
            
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import logo from '@/assets/logo.png'

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