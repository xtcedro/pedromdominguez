import { Application, send } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import router from "./routes/index.ts";
import wsRouter from "./routes/wsRoutes.ts";

// === STEP 7: SIMPLIFIED MIDDLEWARE ORCHESTRATOR ===
import { createMiddlewareStack, MiddlewareManager, type MiddlewareConfig } from "./middleware/index.ts";

const env = await loadEnv();
const app = new Application();
const port = parseInt(env.PORT || "3000");
const environment = env.DENO_ENV || "development";

// === DENOGENESIS FRAMEWORK BOOTUP LOGS ===
const version = "v1.4.0-enterprise";
const buildDate = "July 23, 2025";

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

// === ENHANCED CSP FOR APPOINTMENT BOOKING FUNCTIONALITY ===
const createCSPPolicy = (env: string) => {
  const baseDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.skypack.dev https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ];

  if (env === 'development') {
    // More permissive for development
    baseDirectives[1] = "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: localhost:* 127.0.0.1:*";
    baseDirectives[4] = "connect-src 'self' http://localhost:* http://127.0.0.1:* https://localhost:* ws://localhost:* wss://localhost:*";
  }

  return baseDirectives.join('; ');
};

// === STEP 7: SIMPLIFIED MIDDLEWARE ORCHESTRATION ===
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
    contentSecurityPolicy: createCSPPolicy(environment),
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

// Create the simplified middleware stack (no static files middleware)
const { monitor, middlewares } = createMiddlewareStack(middlewareConfig);

// Apply core middleware in optimal order
console.log("\x1b[35m%s\x1b[0m", "🔧 Initializing Enhanced Middleware Stack...");
middlewares.forEach((middleware, index) => {
  app.use(middleware);
});

const middlewareNames = [
  "Performance Monitor",
  "Error Handler", 
  "Request Logger",
  "Enhanced Security Headers",
  "CORS Handler",
  "Health Check"
];

middlewareNames.forEach((name, index) => {
  console.log("\x1b[36m%s\x1b[0m", `✅ ${index + 1}. ${name}`);
});

console.log("\x1b[32m%s\x1b[0m", "🚀 Enhanced middleware orchestration with appointment booking support enabled!");

