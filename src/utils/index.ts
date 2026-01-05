import { ElNotification } from 'element-plus'
import { getTdtKey } from '@/plugins/store/Setting'
export const getChinaAreasTree = async (geojson: any) => { 
    const areasTree: any = [];
    for (let i = 0; i < geojson.features.length; i++) { 
        const feature = geojson.features[i]; 
        if(!feature.properties.name) continue;
        areasTree.push({
            name: feature.properties.name,
            adcode: feature.properties.adcode,
            level: feature.properties.level,
            center: feature.properties.center,
            geometry: feature.geometry,
            leaf: feature.properties.childrenNum<=0
        });
    }
    // console.log(areasTree);
    return areasTree;
};

export const checkTdtKey = async () => { 
    const tdtKey = await getTdtKey()
    if(!tdtKey){
        return false
    }
    return true
};
export const checkTdtKeyTip = async () => { 
    if(!await checkTdtKey()){
        ElNotification({
            title: '提示',
            message: '请先在设置里配置天地图key',
            type:'warning',
            duration: 2000
        })
        return false
    }
    return true
};