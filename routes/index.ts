// index.ts
// ============================================
// 🗂️ Main Router Registry for Dominguez Tech Solutions (DenoGenesis)
// ============================================
// ✅ Each module is self-contained: controller, service, model, types
// ✅ Keep this clean — new features should plug in without clutter
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
import systemRoutes from "./systemRoutes.ts";

// === Initialize Master Router ===
const router = new Router();

// === Serve Static Homepage ===
router.get("/", async (ctx) => {
  // Check if response has already been handled by middleware
  if (ctx.response.body !== undefined) {
    return;
  }

  try {
    await send(ctx, "/public/pages/home/index.html", {
      root: Deno.cwd(),
      index: "index.html",
    });
  } catch (error) {
    // If homepage not found, send a simple response
    ctx.response.status = 200;
    ctx.response.headers.set("Content-Type", "text/html");
    ctx.response.body = `
<!DOCTYPE html>
<html>
<head>
    <title>DenoGenesis Framework</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>🚀 DenoGenesis Framework</h1>
    <p>Welcome to your local-first digital sovereignty platform!</p>
    <p>Framework is running successfully.</p>
    <ul>
        <li><a href="/health">Health Check</a></li>
        <li><a href="/api/system/info">System Info</a></li>
    </ul>
</body>
</html>`;
  }
});

// === Register All Routes (Silently) ===

router.use("/api/auth", authRoutes.routes(), authRoutes.allowedMethods());
router.use("/api/analytics", analyticsRoutes.routes(), analyticsRoutes.allowedMethods());
router.use("/api/appointments", appointmentRoutes.routes(), appointmentRoutes.allowedMethods());
router.use("/api/blogs", blogRoutes.routes(), blogRoutes.allowedMethods());
router.use("/api/ai-assistant", aiAssistantRoutes.routes(), aiAssistantRoutes.allowedMethods());
router.use("/api/contact", contactRoutes.routes(), contactRoutes.allowedMethods());
router.use("/api/dashboard", dashboardRoutes.routes(), dashboardRoutes.allowedMethods());
router.use("/api/settings", settingsRoutes.routes(), settingsRoutes.allowedMethods());
router.use("/api/payment", paymentRoutes.routes(), paymentRoutes.allowedMethods());
router.use("/api/projects", projectsRoutes.routes(), projectsRoutes.allowedMethods());
router.use("/api/roadmap", roadmapRoutes.routes(), roadmapRoutes.allowedMethods());
router.use("/api/search", searchRoutes.routes(), searchRoutes.allowedMethods());
router.use("/api/notifications", notificationsRoutes.routes(), notificationsRoutes.allowedMethods());
router.use("/api/system", systemRoutes.routes(), systemRoutes.allowedMethods());

export default router;