// routes/index.ts → v2.0 → Enterprise Router Registry
// ================================================================================
// 🗂️ DenoGenesis Framework - Professional Route Management System
// Advanced route registration with performance monitoring and error handling
// ================================================================================

import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { send } from "https://deno.land/x/oak@v12.6.1/send.ts";

// ================================================================================
// 📦 MODULAR ROUTE IMPORTS - ENTERPRISE ARCHITECTURE
// ================================================================================

import authRoutes from "./authRoutes.ts";
import analyticsRoutes from "./analyticsRoutes.ts";
import appointmentRoutes from "./appointmentRoutes.ts";
import blogRoutes from "./blogRoutes.ts";
import aiAssistantRoutes from "./aiAssistantRoutes.ts";
import contactRoutes from "./contactRoutes.ts";
import dashboardRoutes from "./dashboardRoutes.ts";
import settingsRoutes from "./settingsRoutes.ts";
import paymentRoutes from "./paymentRoutes.ts";
import projectsRoutes from "./projectsRoutes.ts";
import roadmapRoutes from "./roadmapRoutes.ts";
import searchRoutes from "./searchRoutes.ts";
import notificationsRoutes from "./notificationsRoutes.ts";

// ================================================================================
// 🔧 ROUTE REGISTRY CONFIGURATION
// ================================================================================

interface RouteConfig {
  path: string;
  router: Router;
  description: string;
  version: string;
  status: 'active' | 'beta' | 'deprecated';
  requiresAuth?: boolean;
  rateLimit?: number;
}

interface RegistryMetrics {
  totalRoutes: number;
  registrationTime: number;
  errors: string[];
  warnings: string[];
}

// ================================================================================
// 🎨 PROFESSIONAL CONSOLE STYLING
// ================================================================================

