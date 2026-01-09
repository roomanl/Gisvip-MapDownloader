import { defineStore } from 'pinia';
import { ref,computed } from 'vue';

export const useDownConfStore = defineStore('downConf-store', () => {
  
    const downExtent = ref([])
    const downZoom = ref([5,10])
    const downTilesType = ref('jpg')
    const downPath = ref('')
    const downCoordinates = ref([])
    const downLayer = ref(undefined)
    const downArea = ref(undefined)
    const tileTotal = ref(0)
    const projection = ref('')

    const mapName = computed(()=>{
        if(!downLayer.value){
            return '未选择地图'
        }
        return downLayer.value.parent.label+' - '+ downLayer.value.layer.label
    })
    const cityName = computed(()=>{
        if(!downArea.value){
            return '未选择下载区域'
        }
        const {city,parentCity} = downArea.value
        const names = []
        if(parentCity.name){
            names.push(parentCity.name);
        }
        if(city.name){
            names.push( city.name);
        }
        return names.join(' - ')
    })
    const cityArea = computed(()=>{
        if(!downArea.value){
            return ''
        }
        return downArea.value.area
    })
    const getFullName = () =>{
        return `${mapName.value}-${cityName.value}(${projection.value})`
                .replaceAll(' ','')
                .replaceAll('EPSG:','')
    }
  
    return {
        downExtent,
        downZoom,
        downTilesType,
        downPath,
        downCoordinates,
        downLayer,
        downArea,
        mapName,
        cityName,
        cityArea,
        tileTotal,
        projection,
        getFullName
    };
});
