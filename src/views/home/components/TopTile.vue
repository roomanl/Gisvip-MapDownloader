<template>
    <div class="top-tile">
        <div class="title">{{title}}</div>
        <div class="areaname">
            <el-divider direction="vertical" />
            <span v-if="areaName">{{ areaName }}</span>
            <span v-else>未选择下载区域</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onBeforeUnmount, ref } from 'vue';


    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const title = ref('');
    const areaName = ref('');

    proxy?.$EventBus.on('switch-map', ({layer,parent})=>{
        // console.log(parent)
        title.value = parent.label+' - '+layer.label
    });

    proxy?.$EventBus.on('switch-area', ({area,parent})=>{
        const names = []
        if(parent.name){
            names.push(parent.name);
        }
        if(area.name){
            names.push( area.name);
        }
        areaName.value=names.join(' - ')
    });

    onBeforeUnmount(()=>{
        proxy?.$EventBus.off('switch-map');
        proxy?.$EventBus.off('switch-area');
    })

</script>

<style scoped>
.title,.areaname{
    display: inline;
}
</style>