(function () {
  const media = window.harmonyCaseMedia || {};

  function renderMedia(node) {
    const id = String(node.dataset.media || '').padStart(2, '0');
    const item = media[id];
    if (!item) return;

    const hidePlaceholder = !item.src && node.dataset.empty === 'hidden';
    node.style.setProperty('--media-ratio', item.aspectRatio || '16 / 9');
    const figure = document.createElement('figure');
    figure.className = 'dc-media-figure';
    figure.setAttribute('aria-label', `图 ${id}｜${item.title}`);
    if (hidePlaceholder) figure.setAttribute('aria-hidden', 'true');

    const frame = document.createElement('div');
    frame.className = 'dc-media-frame';

    if (item.src) {
      const image = document.createElement('img');
      image.src = item.src;
      image.alt = item.alt || item.title;
      image.loading = 'lazy';
      image.style.objectFit = item.fit || 'cover';
      frame.appendChild(image);
    } else if (!hidePlaceholder) {
      const placeholder = document.createElement('div');
      placeholder.className = 'dc-placeholder';
      placeholder.innerHTML = `
        <span class="dc-placeholder-icon" aria-hidden="true">▧</span>
        <strong class="dc-placeholder-title"></strong>
      `;
      placeholder.querySelector('.dc-placeholder-title').textContent = item.title;
      frame.appendChild(placeholder);
    }

    figure.append(frame);
    if (!hidePlaceholder) {
      const caption = document.createElement('figcaption');
      caption.className = 'dc-media-caption';
      caption.textContent = `图 ${id}｜${item.title}`;
      figure.append(caption);
    }
    node.replaceChildren(figure);
  }

  document.querySelectorAll('[data-media]').forEach(renderMedia);

  const narrativeLabels = {
    '#chapter-6 .dc-kicker': '06 / DEEP CASE A · SUPPORT EXPERIENCE',
    '#chapter-7 .dc-kicker': '07 / DEEP CASE B · COMMUNITY EXPERIENCE',
    '#chapter-8 .dc-kicker': '08 / COLLABORATION & PUSH',
    '#chapter-9 .dc-kicker': '09 / RESULTS & TIMELINE',
    '#chapter-10 .dc-kicker': '10 / REFLECTION & REUSE'
  };
  Object.entries(narrativeLabels).forEach(([selector, label]) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = label;
  });

  const progress = document.querySelector('.dc-progress span');
  const topButton = document.querySelector('.dc-top');
  const navLinks = [...document.querySelectorAll('.dc-nav nav a[href^="#"]')];
  const navSections = navLinks
    .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter((item) => item.section);

  function updateCurrentSection() {
    const offset = document.querySelector('.dc-nav')?.getBoundingClientRect().bottom || 0;
    const current = navSections.filter(({ section }) => section.getBoundingClientRect().top <= offset + 48).at(-1);
    const visibleLink = current && getComputedStyle(current.link).display !== 'none'
      ? current.link
      : navSections.slice(0, current ? navSections.indexOf(current) + 1 : 1)
        .map(({ link }) => link)
        .filter((link) => getComputedStyle(link).display !== 'none')
        .at(-1);

    navLinks.forEach((link) => {
      if (link === visibleLink) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  const updateScrollState = () => {
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${pageHeight > 0 ? window.scrollY / pageHeight : 0})`;
    if (topButton) {
      const visible = window.scrollY > window.innerHeight * 1.15;
      topButton.classList.toggle('is-visible', visible);
      topButton.setAttribute('aria-hidden', String(!visible));
      topButton.tabIndex = visible ? 0 : -1;
    }
    updateCurrentSection();
  };
  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  if (topButton) {
    topButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  }

  const revealItems = document.querySelectorAll('[data-reveal]');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    revealItems.forEach((item) => observer.observe(item));
  }
})();
