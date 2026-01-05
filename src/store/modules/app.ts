import { defineStore } from 'pinia';
import { ref,computed } from 'vue';
import router from '@/router'
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
    const openView = (path:string)=>{
        const menu = leftMenu.find((item:ILeftMenu) => item.router === path)
        if(menu){
            selectLeftMenu.value = menu
            router.push(menu.router)
        }
    }
    const openViewByIndex = (index:number)=>{
        const menu = leftMenu[index]
        if(menu){
            selectLeftMenu.value = menu
            router.push(menu.router)
        }
    }

  
    return {
        leftTopMenu,
        leftBottomMenu,
        selectLeftMenu,
        homeMenu,
        leftMenuPanelWidth,
        openView,
        openViewByIndex
    };
});
