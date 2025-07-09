import { Router } from "https://deno.land/x/oak/mod.ts";
import { getSystemInfo } from "../controllers/systemController.ts";

const router = new Router();
router.get("/info", getSystemInfo);

export default router;