import { defineStore } from 'pinia';
import { ref,computed } from 'vue';

export const useDownConfStore = defineStore('downConf-store', () => {
  
    const downExtent = ref([])
    const downZoom = ref([5,10])
    const downTilesType = ref('jpg')
    const downPath = ref('')
    const downCoordinates = ref([])
    const downLayer = undefined
    const downArea = undefined
  
    return {
        downExtent,
        downZoom,
        downTilesType,
        downPath,
        downCoordinates,
        downLayer,
        downArea
    };
});
