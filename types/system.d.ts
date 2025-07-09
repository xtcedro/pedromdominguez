// types/system.d.ts

export interface SystemInfo {
  framework: string;
  frameworkVersion: string;
  denoVersion: string;
  typescriptVersion: string;
  v8Version: string;
  environment?: Record<string, string>;
}