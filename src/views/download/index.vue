<template>
    <div>
        <Teleport defer to="#layout-toptitle-subpanel">
            <div v-if="appStore.selectLeftMenu.key=='download'">
                {{ titleText }}
            </div>
        </Teleport>
        <Teleport defer to="#layout-leftmenu-subpanel">
            <div v-show="appStore.selectLeftMenu.key=='download'">
               <LeftPanel ref="leftPanelRef" />
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
    import { getPercentage } from '@/utils/index'
    import LeftPanel from './components/LeftPanel.vue';
    import TaskDetail from './components/TaskDetail.vue';
    

    const appStore = useAppStore()
    const downTaskStore = useDownTaskStore()
    const route = useRoute()
    const titleText = ref('任务详情')
    const taskId = ref('')
    const leftPanelRef = ref()
    const isOnMounted = ref(false)

    const goHome = () => {
        appStore.openView('/home')
    }
    const init = async () => { 
        const tasks = await downloadMapManager.getDownloadTasks()
        if(tasks && tasks.length>0){
            downTaskStore.tasks = tasks.map(task=>{
                task.errorTotal = 0
                task.percentage = getPercentage(task.successTotal,task.tileTotal)
                task.taskStatus = task.downStatus==0?'pending':(task.downStatus==1?'completed':'error')
                return task
            })
            if(downTaskStore.downloadTasks.length>0 && !downTaskStore.selectTask.id){
                downTaskStore.selectTask = downTaskStore.downloadTasks[0]
            }
        }
    }

    const insterNewTask = async () => {
        const task = await downloadMapManager.getDownloadTaskById(taskId.value)
        // console.log(task)
        task.errorTotal = 0
        task.percentage = 0
        task.taskStatus = 'pending'
        downTaskStore.tasks.unshift(task);
        downTaskStore.selectTask = task
        leftPanelRef.value.setActiveName('1')
    }

    onActivated(()=> {
        if(isOnMounted.value){
            isOnMounted.value = false
            return
        }
        taskId.value = route.query.taskId
        const type = route.query.type
        if(type=='add'){
            insterNewTask()
        }
        
    })

    onMounted(() => {
        isOnMounted.value = true
        init()
    })

    
</script>

<style scoped>

</style>