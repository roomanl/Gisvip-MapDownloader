<template>
    <div>
        <Teleport defer to="#layout-toptitle-subpanel">
            <TopTile v-if="appStore.selectLeftMenu.key=='home'" />
        </Teleport>
         <Teleport defer to="#layout-leftmenu-subpanel">
            <LeftPanel v-show="appStore.selectLeftMenu.key=='home'" />
        </Teleport>
        <div>
            <OlMap>
                <template #content>
                    <DrawBtn class="draw-btn" />
                </template>

            </OlMap>
        </div>

    </div>
</template>

<script setup lang="ts" name="Home">
import { getCurrentInstance, ref,onBeforeUnmount } from 'vue'
import { useAppStore } from '@/store/modules/app'
import LeftPanel from './components/LeftPanel'
import TopTile from './components/TopTile.vue';
import DrawBtn from './components/DrawBtn.vue';
import OlMap from '@/components/OlMap'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const appStore = useAppStore()


proxy?.$EventBus.on('leftmenu-click', (menu: ILeftMenu)=>{
    // console.log(menu)
});


onBeforeUnmount(()=>{
    proxy?.$EventBus.off('leftmenu-click');
})



</script>

<style scoped>
.draw-btn{
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 99;
}
</style>