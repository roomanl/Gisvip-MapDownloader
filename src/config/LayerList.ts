const getTdtUrl = (url:string, layer:string,tilematrixset:string) => {
    const tdtUrlParams = 'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&STYLE=default&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=';
    return `${url}?LAYER=${layer}&TILEMATRIXSET=${tilematrixset}&${tdtUrlParams}`;
  };

export const layerList =[
  {
    label: '高德地图',
    id: 'amap',
    children: [
      {
        label: '电子地图',
        id: 'amap-normal',
        mapType: 'amap',
        layerType: 'tiles',
        projection: 'GCJ-02',
        subdomain: [1, 2, 3, 4],
        url:'https://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      },
      {
        label: '电子地图大字版',
        id: 'amap-normal',
        mapType: 'amap',
        layerType: 'tiles',
        projection: 'GCJ-02',
        subdomain: [1, 2, 3, 4],
        url:'https://webst0{1-4}.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}',
      },
      {
        label: '卫星地图',
        id: 'amap-satellite',
        mapType: 'amap',
        layerType: 'tiles',
        projection: 'GCJ-02',
        subdomain: [1, 2, 3, 4],
        url:'https://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        labelLayer:{
            label: '卫星地图注记',
            id: 'amap-terrain-label',
            mapType: 'amap',
            layerType: 'tiles',
            projection: 'GCJ-02',
            subdomain: [1, 2, 3, 4],
            url : 'https://webst0{1-4}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
        }
      },
      {
        label: '电子地图(英文)',
        value: 'amap-normal-en',
        mapType: 'amap',
        layerType: 'tiles',
        projection: 'GCJ-02',
        subdomain: [1, 2, 3, 4],
        url:'https://webrd0{1-4}.is.autonavi.com/appmaptile?lang=en&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      },
    ],
  },
  {
    label: '天地图',
    id: 'tdt',
    children: [
      {
        label: '电子地图',
        id: 'tdt-normal',
        mapType: 'tdt',
        layerType: 'tiles',
        projection: 'EPSG:3857',
        subdomain: [0, 1, 2, 3, 4, 5, 6, 7],
        url :getTdtUrl('https://t{0-7}.tianditu.gov.cn/vec_w/wmts', 'vec','w'),
        labelLayer:{
            label: '电子地图注记',
            id: 'tdt-normal-label',
            mapType: 'tdt',
            layerType: 'tiles',
            projection: 'EPSG:3857',
            subdomain: [0, 1, 2, 3, 4, 5, 6, 7],
            url :getTdtUrl('https://t{0-7}.tianditu.gov.cn/cva_w/wmts', 'cva','w'),
        }
      },
      {
        label: '卫星地图',
        id: 'tdt-satellite',
        mapType: 'tdt',
        layerType: 'tiles',
        projection: 'EPSG:3857',
        subdomain: [0, 1, 2, 3, 4, 5, 6, 7],
        url: getTdtUrl('https://t{0-7}.tianditu.gov.cn/img_w/wmts', 'img','w'),
        labelLayer:{
            label: '卫星地图注记',
            id: 'tdt-satellite-label',
            mapType: 'tdt',
            layerType: 'tiles',
            projection: 'EPSG:3857',
            subdomain: [0, 1, 2, 3, 4, 5, 6, 7],
            url :getTdtUrl('https://t{0-7}.tianditu.gov.cn/cia_w/wmts', 'cia','w'),
        }
      },
      {
        label: '地形地图',
        id: 'tdt-terrain',
        mapType: 'tdt',
        layerType: 'tiles',
        projection: 'EPSG:3857',
        subdomain: [0, 1, 2, 3, 4, 5, 6, 7],
        url: getTdtUrl('https://t{0-7}.tianditu.gov.cn/ter_w/wmts', 'ter','w'),
        labelLayer:{
            label: '地形地图注记',
            id: 'tdt-terrain-label',
            mapType: 'tdt',
            layerType: 'tiles',
            projection: 'EPSG:3857',
            subdomain: [0, 1, 2, 3, 4, 5, 6, 7],
            url :getTdtUrl('https://t{0-7}.tianditu.gov.cn/cta_w/wmts', 'cta','w'),
        }
      },
    ],
  },
]

export const getLayerById = (id: string) => {
    for (let i = 0; i < layerList.length; i++) {
        const layer = layerList[i];
        if (layer.id === id) {
            return layer;
        }
        if (layer.children) {
            for (let j = 0; j < layer.children.length; j++) {
                const child = layer.children[j];
                if (child.id === id) {
                    return child;
                }
            }
        }
    }
}