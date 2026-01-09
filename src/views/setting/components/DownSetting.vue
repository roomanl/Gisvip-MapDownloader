<template>
    <div>
        <el-form  label-width="auto" label-position="right">
            <el-form-item label="下载线程数">
                <div>
                    <el-input-number v-model="form.downLimit" :min="1" :max="32" />
                    <div><el-text class="setting-tip" type="info">同一个任务内下载的线程数，建议设置为 1 。设置大了可能会触发反爬虫机。总线程数=下载中任务数*下载线程数</el-text></div>
                </div>
            </el-form-item>
             <el-form-item>
                <el-button type="primary" plain  @click="saveSetting" >保 存 配 置</el-button>
             </el-form-item>
        </el-form>
        
    </div>
</template>

<script setup lang="ts">
    import { onMounted, reactive } from 'vue'
    import { getDownloadLimit ,setDownloadLimit } from '@/plugins/store/Setting'
    import { ElNotification } from 'element-plus'

    const form = reactive({
        downLimit: '',
    })

    const saveSetting = async () => { 
        await setDownloadLimit(form.downLimit)
        ElNotification({
            title: '提示',
            message: '保存成功',
            type: 'success',
            duration: 2000
        })
    }



    const init = async () => { 
        form.downLimit = await getDownloadLimit()
    }
    onMounted(() => {
        init()
    })

</script>

<style lang="scss" scoped>
.setting-tip{
    font-size: 12px;
}
:deep(.el-form-item__label){
    font-weight: 700;
}
</style>