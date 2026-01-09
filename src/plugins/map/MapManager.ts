import OlMap from '@/plugins/map/OlMap';
import DrawTool from '@/plugins/map/DrawTool';
import { gcj02ToMercatorMultiPolygon,transformExtentToWgs84 } from '@/plugins/map/TransformUtils'
import { useDownConfStore } from '@/store/modules/downConf'


class MapManager {

    private olMap:OlMap;
    private drawTool: DrawTool;
    private downConfStore = useDownConfStore()
    constructor() {
    }
    initMap = (mapTarget: any) => {
        // console.log(rootmap.value);
        this.olMap = new OlMap({});
        this.olMap.initMap(mapTarget);
        this.drawTool = new DrawTool({
            map: this.olMap,
            layerType: 'downExtent',
            layerIndex: 99
        });
    }
    loadBaseMap(layer: any,parentData:any){
        this.olMap.loadBaseMap(layer);
        this.downConfStore.downLayer = {layer:layer,parent:parentData};
        this.downConfStore.projection = layer.projection;
        // console.log(layer);
    }
    selectArea(city:any,parentCity:any){
        this.drawTool.clear();
        const gcj02Coordinates = city.geometry.type=='MultiPolygon'?city.geometry.coordinates:[city.geometry.coordinates];
        const mercatorCoordinates = gcj02ToMercatorMultiPolygon(gcj02Coordinates);
        let feature = this.drawTool.drawMultiPoly(mercatorCoordinates)
        const extent = feature.getGeometry().getExtent();
        this.olMap.getMapView().fit(extent, {
            duration: 1000,
            padding: [100, 100, 100, 100],
            maxZoom: 15
        });
        this.downConfStore.downExtent = this.transformExtent(extent).map(num => parseFloat(num.toFixed(6)));
        this.downConfStore.downArea = {
            city:city,
            parentCity:parentCity,
            area:this.olMap.formatArea(feature.getGeometry())
        };
        // this.olMap.setCenter(area.center);
    }
    drawExtent(){ 
        this.drawTool.clear();
        this.drawTool.startDraw({
            type: 'Box',
            drawEnd: (evt: any) => {
                const extent = this.transformExtent(evt.feature.getGeometry().getExtent()).map(num => parseFloat(num.toFixed(6)));
                this.downConfStore.downExtent = extent;
                this.downConfStore.downArea = {
                    city:{name:'自定义区域'},
                    parentCity:{},
                    area:this.olMap.formatArea(evt.feature.getGeometry())
                };
            }
        });
    }
    clearExtent(){ 
        this.drawTool.clear();
        this.downConfStore.downExtent = [];
        this.downConfStore.downArea = undefined;
    }
    transformExtent(extent:any){
        return transformExtentToWgs84(extent,this.olMap.getMapView().getProjection())
    }
}

export const mapManager = new MapManager();