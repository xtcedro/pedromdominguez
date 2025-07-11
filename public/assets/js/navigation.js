// File: /assets/js/navigation.js

import anime from 'https://cdn.skypack.dev/animejs@3.2.1';
import { showNotification } from './notifications.js';

export function setupNavigation() {
  // Inject the nav HTML directly
  const navbar = document.querySelector('.navbar');
  if (!navbar) {
    showNotification('❗ Navbar element not found.', 'warning');
    return;
  }

  navbar.innerHTML = `
    <button id="hamburger" aria-label="Toggle navigation" aria-expanded="false">
      <span class="bar bar1"></span>
      <span class="bar bar2"></span>
      <span class="bar bar3"></span>
    </button>
    <nav id="drawer" hidden>
      <ul>
        <li><a href="/index.html">🏠 Home</a></li>
        <li><a href="/about.html">👨‍💻 About</a></li>
        <li><a href="/contact.html">📬 Contact</a></li>
      </ul>
    </nav>
  `;

  const hamburgerBtn = document.getElementById('hamburger');
  const drawerNav = document.getElementById('drawer');
  const firstNavLink = drawerNav.querySelector('a');

  let menuOpen = false;

  function openMenu() {
    drawerNav.removeAttribute('hidden');
    anime({
      targets: '#drawer',
      translateX: '0%',
      duration: 500,
      easing: 'easeOutQuad',
      begin: () => {
        drawerNav.style.transform = 'translateX(-100%)';
      },
    });

    anime({
      targets: '#hamburger .bar1',
      rotate: 45,
      translateY: 8,
      duration: 500,
      easing: 'easeOutQuad',
    });
    anime({
      targets: '#hamburger .bar3',
      rotate: -45,
      translateY: -8,
      duration: 500,
      easing: 'easeOutQuad',
    });
    anime({
      targets: '#hamburger .bar2',
      opacity: 0,
      duration: 300,
      easing: 'easeOutQuad',
    });

    hamburgerBtn.setAttribute('aria-expanded', 'true');
    menuOpen = true;
    if (firstNavLink) firstNavLink.focus();
    showNotification('📂 Menu opened.', 'info');
  }

  function closeMenu() {
    anime({
      targets: '#drawer',
      translateX: '-100%',
      duration: 500,
      easing: 'easeOutQuad',
      complete: () => {
        drawerNav.setAttribute('hidden', '');
        drawerNav.style.transform = 'translateX(-100%)';
      },
    });

    anime({
      targets: '#hamburger .bar1',
      rotate: 0,
      translateY: 0,
      duration: 500,
      easing: 'easeOutQuad',
    });
    anime({
      targets: '#hamburger .bar3',
      rotate: 0,
      translateY: 0,
      duration: 500,
      easing: 'easeOutQuad',
    });
    anime({
      targets: '#hamburger .bar2',
      opacity: 1,
      duration: 300,
      easing: 'easeOutQuad',
      delay: 200,
    });

    hamburgerBtn.setAttribute('aria-expanded', 'false');
    menuOpen = false;
    hamburgerBtn.focus();
    showNotification('📁 Menu closed.', 'info');
  }

  hamburgerBtn.addEventListener('click', () => {
    menuOpen ? closeMenu() : openMenu();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) {
      closeMenu();
    }
  });

  showNotification('✅ Navigation initialized with side drawer.', 'success');
}