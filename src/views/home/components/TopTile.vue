<template>
    <div class="top-tile">
        <div class="title inline">{{mapName}}</div>
        <div class="cityname inline">
            <el-divider direction="vertical" />
            {{ cityName }}
        </div>
        <div class="inline">
            <el-divider direction="vertical" />
            {{ cityAera }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDownConfStore } from '@/store/modules/downConf'

    const downConfStore = useDownConfStore();

    const mapName = computed(()=>{
        if(!downConfStore.downLayer){
            return '未选择地图'
        }
        return downConfStore.downLayer.parent.label+' - '+ downConfStore.downLayer.layer.label
    });
    const cityName = computed(()=>{
        if(!downConfStore.downArea){
            return '未选择下载区域'
        }
        const {city,parentCity} = downConfStore.downArea
        const names = []
        if(parentCity.name){
            names.push(parentCity.name);
        }
        if(city.name){
            names.push( city.name);
        }
        return names.join(' - ')
    });
    const cityAera = computed(()=>{
        if(!downConfStore.downArea){
            return ''
        }
        return downConfStore.downArea.area
    })


</script>

<style scoped>
.inline{
    display: inline;
}
</style>