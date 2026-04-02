import TileLayer from 'ol/layer/Tile'
import SourceXYZ from 'ol/source/XYZ'
export default class TencentTileLayer extends TileLayer {
    constructor(opt_options:any) {
        const options = opt_options ? opt_options : {};
        options.source= new SourceXYZ({
            projection: options.projection,
            crossOrigin: 'anonymous',
            // tilePixelRatio:2,
            tileUrlFunction: function (tileCoord) {
                const URLS_LENGTH = options.subdomain.length          
                const x = tileCoord[1]
                const y = tileCoord[2]
                const z = tileCoord[0] 
                const newY = Math.pow(2, z) - 1 - y  
                const m = Math.floor(x / 16.0);
                const n = Math.floor(newY / 16.0);  
                var hash = (x << z) + y
                var index = hash % URLS_LENGTH
                index = index < 0 ? index + URLS_LENGTH : index          
              return options.url
                .replace(/\{\d+-\d+\}/, options.subdomain[index]).replace('{x}', x).replace('{y}', newY).replace('{z}', z).replace('{m}', m).replace('{n}', n);
            },
          })
          super(options);
    }
}