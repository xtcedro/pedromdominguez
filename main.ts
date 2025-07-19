import { Application, send } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import router from "./routes/index.ts";
import wsRouter from "./routes/wsRoutes.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

// === STEP 1: ADD ONLY PERFORMANCE MONITOR ===
import { PerformanceMonitor, createPerformanceMiddleware } from "./middleware/performanceMonitor.ts";

const env = await loadEnv();
const app = new Application();
const port = parseInt(env.PORT || "3000");
const environment = env.DENO_ENV || "development";

// === DENOGENESIS FRAMEWORK BOOTUP LOGS ===
const version = "v1.3.0";
const buildDate = "May 19, 2025";

<<<<<<< HEAD
// === MIDDLEWARE CONFIGURATION ===
const middlewareConfig: MiddlewareConfig = {
  environment,
  port,
  staticFiles: {
    root: `${Deno.cwd()}/public`,
    enableCaching: environment === "production"
  },
  cors: {
    allowedOrigins: [
      "https://pedromdominguez.com",
      "https://www.pedromdominguez.com"
    ],
    developmentOrigins: [
      "http://localhost:3004",
      "http://localhost:8080",
      "http://127.0.0.1:3004"
    ]
  },
  security: {
    enableHSTS: environment === "production",
    contentSecurityPolicy: environment === "production"
      ? "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
      : undefined
  },
  logging: {
    logLevel: environment === "development" ? "debug" : "info",
    logRequests: true
  },
  healthCheck: {
    endpoint: "/health",
    includeMetrics: true
  }
};
=======
console.log("\x1b[35m%s\x1b[0m", "✨========================================================✨");
console.log("\x1b[36m%s\x1b[0m", "         Welcome to the DenoGenesis Framework Engine");
console.log("\x1b[33m%s\x1b[0m", `         ⚙️  Version: ${version}`);
console.log("\x1b[33m%s\x1b[0m", `         📅 Build Date: ${buildDate}`);
console.log("\x1b[33m%s\x1b[0m", "         🚀 Developed by Pedro M. Dominguez");
console.log("\x1b[35m%s\x1b[0m", "✨========================================================✨");
>>>>>>> refs/remotes/origin/main

console.log("\x1b[32m%s\x1b[0m", "💡 This isn't just code — it's a revolution in motion.");
console.log("\x1b[36m%s\x1b[0m", "🔓 Powered by Deno. Structured by Oak. Hardened on Debian.");
console.log("\x1b[34m%s\x1b[0m", "🔗 GitHub: https://github.com/xtcedro");
console.log("\x1b[32m%s\x1b[0m", "🌍 Pedro M. Dominguez is democratizing technology in Oklahoma City");
console.log("\x1b[32m%s\x1b[0m", "   — one system, one local business, one breakthrough at a time.");
console.log("\x1b[33m%s\x1b[0m", "⚡  Bringing AI, automation, and full-stack innovation to the people.");
console.log("\x1b[32m%s\x1b[0m", "🛠️  This is DenoGenesis — born from purpose, built with precision.");
console.log("\x1b[36m%s\x1b[0m", "✨ Let's rebuild the web — together.\n");

// === NEW: ADD PERFORMANCE MONITORING ===
const monitor = new PerformanceMonitor();
app.use(createPerformanceMiddleware(monitor, environment === 'development'));
console.log("\x1b[36m%s\x1b[0m", "📊 Performance monitoring enabled");

<<<<<<< HEAD
// === GLOBAL ERROR HANDLERS ===
globalThis.addEventListener('error', (event) => {
  ErrorHandler.handleUncaughtError(event.error, environment);
});

globalThis.addEventListener('unhandledrejection', (event) => {
  ErrorHandler.handleUnhandledRejection(event.reason);
});

// === APPLY MIDDLEWARE STACK (EXCLUDING STATIC FILES) ===
ConsoleStyler.logSection("🔧 Initializing Middleware Stack");

// Apply only the first 6 middleware (excluding static files)
const coreMiddlewares = middlewares.slice(0, 6);
const middlewareNames = [
  "Performance Monitor",
  "Error Handler",
  "Request Logger",
  "Security Headers",
  "CORS Handler",
  "Health Check"
];

coreMiddlewares.forEach((middleware, index) => {
  app.use(middleware);
  ConsoleStyler.logRoute(`Middleware ${index + 1}`, middlewareNames[index]);
});

ConsoleStyler.logSuccess("Core middleware initialized successfully");

// === CUSTOM STATIC FILE MIDDLEWARE (SIMPLIFIED) ===
=======
// === YOUR EXISTING STATIC FILE MIDDLEWARE (UNCHANGED) ===
>>>>>>> refs/remotes/origin/main
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

// === YOUR EXISTING CORS (UNCHANGED) ===
app.use(oakCors({
  origin: "https://pedromdominguez.com",
  credentials: true,
}));

<<<<<<< HEAD
// === WEBSOCKET ROUTES ===
ConsoleStyler.logSection("🌐 Registering WebSocket Routes");
app.use(wsRouter.routes());
app.use(wsRouter.allowedMethods());
ConsoleStyler.logRoute("/api/ws", "WebSocket connection handler");

// === API ROUTES ===
ConsoleStyler.logSection("🔗 Registering API Routes");
app.use(router.routes());
app.use(router.allowedMethods());
ConsoleStyler.logSuccess("All API routes registered successfully");

// === 404 FALLBACK ===
app.use(async (ctx) => {
  // Check if response has already been sent
  if (ctx.response.body !== undefined || ctx.response.status !== 404) {
    return;
  }

  ctx.response.status = 404;

  try {
    await send(ctx, "/pages/errors/404.html", {
      root: `${Deno.cwd()}/public`,
    });
  } catch {
    // Fallback if 404.html doesn't exist
=======
// === NEW: ADD HEALTH CHECK ENDPOINT ===
app.use(async (ctx, next) => {
  if (ctx.request.url.pathname === "/health") {
    const metrics = monitor.getMetrics();
>>>>>>> refs/remotes/origin/main
    ctx.response.body = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: version,
      metrics: metrics,
      environment: environment
    };
    ctx.response.headers.set("Content-Type", "application/json");
    return;
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

// === START SERVER ===
console.log("\x1b[32m%s\x1b[0m", `⚙️  DenoGenesis server is now running on http://localhost:${port}`);
console.log("\x1b[36m%s\x1b[0m", `🏥 Health check available at: http://localhost:${port}/health`);

// Show initial metrics after 2 seconds
setTimeout(() => {
  const metrics = monitor.getMetrics();
  console.log("\x1b[33m%s\x1b[0m", `📊 Initial metrics: ${metrics.requests} requests, ${metrics.uptime} uptime`);
}, 2000);

<<<<<<< HEAD
try {
  await app.listen({ port });
} catch (error) {
  ConsoleStyler.logError(`Failed to start server: ${error.message}`);
  Deno.exit(1);
}
=======
await app.listen({ port });
>>>>>>> refs/remotes/origin/main
