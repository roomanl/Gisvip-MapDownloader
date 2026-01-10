import { defineStore } from 'pinia';
import { ref,computed } from 'vue';

export const useDownConfStore = defineStore('downConf-store', () => {
  
    const downloadExtent = ref([])
    const downloadZoom = ref([5,10])
    const tilesType = ref('jpg')
    const downloadPath = ref('')
    const downLayer = undefined
    const downArea = undefined
  
    return {
        downloadExtent,
        downloadZoom,
        tilesType,
        downloadPath,
        downLayer,
        downArea
    };
});
