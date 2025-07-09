// load-components.js → v1.5 → Elite architecture

import { initializeChatbot } from './chatbot.js';
import { initializeFloatingSearch } from './search-widget.js';
import { initializeWebSocket, sendWebSocketMessage } from './wsClient.js';
import { showNotification } from './notifications.js'; // 🧠 Global notification utility
import { initializeTechStackSlider } from './techStackSlider.js'; // ✅ NEW: Tech stack slider animation

// 🧠 Load Footer component
export function loadFooter() {
  fetch('../../components/footer.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    });
}

// 🧠 Load Chatbot component
export function loadChatbot(marked) {
  return fetch('../../components/chatbot.html')
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
  return fetch('../../components/search-widget.html')
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
    fetch('../../components/notifications.html')
      .then(res => res.text())
      .then(data => {
        const container = document.createElement('div');
        container.innerHTML = data;
        document.body.appendChild(container);
      });
  }
}

// 🧠 Load Tech Stack Slider component and initialize animation
export function loadTechStackSlider() {
  fetch('../../components/tech-stack-slider.html')
    .then(res => res.text())
    .then(data => {
      const container = document.createElement('section');
      container.innerHTML = data;
      document.body.appendChild(container);
      initializeTechStackSlider(); // ✅ Initialize after adding to DOM
    });
}

// 🧠 Load Boot Screen component
export function loadBootScreen() {
  return fetch('../../components/boot.html')
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
export { sendWebSocketMessage, showNotification };