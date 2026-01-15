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
    import { onMounted, ref } from 'vue';
    import { layerList } from '@/plugins/map/LayerList';
    import {mapManager} from '@/plugins/map/MapManager';
    import { isTdt,checkTdtKeyTip } from '@/plugins/map/Utils'

    const props = {
        label: 'label',
    }
    const treeData = ref([]);



    const nodeClick = async(data: any,node:any) => { 
        if(!data.url) return;
        if(isTdt(data.id) && !await checkTdtKeyTip()){
            return;
        }
        mapManager.loadBaseMap(data,node.parent.data);
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