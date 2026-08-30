/* ═══════════════════════════════════════
   The Spanish Doctor — main.js
   Theme toggle + mobile nav
═══════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Theme ──────────────────────────── */
  const STORAGE_KEY = 'tsd-theme';
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
    // Update toggle icon aria-label and icon swap
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(btn => {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-label', isDark ? 'Switch to cream (light) mode' : 'Switch to navy (dark) mode');
      btn.innerHTML = isDark ? iconSun() : iconMoon();
    });
  }

  function getStoredTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  }
  function storeTheme(t) {
    try { localStorage.setItem(STORAGE_KEY, t); } catch {}
  }

  function currentTheme() {
    return root.getAttribute('data-theme') || 'light';
  }

  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
  }

  function iconMoon() {
    return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>`;
  }
  function iconSun() {
    return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  }

  /* ── Mobile nav ─────────────────────── */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links  = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    // Close on link click
    links.querySelectorAll('.nav-link').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Active nav link ────────────────── */
  function markActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(a => {
      const href = a.getAttribute('href').split('/').pop();
      if (href === path) a.classList.add('active');
    });
  }

  /* ── Contact form (Formspree AJAX) ──── */
  function initContactForm() {
    const form   = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form || !status) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('.btn--primary');
      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      status.className = 'form-status';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          status.className = 'form-status success';
          status.textContent = 'Message sent — I'll be in touch shortly.';
          form.reset();
        } else {
          throw new Error();
        }
      } catch {
        status.className = 'form-status error';
        status.textContent = 'Something went wrong. Please try again.';
      } finally {
        btn.textContent = orig;
        btn.disabled = false;
      }
    });
  }

  /* ── Auto year ──────────────────────── */
  function setYear() {
    const el = document.getElementById('current-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ── Init ───────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme (or default light)
    const saved = getStoredTheme();
    applyTheme(saved || 'light');

    // Wire toggles
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    initMobileNav();
    markActiveLink();
    initContactForm();
    setYear();
  });

})();
