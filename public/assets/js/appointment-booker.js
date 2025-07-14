// assets/js/appointmentBooker.js

import { showNotification } from "./notifications.js";



const form = document.getElementById("appointmentForm");
const phoneInput = document.getElementById("phone");
const responseMsg = document.getElementById("responseMessage");

// ✅ Toggle local or production API endpoint
const API_BASE = window.location.origin.includes("localhost")
  ? "http://localhost:3003"
  : "https://www.pedromdominguez.com";

// ✅ Identify your site key
const SITE_KEY = "domtech";

// 🧼 Format phone input to 10 digits only
phoneInput.addEventListener("input", () => {
  let cleaned = phoneInput.value.replace(/\D/g, "");
  if (cleaned.length > 10) {
    cleaned = cleaned.slice(0, 10);
  }
  phoneInput.value = cleaned;
});

// 📬 Submit appointment form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  // Normalize phone and add site key
  payload.phone = payload.phone.replace(/\D/g, "");
  payload.siteKey = SITE_KEY;

  // ✅ Validate phone number
  if (payload.phone.length !== 10) {
    responseMsg.style.display = "block";
    responseMsg.textContent = "Phone number must be exactly 10 digits.";
    responseMsg.style.color = "crimson";
    showNotification("❌ Invalid phone number. Must be 10 digits.", "error");
    return;
  }

  try {
    showNotification("📡 Sending appointment data...", "info");

    const res = await fetch(`${API_BASE}/api/appointments?site=${SITE_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    responseMsg.style.display = "block";

    if (res.ok) {
      responseMsg.textContent = data.message || "✅ Appointment booked!";
      responseMsg.style.color = "limegreen";
      form.reset();
      showNotification("✅ Appointment booked successfully!", "success");
    } else {
      responseMsg.textContent = data.error || "❌ Something went wrong.";
      responseMsg.style.color = "crimson";
      showNotification(data.error || "❌ Appointment booking failed.", "error");
    }
  } catch (err) {
    console.error("❌ Submission error:", err);
    responseMsg.style.display = "block";
    responseMsg.textContent = "❌ Error submitting form.";
    responseMsg.style.color = "crimson";
    showNotification("❌ Server error. Please try again.", "error");
  }
});
