import * as projection from 'projzh/projection/index';
import * as datum from 'projzh/datum/index';
import {Projection} from 'ol/proj';

export const smerc2gmerc = (input:any, opt_output:any, opt_dimension:any)  => {
  var output = projection.sphericalMercator.inverse(input, opt_output, opt_dimension);
  output = datum.gcj02.fromWGS84(output, output, opt_dimension);
  return projection.sphericalMercator.forward(output, output, opt_dimension);
}

export const gmerc2smerc = (input:any, opt_output:any, opt_dimension:any)  => {
  var output = projection.sphericalMercator.inverse(input, opt_output, opt_dimension);
  output = datum.gcj02.toWGS84(output, output, opt_dimension);
  return projection.sphericalMercator.forward(output, output, opt_dimension);
}

export const gmerc2ll = (input:any, opt_output:any, opt_dimension:any)  => {
  var output = projection.sphericalMercator.inverse(input, opt_output, opt_dimension);
  return datum.gcj02.toWGS84(output, output, opt_dimension);
}

export const ll2gmerc = (input:any, opt_output:any, opt_dimension:any) => {
  var output = datum.gcj02.fromWGS84(input, opt_output, opt_dimension);
  return projection.sphericalMercator.forward(output, output, opt_dimension);
}

export const gcj02Mecator = new Projection({
  code: 'GCJ-02',
  extent: [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244],
  units: 'm',
});


