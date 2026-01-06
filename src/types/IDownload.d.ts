// src/types/download.ts
export interface DownloadTask {
  id: string;
  url: string;
  filename: string;
  savePath: string;
  totalSize: number;
  downloaded: number;
  percentage: number;
  speed: number; // B/s
  status: 'pending' | 'downloading' | 'paused' | 'completed' | 'error' | 'cancelled';
  error?: string;
}

export interface DownloadOptions {
  url: string;
  filename?: string;
  savePath?: string;
}