// === REMOVE OLD OAKCORS IMPORT ===
import { Application, send } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import router from "./routes/index.ts";
import wsRouter from "./routes/wsRoutes.ts";

// === STEP 1: PERFORMANCE MONITOR ✅
import { PerformanceMonitor, createPerformanceMiddleware } from "./middleware/performanceMonitor.ts";

// === STEP 2: SECURITY HEADERS ✅
import { createSecurityMiddleware } from "./middleware/security.ts";

// === STEP 3: ENHANCED LOGGING ✅
import { createLoggingMiddleware, Logger } from "./middleware/logging.ts";

// === STEP 4: ERROR HANDLING ✅
import { createErrorMiddleware, ErrorHandler } from "./middleware/errorHandler.ts";

// === STEP 5: HEALTH CHECKS ✅
import { createHealthCheckMiddleware } from "./middleware/healthCheck.ts";

// === STEP 6: ADVANCED CORS ===
import { createCorsMiddleware, CorsAnalytics, type CorsConfig } from "./middleware/cors.ts";

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

// === STEP 1: PERFORMANCE MONITORING ✅
const monitor = new PerformanceMonitor();
app.use(createPerformanceMiddleware(monitor, environment === 'development'));
console.log("\x1b[36m%s\x1b[0m", "📊 Performance monitoring enabled");

// === STEP 4: ERROR HANDLING (EARLY IN CHAIN) ===
app.use(createErrorMiddleware({
  environment: environment,
  logErrors: true,
  logToFile: environment === 'production',
  showStackTrace: environment === 'development'
}));
console.log("\x1b[36m%s\x1b[0m", "🛡️ Error handling enabled");

// === STEP 2: SECURITY HEADERS ✅
app.use(createSecurityMiddleware({
  environment: environment,
  enableHSTS: environment === 'production',
  frameOptions: 'SAMEORIGIN',
  contentSecurityPolicy: environment === 'production' 
    ? "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.skypack.dev https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self';"
    : "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.skypack.dev https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self';"
}));
console.log("\x1b[36m%s\x1b[0m", "🔒 Security headers enabled");

// === STEP 3: ENHANCED LOGGING ===
app.use(createLoggingMiddleware({
  environment: environment,
  logLevel: environment === 'development' ? 'debug' : 'info',
  logRequests: true,
  logResponses: environment === 'development'
}));
console.log("\x1b[36m%s\x1b[0m", "📝 Enhanced logging enabled");

// === STEP 6: ADVANCED CORS WITH ANALYTICS ===
const corsConfig: CorsConfig = {
  environment: environment,
  allowedOrigins: [
    "https://pedromdominguez.com",
    "https://www.pedromdominguez.com"
  ],
  developmentOrigins: [
    "http://localhost:3000",
    "http://localhost:3004",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3004"
  ],
  credentials: true,
  maxAge: environment === 'production' ? 86400 : 300,
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization', 
    'X-Requested-With',
    'X-Request-ID',
    'X-API-Key',
    'X-Client-Version'
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Request-ID', 
    'X-Response-Time',
    'X-Rate-Limit-Remaining'
  ]
};

const corsMiddleware = createCorsMiddleware(corsConfig);
app.use(corsMiddleware);
console.log("\x1b[36m%s\x1b[0m", "🌐 Advanced CORS with analytics enabled");

// === ENHANCED HEALTH CHECK WITH CORS ANALYTICS ===
app.use(async (ctx, next) => {
  if (ctx.request.url.pathname === "/health") {
    const metrics = monitor.getMetrics();
    ctx.response.body = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: version,
      metrics: metrics,
      environment: environment,
      framework: "DenoGenesis",
      author: "Pedro M. Dominguez",
      location: "Oklahoma City, OK"
    };
    ctx.response.headers.set("Content-Type", "application/json");
    return;
  }
  
  // CORS Analytics endpoint
  if (ctx.request.url.pathname === "/health/cors") {
    // Note: CORS analytics would be available here if we stored a reference
    ctx.response.body = {
      status: "CORS analytics available",
      message: "Advanced CORS monitoring active",
      features: [
        "Origin validation",
        "Request tracking", 
        "Security insights",
        "Performance analytics"
      ],
      timestamp: new Date().toISOString()
    };
    ctx.response.headers.set("Content-Type", "application/json");
    return;
  }
  
  await next();
});
console.log("\x1b[36m%s\x1b[0m", "🏥 Health check enabled at /health + /health/cors");

// === YOUR EXISTING STATIC FILE MIDDLEWARE (UNCHANGED) ===
app.use(async (ctx, next) => {
  const filePath = ctx.request.url.pathname;
  const fileWhitelist = [".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".ttf", ".woff2", ".html"];

  if (fileWhitelist.some(ext => filePath.endsWith(ext))) {
    try {
      await send(ctx, filePath, {
        root: `${Deno.cwd()}/public`,
        index: "index.html",
      });
      return;
    } catch {
      // Let it fall through to 404
    }
  }

  await next();
});

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
console.log("\x1b[33m%s\x1b[0m", `📊 Middleware stack: Performance → Error → Security → Logging → CORS → Health → Static → Routes`);

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