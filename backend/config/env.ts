// /config/env.ts
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

const env = await loadEnv();

// ✅ Fail loudly if SITE_KEY is missing
if (!env.SITE_KEY) {
  throw new Error("❌ SITE_KEY is not defined in .env file.");
}

export const SITE_KEY = env.SITE_KEY;