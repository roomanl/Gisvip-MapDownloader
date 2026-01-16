<template>
    <div :class="{'task-item':true, 'task-item-bg':props.task.id===downTaskStore.selectTask.id}"
        @click="downTaskStore.selectTask = props.task">
        <div>
            <el-text line-clamp="2">{{ props.task.mapName }} - {{ props.task.cityName }}</el-text>
        </div>
        <div>
            <el-text type="info" size="small">{{ props.task.createTime }}</el-text>
            <el-divider direction="vertical" />
            <el-text size="small" :style="{color:taskStatusColor}">{{taskStatusText }}</el-text>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useDownTaskStore } from '@/store/modules/downTask'
    import { downloadMapManager } from '@/plugins/map/DownloadMapManager'
    
    const downTaskStore = useDownTaskStore()
    const props =defineProps({
        task: Object,
    });

    const taskStatusText = computed(() => {
        const text = downloadMapManager.getTaskStatusAlis(props.task.taskStatus,'text')
        if(text == '下载中'){
            return props.task.percentage + '%'
        }
        return text
    })
    const taskStatusColor = computed(() => {
        return downloadMapManager.getTaskStatusAlis(props.task.taskStatus,'color')
    })
</script>

<style lang="scss" scoped>
.task-item{
    border-radius: 5px;
    padding: 5px 5px;
    margin-bottom: 10px;
    min-height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-bottom: #f0f0f0 1px solid;
    cursor: pointer;
    &:hover{
        background-color: rgb(236, 245, 255);
    }
}
.task-item-bg{
    background-color: rgb(236, 245, 255);
}
</style>