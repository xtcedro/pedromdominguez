// models/systemModel.ts

import { SystemInfo } from "../types/system.d.ts";

export class SystemModel {
  static async fetchSystemInfo(): Promise<SystemInfo> {
    const versionFile = await Deno.readTextFile("./VERSION");
    const denoVersion = Deno.version.deno;
    const typescriptVersion = Deno.version.typescript;
    const v8Version = Deno.version.v8;

    return {
      framework: "DenoGenesis",
      frameworkVersion: versionFile.trim(),
      denoVersion,
      typescriptVersion,
      v8Version,
      environment: Deno.env.toObject(), // Optional: for debugging — remove in prod if needed
    };
  }
}