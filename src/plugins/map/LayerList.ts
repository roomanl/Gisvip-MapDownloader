
const getTdtUrl = (url:string, layer:string,tilematrixset:string) => {
    const tdtUrlParams = 'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&STYLE=default&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=';
    return `${url}?LAYER=${layer}&TILEMATRIXSET=${tilematrixset}&${tdtUrlParams}`;
  };

export const layerList =[
    {
    label: '天地图',
    id: 'tdt',
    children: [
      {
        label: '普通',
        id: 'tdt-normal',
        mapType: 'tdt',
        layerType: 'tiles',
        prejection: 'EPSG:3857',
        url :getTdtUrl('https://t{0-7}.tianditu.gov.cn/vec_w/wmts', 'vec','w'),
        labelLayer:{
            label: '普通',
            id: 'tdt-normal-label',
            mapType: 'tdt',
            layerType: 'tiles',
            prejection: 'EPSG:3857',
            url :getTdtUrl('https://t{0-7}.tianditu.gov.cn/cva_w/wmts', 'cva','w'),
        }
      },
      {
        label: '卫星',
        id: 'tdt-satellite',
        mapType: 'tdt',
        layerType: 'tiles',
        prejection: 'EPSG:3857',
        url: getTdtUrl('https://t{0-7}.tianditu.gov.cn/img_w/wmts', 'img','w'),
        labelLayer:{
            label: '卫星注记',
            id: 'tdt-satellite-label',
            mapType: 'tdt',
            layerType: 'tiles',
            prejection: 'EPSG:3857',
            url :getTdtUrl('https://t{0-7}.tianditu.gov.cn/cia_w/wmts', 'cia','w'),
        }
      },
      {
        label: '地形',
        id: 'tdt-terrain',
        mapType: 'tdt',
        layerType: 'tiles',
        prejection: 'EPSG:3857',
        url: getTdtUrl('https://t{0-7}.tianditu.gov.cn/ter_w/wmts', 'ter','w'),
        labelLayer:{
            label: '地形注记',
            id: 'tdt-terrain-label',
            mapType: 'tdt',
            layerType: 'tiles',
            prejection: 'EPSG:3857',
            url :getTdtUrl('https://t{0-7}.tianditu.gov.cn/cta_w/wmts', 'cta','w'),
        }
      },
    ],
  }
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