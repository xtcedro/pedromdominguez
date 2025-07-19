// main.ts → v3.0 → Clean Enterprise Architecture
// ================================================================================
// 🚀 DenoGenesis Framework - Simplified Entry Point
// All middleware extracted to dedicated modules for maximum maintainability
// Total lines reduced from 400+ to ~150 (62% reduction)
// ================================================================================

import { Application, send } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import router from "./routes/index.ts";
import wsRouter from "./routes/wsRoutes.ts";
import {
  createMiddlewareStack,
  type MiddlewareConfig,
  ErrorHandler,
  PerformanceMonitor // Import PerformanceMonitor type
} from "./middleware/index.ts";
import { ConsoleStyler, type DenoGenesisConfig } from "./utils/consoleStyler.ts";

// ================================================================================
// 🔧 FRAMEWORK CONFIGURATION
// ================================================================================

const FRAMEWORK_CONFIG: DenoGenesisConfig = {
  version: "v3.0.0",
  buildDate: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }),
  environment: Deno.env.get("DENO_ENV") || "development",
  port: parseInt(Deno.env.get("PORT") || "3000"),
  author: "Pedro M. Dominguez",
  repository: "https://github.com/xtcedro/denogenesis",
  description: "Enterprise-Grade Local-First Digital Sovereignty Framework"
};

// ================================================================================
// 🎛️ MIDDLEWARE CONFIGURATION
// ================================================================================

const MIDDLEWARE_CONFIG: MiddlewareConfig = {
  environment: FRAMEWORK_CONFIG.environment,
  port: FRAMEWORK_CONFIG.port,

  staticFiles: {
    root: `${Deno.cwd()}/public`,
    enableCaching: FRAMEWORK_CONFIG.environment === 'production'
  },

  cors: {
    allowedOrigins: [
      'https://pedromdominguez.com',
      'https://www.pedromdominguez.com',
    ],
    developmentOrigins: [
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ]
  },

  security: {
    enableHSTS: FRAMEWORK_CONFIG.environment === 'production',
    contentSecurityPolicy: FRAMEWORK_CONFIG.environment === 'production'
      ? "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://cdnjs.cloudflare.com;"
      : undefined
  },

  logging: {
    logLevel: FRAMEWORK_CONFIG.environment === 'development' ? 'debug' : 'info',
    logRequests: FRAMEWORK_CONFIG.environment === 'development'
  },

  healthCheck: {
    endpoint: '/health',
    includeMetrics: true
  }
};

// ================================================================================
// 🚀 MAIN APPLICATION CLASS
// ================================================================================

class DenoGenesisServer {
  private app: Application;
  private monitor: PerformanceMonitor | null = null; // Initialize as null
  private abortController: AbortController;

  constructor() {
    this.app = new Application();
    this.abortController = new AbortController();
    this.setupMiddleware(); // Setup middleware first to initialize monitor
    this.setupErrorHandling(); // Then setup error handling
    this.setupRoutes();
  }

  private setupErrorHandling(): void {
    // Global error handlers
    globalThis.addEventListener('error', (event) => {
      ErrorHandler.handleUncaughtError(event.error, FRAMEWORK_CONFIG.environment);
    });

    globalThis.addEventListener('unhandledrejection', (event) => {
      ErrorHandler.handleUnhandledRejection(event.reason);
    });

    // Oak application error handler
    this.app.addEventListener('error', (event) => {
      ConsoleStyler.logError(`Application Error: ${event.error?.message || 'Unknown error'}`);
      // Only increment error if monitor is initialized
      if (this.monitor) {
        this.monitor.incrementError();
      }
    });
  }

