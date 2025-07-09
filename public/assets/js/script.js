import {
  loadFooter,
  // loadChatbot,
  // loadSearchWidget,
  loadNotifications,
  loadWebSocket,
  showNotification,
  loadBootScreen,
  loadTechStackSlider, // ✅ Tech stack slider
  loadSystemInfoFAB    // ✅ System Info FAB
} from './load-components.js';

import { marked } from "https://cdn.jsdelivr.net/npm/marked/+esm";
import { setupNavigation } from './navigation.js';
import { runBootSequence } from './boot-sequence.js';
// import { applySiteTheme } from './theme.js'; // ✅ Optional: your custom theming

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // ✅ 1️⃣ Cinematic Sovereign Kernel boot first
    await runBootSequence();

    // ✅ 2️⃣ Apply your theme if needed
    // await applySiteTheme();

    // ✅ 3️⃣ Load core dynamic components
    loadFooter();
    // loadChatbot(marked);
    // loadSearchWidget();
    loadNotifications();
    loadWebSocket();
    setupNavigation();

    // ✅ 4️⃣ Load portfolio-specific components
    loadTechStackSlider();
    loadSystemInfoFAB();

    showNotification('✅ All components loaded successfully.', 'success');
  } catch (err) {
    console.error('❌ Error during init:', err);
    showNotification('❌ Error loading components. Please refresh.', 'error');
  }
});