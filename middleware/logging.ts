// middleware/logging.ts → Professional Logging System
// ================================================================================
// 📝 DenoGenesis Framework - Advanced Logging Middleware
// Structured logging, performance tracking, and intelligent log management
// ================================================================================

// ================================================================================
// 🔧 LOGGING CONFIGURATION INTERFACE
// ================================================================================

export interface LoggingConfig {
  environment: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  logRequests: boolean;
  logResponses?: boolean;
  sensitiveHeaders?: string[];
  maxLogSize?: number;
  enableFileLogging?: boolean;
  logRotation?: boolean;
  structuredLogs?: boolean;
  includeStackTrace?: boolean;
}

// ================================================================================
// 🎨 PROFESSIONAL LOGGER CLASS
// ================================================================================

export class Logger {
  private static colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    
    // Foreground colors
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    
    // Background colors
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    
    // Custom styles
    success: '\x1b[32m\x1b[1m',
    error: '\x1b[31m\x1b[1m',
    warning: '\x1b[33m\x1b[1m',
    info: '\x1b[34m\x1b[1m',
    debug: '\x1b[90m'
  };
  
  private static logLevels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };
  
  private static currentLevel: keyof typeof Logger.logLevels = 'info';
  private static fileLoggingEnabled = false;
  private static structuredLogging = false;
  
  /**
   * Configure logger settings
   */
  static configure(config: LoggingConfig): void {
    this.currentLevel = config.logLevel;
    this.fileLoggingEnabled = config.enableFileLogging ?? false;
    this.structuredLogging = config.structuredLogs ?? false;
  }
  
  /**
   * Debug level logging
   */
  static debug(message: string, metadata?: any): void {
    this.log('debug', message, metadata, '🔍');
  }
  
  /**
   * Info level logging
   */
  static info(message: string, metadata?: any): void {
    this.log('info', message, metadata, 'ℹ️');
  }
  
  /**
   * Success logging (special case of info)
   */
  static success(message: string, metadata?: any): void {
    this.log('info', message, metadata, '✅', this.colors.success);
  }
  
  /**
   * Warning level logging
   */
  static warning(message: string, metadata?: any): void {
    this.log('warn', message, metadata, '⚠️', this.colors.warning);
  }
  
  /**
   * Error level logging
   */
  static error(message: string, metadata?: any): void {
    this.log('error', message, metadata, '❌', this.colors.error);
  }
  
  /**
   * Core logging method
   */
  private static log(
    level: keyof typeof Logger.logLevels,
    message: string,
    metadata?: any,
    icon?: string,
    color?: string
  ): void {
    // Check if we should log this level
    if (this.logLevels[level] < this.logLevels[this.currentLevel]) {
      return;
    }
    
    const timestamp = new Date().toISOString();
    const levelUpper = level.toUpperCase().padEnd(5);
    
    if (this.structuredLogging) {
      // Structured JSON logging
      const logEntry = {
        timestamp,
        level: levelUpper.trim(),
        message,
        metadata: metadata || {},
        ...(metadata && metadata.requestId && { requestId: metadata.requestId }),
        ...(metadata && metadata.userId && { userId: metadata.userId })
      };
      
      console.log(JSON.stringify(logEntry));
    } else {
      // Human-readable console logging
      const colorCode = color || this.colors[level as keyof typeof this.colors] || '';
      const resetColor = this.colors.reset;
      const iconStr = icon ? `${icon} ` : '';
      
      console.log(
        `${this.colors.dim}[${timestamp}]${resetColor} ` +
        `${colorCode}${levelUpper}${resetColor} ` +
        `${iconStr}${message}${resetColor}`
      );
      
      // Log metadata if present
      if (metadata) {
        console.log(`${this.colors.dim}   Metadata: ${JSON.stringify(metadata, null, 2)}${resetColor}`);
      }
    }
    
    // File logging if enabled
    if (this.fileLoggingEnabled) {
      this.writeToFile(level, message, metadata, timestamp);
    }
  }
  
  /**
   * Log HTTP requests with detailed information
   */
  static request(ctx: any, responseTime: number): void {
    const method = ctx.request.method;
    const url = ctx.request.url.pathname;
    const status = ctx.response.status;
    const requestId = ctx.state.requestId || 'unknown';
    const userAgent = ctx.request.headers.get('User-Agent')?.slice(0, 100) || 'unknown';
    const ip = ctx.request.ip || 'unknown';
    
    // Determine log level based on status code
    let level: 'debug' | 'info' | 'warn' | 'error' = 'info';
    let icon = '📝';
    let color = this.colors.info;
    
    if (status >= 500) {
      level = 'error';
      icon = '💥';
      color = this.colors.error;
    } else if (status >= 400) {
      level = 'warn';
      icon = '⚠️';
      color = this.colors.warning;
    } else if (status >= 300) {
      level = 'info';
      icon = '🔄';
      color = this.colors.cyan;
    } else {
      level = 'info';
      icon = '✅';
      color = this.colors.success;
    }
    
    const message = `${method} ${url} - ${status} (${responseTime}ms)`;
    const metadata = {
      requestId,
      method,
      url,
      status,
      responseTime,
      userAgent,
      ip,
      type: 'http_request'
    };
    
    if (this.structuredLogging) {
      this.log(level, message, metadata);
    } else {
      // Custom formatting for HTTP requests
      console.log(
        `${this.colors.dim}[${new Date().toISOString()}]${this.colors.reset} ` +
        `${color}HTTP ${this.colors.reset} ` +
        `${icon} ${color}${method} ${url} - ${status} (${responseTime}ms) [${requestId}]${this.colors.reset}`
      );
      
      if (this.currentLevel === 'debug') {
        console.log(`${this.colors.dim}   User-Agent: ${userAgent}${this.colors.reset}`);
        console.log(`${this.colors.dim}   IP: ${ip}${this.colors.reset}`);
      }
    }
    
    // File logging
    if (this.fileLoggingEnabled) {
      this.writeToFile(level, message, metadata, new Date().toISOString());
    }
  }
  
  /**
   * Log performance metrics
   */
  static performance(operation: string, duration: number, metadata?: any): void {
    const level = duration > 1000 ? 'warn' : 'debug';
    const message = `Performance: ${operation} completed in ${duration}ms`;
    
    this.log(level, message, {
      ...metadata,
      operation,
      duration,
      type: 'performance'
    }, '⚡');
  }
  
  /**
   * Log security events
   */
  static security(event: string, details: any, severity: 'low' | 'medium' | 'high' = 'medium'): void {
    const level = severity === 'high' ? 'error' : severity === 'medium' ? 'warn' : 'info';
    const icons = { low: '🔍', medium: '⚠️', high: '🚨' };
    
    this.log(level, `Security Event: ${event}`, {
      ...details,
      severity,
      type: 'security'
    }, icons[severity]);
  }
  
  /**
   * Write logs to file
   */
  private static async writeToFile(
    level: string,
    message: string,
    metadata: any,
    timestamp: string
  ): Promise<void> {
    try {
      const logEntry = {
        timestamp,
        level: level.toUpperCase(),
        message,
        metadata: metadata || {}
      };
      
      const logLine = JSON.stringify(logEntry) + '\n';
      const logFile = `./logs/${level}.log`;
      
      // Ensure logs directory exists
      try {
        await Deno.mkdir('./logs', { recursive: true });
      } catch {
        // Directory might already exist
      }
      
      await Deno.writeTextFile(logFile, logLine, { append: true });
    } catch (error) {
      // Don't let logging errors crash the application
      console.error('Failed to write to log file:', error.message);
    }
  }
  
  /**
   * Create a child logger with default metadata
   */
  static child(defaultMetadata: any): ChildLogger {
    return new ChildLogger(defaultMetadata);
  }
  
  /**
   * Clear console (development helper)
   */
  static clear(): void {
    console.clear();
  }
  
  /**
   * Log with custom formatting
   */
  static custom(message: string, icon: string, color: string, metadata?: any): void {
    const timestamp = new Date().toISOString();
    console.log(
      `${this.colors.dim}[${timestamp}]${this.colors.reset} ` +
      `${color}${icon} ${message}${this.colors.reset}`
    );
    
    if (metadata) {
      console.log(`${this.colors.dim}   ${JSON.stringify(metadata)}${this.colors.reset}`);
    }
  }
}

