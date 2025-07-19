import { Application, send } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import router from "./routes/index.ts";
import wsRouter from "./routes/wsRoutes.ts";
import { createMiddlewareStack, type MiddlewareConfig } from "./middleware/index.ts";
import { ConsoleStyler, type DenoGenesisConfig } from "./utils/consoleStyler.ts";
import { ErrorHandler } from "./middleware/errorHandler.ts";

// Load environment variables
const env = await loadEnv();
const app = new Application();
const port = parseInt(env.PORT || "3000");
const environment = env.DENO_ENV || "development";

// === DENOGENESIS FRAMEWORK CONFIG ===
const denoGenesisConfig: DenoGenesisConfig = {
  version: "v2.0.0",
  buildDate: "July 19, 2025",
  environment,
  port,
  author: "Pedro M. Dominguez",
  repository: "https://github.com/xtcedro",
  description: "Enterprise Digital Sovereignty Platform"
};

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
      "https://domingueztechsolutions.com",
      "https://www.domingueztechsolutions.com",
      "https://pedromdominguez.com",
      "https://www.pedromdominguez.com"
    ],
    developmentOrigins: [
      "http://localhost:3000",
      "http://localhost:8080",
      "http://127.0.0.1:3000"
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

// === PRINT STARTUP BANNER ===
ConsoleStyler.clear();
ConsoleStyler.printBanner(denoGenesisConfig);
ConsoleStyler.logEnvironment(environment);

// === CREATE MIDDLEWARE STACK ===
const { monitor, middlewares } = createMiddlewareStack(middlewareConfig);

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
app.use(async (ctx, next) => {
  const filePath = ctx.request.url.pathname;
  const fileWhitelist = [".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".ttf", ".woff2", ".html"];

  // Only handle static files, let everything else pass through
  if (fileWhitelist.some(ext => filePath.endsWith(ext))) {
    try {
      await send(ctx, filePath, {
        root: `${Deno.cwd()}/public`,
        index: "index.html",
      });
      return; // Important: return here to prevent further middleware execution
    } catch {
      // If file not found, continue to next middleware
      await next();
    }
  } else {
    // Not a static file, continue to routes
    await next();
  }
});

ConsoleStyler.logRoute("Static File Handler", "Serving public assets");

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
    ctx.response.body = {
      error: "Not Found",
      message: "The requested resource was not found",
      status: 404,
      timestamp: new Date().toISOString()
    };
    ctx.response.headers.set("Content-Type", "application/json");
  }
});

// === STARTUP COMPLETION ===
ConsoleStyler.logStartup(denoGenesisConfig);

// Log initial metrics after a short delay
setTimeout(() => {
  ConsoleStyler.logMetrics(monitor.getMetrics());
}, 1000);

// === START SERVER ===
ConsoleStyler.logSuccess(`DenoGenesis server is now running on http://localhost:${port}`);
ConsoleStyler.logInfo(`Health check available at: http://localhost:${port}/health`);

if (environment === "development") {
  ConsoleStyler.logWarning("Development mode - Enhanced debugging enabled");
} else {
  ConsoleStyler.logInfo("Production mode - Optimized for performance and security");
}

try {
  await app.listen({ port });
} catch (error) {
  ConsoleStyler.logError(`Failed to start server: ${error.message}`);
  Deno.exit(1);
}