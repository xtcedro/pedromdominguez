import {
  loadFooter,
//  loadChatbot,
//  loadSearchWidget,
  loadNotifications,
  loadWebSocket,
  showNotification,
  loadBootScreen
} from './load-components.js';

import { marked } from "https://cdn.jsdelivr.net/npm/marked/+esm";
import { setupNavigation } from './navigation.js';
import { runBootSequence } from './boot-sequence.js';
import { loadTechStackSlider } from './load-components.js'; // ✅ Added your slider loader

// import { applySiteTheme } from './theme.js'; // ✅ Optional: custom theme logic

document.addEventListener('DOMContentLoaded', async () => {
  // ✅ 1️⃣ Run your cinematic Sovereign Kernel boot first
  await runBootSequence();

  // ✅ 2️⃣ Optionally apply your theme after boot
  // await applySiteTheme();

  // ✅ 3️⃣ Then load your dynamic components
  loadFooter();
//  loadChatbot(marked);
 // loadSearchWidget();
  loadNotifications();
  loadWebSocket();
  setupNavigation();

  // ✅ 4️⃣ Finally, load your Tech Stack Slider component
  loadTechStackSlider();
});
