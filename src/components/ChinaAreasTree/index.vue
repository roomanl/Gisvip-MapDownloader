<template>
    <div>
         <el-scrollbar class="scrollbar">
            <el-tree
                :props="props"
                :load="loadNode"
                lazy
                @node-click = "nodeClick"
            />
         </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
    import axios from 'axios';
    import { getCurrentInstance, onMounted, ref } from 'vue';
    import { getChinaAreasTree } from '@/utils';
    import {mapManager} from '@/maplib/MapManager';
    import { useDownConfStore } from '@/store/modules/downConf'

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const downConfStore = useDownConfStore();
    const axiosHttp = axios.create({
        baseURL: 'https://geo.datav.aliyun.com/areas_v3/bound/',
        timeout: 60000,
    });
    const props = {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf',
    }

    const getAreasjson = async (adcode : string) => {
        const res = await axiosHttp.get(adcode+'_full.json');
        // console.log(res.data);
        const tree = await getChinaAreasTree(res.data);
        return tree;
    }

    const loadNode = async (node: any, resolve: any) => { 
        if (node.level === 0) {
            const data = await getAreasjson('100000');
            return resolve(data)
        }
        if (node.level > 3) return resolve([])
        const data = await getAreasjson(node.data.adcode);
        resolve(data)
    }

    const nodeClick = (data: any,node:any) => { 
        console.log(data);
        mapManager.selectArea(data);
        downConfStore.downArea = {area:data,parent:node.parent.data};
        proxy?.$EventBus.emit('switch-area', {area:data,parent:node.parent.data});
    }

    const init = async () => { 
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