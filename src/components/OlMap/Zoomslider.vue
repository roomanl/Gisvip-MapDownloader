<template>
    <div class="zoomslider">
        <el-button circle class="zoom-text">{{ zoom }}</el-button>
        <el-slider v-model="zoom" :min="1" max="19" vertical height="200px" @input="zoomChange" />
    </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';
import {mapManager} from '@/plugins/map/MapManager';

const zoom = ref(0);

const zoomChange = (val:any) => {
    mapManager.olMap?.setZoom(val);
}
const init = () => {
   zoom.value = Math.floor(mapManager.olMap.getMapView().getZoom());
    mapManager.olMap.getMapView().on('change:resolution',(evt:any)=>{
        zoom.value =Math.floor(evt.target.getZoom())
    })
}
onMounted(()=>{
    setTimeout(()=>{
        init();
    },500)
})
</script>

<style lang="scss" scoped>
    .zoomslider{
        width: 35px;
        display:flex ;
        flex-direction: column;
        align-items: center;
        padding-bottom: 15px;
        border-radius: 50px;
        background-color: rgba($color: #fff, $alpha: 0.8);
    }
    .zoom-text{
        width: 35px;
        height: 35px;
        margin-bottom: 10px;
    }

</style>