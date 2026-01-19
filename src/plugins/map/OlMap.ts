import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import Graticule from 'ol/layer/Graticule'
import SourceXYZ from 'ol/source/XYZ'
import TileDebug from 'ol/source/TileDebug'
import ScaleLine from 'ol/control/ScaleLine';
import OverviewMap from 'ol/control/OverviewMap';
import MousePosition from 'ol/control/MousePosition';
import ZoomSlider from 'ol/control/ZoomSlider';
import {createStringXY} from 'ol/coordinate'
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
    private mapView4326: any;
    private mapView3857: any;
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
        this.mapView4326 = new View({
            projection: 'EPSG:4326',
            zoom: 1,
            maxZoom:18
        })
        this.mapView3857 = new View({
            projection: 'EPSG:3857',
            zoom: 1,
            maxZoom:18
        })
        this.map = new Map({
            target: mapTarget,
            // view: this.mapView4326
        })
        this.initControl()
        this.initGraticule()
    }
    initControl(){
        this.map.addControl(new ScaleLine())
        this.map.addControl(new ZoomSlider())
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
    addMousePosition(){
        if(this.mousePosition){
            this.map.removeControl(this.mousePosition)
        }
        this.mousePosition=new MousePosition({
            coordinateFormat:createStringXY(4),
            projection: this.getMapView().getProjection()
        })
        this.map.addControl(this.mousePosition);
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
    switchMapView(layer: any){
        this.map.getLayers().clear();
        let center = this.getMapView().getCenter()
        let zoom = this.getMapView().getZoom()
        zoom = zoom?zoom:10
        if(!center){
            center  = this.transformCoordinates(this.baseCenter,'EPSG:4326',layer.prejection)
        }else{
            center = this.transformCoordinates(center,this.getMapView().getProjection(),layer.prejection)
        }
        if(layer.prejection.includes('4326')){
            this.map.setView(this.mapView4326)
        }else if(layer.prejection.includes('3857')){
            this.map.setView(this.mapView3857)
        }
        this.setCenter(center)
        this.setZoom(zoom)
        this.addMousePosition()
    }

    async loadBaseMap(layer: any){
        // console.log(layer)
        this.switchMapView(layer)
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