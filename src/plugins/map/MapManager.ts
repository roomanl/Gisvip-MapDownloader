import OlMap from '@/plugins/map/OlMap';
import DrawTool from '@/plugins/map/DrawTool';
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
            map: this.olMap.getMap(),
            mapView: this.olMap.getMapView(),
            layerType: 'downExtent',
            layerIndex: 99
        });
    }
    loadBaseMap(layer: any,parentData:any){
        this.olMap.loadBaseMap(layer);
        this.downConfStore.downLayer = {layer:layer,parent:parentData};
    }
    selectArea(city:any,parentCity:any){
        this.drawTool.clear()
        const coordinates = city.geometry.type=='MultiPolygon'?city.geometry.coordinates:[city.geometry.coordinates];
        let feature = this.drawTool.drawMultiPoly(coordinates)
        const extent = feature.getGeometry().getExtent();
        this.olMap.getMapView().fit(extent, {
            duration: 1000,
            padding: [100, 100, 100, 100],
            maxZoom: 15
        });
        this.downConfStore.downExtent = extent;
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
                const extent = evt.feature.getGeometry().getExtent().map(num => parseFloat(num.toFixed(6)));
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
}

export const mapManager = new MapManager();