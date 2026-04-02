import TileLayer from 'ol/layer/Tile'
import SourceXYZ from 'ol/source/XYZ'
import TileGrid from 'ol/tilegrid/TileGrid'
export default class BaiDuTileLayer extends TileLayer {
    constructor(opt_options:any) {
        const options = opt_options ? opt_options : {};
        var bmercResolutions = new Array(19);
        for (var i = 0; i < 19; ++i) {
            bmercResolutions[i] = Math.pow(2, 18 - i);
        }
        options.source= new SourceXYZ({
            projection: options.projection,
            crossOrigin: 'anonymous',
            // tilePixelRatio:2,
            tileUrlFunction: function (tileCoord) {
                var URLS_LENGTH = options.subdomain.length          
                let x = tileCoord[1]
                let y =  -(tileCoord[2] + 1)
                let z = tileCoord[0]     
                var hash = (x << z) + y
                var index = hash % URLS_LENGTH
                index = index < 0 ? index + URLS_LENGTH : index          
                if (x < 0) {
                    x = 'M' + (-x)
                }
                if (y < 0) {
                    y = 'M' + (-y)
                }
              return options.url
                .replace(/\{\d+-\d+\}/, options.subdomain[index]).replace('{x}', x).replace('{y}', y).replace('{z}', z)
            },
            tileGrid: new TileGrid({
              origin:[0,0],
              resolutions: bmercResolutions,
            }),
          })
          super(options);
    }
}