// ================================================================================
// 👶 CHILD LOGGER CLASS
// ================================================================================

export class ChildLogger {
  constructor(private defaultMetadata: any) {}
  
  debug(message: string, metadata?: any): void {
    Logger.debug(message, { ...this.defaultMetadata, ...metadata });
  }
  
  info(message: string, metadata?: any): void {
    Logger.info(message, { ...this.defaultMetadata, ...metadata });
  }
  
  success(message: string, metadata?: any): void {
    Logger.success(message, { ...this.defaultMetadata, ...metadata });
  }
  
  warning(message: string, metadata?: any): void {
    Logger.warning(message, { ...this.defaultMetadata, ...metadata });
  }
  
  error(message: string, metadata?: any): void {
    Logger.error(message, { ...this.defaultMetadata, ...metadata });
  }
}

// ================================================================================
// 🔄 REQUEST LOGGING MIDDLEWARE
// ================================================================================

export function createLoggingMiddleware(config: LoggingConfig) {
  // Configure the logger
  Logger.configure(config);
  
  // Sensitive headers that should be redacted in logs
  const sensitiveHeaders = new Set([
    'authorization',
    'cookie',
    'x-api-key',
    'x-auth-token',
    'x-access-token',
    ...(config.sensitiveHeaders || [])
  ].map(h => h.toLowerCase()));
  
  return async (ctx: any, next: () => Promise<unknown>) => {
    if (!config.logRequests) {
      await next();
      return;
    }
    
    const start = Date.now();
    const requestId = ctx.state.requestId || crypto.randomUUID().split('-')[0];
    
    // Log incoming request
    if (config.logLevel === 'debug') {
      const headers = this.sanitizeHeaders(ctx.request.headers, sensitiveHeaders);
      Logger.debug(`Incoming request: ${ctx.request.method} ${ctx.request.url.pathname}`, {
        requestId,
        method: ctx.request.method,
        url: ctx.request.url.pathname,
        headers,
        query: Object.fromEntries(ctx.request.url.searchParams),
        userAgent: ctx.request.headers.get('User-Agent'),
        ip: ctx.request.ip
      });
    }
    
    try {
      await next();
      
      const responseTime = Date.now() - start;
      
      // Log completed request
      if (config.logResponses) {
        Logger.request(ctx, responseTime);
      }
      
      // Log slow requests
      if (responseTime > 1000) {
        Logger.performance(
          `${ctx.request.method} ${ctx.request.url.pathname}`,
          responseTime,
          { requestId, slow: true }
        );
      }
      
    } catch (error) {
      const responseTime = Date.now() - start;
      
      // Log failed request
      Logger.error(`Request failed: ${ctx.request.method} ${ctx.request.url.pathname}`, {
        requestId,
        error: error.message,
        stack: config.includeStackTrace ? error.stack : undefined,
        responseTime,
        method: ctx.request.method,
        url: ctx.request.url.pathname
      });
      
      throw error;
    }
  };
  
  function sanitizeHeaders(headers: Headers, sensitiveHeaders: Set<string>): Record<string, string> {
    const result: Record<string, string> = {};
    
    for (const [key, value] of headers.entries()) {
      if (sensitiveHeaders.has(key.toLowerCase())) {
        result[key] = '[REDACTED]';
      } else {
        result[key] = value.length > 100 ? value.substring(0, 100) + '...' : value;
      }
    }
    
    return result;
  }
}

