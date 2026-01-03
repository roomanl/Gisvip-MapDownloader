
export const getChinaAreasTree = async (geojson: any) => { 
    const areasTree: any = [];
    for (let i = 0; i < geojson.features.length; i++) { 
        const feature = geojson.features[i]; 
        if(!feature.properties.name) continue;
        areasTree.push({
            name: feature.properties.name,
            adcode: feature.properties.adcode,
            level: feature.properties.level,
            center: feature.properties.center,
            geometry: feature.geometry,
            leaf: feature.properties.childrenNum<=0
        });
    }
    // console.log(areasTree);
    return areasTree;
};