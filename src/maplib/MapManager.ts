import OlMap from '@/maplib/OlMap';
import DrawTool from '@/maplib/DrawTool';
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
            layerType: 'downloadExtent',
            layerIndex: 99
        });
    }
    loadBaseMap(layer: any){
        this.olMap.loadBaseMap(layer);
    }
    selectArea(area:any){
        this.drawTool.clear()
        const coordinates = area.geometry.type=='MultiPolygon'?area.geometry.coordinates:[area.geometry.coordinates];
        let feature = this.drawTool.drawMultiPoly(coordinates)
        const extent = feature.getGeometry().getExtent();
        this.olMap.getMapView().fit(extent, {
            duration: 1000,
            padding: [100, 100, 100, 100],
            maxZoom: 15
        });
        this.downConfStore.downloadExtent = extent;
        // this.olMap.setCenter(area.center);
    }
}

export const mapManager = new MapManager();