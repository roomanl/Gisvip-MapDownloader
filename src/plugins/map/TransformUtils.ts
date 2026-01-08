import coordtransform from 'coordtransform';
import {transform as olTransform} from 'ol/proj.js';

export const gcj02ToWgs84 = (coordinate: any) => {
    return coordtransform.gcj02towgs84(coordinate[0], coordinate[1]);
};

export const gcj02ToMercator = (coordinate: any) => {
    const wgs84 = gcj02ToWgs84(coordinate);
    return olTransform(wgs84, 'EPSG:4326','EPSG:3857');
};

export const gcj02ToMercatorMultiPolygon = (coordinates: any) => {
    if (!Array.isArray(coordinates)) {
        throw new Error('Invalid coordinates format');
    }     
    return coordinates.map((polygon: any) => {
        return polygon.map((ring: any) => {
            return ring.map((coordinate: any) => {
                return gcj02ToMercator(coordinate);
            });
        });
    });
};

export const gcj02ToWgs84MultiPolygon = (coordinates: any) => { 
    if (!Array.isArray(coordinates)) {
        throw new Error('Invalid coordinates format');
    }     
    return coordinates.map((polygon: any) => {
        return polygon.map((ring: any) => {
            return ring.map((coordinate: any) => {
                return gcj02ToWgs84(coordinate);
            });
        });
    });
};

export const transformToWgs84 = (coordinate: any,source: any) => {
    return olTransform(coordinate,source,'EPSG:4326');
}
export const transformExtentToWgs84 = (extent: any,source: any) => {
    const leftTop = olTransform([extent[0],extent[1]],source,'EPSG:4326');
    const rightBottom = olTransform([extent[2],extent[3]],source,'EPSG:4326');
    return [leftTop[0],leftTop[1],rightBottom[0],rightBottom[1]];
}
export const transformMultiPolygon = (coordinates: any,source: any,destination:any) => { 
    if (!Array.isArray(coordinates)) {
        throw new Error('Invalid coordinates format');
    }
    return coordinates.map((polygon: any) => {
        return polygon.map((ring: any) => {
            return ring.map((coordinate: any) => {
                return olTransform(coordinate, source, destination);
            });
        });
    });
}

