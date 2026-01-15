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
            <el-form-item label="瓦片格式">
                <el-text class="text-info" type="info" size="default">{{ downTaskStore.selectTask.downTilesType }}</el-text>
            </el-form-item>
            <el-form-item label="保存路径">
                <el-text class="text-info" type="info" size="default" line-clamp="5">{{ downTaskStore.selectTask.downPath }}</el-text>
            </el-form-item>
            <el-form-item label="下载地址">
                <el-text class="text-info" type="info" size="default" line-clamp="5">{{ downTaskStore.selectTask.downUrl }}</el-text>
            </el-form-item>
            <el-form-item v-if="downTaskStore.selectTask.downStatus==0">
                <div style="padding-top: 20px;width: 100%;">
                    <el-progress :percentage="downTaskStore.selectTask.percentage" />
                </div>
                <div style="width: 100%;text-align: center;">
                    <el-text type="warning">{{ taskStatusText }}</el-text>
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
            <el-button v-if="downTaskStore.selectTask.taskStatus=='waiting'" type="primary" @click="startTask">开始下载</el-button>
            <el-button v-if="downTaskStore.selectTask.taskStatus=='downloading'" type="warning">暂停下载</el-button>
            <el-button v-if="downTaskStore.selectTask.taskStatus!='downloading'" type="danger" @click="deleteTask">删除任务</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { ElMessageBox } from 'element-plus'
    import { downloadMapManager } from '@/plugins/map/DownloadMapManager'
    import { useDownTaskStore } from '@/store/modules/downTask'

    const downTaskStore = useDownTaskStore()

    const taskStatusText = computed(() => {
        return downloadMapManager.getTaskStatusText(downTaskStore.selectTask.taskStatus)
    })
    const startTask = async () => {
        downloadMapManager.startDownload(downTaskStore.selectTask)
    }

    const deleteTask = async () => {
        ElMessageBox.confirm(
            '此处将删除任务，请确认是否继续操作（只会删除任务记录，不会删除本地的文件）？',
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
        // await downloadMapManager.deleteDownloadTask(downTaskStore.selectTask.id)
        // downTaskStore.tasks = await downloadMapManager.getDownloadTasks()
        // downTaskStore.selectTask = downTaskStore.tasks[0]
    }

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
        padding: 20px;
        width: calc(100vh - 100px);
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