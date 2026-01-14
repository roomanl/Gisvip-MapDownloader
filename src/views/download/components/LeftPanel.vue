<template>
    <div>
        <el-tabs v-model="activeName" class="tabs">
            <el-tab-pane label="下载中" name="1">
                <el-empty v-if="downTaskStore.downloadTasks.length==0" description="暂无下载中的任务" />
                <el-scrollbar v-else class="scrollbar">
                    <div v-for="task in downTaskStore.downloadTasks" :key="task.id">
                        <TaskItem :task="task" />
                    </div>
                </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane label="已完成" name="2">
                <el-empty v-if="downTaskStore.finishTasks.length==0" description="暂无已完成的任务" />
                <el-scrollbar v-else class="scrollbar">
                    <div v-for="task in downTaskStore.finishTasks" :key="task.id">
                        <TaskItem :task="task" />
                    </div>
                </el-scrollbar>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useDownTaskStore } from '@/store/modules/downTask'
    import TaskItem from './TaskItem.vue';

    const downTaskStore = useDownTaskStore()
    const activeName = ref('1')

</script>

<style scoped>
.scrollbar{
    height : calc(100vh - 120px);
}
</style>