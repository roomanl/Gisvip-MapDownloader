import { defineStore } from 'pinia';
import { ref,computed } from 'vue';

export const useDownConfStore = defineStore('downConf-store', () => {
  
    const downloadExtent = ref([])
    const downloadZoom = ref([5,10])
    const tilesYype = ref('jpg')
    const downloadPath = ref('')
  
    return {
        downloadExtent,
        downloadZoom,
        tilesYype,
        downloadPath
    };
});
