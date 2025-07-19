// test-imports.ts
try {
  console.log("Testing imports...");
  
  const { PerformanceMonitor } = await import("./middleware/performanceMonitor.ts");
  console.log("✅ PerformanceMonitor imported:", typeof PerformanceMonitor);
  
  const monitor = new PerformanceMonitor();
  console.log("✅ PerformanceMonitor instantiated:", monitor);
  
  const { createMiddlewareStack } = await import("./middleware/index.ts");
  console.log("✅ createMiddlewareStack imported:", typeof createMiddlewareStack);
  
} catch (error) {
  console.error("❌ Import failed:", error);
  console.error("Stack:", error.stack);
}