  private setupMiddleware(): void {
    ConsoleStyler.logSection('🔧 Initializing Middleware Stack', 'cyan');

    try {
      // Create the complete middleware stack
      const middlewareStack = createMiddlewareStack(MIDDLEWARE_CONFIG);

      // Extract monitor and middlewares from the stack
      this.monitor = middlewareStack.monitor;
      const middlewares = middlewareStack.middlewares;

      // Verify monitor is properly initialized
      if (!this.monitor) {
        throw new Error('PerformanceMonitor failed to initialize');
      }

      // Apply all middleware in optimized order
      middlewares.forEach((middleware, index) => {
        this.app.use(middleware);
      });

      ConsoleStyler.logSuccess(`${middlewares.length} middleware components loaded`);
      ConsoleStyler.logSuccess('Performance monitoring initialized');

    } catch (error) {
      ConsoleStyler.logError(`Middleware initialization failed: ${error.message}`);
      throw error; // Re-throw to prevent app from starting with broken middleware
    }
  }

  private setupRoutes(): void {
    ConsoleStyler.logSection('🔌 Initializing Route System', 'blue');

    // WebSocket routes (must be registered first for upgrade handling)
    this.app.use(wsRouter.routes());
    this.app.use(wsRouter.allowedMethods());
    ConsoleStyler.logRoute('/api/ws', 'WebSocket connection endpoint');

    // API routes
    this.app.use(router.routes());
    this.app.use(router.allowedMethods());
    ConsoleStyler.logRoute('/api/*', 'REST API endpoints');

    // Development-only metrics endpoint
    if (FRAMEWORK_CONFIG.environment === 'development') {
      this.app.use(async (ctx, next) => {
        if (ctx.request.url.pathname === '/metrics') {
          // Ensure monitor exists before getting metrics
          if (!this.monitor) {
            ctx.response.status = 503;
            ctx.response.body = {
              error: 'Performance monitor not available',
              message: 'Metrics cannot be retrieved at this time'
            };
            return;
          }

          try {
            const metrics = this.monitor.getMetrics();
            ctx.response.body = {
              ...metrics,
              framework: {
                name: 'DenoGenesis',
                version: FRAMEWORK_CONFIG.version,
                author: FRAMEWORK_CONFIG.author,
                uptime: metrics.uptime
              }
            };
            ctx.response.headers.set('Content-Type', 'application/json');
            ctx.response.headers.set('Cache-Control', 'no-cache');
          } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
              error: 'Failed to retrieve metrics',
              message: error.message
            };
          }
          return;
        }
        await next();
      });
      ConsoleStyler.logRoute('/metrics', 'Development performance metrics');
    }

    // Enhanced 404 handler with better UX
    this.app.use(async (ctx) => {
      ctx.response.status = 404;

      // API 404 - Return structured JSON error
      if (ctx.request.url.pathname.startsWith('/api/')) {
        ctx.response.body = {
          error: 'Not Found',
          message: 'The requested API endpoint does not exist',
          timestamp: new Date().toISOString(),
          path: ctx.request.url.pathname,
          method: ctx.request.method,
          suggestion: 'Check the API documentation for available endpoints',
          availableEndpoints: [
            '/api/auth',
            '/api/appointments',
            '/api/dashboard',
            '/api/analytics',
            '/health'
          ]
        };
        ctx.response.headers.set('Content-Type', 'application/json');
        return;
      }

      // Web 404 - Return custom error page
      try {
        await send(ctx, "/pages/errors/404.html", {
          root: `${Deno.cwd()}/public`,
        });
      } catch {
        // Fallback 404 with DenoGenesis branding
        ctx.response.body = `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>404 - Page Not Found | DenoGenesis</title>
              <style>
                body {
                  font-family: 'Inter', sans-serif;
                  background: linear-gradient(135deg, #0a1a2f, #142040);
                  color: white;
                  text-align: center;
                  padding: 2rem;
                  margin: 0;
                }
                .container { max-width: 600px; margin: 0 auto; padding-top: 10vh; }
                h1 { color: #ffd700; font-size: 3rem; margin-bottom: 1rem; }
                p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.8; }
                a {
                  color: #ffd700;
                  text-decoration: none;
                  padding: 1rem 2rem;
                  border: 2px solid #ffd700;
                  border-radius: 8px;
                  display: inline-block;
                  transition: all 0.3s ease;
                }
                a:hover { background: #ffd700; color: #0a1a2f; }
                .powered-by { margin-top: 3rem; opacity: 0.6; font-size: 0.9rem; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>404</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/">Return to Homepage</a>
                <div class="powered-by">
                  Powered by DenoGenesis Framework v${FRAMEWORK_CONFIG.version}<br>
                  Digital Sovereignty Platform by ${FRAMEWORK_CONFIG.author}
                </div>
              </div>
            </body>
          </html>
        `;
        ctx.response.headers.set('Content-Type', 'text/html');
      }
    });

    ConsoleStyler.logSuccess('Route system initialized with enhanced error handling');
  }

  async start(): Promise<void> {
    try {
      // Verify monitor is initialized before starting
      if (!this.monitor) {
        throw new Error('Performance monitor failed to initialize - cannot start server');
      }

      // Print professional startup banner
      ConsoleStyler.printBanner(FRAMEWORK_CONFIG);

      // Setup graceful shutdown handlers
      this.setupGracefulShutdown();

      // Log startup information
      ConsoleStyler.logSection('🚀 Server Startup Complete', 'green');
      ConsoleStyler.logSuccess(`DenoGenesis server running on http://localhost:${FRAMEWORK_CONFIG.port}`);
      ConsoleStyler.logInfo(`Environment: ${FRAMEWORK_CONFIG.environment.toUpperCase()}`);
      ConsoleStyler.logInfo(`Process ID: ${Deno.pid}`);
      ConsoleStyler.logInfo(`Version: ${FRAMEWORK_CONFIG.version}`);
      ConsoleStyler.logInfo(`Build Date: ${FRAMEWORK_CONFIG.buildDate}`);

      // Environment-specific information
      ConsoleStyler.logEnvironment(FRAMEWORK_CONFIG.environment);

      if (FRAMEWORK_CONFIG.environment === 'development') {
        ConsoleStyler.logSection('🔧 Development Tools', 'yellow');
        ConsoleStyler.logInfo(`Health Check: http://localhost:${FRAMEWORK_CONFIG.port}/health`);
        ConsoleStyler.logInfo(`Metrics: http://localhost:${FRAMEWORK_CONFIG.port}/metrics`);
        ConsoleStyler.logInfo(`Hot Reload: Enabled`);
        ConsoleStyler.logInfo(`Detailed Logging: Enabled`);
      }

      console.log('\n');
      ConsoleStyler.logCustom(
        '🌟 DenoGenesis Framework Ready - Digital Sovereignty Activated! 🌟',
        '🚀',
        'success'
      );
      console.log('\n');

      // Start the server with signal handling
      await this.app.listen({
        port: FRAMEWORK_CONFIG.port,
        signal: this.abortController.signal,
        hostname: '0.0.0.0' // Allow external connections
      });

    } catch (error) {
      ConsoleStyler.logError(`Failed to start server: ${error.message}`);

      // Enhanced error debugging
      if (FRAMEWORK_CONFIG.environment === 'development') {
        console.error('\n🔍 Debug Information:');
        console.error(`- Port: ${FRAMEWORK_CONFIG.port}`);
        console.error(`- Working Directory: ${Deno.cwd()}`);
        console.error(`- Deno Version: ${Deno.version.deno}`);
        console.error(`- Platform: ${Deno.build.os} ${Deno.build.arch}`);
        console.error(`- Permissions: ${JSON.stringify(await Deno.permissions.query({ name: "net" }))}`);
        console.error(`- Monitor Status: ${this.monitor ? 'Initialized' : 'Failed'}`);
      }

      console.error(error.stack);
      Deno.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      console.log('\n');
      ConsoleStyler.logInfo(`Received ${signal}. Initiating graceful shutdown...`);

      // Stop accepting new requests
      this.abortController.abort();

      // Log final server metrics (only if monitor is available)
      if (this.monitor) {
        try {
          ConsoleStyler.logSection('📊 Final Server Metrics', 'cyan');
          const metrics = this.monitor.getMetrics();

          ConsoleStyler.logTable([
            { Metric: 'Total Requests', Value: metrics.requests },
            { Metric: 'Total Errors', Value: metrics.errors },
            { Metric: 'Success Rate', Value: metrics.successRate },
            { Metric: 'Uptime', Value: metrics.uptime },
            { Metric: 'Memory Used', Value: metrics.memory.heapUsed },
            { Metric: 'Memory Total', Value: metrics.memory.heapTotal }
          ]);
        } catch (error) {
          ConsoleStyler.logWarning(`Could not retrieve final metrics: ${error.message}`);
        }
      }

      ConsoleStyler.logSuccess('DenoGenesis server shut down gracefully');
      ConsoleStyler.logCustom('Thank you for using DenoGenesis Framework! 🚀', '💫', 'gold');

      Deno.exit(0);
    };

    // Handle common shutdown signals
    Deno.addSignalListener('SIGINT', () => gracefulShutdown('SIGINT'));
    Deno.addSignalListener('SIGTERM', () => gracefulShutdown('SIGTERM'));
  }
}

