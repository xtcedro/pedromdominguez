// services/systemService.ts

import { SystemModel } from "../models/systemModel.ts";
import { SystemInfo } from "../types/system.d.ts";

export class SystemService {
  static async getSystemInfo(): Promise<SystemInfo> {
    return await SystemModel.fetchSystemInfo();
  }
}