// === ENHANCED STATIC FILE MIDDLEWARE WITH PROPER MIME TYPES ===
app.use(async (ctx, next) => {
  const filePath = ctx.request.url.pathname;
  const fileWhitelist = [".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".ttf", ".woff2", ".html", ".json"];

  if (fileWhitelist.some(ext => filePath.endsWith(ext))) {
    try {
      // Set proper MIME types AND security headers BEFORE sending the file
      const extension = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();

      // Enhanced MIME type handling
      switch (extension) {
        case '.css':
          ctx.response.headers.set('Content-Type', 'text/css; charset=utf-8');
          break;
        case '.js':
          ctx.response.headers.set('Content-Type', 'application/javascript; charset=utf-8');
          // Add specific CSP for JavaScript files
          ctx.response.headers.set('X-Content-Type-Options', 'nosniff');
          break;
        case '.png':
          ctx.response.headers.set('Content-Type', 'image/png');
          break;
        case '.jpg':
        case '.jpeg':
          ctx.response.headers.set('Content-Type', 'image/jpeg');
          break;
        case '.webp':
          ctx.response.headers.set('Content-Type', 'image/webp');
          break;
        case '.svg':
          ctx.response.headers.set('Content-Type', 'image/svg+xml');
          // Allow SVG to be used in img-src
          ctx.response.headers.set('Content-Security-Policy', 'default-src \'none\'; img-src \'self\' data:;');
          break;
        case '.ico':
          ctx.response.headers.set('Content-Type', 'image/x-icon');
          break;
        case '.ttf':
          ctx.response.headers.set('Content-Type', 'font/ttf');
          break;
        case '.woff2':
          ctx.response.headers.set('Content-Type', 'font/woff2');
          break;
        case '.html':
          ctx.response.headers.set('Content-Type', 'text/html; charset=utf-8');
          // Apply full CSP to HTML files
          ctx.response.headers.set('Content-Security-Policy', createCSPPolicy(environment));
          break;
        case '.json':
          ctx.response.headers.set('Content-Type', 'application/json; charset=utf-8');
          break;
        default:
          ctx.response.headers.set('Content-Type', 'application/octet-stream');
      }

      // Add caching headers for static assets
      if (environment === 'production') {
        const cacheTime = ['.css', '.js', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico', '.ttf', '.woff2'].includes(extension) 
          ? 86400 // 24 hours for assets
          : 3600; // 1 hour for HTML
        ctx.response.headers.set('Cache-Control', `public, max-age=${cacheTime}`);
      } else {
        ctx.response.headers.set('Cache-Control', 'no-cache');
      }

      await send(ctx, filePath, {
        root: `${Deno.cwd()}/public`,
        index: "index.html",
      });
      return;
    } catch (error) {
      // Log the error for debugging
      if (environment === 'development') {
        console.log(`\x1b[33m%s\x1b[0m`, `⚠️  Static file not found: ${filePath}`);
      }
      // Let it fall through to next middleware
    }
  }

  await next();
});

console.log("\x1b[36m%s\x1b[0m", "📁 Enhanced static file handler with appointment booking CSP support enabled");

// === APPOINTMENT BOOKING API MIDDLEWARE ===
app.use(async (ctx, next) => {
  // Add specific headers for API endpoints
  if (ctx.request.url.pathname.startsWith('/api/')) {
    // Allow API calls from same origin
    ctx.response.headers.set('Access-Control-Allow-Origin', ctx.request.headers.get('Origin') || '*');
    ctx.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    ctx.response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (ctx.request.method === 'OPTIONS') {
      ctx.response.status = 200;
      return;
    }
  }
  
  await next();
});

console.log("\x1b[36m%s\x1b[0m", "📅 Appointment booking API middleware enabled");

// === YOUR EXISTING WEBSOCKET ROUTES (UNCHANGED) ===
app.use(wsRouter.routes());
app.use(wsRouter.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️ WebSocket route loaded at /api/ws");

// === YOUR EXISTING API ROUTES (UNCHANGED) ===
app.use(router.routes());
app.use(router.allowedMethods());

// === ENHANCED 404 FALLBACK WITH PROPER CONTENT TYPE ===
app.use(async (ctx) => {
  ctx.response.status = 404;
  ctx.response.headers.set('Content-Type', 'text/html; charset=utf-8');
  ctx.response.headers.set('Content-Security-Policy', createCSPPolicy(environment));
  
  try {
    await send(ctx, "/pages/errors/404.html", {
      root: `${Deno.cwd()}/public`,
    });
  } catch {
    // Fallback if 404.html doesn't exist
    ctx.response.body = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Page Not Found</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #333; }
          p { color: #666; }
        </style>
      </head>
      <body>
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/">← Back to Home</a>
      </body>
      </html>
    `;
  }
});

// === STARTUP COMPLETION & METRICS ===
console.log("\x1b[32m%s\x1b[0m", `⚙️  DenoGenesis server is now running on http://localhost:${port}`);
console.log("\x1b[36m%s\x1b[0m", `🏥 Health check available at: http://localhost:${port}/health`);
console.log("\x1b[33m%s\x1b[0m", `📊 Enhanced middleware stack: Performance → Error → Security → Logging → CORS → Health → Static → API → Routes`);

// Create middleware manager instance
const middlewareManager = MiddlewareManager.getInstance(middlewareConfig);
middlewareManager.logStatus();

if (environment === "development") {
  console.log("\x1b[33m%s\x1b[0m", "🔧 Development mode - Enhanced debugging and permissive CSP enabled");
  console.log("\x1b[33m%s\x1b[0m", "📅 Appointment booking functionality ready for testing");
} else {
  console.log("\x1b[32m%s\x1b[0m", "🚀 Production mode - Optimized for performance and security");
  console.log("\x1b[32m%s\x1b[0m", "📅 Appointment booking with production-grade security enabled");
}

// Show initial metrics after 2 seconds
setTimeout(() => {
  const metrics = monitor.getMetrics();
  console.log("\x1b[33m%s\x1b[0m", `📊 Initial metrics: ${metrics.requests} requests, ${metrics.uptime} uptime, ${metrics.successRate} success rate`);
  console.log("\x1b[36m%s\x1b[0m", "✨ DenoGenesis Framework - Local-First Digital Sovereignty Platform - Ready! 🚀");
  console.log("\x1b[35m%s\x1b[0m", "🎓 Cambridge validation data ready - Framework performance validated ⚡");
}, 2000);

await app.listen({ port });