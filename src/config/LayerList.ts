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
            id: 'amap-satellite-label',
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
    label: '百度地图',
    id: 'bdmap',
    children: [
      {
        label: '电子地图',
        id: 'bdmap-normal',
        mapType: 'bdmap',
        layerType: 'bdtiles',
        projection: 'DB09-MC',
        subdomain: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        url:'http://online{0-9}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&v=009&scaler=1&p=1&udt=20260108',
      },{
        label: '电子地图(精美)',
        id: 'bdmap-normal-complex',
        mapType: 'bdmap',
        layerType: 'bdtiles',
        projection: 'DB09-MC',
        subdomain: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        url:'http://online{0-9}.map.bdimg.com/onlinelabel/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&v=009&scaler=1&p=1&udt=20260108',
      },{
        label: '电子地图(精简)',
        id: 'bdmap-normal-lite',
        mapType: 'bdmap',
        layerType: 'bdtiles',
        projection: 'DB09-MC',
        subdomain: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        url:'http://online{0-9}.map.bdimg.com/onlinelabel/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&v=009&scaler=1&p=1&udt=20260108&styleId=1',
      },{
        label: '卫星地图(普通注记)',
        id: 'bdmap-satellite',
        mapType: 'bdmap',
        layerType: 'bdtiles',
        projection: 'DB09-MC',
        subdomain: [0, 1, 2, 3],
        url:'http://maponline{0-3}.bdimg.com/starpic/?qt=satepc&u=x={x};y={y};z={z};v=009;type=sate&styles=sl&v=009&scaler=1&p=1&udt=20260108',
        labelLayer:{
          label: '卫星地图普通注记',
          id: 'bdmap-satellite-label',
          mapType: 'bdmap',
          layerType: 'bdtiles',
          projection: 'DB09-MC',
          subdomain: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          url:'http://online{0-9}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=sl&v=009&scaler=1&p=1&udt=20260108',
        }
      },{
        label: '卫星地图(精美注记)',
        id: 'bdmap-satellite',
        mapType: 'bdmap',
        layerType: 'bdtiles',
        projection: 'DB09-MC',
        subdomain: [0, 1, 2, 3],
        url:'http://maponline{0-3}.bdimg.com/starpic/?qt=satepc&u=x={x};y={y};z={z};v=009;type=sate&styles=sl&v=009&scaler=1&p=1&udt=20260108',
        labelLayer:{
          label: '卫星地图精美注记',
          id: 'bdmap-satellite-complex-label',
          mapType: 'bdmap',
          layerType: 'bdtiles',
          projection: 'DB09-MC',
          subdomain: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          url:'http://online{0-9}.map.bdimg.com/onlinelabel/?qt=vtile&x={x}&y={y}&z={z}&styles=sl&v=009&scaler=1&p=1&udt=20260108',
        }
      }
    ]
  },
  {
    label: '腾讯地图',
    id: 'tencent',
    children: [
      {
        label: '电子地图',
        id: 'tencent-normal',
        mapType: 'tencent',
        layerType: 'tencenttiles',
        projection: 'GCJ-02',
        subdomain: [0,1, 2, 3],
        url:'https://rt{0-3}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}',
      },
      {
        label: '卫星地图',
        id: 'tencent-satellite',
        mapType: 'tencent',
        layerType: 'tencenttiles',
        projection: 'GCJ-02',
        subdomain: [0,1, 2, 3],
        url:'https://p0.map.gtimg.com/sateTiles/{z}/{m}/{n}/{x}_{y}.jpg',
        labelLayer:{
          label: '卫星地图注记',
          id: 'tencent-satellite-label',
          mapType: 'tencent',
          layerType: 'tencenttiles',
          projection: 'GCJ-02',
          subdomain: [0,1, 2, 3],
          url : 'https://rt{0-3}.map.gtimg.com/tile?z={z}&x={x}&y={y}&type=vector&styleid=2',
        }
      },
      {
        label: '电子地图(深色)',
        value: 'tencent-terrain-dark',
        mapType: 'tencent',
        layerType: 'tencenttiles',
        projection: 'GCJ-02',
        subdomain: [0,1, 2, 3],
        url:"https://rt{0-3}.map.gtimg.com/tile?z={z}&x={x}&y={y}&styleid=4"
      },
      {
        label: '地形图',
        value: 'tencent-terrain',
        mapType: 'tencent',
        layerType: 'tencenttiles',
        projection: 'GCJ-02',
        subdomain: [0,1, 2, 3],
        url:'https://p{0-3}.map.gtimg.com/demTiles/{z}/{m}/{n}/{x}_{y}.jpg',
        labelLayer:{
          label: '地形图注记',
          id: 'tencent-terrain-label',
          mapType: 'tencent',
          layerType: 'tencenttiles',
          projection: 'GCJ-02',
          subdomain: [0,1, 2, 3],
          url : 'https://rt{0-3}.map.gtimg.com/tile?z={z}&x={x}&y={y}&type=vector&styleid=2',
        }
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