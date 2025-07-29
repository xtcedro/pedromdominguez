export interface SystemInfo {
  framework: string;
  frameworkVersion: string;
  denoVersion: string;
  typescriptVersion: string;
  v8Version: string;
  kernelVersion: string;
  linuxDistro: string;
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    rss: number;
    external: number;
  };
  uptime: number;
}