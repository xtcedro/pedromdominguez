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

  // === Templates with header fix ===
  const guestNav = `
    <div class="nav-left">
      <span class="nav-title">Dominguez Tech Solutions</span>
    </div>
    <div class="menu-container">
      <div class="sidebar hidden" id="sidebar-menu">
        <div class="sidebar-header">
          <button class="hamburger-menu close-menu" id="menu-toggle" aria-label="Toggle menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </button>
          <h2>📌 Menu</h2>
        </div>
        <ul class="nav-links">
          <li><a href="../../pages/home/index.html">🏠 Home</a></li>
          <li><a href="../../pages/about/about.html">👨‍💻 About Me</a></li>
          <li><a href="../../pages/contact/contact.html">📬 Contact Me</a></li>
        </ul>
        <div class="nav-container">
          <a href="../../pages/auth/login.html" class="nav-button">🫅 Admin Login</a>
        </div>
      </div>
      <div class="overlay hidden" id="menu-overlay"></div>
    </div>
  `;

  const adminNav = `
    <div class="nav-left">
      <span class="nav-title">Admin Panel - Dominguez Tech Solutions</span>
    </div>
    <div class="menu-container">
      <div class="sidebar hidden" id="sidebar-menu">
        <div class="sidebar-header">
          <button class="hamburger-menu close-menu" id="menu-toggle" aria-label="Toggle menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </button>
          <h2>🛠️ Admin Menu</h2>
        </div>
        <ul class="nav-links">
          <li><a href="../../pages/admin/dashboard.html">📊 Dashboard</a></li>
          <li><a href="../../pages/admin/manage-blogs.html">📝 Manage Blogs</a></li>
          <li><a href="../../pages/admin/public-appointments.html">📋 Manage Appointments</a></li>
          <li><a href="../../pages/admin/manage-projects.html">📑 Manage Projects</a></li>
          <li><a href="../../pages/admin/manage-roadmap.html">🛣️ Manage Roadmap</a></li>
          <li><a href="../../pages/admin/transactions.html">💳 Transactions</a></li>
          <li><a href="../../pages/admin/user-messages.html">📫 Inbox</a></li>
          <li><a href="../../pages/admin/settings.html">⚙️ Settings</a></li>
        </ul>
        <div class="nav-container">
          <a href="#" class="nav-button" id="logout-link">🚪 Logout</a>
        </div>
      </div>
      <div class="overlay hidden" id="menu-overlay"></div>
    </div>
  `;

  navbar.innerHTML = isAdmin ? adminNav : guestNav;

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

  // Click outside the sidebar closes it
  document.addEventListener('click', (event) => {
    const isInsideSidebar = sidebarMenu.contains(event.target);
    const isToggleButton = menuButton.contains(event.target);
    if (!isInsideSidebar && !isToggleButton && sidebarMenu.classList.contains('visible')) {
      closeMenu();
    }
  });

  // Highlight active link
  const currentPage = window.location.pathname.split('/').pop().toLowerCase();
  sidebarMenu.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop().toLowerCase();
    if (currentPage === linkPage) {
      link.classList.add('active');
    }
  });

  // Admin logout
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('adminToken');
      showNotification('🚪 You have been logged out.', 'success');
      location.href = '../../pages/auth/login.html';
    });
  }

  showNotification('✅ Navigation initialized successfully.', 'success');
}