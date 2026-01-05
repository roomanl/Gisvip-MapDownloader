import { ElNotification } from 'element-plus'
import { useDownConfStore } from '@/store/modules/downConf'
import { getTdtKey } from '@/utils/settingStore'

export default class DownloadMapManager {
    private downConfStore = useDownConfStore()
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
        if(this.downConfStore.downLayer.layer.id.includes('tdt')){
            const tdtKey = await getTdtKey()
            if(!tdtKey){
                this.notification('请填写天地图密钥')
                return false
            }
        }
        return true
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