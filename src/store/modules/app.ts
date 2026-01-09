import { defineStore } from 'pinia';
import { ref,computed } from 'vue';
import { leftMenu } from '@/config/LeftMenuConf';

export const useAppStore = defineStore('app-store', () => {
  
    const leftTopMenu = computed(() => {
        return leftMenu.filter((item:ILeftMenu) => item.type === 'top')
    })
    const selectLeftMenu = ref<ILeftMenu | undefined>(leftMenu[0])
    const leftMenuPanelWidth = computed(() => {
        return selectLeftMenu.value?.subPanel?'300px':'65px'
    })
  
    return {
        leftTopMenu,
        selectLeftMenu,
        leftMenuPanelWidth,
    };
});
