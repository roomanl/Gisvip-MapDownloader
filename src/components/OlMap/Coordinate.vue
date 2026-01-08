<template>
    <div v-show="show" class="coordinate">
        <el-row>
            <el-col :span="13">
                <span>经度：{{coordinate[0].toFixed(6)}}</span>
            </el-col>
            <el-col :span="11">
                <span>纬度：{{coordinate[1].toFixed(6)}}</span>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref} from 'vue'
import {mapManager} from '@/plugins/map/MapManager';


const coordinate = ref([0,0]);
const show = ref(true);

const init = () => {
    coordinate.value = mapManager.olMap.transformCoordinates(mapManager.olMap.getMapView().getCenter(),mapManager.olMap.getMapView().getProjection(),'EPSG:4326');
    mapManager.olMap.getMap().on('pointermove', (evt:any)=>{
        coordinate.value = mapManager.olMap.transformCoordinates(evt.coordinate,mapManager.olMap.getMapView().getProjection(),'EPSG:4326')
        // show.value = true;
    })
}
onMounted(()=>{
    setTimeout(()=>{
        init();
    },500)
})
</script>

<style lang="scss" scoped>
.coordinate{
    // height: 30px;
    padding: 4px 10px;
    width: 280px;
    color: #000;
    border-radius: 5px;
    background-color: rgba($color: #fff, $alpha: 0.8);
}
</style>