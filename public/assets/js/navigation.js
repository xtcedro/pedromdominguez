// File: /assets/js/navigation.js

import anime from 'https://cdn.skypack.dev/animejs@3.2.1';
import { showNotification } from './notifications.js';

export function setupNavigation() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) {
    showNotification('❗ Navbar element not found.', 'warning');
    return;
  }

  const isAdmin = !!localStorage.getItem('adminToken');

  // === Add submenus in guestNav ===
  const guestNav = `
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
          <button class="hamburger-menu close-menu" id="sidebar-toggle" aria-label="Toggle menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </button>
          <h2>📌 Menu</h2>
        </div>
        <ul class="nav-links">
          <li><a href="../../pages/home/index.html">🏠 Home</a></li>
          <li class="has-submenu">
            <span class="submenu-toggle">👨‍💻 About ▼</span>
            <ul class="submenu">
              <li><a href="../../pages/about/about.html">My Story</a></li>
              <li><a href="../../pages/about/skills.html">Skills & Tools</a></li>
            </ul>
          </li>
          <li class="has-submenu">
            <span class="submenu-toggle">🚀 Projects ▼</span>
            <ul class="submenu">
              <li><a href="../../pages/projects/websites.html">Websites</a></li>
              <li><a href="../../pages/projects/meta-framework.html">Meta Framework</a></li>
            </ul>
          </li>
          <li><a href="../../pages/contact/contact.html">📬 Contact</a></li>
          <li><a href="../../pages/appointments/appointment-booker.html">🗓️ Book Consultation</a></li>
        </ul>
        <div class="nav-container">
          <a href="../../pages/auth/login.html" class="nav-button">🫅 Admin Login</a>
        </div>
      </div>
      <div class="overlay hidden" id="menu-overlay"></div>
    </div>
  `;

  const adminNav = `
    <!-- Your existing adminNav stays the same -->
    ...
  `;

  navbar.innerHTML = isAdmin ? adminNav : guestNav;

  const menuButton = document.getElementById('menu-toggle');
  const sidebarButton = document.getElementById('sidebar-toggle');
  const sidebarMenu = document.getElementById('sidebar-menu');
  const overlay = document.getElementById('menu-overlay');

  // === Animate hamburger
  const animateOpen = (bars) => {
    anime({ targets: bars[0], rotate: 45, translateY: 8, duration: 300 });
    anime({ targets: bars[1], opacity: 0, duration: 200 });
    anime({ targets: bars[2], rotate: -45, translateY: -8, duration: 300 });
  };
  const animateClose = (bars) => {
    anime({ targets: bars[0], rotate: 0, translateY: 0, duration: 300 });
    anime({ targets: bars[1], opacity: 1, duration: 200 });
    anime({ targets: bars[2], rotate: 0, translateY: 0, duration: 300 });
  };

  const openMenu = () => {
    menuButton.classList.add('open');
    sidebarButton.classList.add('open');
    animateOpen(menuButton.querySelectorAll('.bar'));
    animateOpen(sidebarButton.querySelectorAll('.bar'));
    sidebarMenu.classList.add('visible');
    sidebarMenu.classList.remove('hidden');
    overlay.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  };
  const closeMenu = () => {
    menuButton.classList.remove('open');
    sidebarButton.classList.remove('open');
    animateClose(menuButton.querySelectorAll('.bar'));
    animateClose(sidebarButton.querySelectorAll('.bar'));
    sidebarMenu.classList.remove('visible');
    sidebarMenu.classList.add('hidden');
    overlay.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  };
  const toggleMenu = () => {
    if (sidebarMenu.classList.contains('visible')) {
      closeMenu();
    } else {
      openMenu();
    }
  };
  menuButton.addEventListener('click', toggleMenu);
  sidebarButton.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // === Submenu toggle logic ===
  sidebarMenu.querySelectorAll('.has-submenu .submenu-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const submenu = toggle.nextElementSibling;
      submenu.classList.toggle('open');
      toggle.classList.toggle('open');
    });
  });

  // === Highlight active
  const currentPage = window.location.pathname.split('/').pop().toLowerCase();
  sidebarMenu.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop().toLowerCase();
    if (currentPage === linkPage) {
      link.classList.add('active');
    }
  });

  showNotification('✅ Navigation with submenus initialized!', 'success');
}