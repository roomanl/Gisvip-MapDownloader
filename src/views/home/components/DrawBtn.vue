<template>
    <div>
        <el-button-group class="button-group" direction="horizontal">
            <el-button title="显示网格" @click="addGridLayer"><svg-icon  icon-class="grid" /></el-button>
            <el-button title="绘制范围" @click="startDraw"><svg-icon  icon-class="rectangle" /></el-button>
            <el-button title="清除绘制" @click="clean"><svg-icon  icon-class="clean" /></el-button>
        </el-button-group>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import {mapManager} from '@/plugins/map/MapManager';

    const showGridLayer = ref(false);
    const addGridLayer = () => {
        if (!showGridLayer.value) {
            mapManager.olMap.addGraticule();
            showGridLayer.value = true;
        } else {
            mapManager.olMap.removeGraticule();
            showGridLayer.value = false;
        }
    };

    const startDraw = () => {
        mapManager.drawExtent();
    };
    const clean = () => {
        mapManager.clearExtent();
    };

</script>

<style scoped>
.button-group{
     box-shadow: 0px 2px 4px  rgba(0, 0, 0, 0.25);
     border-radius: 5px;
}
</style>