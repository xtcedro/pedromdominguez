import { showNotification } from '../../assets/js/notifications.js';

document.addEventListener("DOMContentLoaded", async () => {
  const welcome = document.getElementById("dashboard-welcome");
  const contentList = document.getElementById("dashboard-content");
  const toolsList = document.getElementById("dashboard-tools");

  try {
    const token = localStorage.getItem("adminToken"); // Retrieve token from storage
    if (!token) {
      throw new Error("Missing admin token.");
    }

    const res = await fetch("/api/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // Attach token
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    if (data.welcomeMessage) {
      welcome.textContent = data.welcomeMessage;
    }

    if (Array.isArray(data.contentSections)) {
      data.contentSections.forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.link;
        a.textContent = item.label;
        li.appendChild(a);
        contentList.appendChild(li);
      });
    }

    if (Array.isArray(data.systemTools)) {
      data.systemTools.forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.link;
        a.textContent = item.label;
        li.appendChild(a);
        toolsList.appendChild(li);
      });
    }

    // ✅ Success notification
    showNotification("✅ Dashboard data loaded successfully!", "success");

  } catch (err) {
    // Replace console with notification
    showNotification(`❌ Failed to load dashboard data: ${err.message}`, "error");

    welcome.textContent = "⚠️ Error loading dashboard.";
  }
});