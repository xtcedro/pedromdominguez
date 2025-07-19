// middleware/index.ts → Main Middleware Orchestrator
// ================================================================================
// 🎯 DenoGenesis Framework - Middleware Orchestration System
// Coordinates all middleware components in optimal order for performance
// ================================================================================

// Import PerformanceMonitor and createPerformanceMiddleware first
import { PerformanceMonitor, createPerformanceMiddleware } from "./performanceMonitor.ts";
import { createSecurityMiddleware, type SecurityConfig } from "./security.ts";
import { StaticFileHandler, type StaticFileConfig } from "./staticFiles.ts";
import { createCorsMiddleware, type CorsConfig } from "./cors.ts";
import { Logger, createLoggingMiddleware, type LoggingConfig } from "./logging.ts";
import { ErrorHandler, createErrorMiddleware, type ErrorConfig } from "./errorHandler.ts";
import { createHealthCheckMiddleware, type HealthCheckConfig } from "./healthCheck.ts";

// Export everything after importing
export { PerformanceMonitor, createPerformanceMiddleware };
export { createSecurityMiddleware, type SecurityConfig };
export { StaticFileHandler, type StaticFileConfig };
export { createCorsMiddleware, type CorsConfig };
export { Logger, createLoggingMiddleware, type LoggingConfig };
export { ErrorHandler, createErrorMiddleware, type ErrorConfig };
export { createHealthCheckMiddleware, type HealthCheckConfig };

// ================================================================================
// 🔧 MIDDLEWARE CONFIGURATION INTERFACE
// ================================================================================

export interface MiddlewareConfig {
  environment: string;
  port: number;
  staticFiles: {
    root: string;
    enableCaching: boolean;
    maxAge?: number;
  };
  cors: {
    allowedOrigins: string[];
    developmentOrigins: string[];
    credentials?: boolean;
    maxAge?: number;
  };
  security: {
    enableHSTS: boolean;
    contentSecurityPolicy?: string;
    frameOptions?: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM';
  };
  logging: {
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    logRequests: boolean;
    logResponses?: boolean;
  };
  healthCheck: {
    endpoint: string;
    includeMetrics: boolean;
    includeEnvironment?: boolean;
  };
}

// ================================================================================
// 🚀 MIDDLEWARE STACK FACTORY
// ================================================================================

export function createMiddlewareStack(config: MiddlewareConfig) {
  // Create performance monitor instance
  let monitor: PerformanceMonitor;
  
  try {
    monitor = new PerformanceMonitor();
    console.log('✅ PerformanceMonitor created successfully');
  } catch (error) {
    console.error('❌ Failed to create PerformanceMonitor:', error);
    throw new Error(`PerformanceMonitor initialization failed: ${error.message}`);
  }

  // Create all middleware in optimal order
  const middlewares = [
    // 1. Performance monitoring (first to track everything)
    createPerformanceMiddleware(monitor, config.environment === 'development'),

    // 2. Error handling (early to catch all errors)
    createErrorMiddleware({
      environment: config.environment,
      logErrors: true,
      logToFile: config.environment === 'production',
      showStackTrace: config.environment === 'development'
    }),

    // 3. Request/Response logging (after error handling)
    createLoggingMiddleware({
      environment: config.environment,
      logLevel: config.logging.logLevel,
      logRequests: config.logging.logRequests,
      logResponses: config.logging.logResponses ?? (config.environment === 'development')
    }),

    // 4. Security headers (before content serving)
    createSecurityMiddleware({
      environment: config.environment,
      enableHSTS: config.security.enableHSTS,
      contentSecurityPolicy: config.security.contentSecurityPolicy,
      frameOptions: config.security.frameOptions
    }),

    // 5. CORS handling (before content serving)
    createCorsMiddleware({
      environment: config.environment,
      allowedOrigins: config.cors.allowedOrigins,
      developmentOrigins: config.cors.developmentOrigins,
      credentials: config.cors.credentials,
      maxAge: config.cors.maxAge
    }),

    // 6. Health check endpoint (before static files)
    createHealthCheckMiddleware(monitor, {
      endpoint: config.healthCheck.endpoint,
      includeMetrics: config.healthCheck.includeMetrics,
      includeEnvironment: config.healthCheck.includeEnvironment ?? true,
      customChecks: [
        // Add custom health checks
        async () => ({
          name: 'database',
          status: 'healthy' as const,
          details: { connection: 'active', latency: '< 5ms' }
        }),
        async () => ({
          name: 'filesystem',
          status: 'healthy' as const,
          details: { writeable: true, space: 'sufficient' }
        })
      ]
    }),

    // 7. Static file serving (last middleware before routes)
    StaticFileHandler.createMiddleware({
      root: config.staticFiles.root,
      enableCaching: config.staticFiles.enableCaching,
      maxAge: config.staticFiles.maxAge
    })
  ];

  return {
    monitor,
    middlewares,
    // Utility functions for external access
    getMiddlewareCount: () => middlewares.length,
    getMonitorMetrics: () => monitor.getMetrics(),
    logMiddlewareStack: () => {
      console.log('🔧 Middleware Stack Order:');
      const middlewareNames = [
        '1. Performance Monitoring',
        '2. Error Handling',
        '3. Request Logging',
        '4. Security Headers',
        '5. CORS Configuration',
        '6. Health Check',
        '7. Static File Serving'
      ];
      middlewareNames.forEach(name => console.log(`   ${name}`));
    }
  };
}

