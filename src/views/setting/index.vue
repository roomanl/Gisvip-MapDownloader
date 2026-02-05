<template>
    <div>
        <Teleport defer to="#layout-toptitle-subpanel">
           <div v-if="appStore.selectLeftMenu.key=='setting'">
                {{ titleText }}
            </div>
        </Teleport>
        <Teleport defer to="#layout-leftmenu-subpanel">
            <LeftPanel v-show="appStore.selectLeftMenu.key=='setting'" @meunClick="meunClick" />
        </Teleport>
        <div>
            <el-tabs v-model="activeName">
                <el-tab-pane :name="0"><MapKeySetting /></el-tab-pane>
                <el-tab-pane :name="1"><DownSetting /></el-tab-pane>
            </el-tabs>
            
        </div>
    </div>
</template>

<script setup lang="ts" name="Setting">
    import { ref } from 'vue';
    import { useAppStore } from '@/store/modules/app'
    import LeftPanel from './components/LeftPanel.vue';
    import MapKeySetting from './components/MapKeySetting'
    import DownSetting from './components/DownSetting'

    const appStore = useAppStore()
    const titleText = ref('')
    const activeName = ref(0)

    const meunClick = (meun: any) => {
        titleText.value = meun.label
        activeName.value = meun.name
    }
</script>

<style lang="scss" scoped>
:deep(.el-tabs__header){
    display: none;
}
:deep(.el-tabs__content){
    padding: 20px;
}
</style>