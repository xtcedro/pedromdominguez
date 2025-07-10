// index.ts
// ============================================
// 🗂️ Main Router Registry for Dominguez Tech Solutions (DenoGenesis)
// ============================================
// ✅ Each module is self-contained: controller, service, model, types
// ✅ Keep this file clean — plug in new features without clutter
// ============================================

import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { send } from "https://deno.land/x/oak@v12.6.1/send.ts";

// === Modular Route Imports ===
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
import systemRoutes from "./systemRoutes.ts"; // ✅ NEW: System Info

// === Initialize Master Router ===
const router = new Router();

// === Serve Static Homepage ===
router.get("/", async (ctx) => {
  await send(ctx, "/public/pages/home/index.html", {
    root: Deno.cwd(),
    index: "index.html",
  });
});

// === Log Registry Start ===
console.log("\x1b[32m%s\x1b[0m", "\n🔗 Registering API Routes...\n");

// === Register All Routes ===
// Always use routes() + allowedMethods() for proper method handling

router.use("/api/auth", authRoutes.routes(), authRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Auth routes loaded at /api/auth");

router.use("/api/analytics", analyticsRoutes.routes(), analyticsRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Analytics routes loaded at /api/analytics");

router.use("/api/appointments", appointmentRoutes.routes(), appointmentRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Appointments routes loaded at /api/appointments");

router.use("/api/blogs", blogRoutes.routes(), blogRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Blog routes loaded at /api/blogs");

router.use("/api/ai-assistant", aiAssistantRoutes.routes(), aiAssistantRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  AI Assistant routes loaded at /api/ai-assistant");

router.use("/api/contact", contactRoutes.routes(), contactRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Contact routes loaded at /api/contact");

router.use("/api/dashboard", dashboardRoutes.routes(), dashboardRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Dashboard routes loaded at /api/dashboard");

router.use("/api/settings", settingsRoutes.routes(), settingsRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Settings routes loaded at /api/settings");

router.use("/api/payment", paymentRoutes.routes(), paymentRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Payment routes loaded at /api/payment");

router.use("/api/projects", projectsRoutes.routes(), projectsRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Projects routes loaded at /api/projects");

router.use("/api/roadmap", roadmapRoutes.routes(), roadmapRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Roadmap routes loaded at /api/roadmap");

router.use("/api/search", searchRoutes.routes(), searchRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Search routes loaded at /api/search");

router.use("/api/notifications", notificationsRoutes.routes(), notificationsRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Notifications routes loaded at /api/notifications");

router.use("/api/system", systemRoutes.routes(), systemRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  System routes loaded at /api/system");

// === Final Confirmation ===
console.log("\x1b[32m%s\x1b[0m", "\n✅ All API routes successfully registered.");
console.log("\x1b[33m%s\x1b[0m", "🚀 Your DenoGenesis framework is modular, transparent, and ready to scale.\n");

export default router;
