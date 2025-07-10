import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { getSystemInfoController } from "../controllers/systemController.ts";

const systemRouter = new Router();
systemRouter.get("/info", getSystemInfoController);

export default systemRouter;