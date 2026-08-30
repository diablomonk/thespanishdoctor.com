/* ===========================================
   The Spanish Doctor -- main.js
   Theme toggle + mobile nav
=========================================== */

(function () {
  'use strict';

  /* -- Theme -------------------------------- */
  var STORAGE_KEY = 'tsd-theme';
  var root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    var toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(function (btn) {
      var isDark = theme === 'dark';
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.innerHTML = isDark ? iconSun() : iconMoon();
    });
  }

  function getStoredTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function storeTheme(t) {
    try { localStorage.setItem(STORAGE_KEY, t); } catch (e) {}
  }

  function currentTheme() {
    return root.getAttribute('data-theme') || 'light';
  }

  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
  }

  function iconMoon() {
    return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>' +
      '</svg>';
  }

  function iconSun() {
    return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="5"/>' +
      '<line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>';
  }

  /* -- Mobile nav --------------------------- */
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var links  = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    links.querySelectorAll('.nav-link').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* -- Active nav link ---------------------- */
  function markActiveLink() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function (a) {
      var href = a.getAttribute('href').split('/').pop();
      if (href === path) a.classList.add('active');
    });
  }

  /* -- Contact form (Formspree AJAX) -------- */
  function initContactForm() {
    var form   = document.getElementById('contact-form');
    var status = document.getElementById('form-status');
    if (!form || !status) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn  = form.querySelector('.btn--primary');
      var orig = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      status.className = 'form-status';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
      .then(function (res) {
        if (res.ok) {
          status.className = 'form-status success';
          status.textContent = "Message sent - I'll be in touch shortly.";
          form.reset();
        } else {
          throw new Error('not ok');
        }
      })
      .catch(function () {
        status.className = 'form-status error';
        status.textContent = 'Something went wrong. Please try again.';
      })
      .finally(function () {
        btn.textContent = orig;
        btn.disabled = false;
      });
    });
  }

  /* -- Auto year ---------------------------- */
  function setYear() {
    var el = document.getElementById('current-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* -- Init --------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    var saved = getStoredTheme();
    applyTheme(saved || 'light');

    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', toggleTheme);
    });

    initMobileNav();
    markActiveLink();
    initContactForm();
    setYear();
  });

})();
