import { readTextFile } from '@tauri-apps/plugin-fs';
import { resolveResource } from '@tauri-apps/api/path'

export const initChinaGeojson = async () => {
    const resourcePath = await resolveResource('data/china.json')
    const geojson = JSON.parse(await readTextFile(resourcePath))
    console.log(geojson)
    return geojson;
};