// ================================================================================
// 📊 LOGGING ANALYTICS
// ================================================================================

export class LoggingAnalytics {
  private static logCounts = new Map<string, number>();
  private static errorPatterns = new Map<string, number>();
  private static performanceIssues: Array<{ operation: string; duration: number; timestamp: number }> = [];
  private static securityEvents: Array<{ event: string; severity: string; timestamp: number }> = [];
  
  static trackLog(level: string, message: string): void {
    const current = this.logCounts.get(level) || 0;
    this.logCounts.set(level, current + 1);
    
    // Track error patterns
    if (level === 'error') {
      const pattern = this.extractErrorPattern(message);
      const patternCount = this.errorPatterns.get(pattern) || 0;
      this.errorPatterns.set(pattern, patternCount + 1);
    }
  }
  
  static trackPerformanceIssue(operation: string, duration: number): void {
    this.performanceIssues.push({
      operation,
      duration,
      timestamp: Date.now()
    });
    
    // Keep only recent issues (last 24 hours)
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    this.performanceIssues = this.performanceIssues.filter(issue => issue.timestamp > oneDayAgo);
  }
  
  static trackSecurityEvent(event: string, severity: string): void {
    this.securityEvents.push({
      event,
      severity,
      timestamp: Date.now()
    });
    
    // Keep only recent events (last 7 days)
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    this.securityEvents = this.securityEvents.filter(event => event.timestamp > oneWeekAgo);
  }
  
