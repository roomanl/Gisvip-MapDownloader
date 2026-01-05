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
    private mapView: any;
    private map: any;
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
        this.map=options.map
        this.mapView=options.mapView
        this.layerType=options.layerType
        this.layerIndex=options.layerIndex?options.layerIndex:1
        

        this.features = [];
        this.drawStyle = {
            lineWidth: options && options.lineWidth ? options.lineWidth : 3,
        };

        this.initSymbol();
        this.initDrawLayer();
        // console.log(this.drawLayer);
    }

    initDrawLayer() {
        this.drawSource = new sourceVector({ wrapX: false });
        this.drawLayer = new layerVector({
            source: this.drawSource,
            zIndex: this.layerIndex,
            style: this.styleSymbol,
			properties:{layerType:this.layerType}
        });
        this.map.addLayer(this.drawLayer);
    }

    initSymbol() {
        this.setPolySymbol();
        this.setStyleSymbol();
    }
    setStyleSymbol(color?:any,fill?:any,lineWidth?:any,radius?:any) {
        this.styleSymbol =new olStyle({
            image: new olCircle({
                radius: radius?radius:4,
                stroke: new olStroke({
                  color: color?color:[246, 0, 60, 1],
                  width: lineWidth?lineWidth:this.drawStyle.lineWidth,
                }),
                fill: new olFill({
                  color: fill?fill:"#fff",
                }),
            }),
            fill: new olFill({
                color: fill?fill:"rgba(247,23,53,0.3)",
            }),
            stroke: new olStroke({
                width: lineWidth?lineWidth:this.drawStyle.lineWidth,
                color:color?color:"rgba(247,23,53,1)"
            })
        })
    }
    setPolySymbol(color?:any,fillColor?:any,lineWidth?:any) {
        this.polySymbol =new olStyle({
            fill: new olFill({ color: fillColor?fillColor:"rgba(247,23,53,0.2)" }),
            stroke: new olStroke({
                width: lineWidth?lineWidth:this.drawStyle.lineWidth,
                color:color?color:"rgba(247,23,53,1)"
            })
        })
    }

    startDraw(obj:any){
        if(obj.lineWidth){
            this.drawStyle.lineWidth=obj.lineWidth
        }
        this.initSymbol();
        this.initDrawLayer();
        this.finishDraw()
        this.removeInteraction()

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

        this.map.addInteraction(this.draw)
        this.map.getViewport().style.cursor='crosshair'
        this.draw.on('drawend', (evt:any) => {
            this.features.push(evt.feature);
            this.map.getViewport().style.cursor='default'
            this.removeInteraction()
            this.draw=null
            if (obj.drawEnd) {
                obj.drawEnd(evt)
            }
        })
    }
    drawMultiPoly(coordinates:any,id:any){
        let poly = this.createGraphic(new MultiPolygon(coordinates),this.polySymbol);
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
        this.map.getViewport().style.cursor='default'
        if(this.draw)
            this.map.removeInteraction(this.draw)
    }

    finishDraw(){
        this.map.getViewport().style.cursor='default'
        if(this.draw){
            this.draw.finishDrawing()
        }
    }
    clearDraw(){
        this.map.getViewport().style.cursor='default'
        this.finishDraw()
        this.removeInteraction()
        this.map.removeLayer(this.drawLayer)
        this.drawLayer=null
        this.draw=null
    }
    clear() {
        for (let i in this.features) {
            this.drawSource.removeFeature(this.features[i]);
        }
        this.features = [];
    }
    getFeatureById(id:any){
		if(id){
             const feature = this.features.find(function (item) {
                return item.getGeometry().id == id;
            });
            return feature;
        }
	}
    rmoveFeatureById(id:any){
        if(id){
            const feature = this.features.find(function (item) {
                return item.getGeometry().id == id;
            });
            if(feature){
                this.drawSource.removeFeature(feature);
                this.features = this.features.filter(function (item) {
                    return item.getGeometry().id != id;
                });
            }
            
        }
    }
	clearAll(){
		var layers = this.map.getLayers().getArray();
		layers.forEach((layer :any) => {
			var layerType = layer.get('layerType');
			if(layerType == this.layerType){
				this.map.removeLayer(layer);
			}
		});
	}

}