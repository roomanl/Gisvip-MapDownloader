import olStyle from "ol/style/Style";
import olFill from "ol/style/Fill";
import olStroke from "ol/style/Stroke";
import olCircle from "ol/style/Circle";
import layerVector from "ol/layer/Vector";
import sourceVector from "ol/source/Vector";
import MultiPolygon from 'ol/geom/MultiPolygon'
import Feature from "ol/Feature";
import olDraw from 'ol/interaction/Draw'
import {createBox} from 'ol/interaction/Draw'
export default class OlMap {
    private option: any;
    private olMap: any;
    private layerType: any;
    private layerIndex: any;
    private features: any[];
    private drawStyle: any;
    private polySymbol: any;
    private styleSymbol: any;
    private drawSource: any;
    private drawLayer: any;
    private draw: any;


    constructor(options: any) {
        this.option=options
        this.olMap=options.map
        this.layerType=options.layerType
        this.layerIndex=options.layerIndex?options.layerIndex:1
        

        this.features = [];
        this.drawStyle = {
            lineWidth: options && options.lineWidth ? options.lineWidth : 3,
        };
        this.initSymbol();
       
    }

    initDrawLayer() {
        if(!this.drawLayer){
            this.drawSource = new sourceVector({ wrapX: false });
            this.drawLayer = new layerVector({
                source: this.drawSource,
                zIndex: this.layerIndex,
                style: this.styleSymbol,
                properties:{layerType:this.layerType}
            });
            this.olMap.getMap().addLayer(this.drawLayer);
       }
    }

    initSymbol() {
        this.styleSymbol =new olStyle({
            image: new olCircle({
                radius:4,
                stroke: new olStroke({
                  color: [246, 0, 60, 1],
                  width: this.drawStyle.lineWidth,
                }),
                fill: new olFill({
                  color:"#fff",
                }),
            }),
            fill: new olFill({
                color:"rgba(247,23,53,0.3)",
            }),
            stroke: new olStroke({
                width: this.drawStyle.lineWidth,
                color:"rgba(247,23,53,1)"
            })
        })
    }

    startDraw(obj:any){
        if(obj.lineWidth){
            this.drawStyle.lineWidth=obj.lineWidth
        }
        this.finishDraw()
        this.removeInteraction()
        this.initDrawLayer();

        var drawType = obj.type
        var geometryFunction, maxPoints
        if (drawType == 'Box') {
            drawType = 'LineString'
            maxPoints = 2
            geometryFunction = createBox()
        }
        // console.log(this.drawLayer);
        this.draw = new olDraw({
            source: this.drawLayer.getSource(),
            type: drawType,
            style: this.styleSymbol,
            stopClick: true,
            maxPoints: maxPoints,
            geometryFunction: geometryFunction,
        })

        this.olMap.getMap().addInteraction(this.draw)
        this.olMap.getMap().getViewport().style.cursor='crosshair'
        this.draw.on('drawend', (evt:any) => {
            this.features.push(evt.feature);
            this.olMap.getMap().getViewport().style.cursor='default'
            this.removeInteraction()
            this.draw=null
            if (obj.drawEnd) {
                obj.drawEnd(evt)
            }
        })
    }
    drawMultiPoly(coordinates:any,id:any){
        this.initDrawLayer();
        let poly = this.createGraphic(new MultiPolygon(coordinates),this.styleSymbol);
         poly.getGeometry().id=id
        return poly
      }
    createGraphic(geometry:any,symbol:any) {
        let geom = { geometry: geometry,data:null,layerType:null };
        geom.layerType=this.layerType
        var feature = new Feature(geom);
        feature.setStyle(symbol);
        this.drawSource.addFeature(feature);
        this.features.push(feature);
        return feature;
    }

    removeInteraction() {
        this.olMap.getMap().getViewport().style.cursor='default'
        if(this.draw)
            this.olMap.getMap().removeInteraction(this.draw)
    }

    finishDraw(){
        this.olMap.getMap().getViewport().style.cursor='default'
        if(this.draw){
            this.draw.finishDrawing()
        }
    }
    clear() {
         for (let i in this.features) {
            this.drawSource.removeFeature(this.features[i]);
        }
        this.features = [];
    }

}