  static getStats() {
    const totalLogs = Array.from(this.logCounts.values()).reduce((a, b) => a + b, 0);
    
    return {
      totalLogs,
      logLevelDistribution: Object.fromEntries(this.logCounts),
      errorPatterns: this.getTopErrorPatterns(5),
      recentPerformanceIssues: this.performanceIssues.slice(-10),
      recentSecurityEvents: this.securityEvents.slice(-10),
      insights: this.generateInsights()
    };
  }
  
  private static extractErrorPattern(message: string): string {
    // Extract meaningful error patterns
    const patterns = [
      /Database connection/i,
      /Authentication failed/i,
      /Permission denied/i,
      /File not found/i,
      /Network timeout/i,
      /Invalid input/i
    ];
    
    for (const pattern of patterns) {
      if (pattern.test(message)) {
        return pattern.source;
      }
    }
    
    // Fallback to first few words
    return message.split(' ').slice(0, 3).join(' ');
  }
  
  private static getTopErrorPatterns(limit: number) {
    return Array.from(this.errorPatterns.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([pattern, count]) => ({ pattern, count }));
  }
  
  private static generateInsights() {
    const insights = [];
    const stats = this.getStats();
    
    // Check error rate
    const errorCount = this.logCounts.get('error') || 0;
    const errorRate = stats.totalLogs > 0 ? (errorCount / stats.totalLogs) * 100 : 0;
    
    if (errorRate > 5) {
      insights.push({
        type: 'error_rate',
        message: `High error rate: ${errorRate.toFixed(2)}%`,
        severity: 'high'
      });
    }
    
    // Check performance issues
    const recentSlowOps = this.performanceIssues.filter(
      issue => issue.timestamp > Date.now() - (60 * 60 * 1000) // Last hour
    );
    
    if (recentSlowOps.length > 10) {
      insights.push({
        type: 'performance',
        message: `${recentSlowOps.length} slow operations in the last hour`,
        severity: 'medium'
      });
    }
    
    // Check security events
    const recentHighSeverityEvents = this.securityEvents.filter(
      event => event.severity === 'high' && 
      event.timestamp > Date.now() - (24 * 60 * 60 * 1000) // Last 24 hours
    );
    
    if (recentHighSeverityEvents.length > 0) {
      insights.push({
        type: 'security',
        message: `${recentHighSeverityEvents.length} high-severity security events in the last 24 hours`,
        severity: 'high'
      });
    }
    
    return insights;
  }
}

// ================================================================================
// 🎯 LOGGING PRESETS
// ================================================================================

export const LoggingPresets = {
  DEVELOPMENT: {
    logLevel: 'debug' as const,
    logRequests: true,
    logResponses: true,
    structuredLogs: false,
    enableFileLogging: false,
    includeStackTrace: true
  },
  
  PRODUCTION: {
    logLevel: 'info' as const,
    logRequests: true,
    logResponses: false,
    structuredLogs: true,
    enableFileLogging: true,
    includeStackTrace: false,
    sensitiveHeaders: ['authorization', 'cookie', 'x-api-key']
  },
  
  MINIMAL: {
    logLevel: 'error' as const,
    logRequests: false,
    logResponses: false,
    structuredLogs: true,
    enableFileLogging: true,
    includeStackTrace: false
  }
};

// ================================================================================
// 🚀 EXPORT ALL LOGGING COMPONENTS
// ================================================================================

export default {
  Logger,
  ChildLogger,
  createLoggingMiddleware,
  LoggingAnalytics,
  LoggingPresets
};