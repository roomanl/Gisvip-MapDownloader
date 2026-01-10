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
                <el-select v-model="downConfStore.tilesType">
                    <el-option label="jpg" value="jpg"/>
                    <el-option label="png" value="png"/>
                </el-select>
            </el-form-item>
            <el-form-item label="下载路径">
                <el-input v-model="downConfStore.downloadPath" readonly @click="selectPath" />
            </el-form-item>
        </el-form>
        <el-button  size="small" round style="width:100%" @click="download" >下 载</el-button>
    </div>
    <el-dialog
        v-model="dialogVisible"
        title="下载信息"
        width="70%"
        append-to-body
        lock-scroll
        align-center
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <span>This is a message</span>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">
            下 载
            </el-button>
        </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
    import { computed, ref,onMounted } from 'vue'
    import { open as openDirDialog } from '@tauri-apps/plugin-dialog';
    import { getDownloadPath ,setDownloadPath } from '@/utils/settingStore'
    import DownloadMapManager from '@/maplib/DownloadMapManager'
    import { useDownConfStore } from '@/store/modules/downConf'

    const downConfStore = useDownConfStore()
    const downloadMapManager = new DownloadMapManager()
    const getdownloadZoomTitle =  computed(() => '下载层级（'+downConfStore.downloadZoom.join('-')+'）');
    const dialogVisible = ref(false)

    const download = async () => {
        if(!await downloadMapManager.checkDownConf()){
            return
        }
        dialogVisible.value = true
    }

    const selectPath = async () => {
        const path = await openDirDialog({
            multiple: false,
            directory: true,
        })
        // console.log(path);
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