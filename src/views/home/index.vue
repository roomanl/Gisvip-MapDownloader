<template>
    <div>
        <Teleport defer to="#layout-leftmenu-subpanel">
            <LayerList v-show="appStore.selectLeftMenu.key=='layers'" />
            <DownloadMapSetting v-show="appStore.selectLeftMenu.key=='download'" />
            <ChinaAreasTree v-show="appStore.selectLeftMenu.key=='downloadExtent'" />
            <MapKeySetting v-show="appStore.selectLeftMenu.key=='mapkey'" />
        </Teleport>
        <Teleport defer to="#layout-toptitle-subpanel">
            <TopTile v-if="appStore.selectLeftMenu.type=='top'" />
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

<script setup lang="ts">
    import { getCurrentInstance, ref,onBeforeUnmount } from 'vue'
import { useAppStore } from '@/store/modules/app'
import ILeftMenu from '@/types/ILeftMenu';
import MapKeySetting from '@/components/MapKeySetting'
import ChinaAreasTree from '@/components/ChinaAreasTree'
import DownloadMapSetting from '@/components/DownloadMapSetting'
import LayerList from '@/components/LayerList'
import TopTile from './components/TopTile.vue';
import DrawBtn from './components/DrawBtn.vue';
import OlMap from '@/components/OlMap'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const appStore = useAppStore()


proxy?.$EventBus.on('leftmenu-click', (menu: ILeftMenu)=>{
    console.log(menu)
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