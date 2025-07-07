import { Context } from "https://deno.land/x/oak/mod.ts";
import { DashboardOverview } from "../types/dashboard.d.ts";

export const getDashboardOverview = async (ctx: Context) => {
  console.log("📡 [Dashboard] Admin overview request received.");
  console.log("🔐 Verifying dashboard access...");

  const overviewPayload: DashboardOverview = {
    welcomeMessage: "Welcome to the Admin Dashboard!",
    contentSections: [
      { label: "✏️ Manage Blogs", link: "manage-blogs.html" },
      { label: "📅 Manage Appointments", link: "public-appointments.html" },
      { label: "📅 Manage Projects", link: "manage-projects.html" },
      { label: "🛣️ Manage Roadmap", link: "manage-roadmap.html" },
    ],
    systemTools: [
      { label: "📊 View Site Analytics", link: "site-analytics.html" },
      { label: "⚙️ Site Settings", link: "settings.html" },
      { label: "📫 User Messages", link: "user-messages.html" },
      { label: "💳 Stripe Terminal", link: "terminal.html" },
      { label: "🖥️ System Health", link: "system-health.html" },
      { label: "📡 Broadcast Controller", link: "broadcast.html" },
      { label: "📡 Live Connected Users", link: "live-users.html" },
      { label: "📥 Export Appointments", link: "export-appointments.html" },
      { label: "📥 Export User Messages", link: "export-messages.html" },
    ],
    userManagement: [
      { label: "👤 Manage Admin Users", link: "manage-admins.html" },
      { label: "🔑 Token Management", link: "token-management.html" },
      { label: "🔒 Access Logs", link: "access-logs.html" },
    ],
    aboutSection: [
      { label: "🔄 System Updates", link: "system-updates.html" },
      { label: "ℹ️ About DenoGenesis", link: "about-denogenesis.html" },
    ],
    communityLinks: [
      { label: "🌍 Official GitHub", link: "https://github.com/xtcedro" },
      { label: "📚 DenoGenesis Docs", link: "docs.html" },
      { label: "💬 Community Chat", link: "community-chat.html" },
    ],
  };

  console.log("✅ [Dashboard] Overview content prepared and delivered.");
  ctx.response.status = 200;
  ctx.response.body = overviewPayload;
};
