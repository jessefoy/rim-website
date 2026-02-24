/**
 * nav.js — Navigation interactions for RIM website
 * Replaces Webflow JS dependency for:
 *   1. Desktop dropdown open/close (hover + click)
 *   2. Mobile hamburger menu toggle
 */
document.addEventListener('DOMContentLoaded', function () {

  // ── Desktop dropdowns ────────────────────────────────────────
  // CSS handles hover (see custom.css). JS handles click for
  // accessibility and closes open dropdowns when clicking elsewhere.

  document.querySelectorAll('.w-dropdown').forEach(function (dropdown) {
    const toggle = dropdown.querySelector('.w-dropdown-toggle');
    const list   = dropdown.querySelector('.w-dropdown-list');
    if (!toggle || !list) return;

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('w--open');

      // Close all open dropdowns first
      closeAllDropdowns();

      if (!isOpen) {
        dropdown.classList.add('w--open');
        list.classList.add('w--open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', closeAllDropdowns);

  function closeAllDropdowns() {
    document.querySelectorAll('.w-dropdown.w--open').forEach(function (d) {
      d.classList.remove('w--open');
      const list   = d.querySelector('.w-dropdown-list');
      const toggle = d.querySelector('.w-dropdown-toggle');
      if (list)   list.classList.remove('w--open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }


  // ── Mobile hamburger ─────────────────────────────────────────
  // The mobile nav (.navigation-mob) has a .w-nav-button hamburger.
  // Clicking it toggles w--open on both the button and the .w-nav-menu.

  document.querySelectorAll('.w-nav-button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const nav  = this.closest('.w-nav');
      const menu = nav ? nav.querySelector('.w-nav-menu') : null;
      if (!menu) return;

      const isOpen = menu.classList.contains('w--open');
      menu.classList.toggle('w--open', !isOpen);
      this.classList.toggle('w--open', !isOpen);
    });
  });

});
