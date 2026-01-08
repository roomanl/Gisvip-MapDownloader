<template>
    <div ref="rootmap" class="map-root">
        <slot name="content"></slot>
        <Coordinate class="coordinate" />
        <Zoomslider class="zoomslider" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import 'ol/ol.css'
import {mapManager} from '@/plugins/map/mapManager';
import Coordinate from './Coordinate.vue';
import Zoomslider from './Zoomslider.vue';

const rootmap = ref<HTMLElement | null>(null);


onMounted(() => {
    mapManager.initMap(rootmap.value);
});



</script>

<style lang="scss" scoped>
    .map-root{
        position: relative;
        height: calc(100vh - 60px);
        // height: 500px;
        width: 100%;
        // border:1px solid #eee;
        //cursor: crosshair;
        .ol-attribution{
        li{
            font-size: 14px;
        }
        
    }
    .coordinate{
        position: absolute;
        bottom: 10px;
        left: 10px;
        z-index: 999;
        box-shadow: 0px 2px 4px  rgba(0, 0, 0, 0.25);
    }
    .zoomslider{
        position: absolute;
        top: 100px;
        right: 10px;
        z-index: 999;
        box-shadow: 0px 2px 4px  rgba(0, 0, 0, 0.25);
    }

   

    :deep(.ol-zoom){
        background-color: rgba($color: #000000, $alpha: 0.5);
        box-shadow: 0px 2px 4px  rgba(0, 0, 0, 0.25);
        // padding: 0;
        width: 35px;
        height: 70px;
        left:auto;
        top:10px;
        right:10px;
        // bottom: .5em !important;
        // right: .5em !important;
        &:hover{
            background-color:rgba($color: #000000, $alpha: 0.3);
        }
        .ol-zoom-in,.ol-zoom-out{
            width: 35px;
            height: 35px;
            color: #444;
            background-color: #fff;
            font-size: 20px;
            cursor: pointer;
            margin: 0;
        }
        .ol-zoom-in{
            margin-bottom: 1px;
        }
    }
    :deep(.ol-zoomslider){
        left:auto;
        right: 10px;
        top:100px;
        box-shadow: 0px 2px 4px  rgba(0, 0, 0, 0.25);
        background-color: rgba(255,255,255,0.8);
        .ol-zoomslider-thumb{
            background-color: #444;
        }
    }
    :deep(.ol-mouse-position){
        padding: 5px 10px;
        width: 150px;
        height: 20px;
        line-height: 20px;
        top:auto;
        bottom: 10px;
        left: 10px;
        color: #000;
        border-radius: 5px;
        box-shadow: 0px 2px 4px  rgba(0, 0, 0, 0.25);
        background-color: rgba(255,255,255,0.8);
    }
    :deep(.ol-scale-line){
        left: 330px;
        bottom: 10px;
        box-shadow: 0px 2px 4px  rgba(0, 0, 0, 0.25);
        background-color: rgba(255,255,255,0.8);
        .ol-scale-line-inner{
            font-size: 16px;
        }
    }
    :deep(.ol-overviewmap){
        bottom: auto;
        left: auto;
        right: 0;
        bottom: 0;
        box-shadow: 0px 2px 4px  rgba(0, 0, 0, 0.25);
        &:not(.ol-collapsed)  {
            button{
                bottom: auto;
                left: auto;
                right: 1px;
                bottom: 1px;
            }
        }
        .ol-overviewmap-box {
            border: 2px solid red;
        }
    }
}
</style>