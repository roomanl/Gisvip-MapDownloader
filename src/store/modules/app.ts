import { defineStore } from 'pinia';
import { ref,computed } from 'vue';
import { useRouter } from 'vue-router'
import { leftMenu } from '@/config/LeftMenuConf';

export const useAppStore = defineStore('app-store', () => {
  
    const leftTopMenu = computed(() => {
        return leftMenu.filter((item:ILeftMenu) => item.type === 'top')
    })
     const leftBottomMenu = computed(() => {
        return leftMenu.filter((item:ILeftMenu) => item.type === 'bottom')
    })
    const selectLeftMenu = ref(leftMenu[0])
    const homeMenu = ref(leftMenu[0])
    const leftMenuPanelWidth = computed(() => {
        return selectLeftMenu.value?.subPanel?'300px':'65px'
    })
  
    return {
        leftTopMenu,
        leftBottomMenu,
        selectLeftMenu,
        homeMenu,
        leftMenuPanelWidth,
    };
});