class RouteLogger {
  private static colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
    dim: '\x1b[2m'
  };
  
  static printHeader(): void {
    const header = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                        🔗 ROUTE REGISTRY INITIALIZATION                      ║
║                     DenoGenesis Framework - Enterprise Edition               ║
╚══════════════════════════════════════════════════════════════════════════════╝`;
    console.log(this.colors.cyan + header + this.colors.reset);
  }
  
  static logSection(title: string): void {
    const line = '─'.repeat(78);
    console.log(`${this.colors.blue}┌${line}┐${this.colors.reset}`);
    console.log(`${this.colors.blue}│ ${this.colors.bright}${title.padEnd(76)}${this.colors.reset}${this.colors.blue} │${this.colors.reset}`);
    console.log(`${this.colors.blue}└${line}┘${this.colors.reset}`);
  }
  
  static logRoute(config: RouteConfig): void {
    const statusIcon = this.getStatusIcon(config.status);
    const authIcon = config.requiresAuth ? '🔐' : '🌐';
    const versionBadge = `v${config.version}`;
    
    // Format the route line
    const pathPadded = config.path.padEnd(30);
    const versionPadded = versionBadge.padEnd(8);
    const statusPadded = `${statusIcon} ${config.status}`.padEnd(12);
    
    console.log(
      `${this.colors.green}➤ ${pathPadded}${this.colors.reset} ` +
      `${this.colors.cyan}${versionPadded}${this.colors.reset} ` +
      `${statusPadded} ${authIcon} ` +
      `${this.colors.dim}${config.description}${this.colors.reset}`
    );
  }
  
  static logError(message: string): void {
    console.log(`${this.colors.red}❌ ERROR: ${message}${this.colors.reset}`);
  }
  
  static logWarning(message: string): void {
    console.log(`${this.colors.yellow}⚠️  WARNING: ${message}${this.colors.reset}`);
  }
  
  static logSuccess(message: string): void {
    console.log(`${this.colors.green}✅ ${message}${this.colors.reset}`);
  }
  
  static logMetrics(metrics: RegistryMetrics): void {
    console.log(`\n${this.colors.cyan}📊 Registry Metrics:${this.colors.reset}`);
    console.log(`   Routes Registered: ${this.colors.bright}${metrics.totalRoutes}${this.colors.reset}`);
    console.log(`   Registration Time: ${this.colors.bright}${metrics.registrationTime}ms${this.colors.reset}`);
    console.log(`   Errors: ${this.colors.bright}${metrics.errors.length}${this.colors.reset}`);
    console.log(`   Warnings: ${this.colors.bright}${metrics.warnings.length}${this.colors.reset}`);
    
    if (metrics.errors.length > 0) {
      console.log(`\n${this.colors.red}Errors encountered:${this.colors.reset}`);
      metrics.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    if (metrics.warnings.length > 0) {
      console.log(`\n${this.colors.yellow}Warnings:${this.colors.reset}`);
      metrics.warnings.forEach(warning => console.log(`   • ${warning}`));
    }
  }
  
  private static getStatusIcon(status: string): string {
    switch (status) {
      case 'active': return '🟢';
      case 'beta': return '🔶';
      case 'deprecated': return '🔴';
      default: return '⚪';
    }
  }
}

// ================================================================================
// 🚀 ENTERPRISE ROUTE REGISTRY
// ================================================================================

class RouteRegistry {
  private router: Router;
  private routes: RouteConfig[] = [];
  private metrics: RegistryMetrics;
  
  constructor() {
    this.router = new Router();
    this.metrics = {
      totalRoutes: 0,
      registrationTime: 0,
      errors: [],
      warnings: []
    };
  }
  
  // Register homepage route with enhanced error handling
  registerHomepage(): void {
    try {
      this.router.get("/", async (ctx) => {
        try {
          // Check if response has already been handled
          if (ctx.response.body !== undefined || ctx.respond === false) {
            return;
          }

          // Set security headers first
          ctx.response.headers.set('X-Frame-Options', 'SAMEORIGIN');
          ctx.response.headers.set('X-Content-Type-Options', 'nosniff');
          ctx.response.headers.set('Content-Type', 'text/html');
          
          // Try to serve the homepage file - using the approach that works
          await send(ctx, "index.html", {
            root: `${Deno.cwd()}/public/pages/home`,
          });
          
        } catch (error) {
          console.error('Homepage serving error:', error);

          // Only set error response if not already sent
          if (ctx.response.body === undefined && ctx.respond !== false) {
            ctx.response.status = 404;
            ctx.response.headers.set('Content-Type', 'application/json');
            ctx.response.body = {
              error: 'Homepage Not Found',
              message: 'Please create /public/pages/home/index.html',
              timestamp: new Date().toISOString(),
              suggestion: 'Create the public directory structure and add your homepage file'
            };
          }
        }
      });

      this.routes.push({
        path: '/',
        router: this.router,
        description: 'DenoGenesis Framework Homepage',
        version: '2.0',
        status: 'active'
      });
    } catch (error) {
      this.metrics.errors.push(`Failed to register homepage: ${error.message}`);
    }
  }
  
  // Enhanced route registration with validation
  registerRoute(config: RouteConfig): void {
    try {
      // Validate route configuration
      this.validateRouteConfig(config);
      
      // Register the route with error handling wrapper
      this.router.use(
        config.path,
        async (ctx, next) => {
          try {
            // Add route metadata to context
            ctx.state.routeInfo = {
              path: config.path,
              version: config.version,
              requiresAuth: config.requiresAuth || false
            };
            
            // Rate limiting (if configured)
            if (config.rateLimit) {
              // Note: In production, implement proper rate limiting here
              // For now, just log the rate limit configuration
              console.log(`Rate limit: ${config.rateLimit} req/min for ${config.path}`);
            }
            
            await next();
          } catch (error) {
            console.error(`Route error in ${config.path}:`, error);
            ctx.response.status = 500;
            ctx.response.body = {
              error: 'Internal Server Error',
              path: config.path,
              timestamp: new Date().toISOString()
            };
          }
        },
        config.router.routes(),
        config.router.allowedMethods()
      );
      
      this.routes.push(config);
      this.metrics.totalRoutes++;
      
      // Log successful registration
      RouteLogger.logRoute(config);
      
    } catch (error) {
      this.metrics.errors.push(`Failed to register route ${config.path}: ${error.message}`);
      RouteLogger.logError(`Failed to register route ${config.path}: ${error.message}`);
    }
  }
  
  // Validate route configuration
  private validateRouteConfig(config: RouteConfig): void {
    if (!config.path || typeof config.path !== 'string') {
      throw new Error('Route path is required and must be a string');
    }
    
    if (!config.router) {
      throw new Error('Route router instance is required');
    }
    
    if (!config.description || typeof config.description !== 'string') {
      throw new Error('Route description is required and must be a string');
    }
    
    if (!config.version || typeof config.version !== 'string') {
      throw new Error('Route version is required and must be a string');
    }
    
    if (!['active', 'beta', 'deprecated'].includes(config.status)) {
      throw new Error('Route status must be one of: active, beta, deprecated');
    }
    
    // Check for duplicate paths
    if (this.routes.some(route => route.path === config.path)) {
      this.metrics.warnings.push(`Duplicate route path detected: ${config.path}`);
    }
    
    // Validate rate limit
    if (config.rateLimit && (typeof config.rateLimit !== 'number' || config.rateLimit <= 0)) {
      throw new Error('Rate limit must be a positive number');
    }
  }
  
  // Register all application routes
  async registerAllRoutes(): Promise<void> {
    const startTime = Date.now();
    
    RouteLogger.printHeader();
    RouteLogger.logSection('🏠 Core Routes');
    
    // Register homepage
    this.registerHomepage();
    
    RouteLogger.logSection('🔐 API Routes');
    
    // Define all route configurations
    const routeConfigs: RouteConfig[] = [
      {
        path: '/api/auth',
        router: authRoutes,
        description: 'Authentication & Authorization Services',
        version: '2.1',
        status: 'active',
        requiresAuth: false,
        rateLimit: 30
      },
      {
        path: '/api/analytics',
        router: analyticsRoutes,
        description: 'Analytics & Metrics Collection',
        version: '2.0',
        status: 'active',
        requiresAuth: true,
        rateLimit: 100
      },
      {
        path: '/api/appointments',
        router: appointmentRoutes,
        description: 'Appointment Management System',
        version: '1.8',
        status: 'active',
        requiresAuth: true,
        rateLimit: 50
      },
      {
        path: '/api/blog',
        router: blogRoutes,
        description: 'Content Management & Publishing',
        version: '2.0',
        status: 'active',
        requiresAuth: false,
        rateLimit: 60
      },
      {
        path: '/api/ai-assistant',
        router: aiAssistantRoutes,
        description: 'AI Assistant & ChatBot Services',
        version: '3.0',
        status: 'beta',
        requiresAuth: true,
        rateLimit: 20
      },
      {
        path: '/api/contact',
        router: contactRoutes,
        description: 'Contact Forms & Communication',
        version: '1.5',
        status: 'active',
        requiresAuth: false,
        rateLimit: 10
      },
      {
        path: '/api/dashboard',
        router: dashboardRoutes,
        description: 'User Dashboard & Overview',
        version: '2.2',
        status: 'active',
        requiresAuth: true,
        rateLimit: 100
      },
      {
        path: '/api/settings',
        router: settingsRoutes,
        description: 'User & System Settings',
        version: '2.0',
        status: 'active',
        requiresAuth: true,
        rateLimit: 40
      },
      {
        path: '/api/payments',
        router: paymentRoutes,
        description: 'Payment Processing & Billing',
        version: '1.9',
        status: 'active',
        requiresAuth: true,
        rateLimit: 30
      },
      {
        path: '/api/projects',
        router: projectsRoutes,
        description: 'Project Management & Collaboration',
        version: '2.1',
        status: 'active',
        requiresAuth: true,
        rateLimit: 80
      },
      {
        path: '/api/roadmap',
        router: roadmapRoutes,
        description: 'Product Roadmap & Planning',
        version: '1.0',
        status: 'beta',
        requiresAuth: true,
        rateLimit: 25
      },
      {
        path: '/api/search',
        router: searchRoutes,
        description: 'Global Search & Indexing',
        version: '2.0',
        status: 'active',
        requiresAuth: false,
        rateLimit: 120
      },
      {
        path: '/api/notifications',
        router: notificationsRoutes,
        description: 'Real-time Notifications & Alerts',
        version: '1.7',
        status: 'active',
        requiresAuth: true,
        rateLimit: 200
      }
    ];
    
    // Register all routes
    for (const config of routeConfigs) {
      this.registerRoute(config);
    }
    
    // Calculate registration time
    this.metrics.registrationTime = Date.now() - startTime;
    
    // Display final metrics
    RouteLogger.logSection('📈 Registration Complete');
    RouteLogger.logMetrics(this.metrics);
    
    if (this.metrics.errors.length === 0) {
      RouteLogger.logSuccess(`All ${this.metrics.totalRoutes} routes registered successfully!`);
    } else {
      RouteLogger.logWarning(`${this.metrics.totalRoutes} routes registered with ${this.metrics.errors.length} errors`);
    }
  }
  
  // Get the configured router instance
  getRouter(): Router {
    return this.router;
  }
  
  // Get route registry metrics
  getMetrics(): RegistryMetrics {
    return { ...this.metrics };
  }
  
  // Get all registered routes
  getRoutes(): RouteConfig[] {
    return [...this.routes];
  }
}

// ================================================================================
// 🎯 MAIN ROUTER INITIALIZATION & EXPORT
// ================================================================================

// Create and configure the enterprise router registry
const registry = new RouteRegistry();

// Initialize all routes
await registry.registerAllRoutes();

// Export the configured router for use in main application
export default registry.getRouter();

// Export additional utilities for monitoring and debugging
export { RouteRegistry, RouteLogger };
export type { RouteConfig, RegistryMetrics };