// controllers/systemController.ts

import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { SystemService } from "../services/systemService.ts";

export const getSystemInfo = async (ctx: Context) => {
  try {
    const info = await SystemService.getSystemInfo();
    ctx.response.status = 200;
    ctx.response.body = info;
  } catch (error) {
    console.error("❌ [SystemController] Error:", error.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Unable to retrieve system info." };
  }
};