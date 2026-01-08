<template>
    <div>
        <el-form  label-width="auto" label-position="top">
            <el-form-item label="下载范围">
                <el-input
                    :model-value="downConfStore.downExtent.join(',')"
                    style="width: 100%"
                    :rows="2"
                    type="textarea"
                    readonly
                    resize="none"
                />
            </el-form-item>
            <el-form-item :label="getdownZoomTitle">
                <el-slider v-model="downConfStore.downZoom" @change="tileTotalChange" range show-stops size="small" :max="18" :min="1" />
            </el-form-item>
            <el-form-item v-if="downConfStore.downExtent.length" label="瓦片数量" label-position="left">
                {{ downConfStore.tileTotal }}
            </el-form-item>
            <el-form-item label="下载坐标系">
                <el-select v-model="downConfStore.projection">
                    <el-option label="EPSG:3857" value="EPSG:3857"/>
                </el-select>
            </el-form-item>
            <el-form-item label="瓦片格式">
                <el-select v-model="downConfStore.downTilesType">
                    <el-option label="jpg" value="jpg"/>
                    <el-option label="png" value="png"/>
                </el-select>
            </el-form-item>
            <el-form-item label="下载路径">
                <el-input v-model="downConfStore.downPath" readonly @click="selectPath" />
            </el-form-item>
        </el-form>
        <el-button type="info" round plain style="width:100%" @click="download" >添加下载任务</el-button>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref,onMounted, watch } from 'vue'
    import { open as openDirDialog } from '@tauri-apps/plugin-dialog';
    import { getDownloadPath ,setDownloadPath } from '@/plugins/store/Setting'
    import { downloadMapManager } from '@/plugins/map/DownloadMapManager'
    import { calculateTileCount } from '@/plugins/map/Utils'
    import { useDownConfStore } from '@/store/modules/downConf'

    const downConfStore = useDownConfStore()
    const getdownZoomTitle =  computed(() => '下载层级（'+downConfStore.downZoom.join('-')+'）');

    const download = async () => {
        downloadMapManager.addDownloadTask()
    }

    const selectPath = async () => {
        const path = await openDirDialog({
            multiple: false,
            directory: true,
        })
        // console.log(path);
        if (!path) return
        downConfStore.downPath = path
        setDownloadPath(path)
    }

    const tileTotalChange = () => {
        downConfStore.tileTotal = calculateTileCount(downConfStore.downExtent,downConfStore.downZoom)
    }

    const init = async () => {
        downConfStore.downPath = await getDownloadPath()
    }

    watch(() => downConfStore.downExtent,()=>{
        tileTotalChange()
    })
    onMounted(() => {
        init()
    })


</script>

<style scoped>

</style>