import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import Graticule from 'ol/layer/Graticule'
import SourceXYZ from 'ol/source/XYZ'
import ScaleLine from 'ol/control/ScaleLine';
import OverviewMap from 'ol/control/OverviewMap';
import MousePosition from 'ol/control/MousePosition';
import {getArea} from 'ol/sphere';
import Stroke from 'ol/style/Stroke'
import {getTopLeft, getWidth,getCenter} from 'ol/extent.js'
import {get as getProjection,transform} from 'ol/proj.js';
import { getTdtKey } from '@/plugins/store/Setting'
import { isTdt } from '@/plugins/map/Utils'


export default class OlMap {
    private opacity: any;
    private baseMapLayer: any;
    private labelLayer: any;
    private gridLayer:any;
    private graticuleLayer: any;
    private mapView: any;
    private map: any;
    private overviewMap: OverviewMap;
    private mousePosition:MousePosition;
    private baseProjection = 'EPSG:3857';
    private baseCenter: any = [116.405285, 39.904989]

    constructor(options: any) {
        this.opacity = 1;
        this.baseMapLayer = null;
        this.labelLayer = null;
        
    }


    initMap(mapTarget: any) {
        this.mapView = new View({
            projection: this.baseProjection,
            zoom: 1,
            maxZoom:19
        })
        this.map = new Map({
            target: mapTarget,
            view: this.mapView
        })
        this.initControl()
        this.initGraticule()
        const center=this.transform4326To3857(this.baseCenter)
        this.setCenter(center)
        this.setZoom(10)
    }
    initControl(){
        this.map.addControl(new ScaleLine())
    }
    addOverviewMap(layer: any){
        if(this.overviewMap){
            this.map.removeControl(this.overviewMap)
        }
        this.overviewMap=new OverviewMap({
            collapsed: false,
            collapsible: true,
            layers: [layer]
        })
        this.map.addControl(this.overviewMap)
        // console.log(this.overviewMap)
    }

    initGraticule(){ 
        this.graticuleLayer=new Graticule({
                maxLines:200,
                strokeStyle:new Stroke({
                lineDash:[5],
                width:2,
                color:'rgba(255,120,0,0.85)'
            }),
            showLabels:true,
            wrapX:false,
        })
    }
    addGraticule(){
        this.map.addLayer(this.graticuleLayer)
    }
    removeGraticule(){
        if(this.graticuleLayer)
            this.map.removeLayer(this.graticuleLayer)
    }
    addGridLayer(){
        this.map.addLayer(this.gridLayer)
    }
    removeGridLayer(){
        if(this.gridLayer)
            this.map.removeLayer(this.gridLayer)
    }

    async loadBaseMap(layer: any){
        // console.log(layer)
        this.map.getLayers().clear();
        this.baseMapLayer=await this.getLayer(layer)
        if(layer.labelLayer){
            this.labelLayer=await this.getLayer(layer.labelLayer)
        }
        // console.log(this.map)
        var layersArray = this.map.getLayers();
        layersArray.insertAt(0,this.baseMapLayer);
        if(this.labelLayer){
            layersArray.insertAt(1,this.labelLayer);
        }
        const overviewMap=await this.getLayer(layer)
        this.addOverviewMap(overviewMap)
        this.updateSize()
    }

    async getLayer(layer: any){
        let baseMapLayer=null
        if(layer.layerType=='tiles'){
            let mapUrl = layer.url
            if(isTdt(layer.mapType)){
                mapUrl= mapUrl + (await getTdtKey())
            }
            baseMapLayer=new TileLayer({
                source: new SourceXYZ({
                    projection: layer.prejection,
                    attributionsCollapsible:false,
                    crossOrigin: 'anonymous',
                    url: mapUrl,
                }),
                id:layer.id
            })
        }
        return baseMapLayer
    }

    getArea(polygon: any){
        return getArea(polygon,{projection:this.getMapView().getProjection()})
        
    }
    formatArea(polygon: any){
        const area = this.getArea(polygon);
        let output;
        if (area > 10000) {
            output = Math.round((area / 1000000) * 100) / 100 + ' ' + '平方千米';
        } else {
            output = Math.round(area * 100) / 100 + ' ' + '平方米';
        }
        return output;
    }
    transform4326To3857(coordinates: any){
        return this.transformCoordinates(coordinates,'EPSG:4326','EPSG:3857')
    }
    transform3857To4326(coordinates: any){
        return this.transformCoordinates(coordinates,'EPSG:3857','EPSG:4326')
    }

    transformCoordinates(coordinates: any,source: any,destination:any){
        // console.log(coordinates,source,destination)
        return transform(coordinates,source,destination)
    }
    setCenter(center: any){
        center[0]=parseFloat(center[0])
        center[1]=parseFloat(center[1])
        this.getMapView().setCenter(center)
        // console.log(center,this.getMapView().getCenter())
    }
    setCenterByExtent(extent: any){
        const center=getCenter(extent)
        this.getMapView().setCenter(center)
    }
    setZoom(zoom: any){
        this.getMapView().setZoom(zoom)
    }
    setBaseOpacity(opacity: any){
        this.opacity=opacity
        this.baseMapLayer.setOpacity(opacity)
        this.labelLayer && this.labelLayer.setOpacity(opacity)
    }
    updateSize(){
        setTimeout(() => {
            this.map.updateSize()
        }, 510)
    }
    getMap(){
        return this.map
    }
    getMapView(){
        return this.map.getView()
    }
    getBaseLayer(){
        return this.baseMapLayer
    }
}