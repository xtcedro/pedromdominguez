// assets/js/appointmentBooker.js

import { showNotification } from "./notifications.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("appointmentForm");
  const phoneInput = document.getElementById("phone");
  const responseMsg = document.getElementById("responseMessage");

  // ✅ Site key for appointment routing
  const SITE_KEY = "pedromd";

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
      displayMessage("Phone number must be exactly 10 digits.", "error");
      showNotification("❌ Invalid phone number. Must be 10 digits.", "error");
      return;
    }

    // ✅ Validate required fields
    if (!payload.name || !payload.email || !payload.phone || !payload.service) {
      displayMessage("Please fill out all required fields.", "error");
      showNotification("❌ Please fill out all required fields.", "error");
      return;
    }

    try {
      showNotification("📡 Sending appointment data...", "info");

      // ✅ Use relative URL (same pattern as contact form)
      const res = await fetch(`/api/appointments?site=${SITE_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        displayMessage(data.message || "✅ Appointment booked successfully!", "success");
        showNotification("✅ Appointment booked successfully!", "success");
        form.reset();
      } else {
        displayMessage(data.error || "❌ Something went wrong.", "error");
        showNotification(data.error || "❌ Appointment booking failed.", "error");
      }
    } catch (err) {
      console.error("❌ Submission error:", err);
      displayMessage("❌ Error submitting form. Please try again later.", "error");
      showNotification("❌ Server error. Please try again later.", "error");
    }
  });

  // ✅ Message display function (same pattern as contact form)
  function displayMessage(text, type) {
    responseMsg.style.display = "block";
    responseMsg.textContent = text;
    responseMsg.style.color = type === "success" ? "limegreen" : "crimson";
  }
});