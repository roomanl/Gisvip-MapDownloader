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
    import { getCurrentInstance, ref } from 'vue';
    import { toStringXY} from 'ol/coordinate'
    import {mapManager} from '@/maplib/MapManager';
    import { useDownConfStore } from '@/store/modules/downConf'


    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const downConfStore = useDownConfStore();
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
        mapManager.drawTool.clear();
        mapManager.drawTool.startDraw({
            type: 'Box',
            drawEnd: (evt: any) => {
                const extent = evt.feature.getGeometry().getExtent().map(num => parseFloat(num.toFixed(6)));
                downConfStore.downloadExtent = extent;
                proxy?.$EventBus.emit('switch-area', {area:{name:'自定义区域'},parent:{}});
            }
        });
    };
    const clean = () => {
        mapManager.drawTool.clear();
        downConfStore.downloadExtent = []
        proxy?.$EventBus.emit('switch-area', {area:{},parent:{}});
    };

</script>

<style scoped>
.button-group{
     box-shadow: 0px 2px 4px  rgba(0, 0, 0, 0.25);
     border-radius: 5px;
}
</style>