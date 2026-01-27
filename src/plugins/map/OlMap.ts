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
import {getTopLeft, getWidth,getCenter} from 'ol/extent'
import {get as getProjection,addProjection,addCoordinateTransforms} from 'ol/proj';
import { getTdtKey } from '@/plugins/store/Setting'
import { gcj02ToMercator } from '@/plugins/map/TransformUtils'
import { gcj02Mecator,smerc2gmerc,gmerc2smerc,gmerc2ll,ll2gmerc } from '@/plugins/map/Gcj02MecatorProjection'
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
    private baseCenter: any = gcj02ToMercator([116.405285, 39.904989])

    constructor(options: any) {
        this.opacity = 1;
        this.baseMapLayer = null;
        this.labelLayer = null;
        
    }


    initMap(mapTarget: any) {
        this.mapView = new View({
            projection: this.baseProjection,
            zoom: 1,
            maxZoom:18
        })
        this.map = new Map({
            target: mapTarget,
            view: this.mapView
        })
        this.initgcj02Mecator()
        this.initControl()
        this.initGraticule()
        this.setCenter(this.baseCenter)
        this.setZoom(10)
    }
    initControl(){
        this.map.addControl(new ScaleLine())
    }
    initgcj02Mecator(){
        addProjection(gcj02Mecator);
        addCoordinateTransforms('EPSG:4326', gcj02Mecator, ll2gmerc, gmerc2ll);
        addCoordinateTransforms('EPSG:3857', gcj02Mecator, smerc2gmerc, gmerc2smerc);
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
        this.clearLayer()
        this.baseMapLayer=await this.getLayer(layer)
        if(layer.labelLayer){
            this.labelLayer=await this.getLayer(layer.labelLayer)
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
        let mapUrl = layer.url
        if(layer.layerType=='tiles'){
            if(isTdt(layer.mapType)){
                mapUrl= mapUrl + (await getTdtKey())
            }
            baseMapLayer=new TileLayer({
                source: new SourceXYZ({
                    projection: layer.projection,
                    attributionsCollapsible:false,
                    crossOrigin: 'anonymous',
                    url: mapUrl,
                }),
                id:layer.id
            })
        }
        return baseMapLayer
    }

    clearLayer(){
        if(this.baseMapLayer){
            this.map.removeLayer(this.baseMapLayer)
            this.baseMapLayer=null
        }
        if(this.labelLayer){
            this.map.removeLayer(this.labelLayer)
            this.labelLayer =null
        }
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