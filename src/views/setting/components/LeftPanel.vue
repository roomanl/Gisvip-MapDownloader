<template>
    <div style="padding: 20px 10px;">
        <el-space fill wrap direction="vertical" style="width: 100%;">
            <el-button v-for="menu in menus" :key="menu.name" type="info" plain
                @click="meunClick(menu)">
                {{ menu.label }}
            </el-button>
        </el-space>
    </div>
</template>

<script setup lang="ts">
import { defineEmits, onMounted } from 'vue';


    const emit = defineEmits(['meunClick'])
    const menus = [
        {
            name: 0,
            label: '地图key配置',
        }
    ]

    const meunClick = (meun: any) => {
        emit('meunClick', meun)
    }
    onMounted(() => {
        emit('meunClick', menus[0])
        console.log(menus[0])
    })

</script>

<style scoped>

</style>