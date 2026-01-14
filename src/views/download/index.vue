<template>
    <div>
        <Teleport defer to="#layout-toptitle-subpanel">
            <div v-if="appStore.selectLeftMenu.key=='download'">
                {{ titleText }}
            </div>
        </Teleport>
        <Teleport defer to="#layout-leftmenu-subpanel">
            <div v-show="appStore.selectLeftMenu.key=='download'">
               <LeftPanel />
            </div>
        </Teleport>
        <div>
            <el-empty v-if="!downTaskStore.selectTask.id" description="请在左侧列表选择一个任务查看详情">
                 <el-button type="primary" round plain @click="goHome">或者去下载</el-button>
            </el-empty>
            <div v-else>
                <TaskDetail />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="Download">
    import { ref,onMounted,onActivated } from 'vue';
    import { downloadMapManager } from '@/plugins/map/DownloadMapManager'
    import { useRoute } from 'vue-router';
    import { useAppStore } from '@/store/modules/app'
    import { useDownTaskStore } from '@/store/modules/downTask'
    import LeftPanel from './components/LeftPanel.vue';
    import TaskDetail from './components/TaskDetail.vue';
    

    const appStore = useAppStore()
    const downTaskStore = useDownTaskStore()
    const route = useRoute()
    const titleText = ref('下载详情')
    const taskId = ref('')

    const goHome = () => {
        appStore.openView('/home')
    }
    const init = async () => { 
        if( downTaskStore.tasks.length==0 || taskId.value){
            const tasks = await downloadMapManager.getDownloadTasks()
            downTaskStore.tasks = tasks.map(task=>{
                task.errorTotal = 0
                task.percentage = 0
                task.taskStatus = task.downStatus==1?'finish':'waiting'
                return task
            })
            if(taskId.value){
                downTaskStore.selectTask = downTaskStore.tasks.find(task=>task.id==taskId.value)
            }else if(downTaskStore.downloadTasks.length>0 && !downTaskStore.selectTask.id){
                downTaskStore.selectTask = downTaskStore.downloadTasks[0]
            }
        }
        
    }

    onActivated(()=> {
        taskId.value = route.query.taskId
        init()
    })

    onMounted(() => {
        
    })

    
</script>

<style scoped>

</style>