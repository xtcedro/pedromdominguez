// main.ts
// ================================================================================
// 🚀 DenoGenesis Framework - Enhanced Main Application
// Professional server initialization with styled console output
// ================================================================================

import { Application, send } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import router from "./routes/index.ts";
import wsRouter from "./routes/wsRoutes.ts";

// Enhanced Console Styling
import { ConsoleStyler, type DenoGenesisConfig } from "./utils/consoleStyler.ts";

// Middleware Management
import { createMiddlewareStack, MiddlewareManager, type MiddlewareConfig } from "./middleware/index.ts";

// ================================================================================
// 🔧 ENVIRONMENT & CONFIGURATION SETUP
// ================================================================================

const env = await loadEnv();
const app = new Application();
const port = parseInt(env.PORT || "3000");
const environment = env.DENO_ENV || "development";

// DenoGenesis Framework Configuration
const frameworkConfig: DenoGenesisConfig = {
  version: "v1.4.0-enterprise",
  buildDate: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }),
  environment,
  port,
  author: "Pedro M. Dominguez",
  repository: "https://github.com/xtcedro/deno-genesis",
  description: "Local-First Digital Sovereignty Platform"
};

// ================================================================================
// 🎨 PROFESSIONAL STARTUP SEQUENCE
// ================================================================================

// Clear console for clean startup
ConsoleStyler.clear();

// Display professional banner
ConsoleStyler.printBanner(frameworkConfig);

// Log environment-specific information
ConsoleStyler.logEnvironment(environment);

// Display startup information
ConsoleStyler.logStartup(frameworkConfig);

// ================================================================================
// 🔧 MIDDLEWARE CONFIGURATION
// ================================================================================

ConsoleStyler.logSection('🔧 Middleware Configuration', 'blue');

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
      "https://www.pedromdominguez.com",
      "https://domingueztechsolutions.com",
      "https://okdevs.xyz"
    ],
    developmentOrigins: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
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

// ================================================================================
// 🚀 MIDDLEWARE STACK INITIALIZATION
// ================================================================================

ConsoleStyler.logInfo("Initializing enterprise middleware stack...");

// Create the middleware stack
const { monitor, middlewares } = createMiddlewareStack(middlewareConfig);

// Apply middleware with professional logging
const middlewareComponents = [
  { name: "Performance Monitor", description: "Request timing and metrics collection" },
  { name: "Error Handler", description: "Global error handling and recovery" },
  { name: "Request Logger", description: "HTTP request/response logging" },
  { name: "Security Headers", description: "OWASP security header injection" },
  { name: "CORS Handler", description: "Cross-origin resource sharing" },
  { name: "Health Check", description: "System health monitoring endpoint" }
];

middlewares.forEach((middleware, index) => {
  app.use(middleware);
  const component = middlewareComponents[index];
  if (component) {
    ConsoleStyler.logSuccess(`${component.name} initialized`);
    ConsoleStyler.logDebug(`   → ${component.description}`);
  }
});

ConsoleStyler.logSuccess("Middleware orchestration completed successfully!");

// ================================================================================
// 📁 ENHANCED STATIC FILE HANDLER
// ================================================================================

ConsoleStyler.logSection('📁 Static File Configuration', 'cyan');

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

const supportedExtensions = Object.keys(mimeTypes);

