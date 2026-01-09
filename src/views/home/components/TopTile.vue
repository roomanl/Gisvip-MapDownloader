<template>
    <div class="top-tile">
        <div class="title inline">{{downConfStore.mapName}}</div>
        <div class="cityname inline">
            <el-divider direction="vertical" />
            {{ downConfStore.cityName }}
        </div>
        <div class="inline">
            <el-divider direction="vertical" />
            {{ downConfStore.cityArea }}
        </div>
        <!-- <div class="inline projection">
            <el-text type="info">底图坐标系：EPSG:3857</el-text>
        </div> -->
    </div>
</template>

<script setup lang="ts">
import { useDownConfStore } from '@/store/modules/downConf'

    const downConfStore = useDownConfStore();


</script>

<style scoped>
.inline{
    display: inline;
}
.projection{
    float: right;
}
</style>