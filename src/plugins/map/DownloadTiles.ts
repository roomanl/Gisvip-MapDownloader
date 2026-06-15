// src/lib/downloader.ts
import { ElNotification } from 'element-plus'
import { fetch } from '@tauri-apps/plugin-http';
import { join } from '@tauri-apps/api/path';
import { writeFile, mkdir, exists,remove as removeFile } from "@tauri-apps/plugin-fs";
import { nanoid } from 'nanoid';
import { getTdtKey,getDownloadLimit } from '@/plugins/store/Setting'
import * as downloadInfoStore from '@/plugins/store/DownloadInfo'
import { isTdt,isTencent } from '@/plugins/map/Utils'
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
  private downLayer: any;
  private downUrl:string;
  private isTencentMap:boolean;
  private downX:any;
  private downY:any;
  private downZ:any;
  private downZxy:any;
  private downErrorZxy:any = [];
  private successCallback: Function;
  private failCallback: Function;
  private longlat2tile:Function;
  constructor(options: any) {
    this.taskInfo = options.taskInfo;
    this.longlat2tile = options.longlat2tile
  }
  async init() { 
    this.downLayer = JSON.parse(this.taskInfo.downLayer);
    this.downUrl = this.downLayer.url;
    //获取设置的下载线程数
    this.concurrentLimit = await getDownloadLimit();
    //天地图拼接key
    if(isTdt(this.downLayer.mapType)){
      this.downUrl += (await getTdtKey())
    }
    //是否是腾讯地图
    this.isTencentMap = isTencent(this.downLayer.mapType);
    //获取上次下载的zxy
    const downZxy = await downloadInfoStore.getDownZxy(this.taskInfo.id)
    this.taskInfo.successTotal = 0
    if(downZxy){
      const downZxyArr = downZxy.split(',')
      if(downZxyArr.length == 4){
        this.downZ = parseInt(downZxyArr[0])
        this.downX = parseInt(downZxyArr[1])
        this.downY = parseInt(downZxyArr[2])
        this.taskInfo.successTotal =  parseInt(downZxyArr[3])
      }
    }
    //获取上次错误下载的zxy
    const downErrorZxy = await downloadInfoStore.getDownErrorZxy(this.taskInfo.id)
    if(downErrorZxy){
      this.downErrorZxy = JSON.parse(downErrorZxy)
      this.taskInfo.errorTotal = this.downErrorZxy.length
    }
  }
  async start(){
    this.setStatus('downloading');
    // this.taskInfo.successTotal = 0;
    //先开始上次下载失败的
    await this.startDownErrorZxy()
    //再下载没下载的
    const { downZoom, downExtent } = this.taskInfo;
    const [minZoom, maxZoom] = JSON.parse(downZoom);
    const [minLng, minLat, maxLng, maxLat] = JSON.parse(downExtent);
    // 设置起始缩放级别
    const startZoom = this.downZ || minZoom;
    this.downZ = undefined;
    // 批量处理所有缩放级别
    this.processZoomLevels(startZoom, maxZoom, minLng, maxLat, maxLng, minLat);
  }
  async startDownErrorZxy(){
    if(this.downErrorZxy.length > 0){
      this.downErrorZxy.forEach(async (zxy:any) => {
        await this.createSingleTileTask(zxy.x, zxy.y, zxy.z)
      });
    }
  }
  async processZoomLevels(startZoom:any, maxZoom:any, minLng:any, maxLat:any, maxLng:any, minLat:any) {
    for (let zoom = startZoom; zoom <= maxZoom; zoom++) {
      this.processTilesAtZoom(zoom, minLng, maxLat, maxLng, minLat);
    }
  }
  async processTilesAtZoom(zoom:any, minLng:any, maxLat:any, maxLng:any, minLat:any) {
      const topLeft = this.longlat2tile(minLng, maxLat, zoom);
      const bottomRight = this.longlat2tile(maxLng, minLat, zoom);
      
      const startX = this.downX || Math.min(topLeft.x, bottomRight.x);
      const endX = Math.max(topLeft.x, bottomRight.x);
      const startY = this.downY || Math.min(topLeft.y, bottomRight.y);
      const endY = Math.max(topLeft.y, bottomRight.y);
      
      // 清除断点标记
      this.clearBreakpointFlags();
      //循环瓦片
      for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
          await this.createSingleTileTask(x, y, zoom)
        }
      }
  }
  async createSingleTileTask(x:any, y:any, zoom:any) {
      const downUrl = await this.getTileUrl(x, y, zoom);
      // const downUrl ='http://192.168.1.201/001.jpg'
      const { saveDir, filename, savePath } = await this.getSaveDirAndFileName(x, y, zoom);
      this.addTask(downUrl, saveDir, savePath, filename,`${zoom},${x},${y}`);
  }
  async addTask(downUrl:string,saveDir:string,savePath:string,filename:string,downZxy:any){
    const taskId = nanoid();
    const task = {
      taskId: taskId,
      url: downUrl,
      filename,
      saveDir,
      savePath,
      downZxy,
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
      this.downZxy = `${task.downZxy},${this.taskInfo.successTotal}`
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
    const ua = RandomUserAgent.generate()
    try {
      // 确保保存目录存在
      if (!await exists(task.saveDir)) {
        await mkdir(task.saveDir, { recursive: true });
      }
      
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
        this.downZxy = `${task.downZxy},${this.taskInfo.successTotal}`
      }else{
        this.tasKError(taskId)
      }
    } catch (error: any) {
      this.tasKError(taskId)
      console.error(error,ua);
    } finally {
      this.activeDownloads.delete(taskId);
      this.processQueue();
      this.updateProgress()
    }
  }

  clearBreakpointFlags() {
    if (this.downX) this.downX = undefined;
    if (this.downY) this.downY = undefined;
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
      // 为了不频繁操作数据库，每成功20个瓦片更新一次数据库
      if(this.taskInfo.successTotal % 20 === 0 || this.taskInfo.percentage>=100){
        sqliteManager.updateDownloadSuccessTotal(this.taskInfo.id,this.taskInfo.successTotal)
        downloadInfoStore.setDownZxy(this.taskInfo.id,this.downZxy)
      }
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
    let url = this.downUrl
    if(this.isTencentMap){
      y = Math.pow(2, z) - 1 - y
      const m = Math.floor(x / 16.0);
      const n = Math.floor(y / 16.0);  
      url = url.replace('{m}', m).replace('{n}', n);
    }
    url = url.replace('{z}', z).replace('{x}', x).replace('{y}', y);
    if(this.downLayer.subdomain && this.downLayer.subdomain.length>0){
      var hash = (x << z) + y
      var index = hash % this.downLayer.subdomain.length
      index = index < 0 ? index + this.downLayer.subdomain.length : index
      const subdomains = this.downLayer.subdomain[index];
      url = url.replace(/\{\d+-\d+\}/, subdomains);
    }
    return url
  }

}