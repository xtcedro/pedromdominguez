// middleware/staticFiles.ts → Advanced Static File System
// ================================================================================
// 🌐 DenoGenesis Framework - Enterprise Static File Middleware
// Optimized caching, compression, security, and performance for static assets
// ================================================================================

import { send } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// ================================================================================
// 🔧 STATIC FILE CONFIGURATION
// ================================================================================

export interface StaticFileConfig {
  root: string;
  enableCaching: boolean;
  maxAge?: number;
  compressionLevel?: number;
  enableGzip?: boolean;
  enableBrotli?: boolean;
  enableEtag?: boolean;
  indexFiles?: string[];
  fallbackFile?: string;
  serveHidden?: boolean;
  maxFileSize?: number; // in bytes
}

// ================================================================================
// 🎯 STATIC FILE HANDLER CLASS
// ================================================================================

export class StaticFileHandler {
  // Supported file extensions with security validation
  private static readonly ALLOWED_EXTENSIONS = new Set([
    // Web assets
    '.html', '.htm', '.css', '.js', '.mjs', '.json', '.xml', '.txt', '.md',
    
    // Images
    '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.bmp', '.tiff',
    
    // Fonts
    '.ttf', '.otf', '.woff', '.woff2', '.eot',
    
    // Documents
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    
    // Media
    '.mp3', '.mp4', '.wav', '.ogg', '.webm', '.avi', '.mov',
    
    // Archives (be careful with these)
    '.zip', '.tar', '.gz',
    
    // Development
    '.map', '.ts' // Source maps and TypeScript files for development
  ]);
  