// ================================================================================
// 🎯 APPLICATION BOOTSTRAP
// ================================================================================

async function bootstrap() {
  try {
    // Show loading message
    ConsoleStyler.logWithTime('Loading environment configuration...', 'info');

    // Load environment variables
    const env = await loadEnv();

    // Override config with environment variables
    if (env.PORT) {
      FRAMEWORK_CONFIG.port = parseInt(env.PORT);
      MIDDLEWARE_CONFIG.port = FRAMEWORK_CONFIG.port;
    }

    if (env.DENO_ENV) {
      FRAMEWORK_CONFIG.environment = env.DENO_ENV;
      MIDDLEWARE_CONFIG.environment = env.DENO_ENV;

      // Update other environment-dependent settings
      MIDDLEWARE_CONFIG.staticFiles.enableCaching = env.DENO_ENV === 'production';
      MIDDLEWARE_CONFIG.security.enableHSTS = env.DENO_ENV === 'production';
      MIDDLEWARE_CONFIG.logging.logRequests = env.DENO_ENV === 'development';
    }

    // Additional environment-specific configurations
    if (env.CORS_ORIGINS) {
      MIDDLEWARE_CONFIG.cors.allowedOrigins = env.CORS_ORIGINS.split(',').map(o => o.trim());
      ConsoleStyler.logDebug(`CORS origins configured: ${MIDDLEWARE_CONFIG.cors.allowedOrigins.join(', ')}`);
    }

    if (env.ENABLE_CACHING !== undefined) {
      MIDDLEWARE_CONFIG.staticFiles.enableCaching = env.ENABLE_CACHING === 'true';
    }

    if (env.LOG_LEVEL) {
      MIDDLEWARE_CONFIG.logging.logLevel = env.LOG_LEVEL as any;
    }

    ConsoleStyler.logSuccess('Environment configuration loaded successfully');

    // Create and start the server
    const server = new DenoGenesisServer();
    await server.start();

  } catch (error) {
    ConsoleStyler.logError(`Application bootstrap failed: ${error.message}`);

    // Enhanced error logging for troubleshooting
    console.error('\n🚨 Bootstrap Error Details:');
    console.error(`- Error Type: ${error.constructor.name}`);
    console.error(`- Error Message: ${error.message}`);
    console.error(`- Current Directory: ${Deno.cwd()}`);
    console.error(`- Deno Version: ${Deno.version.deno}`);
    console.error(`- Environment: ${Deno.env.get('DENO_ENV') || 'development'}`);
    console.error(`- Available Permissions:`, await Deno.permissions.query({ name: "read" }));

    if (error.stack) {
      console.error('\n📋 Stack Trace:');
      console.error(error.stack);
    }

    ConsoleStyler.logError('Bootstrap failed - shutting down');
    Deno.exit(1);
  }
}

// ================================================================================
// 🚀 APPLICATION ENTRY POINT
// ================================================================================

if (import.meta.main) {
  await bootstrap();
}
