import { ElNotification } from 'element-plus'
import { join } from '@tauri-apps/api/path';
import { useDownConfStore } from '@/store/modules/downConf'
import { useDownTaskStore } from '@/store/modules/downTask'
import { useAppStore } from '@/store/modules/app'
import { formatDate } from '@/utils/index'
import { sqliteManager } from '@/plugins/sqlite/SQLiteManager'
import { isTdt,checkTdtKeyTip } from '@/plugins/map/Utils'
import DownloadTiles from '@/plugins/map/DownloadTiles'

class DownloadMapManager {
    private downConfStore = useDownConfStore()
    private downTaskStore = useDownTaskStore()
    private appStore = useAppStore()
    private downloadTasks: Map<string, DownloadTiles> = new Map();
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
        if(!await this.checkTdtKey(this.downConfStore.downLayer.layer)){
            return false
        }
        return true
    }
    async checkTdtKey(downLayer:any) { 
        if(isTdt(downLayer.mapType) && !await checkTdtKeyTip()){
            return false
        }
        return true
    }
    async startDownload(taskInfo:any) { 
        if(!await this.checkTdtKey(JSON.parse(taskInfo.downLayer))){
            return
        }
        let downloadTask = this.downloadTasks.get(taskInfo.id)
        if(!downloadTask){
            downloadTask = new DownloadTiles(taskInfo)
            downloadTask.setCallback(
                (taskId: any)=>this.downloadTilesSuccess(taskId),
                (taskId: any)=>this.downloadTilesError(taskId)
            )
            this.downloadTasks.set(taskInfo.id, downloadTask);
        }
        if(downloadTask.status=='pending' || downloadTask.status=='error'){
            downloadTask.start()
            sqliteManager.updateDownloadStatus(taskInfo.id,0)
        }else if(downloadTask.status=='paused'){ 
            downloadTask.resumeDownload()
        }
    }
    async stopDownload(taskId: any) { 
        const task = this.downloadTasks.get(taskId)
        if(task){
            task.pauseDownload()
        }
    }
    downloadTilesSuccess(taskId: any) { 
        const task = this.downTaskStore.getTaskInfo(taskId)
        task.downStatus = 1
        sqliteManager.updateDownloadStatus(taskId,1)
        ElNotification({
          title: '提示',
          message: `${task.mapName} - ${task.cityName} 下载成功`,
          type: 'success',
          duration: 2000
        })
    }
    downloadTilesError(taskId: any) { 
        ElNotification({
          title: '提示',
          message: '下载失败',
          type: 'error',
          duration: 2000
        })
        sqliteManager.updateDownloadStatus(taskId,2)
    }
    async addDownloadTask() { 
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
            tileTotal: this.downConfStore.tileTotal,
            createTime: formatDate(new Date().getTime()),
        }
        const result = await sqliteManager.addDownloadTask(task)
        if(result && result.rowsAffected==1){
            const taskId = result.lastInsertId
            this.appStore.openView('/download',{taskId,type:'add'})
        }
    }
    async getDownloadTasks() { 
        return await sqliteManager.getDownloadTasks()
    }
    async getDownloadTaskById(taskId: any) {
        return await sqliteManager.getDownloadTaskById(taskId)
    }
    async deleteDownloadTask(taskId: any){
        const result = await sqliteManager.deleteDownloadTask(taskId)
        if(result && result.rowsAffecte==0){
            this.notification('删除失败')
            return;
        }
        const index = this.downTaskStore.tasks.findIndex((item: any) => item.id == taskId)
        if(index != -1){
            this.downTaskStore.tasks.splice(index,1)
            // this.downTaskStore.selectTask = {}
        }
        if(this.downTaskStore.selectTask.id==taskId){
            if(this.downTaskStore.finishTasks.length>0 && this.downTaskStore.selectTask.downStatus==1){
                this.downTaskStore.selectTask = this.downTaskStore.finishTasks[0]
            }else if(this.downTaskStore.downloadTasks.length>0){
                this.downTaskStore.selectTask = this.downTaskStore.downloadTasks[0]
            }else{
                this.downTaskStore.selectTask = {}
            }
        }
        this.notification('删除成功','success')
    }
    getTaskStatusAlis(status: any,type?: any){
        switch (status) {
            case 'pending':
                return type=='text'?'等待下载':(type=='color'?'#909399':'icon')
            case 'downloading':
                return type=='text'?'下载中':(type=='color'?'#409EFF':'icon')
            case 'paused':
                return type=='text'?'暂停下载':(type=='color'?'#E6A23C':'icon')
            case 'completed':
                return type=='text'?'下载完成':(type=='color'?'#67C23A':'icon')
            case 'error':
                return type=='text'?'下载失败':(type=='color'?'#F56C6C':'icon')
            default:
                return type=='text'?'等待下载':(type=='color'?'#E6A23C':'icon')
        }
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

export const downloadMapManager = new DownloadMapManager();