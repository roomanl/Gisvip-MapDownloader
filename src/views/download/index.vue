<template>
    <div>
        <Teleport defer to="#layout-toptitle-subpanel">
            <div v-if="appStore.selectLeftMenu.key=='download'">
                {{ titleText }}
            </div>
        </Teleport>
        <Teleport defer to="#layout-leftmenu-subpanel">
            <div v-show="appStore.selectLeftMenu.key=='download'">
               <LeftPanel />
            </div>
        </Teleport>
        <div>
            <el-empty description="暂无下载数据">
                 <el-button type="primary" round plain @click="goHome">去下载</el-button>
            </el-empty>
        </div>
    </div>
</template>

<script setup lang="ts" name="Download">
    import { ref } from 'vue';
    import { useAppStore } from '@/store/modules/app'
    import LeftPanel from './components/LeftPanel.vue';

    const appStore = useAppStore()
    const titleText = ref('下载管理')

    const goHome = () => {
        appStore.openViewByIndex(0)
    }

    
</script>

<style scoped>

</style>