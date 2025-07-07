import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import {
  bold,
  green,
  red,
  cyan,
  magenta,
  yellow,
} from "https://deno.land/std@0.224.0/fmt/colors.ts";

// Load environment variables
const env = await loadEnv();

const dbConfig = {
  hostname: env.DB_HOST,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  db: env.DB_NAME,
  poolSize: 10,
};

// ✅ DenoGenesis Universal Database Client
export const db = await new Client().connect({
  hostname: dbConfig.hostname,
  username: dbConfig.username,
  password: dbConfig.password,
  db: dbConfig.db,
  poolSize: dbConfig.poolSize,
});

// ✅ Test Connection
try {
  const result = await db.execute("SELECT 1");
  console.log(bold(magenta("✨===========================================✨")));
  console.log(bold(green("✅ DenoGenesis Universal Database Connected")));
  console.log(cyan("✨ Database:"), yellow(dbConfig.db));
  console.log(cyan("✨ Host:"), yellow(dbConfig.hostname));
  console.log(bold(magenta("✨===========================================✨")));
} catch (err) {
  console.error(bold(red("❌ Database connection error:")), red(err.message));
  Deno.exit(1);
}