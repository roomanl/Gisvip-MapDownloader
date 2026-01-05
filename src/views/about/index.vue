<template>
    <div>
        <Teleport defer to="#layout-toptitle-subpanel">
            <div v-if="appStore.selectLeftMenu.key=='about'">
                {{ titleText }}
            </div>
        </Teleport>
        <Teleport defer to="#layout-leftmenu-subpanel">
            <LeftPanel v-show="appStore.selectLeftMenu.key=='about'" @meunClick="meunClick" />
        </Teleport>
    </div>
</template>

<script setup lang="ts" name="About">
    import { ref } from 'vue';
    import { useAppStore } from '@/store/modules/app'
    import LeftPanel from './components/LeftPanel.vue';

    const appStore = useAppStore()
    const titleText = ref('')

    const meunClick = (meun: any) => {
        titleText.value = meun.label
    }
</script>

<style scoped>

</style>