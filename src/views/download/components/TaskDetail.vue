<template>
    <div class="task-detail">
        <el-form  label-width="auto" label-suffix="：" label-position="right" size="large">
            <el-form-item label="地图源">
                <el-text class="text-info" type="info" size="default">{{ downTaskStore.selectTask.mapName }}</el-text>
            </el-form-item>
            <el-form-item label="下载区域">
                <el-text class="text-info" type="info" size="default">{{ downTaskStore.selectTask.cityName }}</el-text>
            </el-form-item>
            <el-form-item label="下载面积">
                <el-text class="text-info" type="info" size="default">{{ downTaskStore.selectTask.cityArea }}</el-text>
            </el-form-item>
            <el-form-item label="下载层级">
                <el-text class="text-info" type="info" size="default">{{ downTaskStore.selectTask.downZoom }}</el-text>
            </el-form-item>
            <el-form-item label="坐标范围">
                <el-text class="text-info" type="info" size="default">{{ downTaskStore.selectTask.downExtent }}</el-text>
            </el-form-item>
            <el-form-item label="源坐标系">
                <el-text class="text-info" type="info" size="default">{{ downTaskStore.selectTask.projection }}</el-text>
            </el-form-item>
            <el-form-item label="瓦片注记">
                <el-text class="text-info" type="info" size="default">{{ labelLayerText }}</el-text>
            </el-form-item>
            <el-form-item label="瓦片格式">
                <el-text class="text-info" type="info" size="default">{{ downTaskStore.selectTask.downTilesType }}</el-text>
            </el-form-item>
            <el-form-item label="瓦片总数">
                <el-text class="text-info" type="info" size="default">{{ downTaskStore.selectTask.tileTotal }}</el-text>
             </el-form-item>
            <el-form-item label="保存路径">
                <el-text class="text-info" type="info" size="default" line-clamp="2">{{ downTaskStore.selectTask.downPath }}</el-text>
            </el-form-item>
            <!-- <el-form-item label="下载地址">
                <el-text class="text-info" type="info" size="default" line-clamp="1">{{ downTaskStore.selectTask.downUrl }}</el-text>
            </el-form-item> -->
            <el-form-item v-if="downTaskStore.selectTask.downStatus!=1">
                <div style="padding-top: 20px;width: 100%;">
                    <el-progress :percentage="downTaskStore.selectTask.percentage" />
                </div>
                <div style="width: 100%;text-align: center;">
                    <el-text :style="{color:taskStatusColor}">{{ taskStatusText }}</el-text>
                    <el-divider direction="vertical" />
                    <el-text type="primary">总瓦片数：{{ downTaskStore.selectTask.tileTotal }}</el-text>
                    <el-divider direction="vertical" />
                    <el-text type="success">成功：{{ downTaskStore.selectTask.successTotal }}</el-text>
                    <el-divider direction="vertical" />
                    <el-text type="danger">失败：{{ downTaskStore.selectTask.errorTotal }}</el-text>
                </div>
            </el-form-item>
        </el-form>
        <div class="footer">
            <el-button 
                v-if="['pending','paused','error'].includes(downTaskStore.selectTask.taskStatus)" 
                type="primary" @click="startTask">开始下载</el-button>
            <el-button v-if="downTaskStore.selectTask.taskStatus=='downloading'" type="warning" @click="stopDownload">暂停下载</el-button>
            <el-button v-if="downTaskStore.selectTask.taskStatus=='completed'" type="primary" @click="openFolder">打开所在文件夹</el-button>
            <el-button v-if="downTaskStore.selectTask.taskStatus=='completed'" type="success" @click="openWindow">离线预览</el-button>
            <el-button v-if="downTaskStore.selectTask.taskStatus!='downloading'" type="danger" @click="deleteTask">删除任务</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue';
    import { openPath } from '@tauri-apps/plugin-opener';
    import { Window } from "@tauri-apps/api/window"
    import { ElMessageBox,ElNotification } from 'element-plus'
    import { downloadMapManager } from '@/plugins/map/DownloadMapManager'
    import { useDownTaskStore } from '@/store/modules/downTask'

    const downTaskStore = useDownTaskStore()
    const window = new Window('previewTiles')

    const taskStatusText = computed(() => {
        return downloadMapManager.getTaskStatusAlis(downTaskStore.selectTask.taskStatus,'text')
    })
    const taskStatusColor = computed(() => {
        return downloadMapManager.getTaskStatusAlis(downTaskStore.selectTask.taskStatus,'color')
    })
    const labelLayerText = computed(() => {
        const downLayer = JSON.parse(downTaskStore.selectTask.downLayer)
        return downLayer.labelLayer?'无注记':'自带注记'
    })
    const startTask = async () => {
        const task = downTaskStore.getTaskInfo(downTaskStore.selectTask.id)
        if(task){
            downloadMapManager.startDownload(task)
        }else{
            ElNotification({
                title: '提示',
                message: '任务异常,无法启动下载',
                type: 'warning',
                duration: 2000
            })
        }
    }

    const deleteTask = async () => {
        ElMessageBox.confirm(
            '将删除任务，请确认是否继续操作（只会删除任务记录，不会删除本地的文件）？',
            '提示',
            {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning',
            showClose:false,
            lockScroll:false,
            closeOnClickModal: false
            }
        ).then(() => {
            downloadMapManager.deleteDownloadTask(downTaskStore.selectTask.id)
        }).catch(() => {})
    }
    const stopDownload = async () => {
        downloadMapManager.stopDownload(downTaskStore.selectTask.id)
    }

    const openFolder = async () => {
        await openPath(downTaskStore.selectTask.downPath)
    }

    const openWindow = async () => {
        
        window.show()
    }
    onMounted(() => {
    })

</script>

<style lang="scss" scoped>
    .task-detail{
        padding: 20px 50px;
        position: relative;
        height: calc(100vh - 100px);
    }
    .text-info{
        line-height: 20px;
    }
    .footer{
        padding: 20px 0;
        width: calc(100% - 100px);
        text-align: center;
        position: absolute;
        bottom: 0;
        // transform: translateX(50%);
        
        // width: 100%;
    }
:deep(.el-form-item){
    margin-bottom: 0px !important;
}
:deep(.el-form-item__label){
    font-weight: 700;
}
</style>