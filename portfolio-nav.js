/* One navigation behavior shared by the homepage and case studies. */
(() => {
  const header = document.querySelector('.portfolio-header');
  if (!header) return;
  const button = header.querySelector('.portfolio-menu');
  const nav = header.querySelector('nav');
  const mobile = window.matchMedia('(max-width: 900px)');
  const setOpen = (open) => {
    header.classList.toggle('is-open', open);
    document.body.classList.toggle('portfolio-menu-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
  };
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    setOpen(false);
    if (link.hash && link.pathname === location.pathname) {
      const target = document.getElementById(link.hash.slice(1));
      if (target && mobile.matches) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    }
  });
  document.addEventListener('keydown', (event) => {
    if (button.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { setOpen(false); button.focus(); }
    if (event.key === 'Tab') {
      const items = [button, ...nav.querySelectorAll('a')];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  document.addEventListener('click', (event) => { if (!header.contains(event.target)) setOpen(false); });
  mobile.addEventListener('change', () => setOpen(false));
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1)));
  const update = () => {
    header.classList.toggle('is-scrolled', scrollY > 24);
    let current = -1;
    sections.forEach((section, index) => { if (section && section.getBoundingClientRect().top <= 180) current = index; });
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  let pending = false;
  window.addEventListener('scroll', () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { update(); pending = false; });
  }, { passive: true });
  update();
})();
