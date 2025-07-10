
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
import { initTypingEffects } from './initTypingEffects.js'; // ✅ Import your typing engine

// import { applySiteTheme } from './theme.js'; // ✅ Optional: custom theming

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // ✅ 1️⃣ Sovereign Kernel boot
    await runBootSequence();

    // ✅ 2️⃣ Optionally apply your theme
    // await applySiteTheme();

    // ✅ 3️⃣ Load core dynamic components
    loadFooter();
    // loadChatbot(marked);
    // loadSearchWidget();
    loadNotifications();
    loadWebSocket();
    setupNavigation();

    // ✅ 4️⃣ Portfolio-specific features
    loadTechStackSlider();
    loadSystemInfoFAB();

    // ✅ 5️⃣ Typing effects
    await initTypingEffects();

    showNotification('✅ All components loaded for PedroMDominguez.com', 'success');
  } catch (err) {
    console.error('❌ Error during initialization:', err);
    showNotification('❌ Something went wrong. Please refresh.', 'error');
  }
});