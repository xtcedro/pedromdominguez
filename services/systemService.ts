// services/systemService.ts
import { SystemInfo } from "../types/system.d.ts";

// Capture the start time when this module is loaded (app startup time)
const startTime = Date.now();

export async function getSystemInfo(): Promise<SystemInfo> {
  // Deno runtime versions
  const { deno, v8, typescript } = Deno.version;
  
  // Read the application version from the VERSION file
  let appVersion = "unknown";
  try {
    const text = await Deno.readTextFile("./VERSION");
    appVersion = text.trim();
  } catch (err) {
    console.error("Could not read VERSION file:", err);
  }
  
  // Memory usage (heap and total)
  const mem = Deno.memoryUsage();
  
  // Uptime in seconds
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  
  return {
    denoVersion: deno,
    v8Version: v8,
    tsVersion: typescript,
    appVersion,
    memoryUsage: {
      heapUsed: mem.heapUsed,
      heapTotal: mem.heapTotal,
      rss: mem.rss,
      external: mem.external,
    },
    uptime: uptimeSeconds,
  };
}