// src/lib/downloader.ts
import { http } from '@tauri-apps/api';
import { downloadDir, join } from '@tauri-apps/api/path';
import { writeBinaryFile, createDir, exists } from '@tauri-apps/api/fs';
import { nanoid } from 'nanoid';

export class DownloadManager {
  private tasks: Map<string, DownloadTask> = new Map();
  private activeDownloads: Set<string> = new Set();
  private concurrentLimit: number = 3;
  private queue: string[] = [];
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(concurrentLimit: number = 3) {
    this.concurrentLimit = concurrentLimit;
  }

  // 添加单个下载任务
  async addTask(options: DownloadOptions): Promise<string> {
    const taskId = nanoid();
    let filename = options.filename;
    
    if (!filename) {
      filename = this.extractFilenameFromUrl(options.url);
    }
    
    let savePath = options.savePath;
    if (!savePath) {
      const downloadPath = await downloadDir();
      savePath = await join(downloadPath, filename);
    }
    
    const task: DownloadTask = {
      id: taskId,
      url: options.url,
      filename,
      savePath,
      totalSize: 0,
      downloaded: 0,
      percentage: 0,
      speed: 0,
      status: 'pending',
      createdAt: Date.now()
    };
    
    this.tasks.set(taskId, task);
    this.emit('taskAdded', task);
    
    // 加入队列或立即开始
    if (this.activeDownloads.size < this.concurrentLimit) {
      this.startDownload(taskId);
    } else {
      this.queue.push(taskId);
      this.emit('taskQueued', task);
    }
    return taskId;
  }

  // 开始下载任务
  private async startDownload(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== 'pending') return;
    
    this.activeDownloads.add(taskId);
    task.status = 'downloading';
    this.emit('taskStarted', task);
    
    try {
      // 确保保存目录存在
      const dirPath = task.savePath.substring(0, task.savePath.lastIndexOf('/'));
      if (!await exists(dirPath)) {
        await createDir(dirPath, { recursive: true });
      }
      
      // 发送HTTP请求
      const response = await http.fetch(task.url, {
        method: 'GET',
        responseType: http.ResponseType.Binary,
        onDownloadProgress: (progress) => {
          this.updateProgress(taskId, progress);
        }
      });
      
      // 保存文件
      await writeBinaryFile(task.savePath, response.data);
      
      // 更新任务状态
      task.status = 'completed';
      task.completedAt = Date.now();
      this.emit('taskCompleted', task);
      
    } catch (error: any) {
      task.status = 'error';
      task.error = error.message || '下载失败';
      this.emit('taskError', task, error);
    } finally {
      this.activeDownloads.delete(taskId);
      this.processQueue();
    }
  }

  // 更新下载进度
  private updateProgress(taskId: string, progress: any): void {
    const task = this.tasks.get(taskId);
    if (!task) return;
    
    task.downloaded = progress.receivedBytes;
    if (progress.totalBytes) {
      task.totalSize = progress.totalBytes;
      task.percentage = Math.round((progress.receivedBytes / progress.totalBytes) * 100);
    }
    
    // 计算下载速度（简化版）
    const now = Date.now();
    const elapsed = (now - task.createdAt) / 1000;
    task.speed = elapsed > 0 ? task.downloaded / elapsed : 0;
    
    this.emit('taskProgress', task);
  }

  // 处理队列中的任务
  private processQueue(): void {
    while (this.queue.length > 0 && this.activeDownloads.size < this.concurrentLimit) {
      const nextTaskId = this.queue.shift();
      if (nextTaskId) {
        this.startDownload(nextTaskId);
      }
    }
  }

  // 暂停下载
  pause(taskId: string): void {
    // 注意：Tauri的http.fetch不支持真正的暂停，这里只是停止任务
    const task = this.tasks.get(taskId);
    if (task && task.status === 'downloading') {
      task.status = 'paused';
      this.activeDownloads.delete(taskId);
      this.emit('taskPaused', task);
      
      // 重新加入队列
      this.queue.unshift(taskId);
    }
  }

  // 恢复下载
  resume(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task && task.status === 'paused') {
      if (this.activeDownloads.size < this.concurrentLimit) {
        task.status = 'pending';
        this.startDownload(taskId);
      } else {
        this.queue.unshift(taskId);
      }
    }
  }

  // 取消下载
  cancel(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = 'cancelled';
      this.activeDownloads.delete(taskId);
      
      // 从队列中移除
      const index = this.queue.indexOf(taskId);
      if (index > -1) {
        this.queue.splice(index, 1);
      }
      
      this.emit('taskCancelled', task);
      this.processQueue();
    }
  }

  // 删除任务
  remove(taskId: string): void {
    this.cancel(taskId);
    this.tasks.delete(taskId);
    this.emit('taskRemoved', taskId);
  }

  // 获取所有任务
  getAllTasks(): DownloadTask[] {
    return Array.from(this.tasks.values());
  }

  // 获取下载中任务
  getActiveTasks(): DownloadTask[] {
    return Array.from(this.activeDownloads)
      .map(id => this.tasks.get(id))
      .filter(Boolean) as DownloadTask[];
  }

  // 获取等待中任务
  getQueuedTasks(): DownloadTask[] {
    return this.queue
      .map(id => this.tasks.get(id))
      .filter(Boolean) as DownloadTask[];
  }

  // 事件监听
  on(event: string, listener: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  // 触发事件
  private emit(event: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(...args));
    }
  }

  // 从URL提取文件名
  private extractFilenameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      let filename = urlObj.pathname.split('/').pop() || 'download';
      
      // 移除查询参数
      filename = filename.split('?')[0];
      
      // 如果没有扩展名，添加时间戳
      if (!filename.includes('.')) {
        filename = `${filename}_${Date.now()}`;
      }
      
      return filename;
    } catch {
      return `download_${Date.now()}`;
    }
  }

  // 更新并发限制
  updateConcurrentLimit(limit: number): void {
    this.concurrentLimit = limit;
    
    // 如果当前活跃任务数小于新限制，启动队列中的任务
    while (this.activeDownloads.size < this.concurrentLimit && this.queue.length > 0) {
      const nextTaskId = this.queue.shift();
      if (nextTaskId) {
        this.startDownload(nextTaskId);
      }
    }
  }
}