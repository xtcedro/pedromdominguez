// types/system.d.ts

export interface SystemInfo {
  denoVersion: string;
  v8Version: string;
  tsVersion: string;
  appVersion: string;
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    rss: number;
    external: number;
  };
  uptime: number;
}