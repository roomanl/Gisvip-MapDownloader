<template>
    <div class="container">
        <h1>启动页!</h1>
        <div class="row">
            <h5>加载中......</h5>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

const init = async () => { 
    setTimeout(()=>{
        router.replace('/home')
        // router.push('/home')
    },2000)
}
onMounted(()=>{
    init()
})
</script>

<style scoped>
.container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color:#545c64;
}
</style>