  // MIME type mapping for proper Content-Type headers
  private static readonly MIME_TYPES = new Map([
    // Text files
    ['.html', 'text/html; charset=utf-8'],
    ['.htm', 'text/html; charset=utf-8'],
    ['.css', 'text/css; charset=utf-8'],
    ['.js', 'application/javascript; charset=utf-8'],
    ['.mjs', 'application/javascript; charset=utf-8'],
    ['.json', 'application/json; charset=utf-8'],
    ['.xml', 'application/xml; charset=utf-8'],
    ['.txt', 'text/plain; charset=utf-8'],
    ['.md', 'text/markdown; charset=utf-8'],
    
    // Images
    ['.png', 'image/png'],
    ['.jpg', 'image/jpeg'],
    ['.jpeg', 'image/jpeg'],
    ['.gif', 'image/gif'],
    ['.webp', 'image/webp'],
    ['.svg', 'image/svg+xml'],
    ['.ico', 'image/x-icon'],
    ['.bmp', 'image/bmp'],
    ['.tiff', 'image/tiff'],
    
    // Fonts
    ['.ttf', 'font/ttf'],
    ['.otf', 'font/otf'],
    ['.woff', 'font/woff'],
    ['.woff2', 'font/woff2'],
    ['.eot', 'application/vnd.ms-fontobject'],
    
    // Documents
    ['.pdf', 'application/pdf'],
    ['.doc', 'application/msword'],
    ['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ['.xls', 'application/vnd.ms-excel'],
    ['.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    ['.ppt', 'application/vnd.ms-powerpoint'],
    ['.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    
    // Media
    ['.mp3', 'audio/mpeg'],
    ['.mp4', 'video/mp4'],
    ['.wav', 'audio/wav'],
    ['.ogg', 'audio/ogg'],
    ['.webm', 'video/webm'],
    ['.avi', 'video/x-msvideo'],
    ['.mov', 'video/quicktime'],
    
    // Archives
    ['.zip', 'application/zip'],
    ['.tar', 'application/x-tar'],
    ['.gz', 'application/gzip'],
    
    // Development
    ['.map', 'application/json'],
    ['.ts', 'application/typescript']
  ]);
  
  // Cache configuration by file type
  private static readonly CACHE_HEADERS = new Map([
    // Long-term caching for immutable assets
    ['.css', { maxAge: 31536000, public: true, immutable: true }], // 1 year
    ['.js', { maxAge: 31536000, public: true, immutable: true }],
    ['.mjs', { maxAge: 31536000, public: true, immutable: true }],
    
    // Medium-term caching for images
    ['.png', { maxAge: 2592000, public: true }], // 30 days
    ['.jpg', { maxAge: 2592000, public: true }],
    ['.jpeg', { maxAge: 2592000, public: true }],
    ['.gif', { maxAge: 2592000, public: true }],
    ['.webp', { maxAge: 2592000, public: true }],
    ['.svg', { maxAge: 2592000, public: true }],
    
    // Long-term caching for fonts
    ['.ttf', { maxAge: 31536000, public: true, immutable: true }], // 1 year
    ['.otf', { maxAge: 31536000, public: true, immutable: true }],
    ['.woff', { maxAge: 31536000, public: true, immutable: true }],
    ['.woff2', { maxAge: 31536000, public: true, immutable: true }],
    ['.eot', { maxAge: 31536000, public: true, immutable: true }],
    
    // Short-term caching for HTML (to allow updates)
    ['.html', { maxAge: 3600, public: true }], // 1 hour
    ['.htm', { maxAge: 3600, public: true }],
    
    // Medium-term for other assets
    ['.ico', { maxAge: 604800, public: true }], // 1 week
    ['.json', { maxAge: 3600, public: true }], // 1 hour
    ['.xml', { maxAge: 3600, public: true }],
    ['.txt', { maxAge: 3600, public: true }],
    ['.md', { maxAge: 3600, public: true }],
    
    // No caching for source maps in production
    ['.map', { maxAge: 0, public: false }]
  ]);
  
  // Files that support compression
  private static readonly COMPRESSIBLE_TYPES = new Set([
    '.html', '.htm', '.css', '.js', '.mjs', '.json', '.xml', '.txt', '.md', '.svg'
  ]);
  
  /**
   * Create static file middleware with advanced features
   */
  static createMiddleware(config: StaticFileConfig) {
    return async (ctx: any, next: () => Promise<unknown>) => {
      const filePath = ctx.request.url.pathname;
      const extension = this.getFileExtension(filePath);
      
      // ================================================================================
      // 🛡️ SECURITY VALIDATION
      // ================================================================================
      
      // Check if file extension is allowed
      if (!this.ALLOWED_EXTENSIONS.has(extension)) {
        await next();
        return;
      }
      
      // Prevent access to hidden files unless explicitly allowed
      if (!config.serveHidden && this.isHiddenFile(filePath)) {
        await next();
        return;
      }
      
      // Prevent directory traversal attacks
      if (this.hasDirectoryTraversal(filePath)) {
        console.warn(`🚨 Directory traversal attempt blocked: ${filePath}`);
        ctx.response.status = 403;
        ctx.response.body = 'Forbidden';
        return;
      }
      
      try {
        // ================================================================================
        // 📁 FILE SERVING LOGIC
        // ================================================================================
        
        const stats = await this.getFileStats(config.root, filePath);
        
        // Check file size limits
        if (config.maxFileSize && stats && stats.size > config.maxFileSize) {
          console.warn(`📏 File too large: ${filePath} (${stats.size} bytes)`);
          ctx.response.status = 413;
          ctx.response.body = 'File too large';
          return;
        }
        
        // ================================================================================
        // 🎯 MIME TYPE AND HEADERS
        // ================================================================================
        
        // Set appropriate MIME type
        const mimeType = this.MIME_TYPES.get(extension) || 'application/octet-stream';
        ctx.response.headers.set('Content-Type', mimeType);
        
        // ================================================================================
        // 💾 CACHING STRATEGY
        // ================================================================================
        
        if (config.enableCaching) {
          const cacheConfig = this.CACHE_HEADERS.get(extension) || { 
            maxAge: config.maxAge || 3600, 
            public: true 
          };
          
          // Build Cache-Control header
          const cacheControlParts = [];
          if (cacheConfig.public) cacheControlParts.push('public');
          if (cacheConfig.maxAge) cacheControlParts.push(`max-age=${cacheConfig.maxAge}`);
          if (cacheConfig.immutable) cacheControlParts.push('immutable');
          
          ctx.response.headers.set('Cache-Control', cacheControlParts.join(', '));
          
          // Add ETag for better caching
          if (config.enableEtag !== false && stats) {
            const etag = await this.generateETag(stats, filePath);
            ctx.response.headers.set('ETag', etag);
            
            // Check If-None-Match header for 304 responses
            const ifNoneMatch = ctx.request.headers.get('If-None-Match');
            if (ifNoneMatch === etag) {
              ctx.response.status = 304;
              return;
            }
          }
          
          // Add Last-Modified header
          if (stats && stats.mtime) {
            const lastModified = stats.mtime.toUTCString();
            ctx.response.headers.set('Last-Modified', lastModified);
            
            // Check If-Modified-Since header
            const ifModifiedSince = ctx.request.headers.get('If-Modified-Since');
            if (ifModifiedSince && new Date(ifModifiedSince) >= stats.mtime) {
              ctx.response.status = 304;
              return;
            }
          }
        } else {
          // Disable caching
          ctx.response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
          ctx.response.headers.set('Pragma', 'no-cache');
          ctx.response.headers.set('Expires', '0');
        }
        
        // ================================================================================
        // 🗜️ COMPRESSION SUPPORT
        // ================================================================================
        
        if (this.shouldCompress(extension, config)) {
          const acceptEncoding = ctx.request.headers.get('Accept-Encoding') || '';
          
          if (config.enableBrotli && acceptEncoding.includes('br')) {
            ctx.response.headers.set('Content-Encoding', 'br');
            ctx.response.headers.set('Vary', 'Accept-Encoding');
          } else if (config.enableGzip !== false && acceptEncoding.includes('gzip')) {
            ctx.response.headers.set('Content-Encoding', 'gzip');
            ctx.response.headers.set('Vary', 'Accept-Encoding');
          }
        }
        
        // ================================================================================
        // 🔒 SECURITY HEADERS FOR STATIC FILES
        // ================================================================================
        
        // Prevent MIME type sniffing
        ctx.response.headers.set('X-Content-Type-Options', 'nosniff');
        
        // Add security headers for specific file types
        if (extension === '.html' || extension === '.htm') {
          ctx.response.headers.set('X-Frame-Options', 'SAMEORIGIN');
          ctx.response.headers.set('X-XSS-Protection', '1; mode=block');
        }
        
        // Prevent execution of uploaded files
        if (['.pdf', '.doc', '.docx', '.xls', '.xlsx'].includes(extension)) {
          ctx.response.headers.set('X-Download-Options', 'noopen');
          ctx.response.headers.set('Content-Disposition', 'attachment');
        }
        
        // ================================================================================
        // 📤 FILE DELIVERY
        // ================================================================================
        
        await send(ctx, filePath, {
          root: config.root,
          index: config.indexFiles || ["index.html"],
          hidden: config.serveHidden || false
        });
        
        // Log successful file serving (in development)
        if (ctx.state?.environment === 'development') {
          console.log(`📁 Served static file: ${filePath} (${mimeType})`);
        }
        
        return; // Successfully served static file
        
      } catch (error) {
        // ================================================================================
        // 🔄 FALLBACK HANDLING
        // ================================================================================
        
        // If file not found and fallback is configured (SPA support)
        if (error.name === 'NotFound' && config.fallbackFile) {
          try {
            await send(ctx, config.fallbackFile, {
              root: config.root
            });
            
            // Set appropriate headers for SPA fallback
            ctx.response.headers.set('Content-Type', 'text/html; charset=utf-8');
            ctx.response.headers.set('Cache-Control', 'no-cache');
            
            return;
          } catch (fallbackError) {
            console.error(`❌ Fallback file serving failed: ${fallbackError.message}`);
          }
        }
        
        // File not found or other error, continue to next middleware
        await next();
      }
    };
  }
  
  // ================================================================================
  // 🛠️ UTILITY METHODS
  // ================================================================================
  
  private static getFileExtension(path: string): string {
    const lastDot = path.lastIndexOf('.');
    return lastDot === -1 ? '' : path.substring(lastDot).toLowerCase();
  }
  
  private static isHiddenFile(path: string): boolean {
    return path.split('/').some(part => part.startsWith('.') && part !== '.');
  }
  
  private static hasDirectoryTraversal(path: string): boolean {
    const normalizedPath = path.replace(/\\/g, '/');
    return normalizedPath.includes('../') || 
           normalizedPath.includes('..\\') ||
           normalizedPath.includes('%2e%2e') ||
           normalizedPath.includes('%2E%2E');
  }
  
  private static async getFileStats(root: string, filePath: string): Promise<Deno.FileInfo | null> {
    try {
      const fullPath = `${root}${filePath}`;
      return await Deno.stat(fullPath);
    } catch {
      return null;
    }
  }
  
  private static async generateETag(stats: Deno.FileInfo, filePath: string): Promise<string> {
    const mtime = stats.mtime?.getTime() || Date.now();
    const size = stats.size;
    const hash = await this.simpleHash(`${filePath}-${mtime}-${size}`);
    return `"${hash}"`;
  }
  
  private static async simpleHash(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
  }
  
  private static shouldCompress(extension: string, config: StaticFileConfig): boolean {
    return (config.enableGzip !== false || config.enableBrotli) && 
           this.COMPRESSIBLE_TYPES.has(extension);
  }
}

// ================================================================================
// 📊 STATIC FILE ANALYTICS
// ================================================================================

export class StaticFileAnalytics {
  private static requestCounts: Map<string, number> = new Map();
  private static bandwidthUsed: Map<string, number> = new Map();
  private static lastAccess: Map<string, number> = new Map();
  
  static trackRequest(path: string, size: number = 0): void {
    // Track request count
    const currentCount = this.requestCounts.get(path) || 0;
    this.requestCounts.set(path, currentCount + 1);
    
    // Track bandwidth
    const currentBandwidth = this.bandwidthUsed.get(path) || 0;
    this.bandwidthUsed.set(path, currentBandwidth + size);
    
    // Track last access time
    this.lastAccess.set(path, Date.now());
  }
  
  static getPopularFiles(limit: number = 10) {
    return Array.from(this.requestCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([path, count]) => ({
        path,
        requests: count,
        bandwidth: this.formatBytes(this.bandwidthUsed.get(path) || 0),
        lastAccess: new Date(this.lastAccess.get(path) || 0).toISOString()
      }));
  }
  
  static getTotalStats() {
    const totalRequests = Array.from(this.requestCounts.values()).reduce((a, b) => a + b, 0);
    const totalBandwidth = Array.from(this.bandwidthUsed.values()).reduce((a, b) => a + b, 0);
    
    return {
      totalRequests,
      totalBandwidth: this.formatBytes(totalBandwidth),
      uniqueFiles: this.requestCounts.size,
      averageRequestsPerFile: totalRequests / this.requestCounts.size || 0
    };
  }
  
  private static formatBytes(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
  
  static reset(): void {
    this.requestCounts.clear();
    this.bandwidthUsed.clear();
    this.lastAccess.clear();
  }
}

// ================================================================================
// 🔧 STATIC FILE UTILITIES
// ================================================================================

export class StaticFileUtils {
  /**
   * Generate a comprehensive static file report
   */
  static async generateReport(rootPath: string): Promise<any> {
    const report = {
      timestamp: new Date().toISOString(),
      rootPath,
      analytics: StaticFileAnalytics.getTotalStats(),
      popularFiles: StaticFileAnalytics.getPopularFiles(),
      systemInfo: {
        supportedExtensions: Array.from(StaticFileHandler['ALLOWED_EXTENSIONS']),
        mimeTypes: Object.fromEntries(StaticFileHandler['MIME_TYPES']),
        compressibleTypes: Array.from(StaticFileHandler['COMPRESSIBLE_TYPES'])
      }
    };
    
    return report;
  }
  
  /**
   * Validate static file configuration
   */
  static validateConfig(config: StaticFileConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check root path
    if (!config.root) {
      errors.push('Root path is required');
    }
    
    // Check max file size
    if (config.maxFileSize && config.maxFileSize < 0) {
      errors.push('Max file size must be positive');
    }
    
    // Check index files
    if (config.indexFiles && config.indexFiles.length === 0) {
      errors.push('Index files array cannot be empty');
    }
    
    // Check compression settings
    if (config.compressionLevel && (config.compressionLevel < 1 || config.compressionLevel > 9)) {
      errors.push('Compression level must be between 1-9');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Get file serving statistics
   */
  static getFileStats(path: string) {
    return {
      requests: StaticFileAnalytics['requestCounts'].get(path) || 0,
      bandwidth: StaticFileAnalytics['bandwidthUsed'].get(path) || 0,
      lastAccess: StaticFileAnalytics['lastAccess'].get(path) ? 
        new Date(StaticFileAnalytics['lastAccess'].get(path)!).toISOString() : null
    };
  }
  
  /**
   * Check if a file extension is supported
   */
  static isExtensionSupported(extension: string): boolean {
    return StaticFileHandler['ALLOWED_EXTENSIONS'].has(extension.toLowerCase());
  }
  
  /**
   * Get MIME type for a file extension
   */
  static getMimeType(extension: string): string {
    return StaticFileHandler['MIME_TYPES'].get(extension.toLowerCase()) || 'application/octet-stream';
  }
  
  /**
   * Check if a file type is compressible
   */
  static isCompressible(extension: string): boolean {
    return StaticFileHandler['COMPRESSIBLE_TYPES'].has(extension.toLowerCase());
  }
}

// ================================================================================
// 🎯 STATIC FILE CONFIGURATION PRESETS
// ================================================================================

export const StaticFilePresets = {
  /**
   * Development configuration - no caching, detailed logging
   */
  DEVELOPMENT: {
    enableCaching: false,
    enableGzip: true,
    enableBrotli: false,
    enableEtag: false,
    serveHidden: true,
    indexFiles: ['index.html', 'index.htm'],
    maxFileSize: 100 * 1024 * 1024, // 100MB
    compressionLevel: 6
  } as StaticFileConfig,
  
  /**
   * Production configuration - aggressive caching, compression
   */
  PRODUCTION: {
    enableCaching: true,
    enableGzip: true,
    enableBrotli: true,
    enableEtag: true,
    serveHidden: false,
    indexFiles: ['index.html'],
    maxFileSize: 50 * 1024 * 1024, // 50MB
    compressionLevel: 9,
    maxAge: 31536000 // 1 year
  } as StaticFileConfig,
  
  /**
   * CDN configuration - maximum caching for static assets
   */
  CDN: {
    enableCaching: true,
    enableGzip: true,
    enableBrotli: true,
    enableEtag: true,
    serveHidden: false,
    indexFiles: ['index.html'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    compressionLevel: 9,
    maxAge: 94608000 // 3 years
  } as StaticFileConfig,
  
  /**
   * SPA (Single Page Application) configuration
   */
  SPA: {
    enableCaching: true,
    enableGzip: true,
    enableBrotli: true,
    enableEtag: true,
    serveHidden: false,
    indexFiles: ['index.html'],
    fallbackFile: '/index.html', // SPA fallback
    maxFileSize: 25 * 1024 * 1024, // 25MB
    compressionLevel: 7
  } as StaticFileConfig
};

// ================================================================================
// 🔍 STATIC FILE MIDDLEWARE WITH ANALYTICS
// ================================================================================

export function createAnalyticsEnabledStaticMiddleware(config: StaticFileConfig) {
  const baseMiddleware = StaticFileHandler.createMiddleware(config);
  
  return async (ctx: any, next: () => Promise<unknown>) => {
    const filePath = ctx.request.url.pathname;
    const startTime = Date.now();
    
    // Call the base static file middleware
    await baseMiddleware(ctx, next);
    
    // If a static file was served (response is set), track analytics
    if (ctx.response.body !== undefined && ctx.response.status < 400) {
      const responseTime = Date.now() - startTime;
      const contentLength = ctx.response.headers.get('Content-Length');
      const size = contentLength ? parseInt(contentLength) : 0;
      
      // Track the request
      StaticFileAnalytics.trackRequest(filePath, size);
      
      // Add analytics headers (development only)
      if (ctx.state?.environment === 'development') {
        ctx.response.headers.set('X-Static-File-Analytics', 'enabled');
        ctx.response.headers.set('X-File-Requests', 
          String(StaticFileAnalytics['requestCounts'].get(filePath) || 0));
      }
      
      // Log performance metrics for slow requests
      if (responseTime > 1000) {
        console.warn(`🐌 Slow static file serve: ${filePath} took ${responseTime}ms`);
      }
    }
  };
}

// ================================================================================
// 🚀 EXPORT ALL STATIC FILE COMPONENTS
// ================================================================================

export default {
  StaticFileHandler,
  StaticFileAnalytics,
  StaticFileUtils,
  StaticFilePresets,
  createAnalyticsEnabledStaticMiddleware
};