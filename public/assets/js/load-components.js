// load-components.js → v1.5 → Elite architecture

import { initializeChatbot } from './chatbot.js';
import { initializeFloatingSearch } from './search-widget.js';
import { initializeWebSocket, sendWebSocketMessage } from './wsClient.js';
import { showNotification } from './notifications.js'; // 🧠 Global notification utility
import { initializeTechStackSlider } from './techStackSlider.js'; // ✅ Tech stack slider animation
import { initializeSystemInfoFAB } from './systemInfoFAB.js'; // ✅ NEW: System Info FAB

// 🧠 Load Footer component
export function loadFooter() {
  fetch('/components/footer.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    });
}

// 🧠 Load Chatbot component
export function loadChatbot(marked) {
  return fetch('/components/chatbot.html')
    .then(res => res.text())
    .then(data => {
      const container = document.createElement('div');
      container.innerHTML = data;
      document.body.appendChild(container);
      initializeChatbot(marked);
    });
}

// 🧠 Load Search Widget component
export function loadSearchWidget() {
  return fetch('/components/search-widget.html')
    .then(res => res.text())
    .then(data => {
      const container = document.createElement('div');
      container.innerHTML = data;
      document.body.appendChild(container);
      initializeFloatingSearch();
    });
}

// 🧠 Load Notifications component (safe - prevents duplicates)
export function loadNotifications() {
  if (!document.getElementById('globalNotifications')) {
    fetch('/components/notifications.html')
      .then(res => res.text())
      .then(data => {
        const container = document.createElement('div');
        container.innerHTML = data;
        document.body.appendChild(container);
      });
  }
}

// 🧠 Load Tech Stack Slider component BEFORE hero section and initialize
export function loadTechStackSlider() {
  fetch('/components/tech-stack-slider.html')
    .then(res => res.text())
    .then(data => {
      const container = document.createElement('section');
      container.innerHTML = data;

      const heroSection = document.getElementById('hero');
      if (heroSection && heroSection.parentNode) {
        heroSection.parentNode.insertBefore(container, heroSection);
      } else {
        // fallback if no hero
        document.body.prepend(container);
      }

      initializeTechStackSlider(); // ✅ After DOM injection
    });
}

// 🧠 Load System Info FAB and initialize
export function loadSystemInfoFAB() {
  fetch('/components/system-info-fab.html')
    .then(res => res.text())
    .then(data => {
      const container = document.createElement('div');
      container.innerHTML = data;
      document.body.appendChild(container);
      initializeSystemInfoFAB(); // ✅ After DOM injection
    });
}

// 🧠 Load Boot Screen component
export function loadBootScreen() {
  return fetch('/components/boot.html')
    .then(res => res.text())
    .then(data => {
      const container = document.createElement('div');
      container.innerHTML = data;
      document.body.appendChild(container);
    });
}

// 🧠 Load WebSocket client and initialize connection
export function loadWebSocket(wsUrl = "wss://domingueztechsolutions.com/api/ws") {
  initializeWebSocket(wsUrl);
}

// 🧠 Export globally
export {
  sendWebSocketMessage,
  showNotification,
};
