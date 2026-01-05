<template>
    <div>
        <el-form size="large"  label-width="auto" label-position="top">
            <el-form-item label="天地图key">
                <el-input v-model="form.tdtKey" ></el-input>
            </el-form-item>
             <el-form-item>
                <el-button type="info" plain  @click="saveSetting" >保 存</el-button>
             </el-form-item>
        </el-form>
        
    </div>
</template>

<script setup lang="ts">
    import { onMounted, reactive } from 'vue'
    import { getTdtKey ,setTdtKey } from '@/plugins/store/Setting'
    import { ElNotification } from 'element-plus'

    const form = reactive({
        tdtKey: '',
    })

    const saveSetting = async () => { 
        await setTdtKey(form.tdtKey)
        ElNotification({
            title: '提示',
            message: '保存成功',
            type: 'success',
            duration: 2000
        })
    }



    const init = async () => { 
        form.tdtKey = await getTdtKey()
    }
    onMounted(() => {
        init()
    })

</script>

<style scoped>

</style>