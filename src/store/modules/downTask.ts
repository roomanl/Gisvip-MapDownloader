import { defineStore } from 'pinia';
import { ref,computed } from 'vue';

export const useDownTaskStore = defineStore('downTask-store', () => {
  
    const tasks = ref<any[]>([])
    const finishTasks = computed(() => tasks.value.filter((item:any) => item.downStatus === 1))
    const downloadTasks = computed(() => tasks.value.filter((item:any) => item.downStatus === 0))
    const selectTask = ref<any>({})
  
    return {
        tasks,
        finishTasks,
        downloadTasks,
        selectTask
    };
});
