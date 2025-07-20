import { Application, send } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import router from "./routes/index.ts";
import wsRouter from "./routes/wsRoutes.ts";

// === STEP 7: FULL MIDDLEWARE ORCHESTRATOR ===
import { createMiddlewareStack, MiddlewareManager, type MiddlewareConfig } from "./middleware/index.ts";

const env = await loadEnv();
const app = new Application();
const port = parseInt(env.PORT || "3000");
const environment = env.DENO_ENV || "development";

// === DENOGENESIS FRAMEWORK BOOTUP LOGS ===
const version = "v1.3.0";
const buildDate = "May 19, 2025";

console.log("\x1b[35m%s\x1b[0m", "✨========================================================✨");
console.log("\x1b[36m%s\x1b[0m", "         Welcome to the DenoGenesis Framework Engine");
console.log("\x1b[33m%s\x1b[0m", `         ⚙️  Version: ${version}`);
console.log("\x1b[33m%s\x1b[0m", `         📅 Build Date: ${buildDate}`);
console.log("\x1b[33m%s\x1b[0m", "         🚀 Developed by Pedro M. Dominguez");
console.log("\x1b[35m%s\x1b[0m", "✨========================================================✨");

console.log("\x1b[32m%s\x1b[0m", "💡 This isn't just code — it's a revolution in motion.");
console.log("\x1b[36m%s\x1b[0m", "🔓 Powered by Deno. Structured by Oak. Hardened on Debian.");
console.log("\x1b[34m%s\x1b[0m", "🔗 GitHub: https://github.com/xtcedro");
console.log("\x1b[32m%s\x1b[0m", "🌍 Pedro M. Dominguez is democratizing technology in Oklahoma City");
console.log("\x1b[32m%s\x1b[0m", "   — one system, one local business, one breakthrough at a time.");
console.log("\x1b[33m%s\x1b[0m", "⚡  Bringing AI, automation, and full-stack innovation to the people.");
console.log("\x1b[32m%s\x1b[0m", "🛠️  This is DenoGenesis — born from purpose, built with precision.");
console.log("\x1b[36m%s\x1b[0m", "✨ Let's rebuild the web — together.\n");

// === STEP 7: COMPLETE MIDDLEWARE ORCHESTRATION ===
const middlewareConfig: MiddlewareConfig = {
  environment,
  port,
  staticFiles: {
    root: `${Deno.cwd()}/public`,
    enableCaching: environment === 'production',
    maxAge: environment === 'production' ? 86400 : 300
  },
  cors: {
    allowedOrigins: [
      "https://pedromdominguez.com",
      "https://www.pedromdominguez.com"
    ],
    developmentOrigins: [
      "http://localhost:3000",
      "http://localhost:3004", 
      "http://127.0.0.1:3000",
      "https://cdn.skypack.dev",
      "https://cdnjs.cloudflare.com",
      "https://cdn.jsdelivr.net",
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com"
    ],
    credentials: true,
    maxAge: environment === 'production' ? 86400 : 300
  },
  security: {
    enableHSTS: environment === 'production',
    contentSecurityPolicy: environment === 'production' 
      ? "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.skypack.dev https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self';"
      : "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.skypack.dev https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self';",
    frameOptions: 'SAMEORIGIN'
  },
  logging: {
    logLevel: environment === 'development' ? 'debug' : 'info',
    logRequests: true,
    logResponses: environment === 'development'
  },
  healthCheck: {
    endpoint: '/health',
    includeMetrics: true,
    includeEnvironment: true
  }
};

// Create the complete middleware stack
const { monitor, middlewares } = createMiddlewareStack(middlewareConfig);

// Apply all middleware in optimal order
console.log("\x1b[35m%s\x1b[0m", "🔧 Initializing Complete Middleware Stack...");
middlewares.forEach((middleware, index) => {
  app.use(middleware);
});

const middlewareNames = [
  "Performance Monitor",
  "Error Handler",
  "Request Logger", 
  "Security Headers",
  "CORS Handler",
  "Health Check",
  "Static File Server"
];

middlewareNames.forEach((name, index) => {
  console.log("\x1b[36m%s\x1b[0m", `✅ ${index + 1}. ${name}`);
});

console.log("\x1b[32m%s\x1b[0m", "🚀 Complete middleware orchestration enabled!");

// === YOUR EXISTING WEBSOCKET ROUTES (UNCHANGED) ===
app.use(wsRouter.routes());
app.use(wsRouter.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️ WebSocket route loaded at /api/ws");

// === YOUR EXISTING API ROUTES (UNCHANGED) ===
app.use(router.routes());
app.use(router.allowedMethods());

// === YOUR EXISTING 404 FALLBACK (UNCHANGED) ===
app.use(async (ctx) => {
  ctx.response.status = 404;
  await send(ctx, "/pages/errors/404.html", {
    root: `${Deno.cwd()}/public`,
  });
});

// === STARTUP COMPLETION & METRICS ===
console.log("\x1b[32m%s\x1b[0m", `⚙️  DenoGenesis server is now running on http://localhost:${port}`);
console.log("\x1b[36m%s\x1b[0m", `🏥 Health check available at: http://localhost:${port}/health`);
console.log("\x1b[33m%s\x1b[0m", `📊 Complete middleware orchestration active`);

// Create middleware manager instance
const middlewareManager = MiddlewareManager.getInstance(middlewareConfig);
middlewareManager.logStatus();

if (environment === "development") {
  console.log("\x1b[33m%s\x1b[0m", "🔧 Development mode - Enhanced debugging enabled");
} else {
  console.log("\x1b[32m%s\x1b[0m", "🚀 Production mode - Optimized for performance and security");
}

// Show initial metrics after 2 seconds
setTimeout(() => {
  const metrics = monitor.getMetrics();
  console.log("\x1b[33m%s\x1b[0m", `📊 Initial metrics: ${metrics.requests} requests, ${metrics.uptime} uptime, ${metrics.successRate} success rate`);
  console.log("\x1b[36m%s\x1b[0m", "✨ DenoGenesis Framework - Local-First Digital Sovereignty Platform - Ready! 🚀");
}, 2000);

await app.listen({ port });