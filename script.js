/* ============================================================
   PORTFOLIO — Andy Setiawan  |  script.js
   ============================================================ */

/* ── 1. THEME: apply saved preference immediately (no flash) ─ */
(function () {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

/* ── 2. THEME TOGGLE ─────────────────────────────────────── */
function toggleTheme() {
  const current  = document.documentElement.getAttribute('data-theme');
  const next     = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

/* ── 3. HAMBURGER MENU ───────────────────────────────────── */
function toggleMenu() {
  const menu = document.querySelector('.menu-links');
  const icon = document.querySelector('.hamburger-icon');
  if (!menu || !icon) return;
  menu.classList.toggle('open');
  icon.classList.toggle('open');
}

/* Close menu when clicking outside */
document.addEventListener('click', function (e) {
  const menu = document.querySelector('.menu-links');
  const icon = document.querySelector('.hamburger-icon');
  if (!menu || !icon) return;
  if (!menu.contains(e.target) && !icon.contains(e.target)) {
    menu.classList.remove('open');
    icon.classList.remove('open');
  }
});
