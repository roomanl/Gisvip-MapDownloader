<template>
    <div>
        <el-form  label-width="auto" label-position="top">
            <el-form-item label="下载范围">
                <el-input
                    :model-value="downConfStore.downloadExtent.join(',')"
                    style="width: 100%"
                    :rows="2"
                    type="textarea"
                    readonly
                    resize="none"
                />
            </el-form-item>
            <el-form-item :label="getdownloadZoomTitle">
                <el-slider v-model="downConfStore.downloadZoom" range show-stops size="small" :max="19" :min="1" />
            </el-form-item>
            <el-form-item label="瓦片格式">
                <el-select v-model="downConfStore.tilesYype">
                    <el-option label="jpg" value="jpg"/>
                    <el-option label="png" value="png"/>
                </el-select>
            </el-form-item>
            <el-form-item label="下载路径">
                <el-input v-model="downConfStore.downloadPath" readonly @click="selectPath" />
            </el-form-item>
        </el-form>
        <el-button  size="small" round style="width:100%" @click="" >下 载</el-button>
    </div>
</template>

<script setup lang="ts">
    import { reactive, computed,ref, onMounted } from 'vue'
    import { open as openDirDialog } from '@tauri-apps/plugin-dialog';
    import { getDownloadPath ,setDownloadPath } from '@/utils/settingStore'
    import { useDownConfStore } from '@/store/modules/downConf'

    const downConfStore = useDownConfStore()


    const getdownloadZoomTitle =  computed(() => '下载层级（'+downConfStore.downloadZoom.join('-')+'）');

    const selectPath = async () => {
        const path = await openDirDialog({
            multiple: false,
            directory: true,
        })
        console.log(path);
        if (!path) return
        downConfStore.downloadPath = path
        setDownloadPath(path)
    }

    const init = async () => {
        downConfStore.downloadPath = await getDownloadPath()
    }

    onMounted(() => {
        init()
    })


</script>

<style scoped>

</style>