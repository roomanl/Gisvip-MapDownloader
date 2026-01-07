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

export const formatDate = (datetime: string) => {
  if (datetime == null || datetime == '') return '';
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
};

export const getPercentage = (num: number, total: number) => { 
    if(num ==0 || total==0){
        return 0;
    }
    let percentage = ((num / total) * 100);
    if(percentage>=100){
        return  100;
    }else{
        return isNaN(percentage)?0:percentage.toFixed(2);
    }
};