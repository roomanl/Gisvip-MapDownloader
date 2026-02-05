<template>
    <div style="padding: 20px 10px;">
        <el-space fill wrap direction="vertical" style="width: 100%;">
            <el-button v-for="menu in menus" :key="menu.name" 
                :type="activeName==menu.name?'primary':'info'" plain
                @click="meunClick(menu)">
                {{ menu.label }}
            </el-button>
        </el-space>
    </div>
</template>

<script setup lang="ts">
import { defineEmits, onMounted ,ref} from 'vue';


    const emit = defineEmits(['meunClick'])
    const activeName = ref(0)
    const menus = [
        {
            name: 0,
            label: '地图key配置',
        },{
            name: 1,
            label: '下载配置',
        }
    ]

    const meunClick = (meun: any) => {
        activeName.value = meun.name
        emit('meunClick', meun)
    }
    onMounted(() => {
        emit('meunClick', menus[0])
    })

</script>

<style scoped>

</style>