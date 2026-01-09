
const getTdtUrl = (url:string, layer:string) => {
    const tdtUrlParams = 'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=';
    return `${url}?LAYER=${layer}&${tdtUrlParams}`;
  };

export const layerList =[
    {
    label: '天地图',
    id: 'tdt',
    children: [
      {
        label: '普通',
        id: 'tdt-normal',
        type: 'tiles',
        prejection: 'EPSG:4326',
        url :getTdtUrl('https://t{0-7}.tianditu.gov.cn/vec_c/wmts', 'vec'),
        labelLayer:{
            label: '普通',
            id: 'tdt-normal-label',
            type: 'tiles',
            prejection: 'EPSG:4326',
            url :getTdtUrl('https://t{0-7}.tianditu.gov.cn/cva_c/wmts', 'cva'),
        }
      },
      {
        label: '卫星',
        id: 'tdt-satellite',
        type: 'tiles',
        prejection: 'EPSG:4326',
        url: getTdtUrl('https://t{0-7}.tianditu.gov.cn/img_c/wmts', 'img'),
        labelLayer:{
            label: '普通',
            id: 'tdt-normal-label',
            type: 'tiles',
            prejection: 'EPSG:4326',
            url :getTdtUrl('https://t{0-7}.tianditu.gov.cn/cia_c/wmts', 'cia'),
        }
      },
      {
        label: '地形',
        id: 'tdt-terrain',
        type: 'tiles',
        prejection: 'EPSG:4326',
        url: getTdtUrl('https://t{0-7}.tianditu.gov.cn/ter_c/wmts', 'ter'),
        labelLayer:{
            label: '普通',
            id: 'tdt-normal-label',
            type: 'tiles',
            prejection: 'EPSG:4326',
            url :getTdtUrl('https://t{0-7}.tianditu.gov.cn/cta_c/wmts', 'cta'),
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