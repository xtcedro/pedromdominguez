// controllers/system.controller.ts
import { RouterContext } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { getSystemInfo } from "../services/systemService.ts";

export const getSystemInfoController = async (ctx: RouterContext) => {
  const info = await getSystemInfo();
  ctx.response.status = 200;
  ctx.response.body = info;
  // Setting the response type to JSON is optional; Oak will infer JSON for objects
  ctx.response.type = "application/json";
};
