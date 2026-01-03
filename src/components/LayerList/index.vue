<template>
    <div>
         <el-scrollbar class="scrollbar">
            <el-tree
                :data="treeData"
                :props="props"
                default-expand-all
                @node-click = "nodeClick"
            />
         </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
    import { getCurrentInstance, onMounted, ref } from 'vue';
    import { ElNotification } from 'element-plus'
    import { layerList } from '@/maplib/LayerList';
    import {mapManager} from '@/maplib/MapManager';
    import { getTdtKey } from '@/utils/settingStore'
    import { useDownConfStore } from '@/store/modules/downConf'

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const downConfStore = useDownConfStore();
    const props = {
        label: 'label',
    }
    const treeData = ref([]);



    const nodeClick = async(data: any,node:any) => { 
        if(!data.url) return;
        if(data.id.includes('tdt')){
            const  tdtKey  = await getTdtKey();
            if(!tdtKey) {
                ElNotification({
                    title: '提示',
                    message: '请先设置天地图key',
                    type: 'warning',
                    duration: 2000
                })
                return;
            }
        }
        mapManager.loadBaseMap(data);
        downConfStore.downLayer = {layer:data,parent:node.parent.data};
        proxy?.$EventBus.emit('switch-map', {layer:data,parent:node.parent.data});
    }

    const init = async () => { 
        treeData.value = layerList;
        nodeClick(layerList[0].children[0],{parent: {data: layerList[0]}});
    }

    onMounted(() => {
        init();
    })

</script>

<style lang="scss" scoped>
.scrollbar{
    height : calc(100vh - 70px);
}
</style>