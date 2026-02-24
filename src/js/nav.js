/**
 * nav.js — RIM Website navigation
 *
 * webflow.js (loaded before this file) registers its own click handlers on
 * .w-nav-button and .w-dropdown-toggle. We strip those by cloning the elements
 * before adding our own handlers — this eliminates the double-handler conflict
 * that caused the mobile menu to flash open and immediately close.
 */
document.addEventListener('DOMContentLoaded', function () {

  // ── Strip webflow.js handlers ────────────────────────────────
  // cloneNode(true) deep-copies the element and its children but NOT its
  // event listeners. Replacing the original removes webflow's handlers.

  document.querySelectorAll('.w-nav-button, .w-dropdown-toggle').forEach(function (el) {
    var clone = el.cloneNode(true);
    el.parentNode.replaceChild(clone, el);
  });


  // ── Desktop dropdowns ────────────────────────────────────────
  // CSS handles hover (custom.css). JS handles click and closes on outside click.
  // Must query AFTER the clone-replace above so we get the fresh elements.

  document.querySelectorAll('.w-dropdown').forEach(function (dropdown) {
    var toggle = dropdown.querySelector('.w-dropdown-toggle');
    var list   = dropdown.querySelector('.w-dropdown-list');
    if (!toggle || !list) return;

    toggle.addEventListener('click', function (e) {
      e.stopPropagation(); // prevent document click from closing immediately
      var isOpen = dropdown.classList.contains('w--open');

      closeAllDropdowns();

      if (!isOpen) {
        dropdown.classList.add('w--open');
        list.classList.add('w--open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });


  // ── Mobile hamburger ─────────────────────────────────────────
  // Must query AFTER the clone-replace above.

  document.querySelectorAll('.w-nav-button').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation(); // prevent document click from closing immediately
      var nav  = this.closest('.w-nav');
      var menu = nav ? nav.querySelector('.w-nav-menu') : null;
      if (!menu) return;

      var isOpen = menu.classList.contains('w--open');
      menu.classList.toggle('w--open', !isOpen);
      this.classList.toggle('w--open', !isOpen);
      this.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Close mobile menu when a nav link inside it is tapped
  document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      closeAllMobileMenus();
    });
  });


  // ── Global close handlers ────────────────────────────────────

  // Click anywhere outside the nav closes everything
  document.addEventListener('click', function (e) {
    closeAllDropdowns();
    if (!e.target.closest('.w-nav')) {
      closeAllMobileMenus();
    }
  });

  // Escape key closes everything
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAllDropdowns();
      closeAllMobileMenus();
    }
  });


  // ── Helpers ──────────────────────────────────────────────────

  function closeAllDropdowns() {
    document.querySelectorAll('.w-dropdown.w--open').forEach(function (d) {
      d.classList.remove('w--open');
      var list   = d.querySelector('.w-dropdown-list');
      var toggle = d.querySelector('.w-dropdown-toggle');
      if (list)   list.classList.remove('w--open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  function closeAllMobileMenus() {
    document.querySelectorAll('.w-nav-menu.w--open').forEach(function (menu) {
      menu.classList.remove('w--open');
    });
    document.querySelectorAll('.w-nav-button.w--open').forEach(function (btn) {
      btn.classList.remove('w--open');
      btn.setAttribute('aria-expanded', 'false');
    });
  }

});
