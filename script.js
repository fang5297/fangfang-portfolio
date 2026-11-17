/* Homepage content is visible by default. Navigation lives in portfolio-nav.js. */
(() => {
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
