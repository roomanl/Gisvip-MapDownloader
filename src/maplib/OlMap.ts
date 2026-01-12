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
import { getTdtKey } from '@/utils/settingStore'


export default class OlMap {
    private opacity: any;
    private baseMapLayer: any;
    private labelLayer: any;
    private gridLayer:any;
    private graticuleLayer: any;
    private mapView: any;
    private map: any;
    private overviewMap: OverviewMap;
    private baseProjection = 'EPSG:4326';

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
        this.initTileDebug()
        this.initGraticule()
        this.setZoom(10)
        this.setCenter([116.405285, 39.904989])
    }
    initControl(){
        this.map.addControl(new ScaleLine())
        this.map.addControl(new ZoomSlider())
        this.map.addControl(new MousePosition({
            coordinateFormat:createStringXY(4),
            projection: this.mapView.getProjection()
        }));
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

    initTileDebug(){
        this.gridLayer=new TileLayer({
            source:new TileDebug({
                projection:this.mapView.getProjection(),
                wrapX:false,
                template:'(x,y,z)({x},{y},{z})'
            })
        })
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
        if(this.baseMapLayer){
            this.map.removeLayer(this.baseMapLayer);
            this.baseMapLayer=null
        }
        if(this.labelLayer){
            this.map.removeLayer(this.labelLayer);
            this.labelLayer=null
        }
        this.baseMapLayer=await this.getLayer(layer)
        if(layer.labelLayer){
            this.labelLayer=await this.getLayer(layer.labelLayer)
        }
        if(layer.center){
           this.mapView.setCenter(layer.center)
        }
        if(layer.zoom){
            this.mapView.setZoom(layer.zoom)
        }
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
        if(layer.type=='tiles'){
            let mapUrl = layer.url
            if(layer.id.includes('tdt')){
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
    removeLayer(mapId: any){
        const layersArray = this.map.getLayers();
        for(let i=0;i<layersArray.getLength();i++){
            const lay=layersArray.item(i)
            if(lay.get('id')==mapId){
                this.map.removeLayer(lay)
            }
        }
    }

    getArea(polygon: any){
        return getArea(polygon,{projection:this.mapView.getProjection()})
        
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
    setCenter(center: any){
        // console.log(center)
        center[0]=parseFloat(center[0])
        center[1]=parseFloat(center[1])
        // this.mapView.animate({resolution:{resolution:this.resolutions4326[10]},},{center:center})
    //    this.mapView.setCenter(transform(center, "EPSG:4326", "EPSG:4326"))
       this.mapView.setCenter(center)
    }
    setCenterByExtent(extent: any){
        const center=getCenter(extent)
        this.mapView.setCenter(center)
    }
    setZoom(zoom: any){
        this.mapView.setZoom(zoom)
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
        return this.mapView
    }
    getBaseLayer(){
        return this.baseMapLayer
    }
}