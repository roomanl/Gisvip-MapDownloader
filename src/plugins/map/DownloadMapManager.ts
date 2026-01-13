import { ElNotification } from 'element-plus'
import { join } from '@tauri-apps/api/path';
import { useDownConfStore } from '@/store/modules/downConf'
import { useAppStore } from '@/store/modules/app'
import { checkTdtKeyTip } from '@/utils/index'
import { sqliteManager } from '@/plugins/sqlite/SQLiteManager'

export default class DownloadMapManager {
    private downConfStore = useDownConfStore()
    private appStore = useAppStore()
    constructor() {
    }

    async checkDownConf() { 
        if(!this.downConfStore.downExtent || this.downConfStore.downExtent.length !=4){
            this.notification('请选择下载区域')
            return false
        }
        if(!this.downConfStore.downPath){ 
            this.notification('请选择下载路径')
            return false
        }
        if(!this.downConfStore.downTilesType){ 
            this.notification('请选择下载图片格式')
            return false
        }
        if(!this.downConfStore.downZoom || this.downConfStore.downZoom.length !=2){ 
            this.notification('请选择下载层级')
            return false
        }
        if(!this.downConfStore.downLayer){ 
            this.notification('请选择地图源')
            return false
        }
        if(this.downConfStore.downLayer.layer.id.includes('tdt') && !await checkTdtKeyTip()){
            return false
        }
        return true
    }
    async startDownload() { 
        if(!await this.checkDownConf()){
            return
        }
        const task = {
            mapName: this.downConfStore.mapName,
            cityName: this.downConfStore.cityName,
            cityArea: this.downConfStore.cityArea,
            downExtent: JSON.stringify(this.downConfStore.downExtent),
            downZoom: JSON.stringify(this.downConfStore.downZoom),
            downTilesType: this.downConfStore.downTilesType,
            downPath: await join(this.downConfStore.downPath,`${this.downConfStore.mapName}-${this.downConfStore.cityName}`.replaceAll(' ','')),
            downUrl: this.downConfStore.downLayer.layer.url,
            downLayer: JSON.stringify(this.downConfStore.downLayer.layer),
            tileTotal: '0',
            createTime: new Date().getTime(),
        }
        console.log(task)
        await sqliteManager.addDownloadTask(task)
        this.appStore.openViewByIndex(1)
    }
    notification(message: string,type?: string){
        ElNotification({
            title: '提示',
            message: message,
            type: type?type:'warning',
            duration: 2000
        })
    }

}