// src/lib/downloader.ts
import { fetch } from '@tauri-apps/plugin-http';
import { downloadDir, join } from '@tauri-apps/api/path';
import { writeFile, mkdir, exists } from "@tauri-apps/plugin-fs";
import { nanoid } from 'nanoid';
import { getTdtKey } from '@/plugins/store/Setting'
import { isTdt,startXYAndendXy } from '@/plugins/map/Utils'
import { save } from '@tauri-apps/plugin-dialog';

type TaskStatus = 'pending' | 'downloading' | 'paused' | 'completed' | 'error' | 'cancelled';

export default class DownloadTiles {
  private tasks: Map<string, any> = new Map();
  private activeDownloads: Set<string> = new Set();
  private concurrentLimit: number = 3;
  private queue: string[] = [];
  private status:TaskStatus = 'pending';
  private taskInfo: any;

  constructor(taskInfo: any) {
    this.taskInfo = taskInfo;
  }
  async start(){
    const [minZoom, maxZoom] = JSON.parse(this.taskInfo.downZoom);
    const extent = JSON.parse(this.taskInfo.downExtent);
    for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
      const {startX,endX,startY,endY} = startXYAndendXy(extent,zoom);
      for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
          //const downUrl ='https://blog.gisvip.cn/data/image/2025/12/29/34674_stle_6580.png'
          const downUrl =await this.getTileUrl( x, y, zoom );
          const {saveDir,filename,savePath} = await this.getSaveDirAndFileName( x, y, zoom );
          this.addTask(downUrl,saveDir,savePath,filename);
          console.log(downUrl);
        }
      }
    }
  }
  async addTask(downUrl:string,saveDir:string,savePath:string,filename:string){
    const taskId = nanoid();
    
    const task = {
      id: taskId,
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
    }else if (this.activeDownloads.size < this.concurrentLimit) {
      this.startDownload(taskId);
    } else {
      this.queue.push(taskId);
    }
    return taskId;
  }

  private async startDownload(taskId: string) {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== 'pending') return;
    
    this.activeDownloads.add(taskId);
    task.status = 'downloading';
    this.taskInfo.taskStatus = 'downloading';
    try {
      // 确保保存目录存在
      if (!await exists(task.saveDir)) {
        await mkdir(task.saveDir, { recursive: true });
      }
      // 发送HTTP请求
      const response = await fetch(task.url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
      });
      console.log(response);
      if(response.ok){
        // 保存文件
        await writeFile(task.savePath,  await response.bytes());
        // 更新任务状态
        task.status = 'completed';
        this.taskInfo.successTotal += 1;
        this.updateProgress()
      }else{
        task.status = 'error';
        this.taskInfo.errorTotal += 1;

      }
      
    } catch (error: any) {
      task.status = 'error';
      this.taskInfo.errorTotal += 1;
      console.error(error);
    } finally {
      this.activeDownloads.delete(taskId);
      this.processQueue();
    }
  }

  // 处理队列中的任务
  private processQueue() {
    while (this.queue.length > 0 && this.activeDownloads.size < this.concurrentLimit) {
      const nextTaskId = this.queue.shift();
      if (nextTaskId) {
        this.startDownload(nextTaskId);
      }
    }
  }

   private updateProgress() {
      let percentage = ((this.taskInfo.successTotal / this.taskInfo.tileTotal) * 100);
      if(percentage>=100){
        this.taskInfo.percentage = 100;
      }else{
        this.taskInfo.percentage = isNaN(percentage)?0:percentage.toFixed(2);
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
    if(isTdt(downLayer.id)){
      url=url.replace('{0-7}', this.randomNum(0,7))
      url=url+ (await getTdtKey())
    }
    return url
  }
  private randomNum(max:number,min:number){ 
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


}