app.use(async (ctx, next) => {
  const filePath = ctx.request.url.pathname;
  const extension = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();

  if (supportedExtensions.includes(extension)) {
    try {
      // Set proper MIME type
      ctx.response.headers.set('Content-Type', mimeTypes[extension as keyof typeof mimeTypes]);

      // Add caching headers for production
      if (environment === 'production' && ['.css', '.js', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico', '.ttf', '.woff', '.woff2'].includes(extension)) {
        ctx.response.headers.set('Cache-Control', 'public, max-age=86400'); // 24 hours
        ctx.response.headers.set('ETag', `"${Date.now()}"`);
      }

      await send(ctx, filePath, {
        root: `${Deno.cwd()}/public`,
        index: "index.html",
      });
      return;
    } catch (error) {
      // File not found, let it fall through to next middleware
      ConsoleStyler.logDebug(`Static file not found: ${filePath}`);
    }
  }

  await next();
});

ConsoleStyler.logSuccess("Enhanced static file handler configured");
ConsoleStyler.logInfo(`Supporting ${supportedExtensions.length} file types with proper MIME handling`);

// ================================================================================
// 🌐 WEBSOCKET ROUTE CONFIGURATION
// ================================================================================

ConsoleStyler.logSection('🌐 WebSocket Configuration', 'magenta');

app.use(wsRouter.routes());
app.use(wsRouter.allowedMethods());

ConsoleStyler.logRoute('/api/ws', 'WebSocket connection endpoint');
ConsoleStyler.logSuccess("WebSocket routes configured successfully");

// ================================================================================
// 🛣️ API ROUTE CONFIGURATION
// ================================================================================

ConsoleStyler.logSection('🛣️ API Route Configuration', 'yellow');

app.use(router.routes());
app.use(router.allowedMethods());

// Log registered routes (you can expand this based on your actual routes)
const apiRoutes = [
  { path: '/api/health', description: 'System health check' },
  { path: '/api/dashboard', description: 'Dashboard data endpoint' },
  { path: '/api/appointments', description: 'Appointment management' },
  { path: '/api/payments', description: 'Payment processing' },
  { path: '/api/analytics', description: 'Analytics data' },
  { path: '/api/blogs', description: 'Blog content management' },
  { path: '/api/projects', description: 'Project portfolio' },
  { path: '/api/notifications', description: 'Notification system' },
  { path: '/api/contact', description: 'Contact form handling' }
];

apiRoutes.forEach(route => {
  ConsoleStyler.logRoute(route.path, route.description);
});

ConsoleStyler.logSuccess("API routes configured successfully");

// ================================================================================
// 🚨 ERROR HANDLING & 404 FALLBACK
// ================================================================================

app.use(async (ctx) => {
  ConsoleStyler.logWarning(`404 Not Found: ${ctx.request.url.pathname}`);
  ctx.response.status = 404;

  try {
    await send(ctx, "/pages/errors/404.html", {
      root: `${Deno.cwd()}/public`,
    });
  } catch {
    // Fallback JSON response if 404.html doesn't exist
    ctx.response.type = 'application/json';
    ctx.response.body = {
      error: 'Not Found',
      message: 'The requested resource was not found',
      path: ctx.request.url.pathname,
      timestamp: new Date().toISOString()
    };
  }
});

// ================================================================================
// 🚀 SERVER STARTUP & MONITORING
// ================================================================================

ConsoleStyler.logSection('🚀 Server Startup', 'green');

// Create middleware manager instance
const middlewareManager = MiddlewareManager.getInstance(middlewareConfig);

// Server startup information
const serverInfo = [
  { label: 'Server URL', value: `http://localhost:${port}` },
  { label: 'Environment', value: environment },
  { label: 'Process ID', value: Deno.pid.toString() },
  { label: 'Version', value: frameworkConfig.version },
  { label: 'Build Date', value: frameworkConfig.buildDate }
];

serverInfo.forEach(info => {
  ConsoleStyler.logInfo(`${info.label}: ${info.value}`);
});

// Health check information
ConsoleStyler.logRoute('/health', 'System health monitoring endpoint');
ConsoleStyler.logRoute('/metrics', 'Performance metrics endpoint (if enabled)');

// Development vs Production specific messages
if (environment === "development") {
  ConsoleStyler.logCustom("Development mode active - Enhanced debugging enabled", "🔧", "warning");
  ConsoleStyler.logInfo("Hot reload and detailed logging available");
} else {
  ConsoleStyler.logCustom("Production mode active - Optimized for performance", "🚀", "success");
  ConsoleStyler.logInfo("Security headers and caching enabled");
}

// Final success message
ConsoleStyler.logSuccess("DenoGenesis Framework initialization complete!");

// Display middleware status
middlewareManager.logStatus();

// ================================================================================
// 📊 INITIAL METRICS & MONITORING
// ================================================================================

// Show initial metrics after server stabilization
setTimeout(() => {
  ConsoleStyler.logSection('📊 System Status', 'cyan');

  const metrics = monitor.getMetrics();

  ConsoleStyler.logMetrics({
    uptime: `${metrics.uptime}`,
    requests: metrics.requests,
    errors: metrics.errors || 0,
    successRate: `${metrics.successRate}%`,
    memory: Deno.memoryUsage ? {
      heapUsed: `${Math.round(Deno.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(Deno.memoryUsage().heapTotal / 1024 / 1024)}MB`
    } : undefined
  });

  // Final ready message with ASCII art
  console.log('\n');
  ConsoleStyler.asciiArt('DENOGENESIS');
  console.log('\n');

  ConsoleStyler.logCustom(
    "Local-First Digital Sovereignty Platform - Ready! 🚀",
    "✨",
    "success"
  );

  // Cambridge validation note
  ConsoleStyler.logCustom(
    "Framework validated for academic research collaboration",
    "🎓",
    "info"
  );

}, 2000);

// ================================================================================
// 🎯 ERROR HANDLING & GRACEFUL SHUTDOWN
// ================================================================================

// Handle graceful shutdown
const handleShutdown = (signal: string) => {
  ConsoleStyler.logWarning(`Received ${signal}, shutting down gracefully...`);

  // Log final metrics
  const finalMetrics = monitor.getMetrics();
  ConsoleStyler.logInfo(`Final metrics: ${finalMetrics.requests} requests processed`);

  ConsoleStyler.logSuccess("DenoGenesis Framework shutdown complete");
  Deno.exit(0);
};

// Register signal handlers
Deno.addSignalListener("SIGINT", () => handleShutdown("SIGINT"));
Deno.addSignalListener("SIGTERM", () => handleShutdown("SIGTERM"));

// Handle uncaught errors
globalThis.addEventListener("error", (event) => {
  ConsoleStyler.logError(`Uncaught error: ${event.error?.message || event.error}`);
  if (event.error?.stack) {
    ConsoleStyler.logDebug(`Stack trace: ${event.error.stack}`);
  }
});

globalThis.addEventListener("unhandledrejection", (event) => {
  ConsoleStyler.logError(`Unhandled promise rejection: ${event.reason}`);
  event.preventDefault();
});

// ================================================================================
// 🌟 SERVER LISTENER
// ================================================================================

try {
  await app.listen({ port });
} catch (error) {
  ConsoleStyler.logError(`Failed to start server: ${error.message}`);
  ConsoleStyler.logError("Check if port is already in use or permissions are correct");
  Deno.exit(1);
}
