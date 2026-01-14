<template>
    <div :class="{'task-item':true, 'task-item-bg':props.task.id===downTaskStore.selectTask.id}"
        @click="downTaskStore.selectTask = props.task">
        <div>
            <el-text>{{ props.task.mapName }} - {{ props.task.cityName }}</el-text>
        </div>
        <div>
            <el-text type="info">{{ props.task.createTime }}</el-text>
            <el-divider direction="vertical" />
            <el-text type="info">{{ props.task.percentage }}%</el-text>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useDownTaskStore } from '@/store/modules/downTask'
    
    const downTaskStore = useDownTaskStore()
    const props =defineProps({
        task: Object,
    });
</script>

<style lang="scss" scoped>
.task-item{
    border-radius: 5px;
    padding: 5px 5px;
    min-height: 80px;
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