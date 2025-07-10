import { SystemInfo } from "../types/system.d.ts";

const startTime = Date.now();

export class SystemModel {
  static async getInfo(): Promise<SystemInfo> {
    let frameworkVersion = "unknown";
    try {
      const text = await Deno.readTextFile("./VERSION");
      frameworkVersion = text.trim();
    } catch (err) {
      console.error("❌ Could not read VERSION file:", err);
    }

    const mem = Deno.memoryUsage();

    return {
      framework: "DenoGenesis",
      frameworkVersion,
      denoVersion: Deno.version.deno,
      typescriptVersion: Deno.version.typescript,
      v8Version: Deno.version.v8,
      memoryUsage: {
        heapUsed: mem.heapUsed,
        heapTotal: mem.heapTotal,
        rss: mem.rss,
        external: mem.external,
      },
      uptime: Math.floor((Date.now() - startTime) / 1000),
    };
  }
}