import * as projection from 'projzh/projection/index';
import * as datum from 'projzh/datum/index';
import {Projection} from 'ol/proj';

export const smerc2bmerc = function(input:any, opt_output:any, opt_dimension:any) {
  var output = projection.sphericalMercator.inverse(input, opt_output, opt_dimension);
  output = datum.bd09.fromWGS84(output, output, opt_dimension);
  return projection.baiduMercator.forward(output, output, opt_dimension);
};

export const bmerc2smerc = function(input:any, opt_output:any, opt_dimension:any) {
  var output = projection.baiduMercator.inverse(input, opt_output, opt_dimension);
  output = datum.bd09.toWGS84(output, output, opt_dimension);
  return projection.sphericalMercator.forward(output, output, opt_dimension);
};

export const bmerc2ll = function(input:any, opt_output:any, opt_dimension:any) {
  var output = projection.baiduMercator.inverse(input, opt_output, opt_dimension);
  return datum.bd09.toWGS84(output, output, opt_dimension);
};

export const ll2bmerc = function(input:any, opt_output:any, opt_dimension:any) {
  var output = datum.bd09.fromWGS84(input, opt_output, opt_dimension);
  return projection.baiduMercator.forward(output, output, opt_dimension);
};

export const bd09Mecator = new Projection({
  code: 'DB09-MC',
  units: 'm',
});