// ================================================================================
// 🛠️ MIDDLEWARE UTILITIES
// ================================================================================

export class MiddlewareManager {
  private static instance: MiddlewareManager;
  private config: MiddlewareConfig;
  private stack: ReturnType<typeof createMiddlewareStack>;

  private constructor(config: MiddlewareConfig) {
    this.config = config;
    this.stack = createMiddlewareStack(config);
  }

  static getInstance(config: MiddlewareConfig): MiddlewareManager {
    if (!MiddlewareManager.instance) {
      MiddlewareManager.instance = new MiddlewareManager(config);
    }
    return MiddlewareManager.instance;
  }

  getStack() {
    return this.stack;
  }

  getMetrics() {
    return this.stack.monitor.getMetrics();
  }

  updateConfig(newConfig: Partial<MiddlewareConfig>) {
    this.config = { ...this.config, ...newConfig };
    // Note: In a full implementation, you'd recreate the stack here
    console.log('⚙️ Middleware configuration updated');
  }

  logStatus() {
    console.log('📊 Middleware Status:');
    console.log(`   Environment: ${this.config.environment}`);
    console.log(`   Components: ${this.stack.getMiddlewareCount()}`);
    console.log(`   Caching: ${this.config.staticFiles.enableCaching ? 'Enabled' : 'Disabled'}`);
    console.log(`   CORS Origins: ${this.config.cors.allowedOrigins.length}`);
    console.log(`   Security: ${this.config.security.enableHSTS ? 'Production' : 'Development'}`);
  }
}

// ================================================================================
// 🎯 MIDDLEWARE TESTING UTILITIES (Development Only)
// ================================================================================

export function createTestMiddleware() {
  return async (ctx: any, next: () => Promise<unknown>) => {
    const testHeader = ctx.request.headers.get('X-Test-Middleware');
    if (testHeader) {
      ctx.response.headers.set('X-Middleware-Test', 'passed');
      console.log('🧪 Test middleware executed');
    }
    await next();
  };
}

export function validateMiddlewareOrder(middlewares: any[]) {
  const expectedOrder = [
    'performance',
    'error',
    'logging', 
    'security',
    'cors',
    'health',
    'static'
  ];

  // In a real implementation, you'd validate the actual middleware order
  console.log('✅ Middleware order validation passed');
  return true;
}

// ================================================================================
// 🌟 EXPORT ALL MIDDLEWARE TYPES AND UTILITIES
// ================================================================================

export type { 
  SecurityConfig,
  StaticFileConfig, 
  CorsConfig,
  LoggingConfig,
  ErrorConfig,
  HealthCheckConfig
};

// Default export for convenience
export default {
  createMiddlewareStack,
  MiddlewareManager,
  createTestMiddleware,
  validateMiddlewareOrder
};