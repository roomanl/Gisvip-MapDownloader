import { ElNotification } from 'element-plus'
import { wgs84ToBaiduMercator } from '@/plugins/map/TransformUtils'
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

export const isTdt = (mapType: string) =>{
  return mapType == 'tdt'
}
export const isTencent = (mapType: string) =>{
  return mapType == 'tencent'
}

// 经纬度转瓦片行列号
export const longlat2tile=(lon:number, lat:number, zoom:number)=> {
    if(!lat || !lon) return {x:0, y:0}
    const n = Math.pow(2, zoom);
    const x = Math.floor((lon + 180) / 360 * n);

    const latRad = lat * Math.PI / 180;
    const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
    return { x, y };
}

export const longlat2bdtile=(lon:number, lat:number, zoom:number)=> {
    console.log(lon, lat)
    if(!lat || !lon) return {x:0, y:0}
    const [bdlon, bdlat] = wgs84ToBaiduMercator([lon, lat])
    console.log(bdlon, bdlat)
    const n = Math.pow(2, (zoom - 18));
    const x = Math.floor(bdlon * n / 256);
    const y =  Math.floor(bdlat * n / 256);;
    return { x, y };
}
export const calculateTileCount = (extent: number[], zooms: number[]) =>{
    const [minZoom, maxZoom] = zooms;
    const [minLng, minLat, maxLng, maxLat] = extent;
    let totalCount = 0;
    for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
        const topLeft = longlat2tile(minLng, maxLat, zoom);
        const bottomRight = longlat2tile(maxLng, minLat, zoom);

        const xCount = Math.abs(topLeft.x - bottomRight.x) + 1;
        const yCount = Math.abs(topLeft.y - bottomRight.y) + 1;

        const tileCount = xCount * yCount;
        totalCount += tileCount;
    }
    return totalCount;
}

export const calculateBdTileCount = (extent: number[], zooms: number[]) =>{
    const [minZoom, maxZoom] = zooms;
    const [minLng, minLat, maxLng, maxLat] = extent;
    let totalCount = 0;
    for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
        const topLeft = longlat2bdtile(minLng, maxLat, zoom);
        const bottomRight = longlat2bdtile(maxLng, minLat, zoom);

        const xCount = Math.abs(topLeft.x - bottomRight.x) + 1;
        const yCount = Math.abs(topLeft.y - bottomRight.y) + 1;

        const tileCount = xCount * yCount;
        totalCount += tileCount;
    }
    return totalCount;
}