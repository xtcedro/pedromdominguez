// test-middleware-stack.ts
try {
  const { createMiddlewareStack } = await import("./middleware/index.ts");
  
  const config = {
    environment: "development",
    port: 3000,
    staticFiles: { root: "./public", enableCaching: false },
    cors: { allowedOrigins: [], developmentOrigins: [] },
    security: { enableHSTS: false },
    logging: { logLevel: "info" as const, logRequests: true },
    healthCheck: { endpoint: "/health", includeMetrics: true }
  };
  
  console.log("Creating middleware stack...");
  const stack = createMiddlewareStack(config);
  console.log("✅ Stack created:", stack);
  console.log("✅ Monitor:", stack.monitor);
  
} catch (error) {
  console.error("❌ Middleware stack creation failed:", error);
  console.error("Stack:", error.stack);
}