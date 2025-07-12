import {
  loadFooter,
  loadNotifications,
  loadWebSocket,
  showNotification,
  loadBootScreen,
  loadTechStackSlider,
  loadSystemInfoFAB
} from './load-components.js';

import { marked } from "https://cdn.jsdelivr.net/npm/marked/+esm";
import { setupNavigation } from './navigation.js';
import { runBootSequence } from './boot-sequence.js';
import { initializeTypingEffects } from './initTypingEffects.js';
import { initAnimations } from './animations.js';  // ✅ Your new single import

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await runBootSequence();

    loadFooter();
    loadNotifications();
    loadWebSocket();
    setupNavigation();
    loadTechStackSlider();
    loadSystemInfoFAB();

    initializeTypingEffects();

    // ✅ Run ALL your animations from the single function!
    initAnimations();

    showNotification('✅ All components & animations loaded for PedroMDominguez.com', 'success');
  } catch (err) {
    console.error('❌ Error during initialization:', err);
    showNotification('❌ Something went wrong. Please refresh.', 'error');
  }
});