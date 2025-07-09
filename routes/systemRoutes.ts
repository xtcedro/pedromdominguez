// routes/systemRoutes.ts

import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { getSystemInfo } from "../controllers/systemController.ts";

const systemRoutes = new Router();

systemRoutes.get("/api/system/info", getSystemInfo);

export default systemRoutes;