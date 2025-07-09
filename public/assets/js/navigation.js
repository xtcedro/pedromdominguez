// File: /assets/js/navigation.js

import anime from 'https://cdn.skypack.dev/animejs@3.2.1';
import { showNotification } from './notifications.js';

export function setupNavigation() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) {
    showNotification('❗ Navbar element not found.', 'warning');
    return;
  }

  // === Portfolio Navigation Template ===
  const navTemplate = `
    <div class="nav-left">
      <button class="hamburger-menu" id="menu-toggle" aria-label="Toggle navigation">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
      <span class="nav-title">Pedro M. Dominguez</span>
    </div>
    <div class="menu-container">
      <div class="sidebar hidden" id="sidebar-menu">
        <div class="sidebar-header">
          <h2>📌 Menu</h2>
        </div>
        <ul class="nav-links">
          <li><a href="/index.html">🏠 Home</a></li>
          <li><a href="/pages/about.html">👨‍💻 About</a></li>
          <li><a href="/pages/projects.html">🚀 Projects</a></li>
          <li><a href="/pages/contact.html">📬 Contact</a></li>
        </ul>
      </div>
      <div class="overlay hidden" id="menu-overlay"></div>
    </div>
  `;

  navbar.innerHTML = navTemplate;

  const menuButton = document.getElementById('menu-toggle');
  const sidebarMenu = document.getElementById('sidebar-menu');
  const overlay = document.getElementById('menu-overlay');

  if (!menuButton || !sidebarMenu || !overlay) {
    showNotification('❗ Missing sidebar elements.', 'warning');
    return;
  }

  const bars = menuButton.querySelectorAll('.bar');

  const openMenu = () => {
    menuButton.classList.add('open');

    anime({
      targets: bars[0],
      rotate: 45,
      translateY: 8,
      duration: 300,
      easing: 'easeInOutQuad',
    });
    anime({
      targets: bars[1],
      opacity: 0,
      duration: 200,
      easing: 'easeInOutQuad',
    });
    anime({
      targets: bars[2],
      rotate: -45,
      translateY: -8,
      duration: 300,
      easing: 'easeInOutQuad',
    });

    sidebarMenu.classList.add('visible');
    sidebarMenu.classList.remove('hidden');
    overlay.classList.remove('hidden');
    document.body.classList.add('no-scroll');
    showNotification('📂 Menu opened.', 'info');
  };

  const closeMenu = () => {
    menuButton.classList.remove('open');

    anime({
      targets: bars[0],
      rotate: 0,
      translateY: 0,
      duration: 300,
      easing: 'easeInOutQuad',
    });
    anime({
      targets: bars[1],
      opacity: 1,
      duration: 200,
      easing: 'easeInOutQuad',
    });
    anime({
      targets: bars[2],
      rotate: 0,
      translateY: 0,
      duration: 300,
      easing: 'easeInOutQuad',
    });

    sidebarMenu.classList.remove('visible');
    sidebarMenu.classList.add('hidden');
    overlay.classList.add('hidden');
    document.body.classList.remove('no-scroll');
    showNotification('📁 Menu closed.', 'info');
  };

  const toggleMenu = () => {
    if (menuButton.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  menuButton.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarMenu.classList.contains('visible')) {
      closeMenu();
    }
  });

  document.addEventListener('click', (event) => {
    const isInsideSidebar = sidebarMenu.contains(event.target);
    const isToggleButton = menuButton.contains(event.target);
    if (!isInsideSidebar && !isToggleButton && sidebarMenu.classList.contains('visible')) {
      closeMenu();
    }
  });

  // Highlight current page
  const currentPage = window.location.pathname.split('/').pop().toLowerCase();
  sidebarMenu.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop().toLowerCase();
    if (currentPage === linkPage) {
      link.classList.add('active');
    }
  });

  showNotification('✅ Navigation loaded for PedroMDominguez.com', 'success');
}