<template>
    <div>
        <el-tabs v-model="activeName" class="tabs">
            <el-tab-pane label="下载配置" name="1">
                <DownloadMapSetting />
            </el-tab-pane>
            <el-tab-pane label="地图源" name="2">
                <LayerList />
            </el-tab-pane>
            <el-tab-pane label="区域" name="3">
                <ChinaAreasTree />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DownloadMapSetting from './DownloadMapSetting'
import LayerList from './LayerList'
import ChinaAreasTree from './ChinaAreasTree'


    const activeName = ref('1')

</script>

<style scoped>

</style>