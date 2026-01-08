// src/lib/downloader.ts
import { ElNotification } from 'element-plus'
import { fetch } from '@tauri-apps/plugin-http';
import { join } from '@tauri-apps/api/path';
import { writeFile, mkdir, exists,remove as removeFile } from "@tauri-apps/plugin-fs";
import { nanoid } from 'nanoid';
import { getTdtKey } from '@/plugins/store/Setting'
import { isTdt,longlat2tile } from '@/plugins/map/Utils'
import { sqliteManager } from '@/plugins/sqlite/SQLiteManager'
import { getPercentage } from '@/utils/index'
import { RandomUserAgent } from '@/utils/userAgent';

type TaskStatus = 'pending' | 'downloading' | 'paused' | 'completed' | 'error' | 'cancelled';

export default class DownloadTiles {
  private tasks: Map<string, any> = new Map();
  private activeDownloads: Set<string> = new Set();
  private concurrentLimit: number = 1;
  private maxRetryCount: number = 5;
  private retryCount: number = 0;
  private queue: string[] = [];
  private failTaskid: string[] = [];
  private status:TaskStatus = 'pending';
  private isStop: boolean = false;
  private taskInfo: any;
  private successCallback: Function;
  private failCallback: Function;
  constructor(taskInfo: any) {
    this.taskInfo = taskInfo;
  }
  async start(){
    this.setStatus('downloading');
    this.taskInfo.successTotal = 0;
    const [minZoom, maxZoom] = JSON.parse(this.taskInfo.downZoom);
    const extent = JSON.parse(this.taskInfo.downExtent);
    const [minLng, minLat, maxLng, maxLat] = extent;
    for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
      const topLeft = longlat2tile(minLng, maxLat, zoom);
      const bottomRight = longlat2tile(maxLng, minLat, zoom);
      for (let x = topLeft.x; x <= bottomRight.x; x++) {
        for (let y = topLeft.y; y <= bottomRight.y; y++) {
          // const downUrl ='https://blog.gisvip.cn/data/image/2025/12/29/34674_stle_6580.png'
          // const downUrl ='http://192.168.1.201/001.jpg'
          const downUrl =await this.getTileUrl( x, y, zoom );
          const {saveDir,filename,savePath} = await this.getSaveDirAndFileName( x, y, zoom );
          this.addTask(downUrl,saveDir,savePath,filename);
          // console.log(downUrl);
        }
      }
    }
  }
  async addTask(downUrl:string,saveDir:string,savePath:string,filename:string){
    const taskId = nanoid();
    const task = {
      taskId: taskId,
      url: downUrl,
      filename,
      saveDir,
      savePath,
      totalSize: 0,
      downloaded: 0,
      percentage: 0,
      speed: 0,
      status: 'pending'
    };
    
    this.tasks.set(taskId, task);
    if (await exists(task.savePath)) {
      task.status = 'completed';
      this.taskInfo.successTotal += 1;
      this.updateProgress()
    }else if(this.activeDownloads.size < this.concurrentLimit && !this.isStop) {
      this.startDownload(taskId);
    } else {
      this.queue.push(taskId);
    }
    return taskId;
  }

  private setCallback(successCallback: Function, failCallback: Function) {
    this.successCallback = successCallback;
    this.failCallback = failCallback;
  }

  private async startDownload(taskId: string) {
    const task = this.tasks.get(taskId);
    // console.log(task);
    if (!task || task.status !== 'pending') return;
    this.activeDownloads.add(taskId);
    task.status = 'downloading';
    this.setStatus('downloading');
    try {
      // 确保保存目录存在
      if (!await exists(task.saveDir)) {
        await mkdir(task.saveDir, { recursive: true });
      }
      const ua = RandomUserAgent.generate()
      // 发送HTTP请求
      const response = await fetch(task.url, {
        method: 'GET',
        headers: { 'User-Agent': ua}
      });
      // console.log(response);
      if(response.ok){
        await writeFile(task.savePath,  await response.bytes());
        task.status = 'completed';
        this.taskInfo.successTotal += 1;
      }else{
        this.tasKError(taskId)
      }
    } catch (error: any) {
      this.tasKError(taskId)
      console.error(error);
    } finally {
      this.activeDownloads.delete(taskId);
      this.processQueue();
      this.updateProgress()
    }
  }

  pauseDownload() {
    this.isStop = true;
    this.setStatus('paused');
  }
  resumeDownload() {
    this.isStop = false;
    this.setStatus('downloading');
    this.processQueue();
  }

  // 处理队列中的任务
  private processQueue() {
    while (this.queue.length > 0 && this.activeDownloads.size < this.concurrentLimit && !this.isStop) {
      const nextTaskId = this.queue.shift();
      if (nextTaskId) {
        this.startDownload(nextTaskId);
      }
    }
  }

  private tasKError(taskId: string) {
    const task = this.tasks.get(taskId);
    if (!task) return;
    task.status = 'error';
    this.taskInfo.errorTotal += 1;
    this.deleteFailedFile(taskId)
    this.failTaskid.push(taskId)
  }

   private updateProgress() {
      this.taskInfo.percentage = getPercentage(this.taskInfo.successTotal , this.taskInfo.tileTotal)
      if(this.taskInfo.successTotal+this.taskInfo.errorTotal>=this.taskInfo.tileTotal){
        if(this.taskInfo.errorTotal>0){
            ElNotification({
                title: '提示',
                message: '已下载完成，但是有下载失败的瓦片，正在重新下载失败的瓦片...',
                type: 'warning',
                duration: 2000
            })
            setTimeout(()=>{
              this.retryFailedTask()
            },1000)
        }else{
          this.finishAllTask();
        }
      }
      sqliteManager.updateDownloadSuccessTotal(this.taskInfo.id,this.taskInfo.successTotal)
   }

   private retryFailedTask(){
    if(this.retryCount>=this.maxRetryCount){
        this.setStatus('error');
        this.failCallback && this.failCallback(this.taskInfo.id)
        return;
      }
      this.retryCount++
      ElNotification({
        title: '提示',
        message: `正在重试第${this.retryCount}次下载...`,
        type: 'info',
        duration: 2000
      })
      this.taskInfo.errorTotal = 0
      this.failTaskid.forEach(taskId=>{
        const task = this.tasks.get(taskId);
        task.status = 'pending';
        this.startDownload(task.taskId)
      })
      this.failTaskid = []
   }

   private finishAllTask(){
      this.setStatus('completed');
      this.successCallback && this.successCallback(this.taskInfo.id)
   }

   private setStatus(status: TaskStatus){
      this.taskInfo.taskStatus = status;
      this.status = status;
   }

   private async deleteFailedFile(taskId: string){
      const task = this.tasks.get(taskId);
      if (task && await exists(task.savePath)){
        await removeFile(task.savePath);
      }
   }
  
  private async getSaveDirAndFileName(x:any, y:any, z:any) { 
    const saveDir =  await join(this.taskInfo.downPath,z.toString(),x.toString());
    const filename = y.toString() +'.'+ this.taskInfo.downTilesType;
    return {saveDir,filename,savePath:await join(saveDir, filename)};
  }
  private async getTileUrl(x:any, y:any, z:any){
    const downLayer = JSON.parse(this.taskInfo.downLayer);
    let url = downLayer.url.replace('{z}', z).replace('{x}', x).replace('{y}', y);
    if(isTdt(downLayer.mapType)){
      url=url.replace('{0-7}', this.randomNum(0,7))
      url=url+ (await getTdtKey())
    }
    return url
  }
  private randomNum(max:number,min:number){ 
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


}