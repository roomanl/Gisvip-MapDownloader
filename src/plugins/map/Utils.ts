import { ElNotification } from 'element-plus'
import { getTdtKey } from '@/plugins/store/Setting'

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

export const isTdt = (layerId: string) =>{
  return layerId.includes('tdt')
}

// 经纬度转瓦片行列号
export const long2tile=(lon:number, zoom:number)=> {
  return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}

// 经纬度转瓦片行列号
export const lat2tile = (lat:number, zoom:number) =>{
  return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}

export const long_lat_to_tile_xy = (extent: number[], zoom: number) =>{ 
    const [minLng, minLat, maxLng, maxLat] = extent;
    const minX = long2tile(minLng,zoom);
    const maxX = long2tile(maxLng,zoom);
    const yMax = lat2tile(minLat,zoom)
    const yMin = lat2tile(maxLat,zoom)
    const xCount = Math.abs(maxX - minX) + 1;
    const yCount = Math.abs(yMax - yMin) + 1;
    return {minX,maxX,yMin,yMax,xCount, yCount};
}
export const startXYAndendXy  = (extent: number[], zoom: number) =>{
    const {minX,maxX,yMin,yMax} = long_lat_to_tile_xy(extent,zoom);
    const startX = Math.min(minX,maxX);
    const endX = Math.max(minX, maxX);
    let startY = Math.min(yMin, yMax);
    if (startY < 0) startY = 0;
    const endY = Math.max(yMin, yMax);
    return {startX,endX,startY,endY}
}
export const calculateTileCount = (extent: number[], zooms: number[]) =>{
    const [minZoom, maxZoom] = zooms;
    let totalCount = 0;
    for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
        const {xCount,yCount} = long_lat_to_tile_xy(extent,zoom);
        const tileCount = xCount * yCount;
        totalCount += tileCount;
        // console.log(`层级 ${zoom}: ${xCount}×${yCount} = ${tileCount} 个瓦片`);
    }
    // console.log(`总计: ${totalCount} 个瓦片`);
    return totalCount;
}