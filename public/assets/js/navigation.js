import anime from 'https://cdn.skypack.dev/animejs@3.2.1';
import { showNotification } from './notifications.js';

export async function setupNavigation() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) {
    showNotification('❗ Navbar element not found.', 'warning');
    return;
  }

  const isAdmin = !!localStorage.getItem('adminToken');
  const navURL = isAdmin ? '/components/admin-nav.html' : '/components/guest-nav.html';

  try {
    const res = await fetch(navURL);
    const navHTML = await res.text();
    navbar.innerHTML = navHTML;

    showNotification(`✅ Loaded ${isAdmin ? 'Admin' : 'Guest'} Navigation.`, 'success');

    initializeNavEvents();
  } catch (err) {
    console.error(err);
    showNotification('❌ Failed to load navigation component.', 'error');
  }
}

function initializeNavEvents() {
  const menuButton = document.getElementById('menu-toggle');
  const sidebarButton = document.getElementById('sidebar-toggle');
  const sidebarMenu = document.getElementById('sidebar-menu');
  const overlay = document.getElementById('menu-overlay');

  if (!menuButton || !sidebarButton || !sidebarMenu || !overlay) {
    showNotification('❗ Missing sidebar elements.', 'warning');
    return;
  }

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
    sidebarMenu.classList.contains('visible') ? closeMenu() : openMenu();
  };

  menuButton.addEventListener('click', toggleMenu);
  sidebarButton.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // ✅ Submenu toggles
  sidebarMenu.querySelectorAll('.has-submenu .submenu-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const submenu = toggle.nextElementSibling;
      submenu.classList.toggle('open');
      toggle.classList.toggle('open');
    });
  });

  // ✅ Highlight active link
  const currentPage = window.location.pathname.split('/').pop().toLowerCase();
  sidebarMenu.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop().toLowerCase();
    if (currentPage === linkPage) {
      link.classList.add('active');
    }
  });

  // ✅ Logout
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('adminToken');
      showNotification('🚪 You have been logged out.', 'success');
      location.href = '../../pages/auth/login.html';
    });
  }
}