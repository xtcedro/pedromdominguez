// public/js/notifications.js

export function showNotification(message, type = "info") {
  ensureNotificationsComponent().then(() => {
    const container = document.getElementById("globalNotifications");
    if (!container) {
      console.warn("⚠️ No #globalNotifications container found.");
      return;
    }

    // ✅ Convert object payloads safely
    if (typeof message === "object" && message !== null) {
      const msg = message.message || "(no message)";
      const t = message.type || type || "info";
      message = `${t.toUpperCase()} — ${msg}`;
      type = t;
    }

    const notification = document.createElement("div");
    notification.className = `notification ${getNotificationClass(type)}`;
    notification.textContent = message;

    // Add with fade-in effect
    notification.style.opacity = "0";
    container.appendChild(notification);

    requestAnimationFrame(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateY(0)";
    });

    // Auto-remove after 4 seconds with fade-out
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(-10px)";
      setTimeout(() => {
        notification.remove();
      }, 300); // match fadeOut animation duration
    }, 4000);
  });
}

function getNotificationClass(type) {
  switch (type) {
    case "success":
      return "notification-success";
    case "warning":
      return "notification-warning";
    case "error":
      return "notification-error";
    default:
      return "notification-info";
  }
}

// 🧠 Utility to auto-load notifications.html if not already present
async function ensureNotificationsComponent() {
  if (document.getElementById("globalNotifications")) return;

  try {
    const res = await fetch("../../components/notifications.html");
    const html = await res.text();
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);
  } catch (err) {
    console.error("❌ Failed to load notifications.html:", err);
  }
}