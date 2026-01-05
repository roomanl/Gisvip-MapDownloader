<template>
    <div>
        <el-tabs v-model="activeName" class="tabs">
            <el-tab-pane label="下载中" name="1">
                <el-empty description="暂无下载中的任务" />
            </el-tab-pane>
            <el-tab-pane label="已完成" name="2">
                <el-empty description="暂无已完成的任务" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const activeName = ref('1')

</script>

<style scoped>

</style>