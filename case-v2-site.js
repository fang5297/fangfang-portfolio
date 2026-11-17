const progress = document.querySelector('.progress span');
const revealItems = document.querySelectorAll('.reveal');
const backToTop = document.querySelector('.back-to-top');

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) {
    progress.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
  }
  if (backToTop) {
    const isPastThreshold = window.scrollY > window.innerHeight * 1.5;
    backToTop.classList.toggle('is-visible', isPastThreshold);
    backToTop.setAttribute('aria-hidden', String(!isPastThreshold));
    backToTop.tabIndex = isPastThreshold ? 0 : -1;
  }
}

window.addEventListener('scroll', updateProgress, { passive: true });
if (backToTop) {
  backToTop.addEventListener('click', () => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.scrollTo({ top: 0, behavior });
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

updateProgress();

const caseStoryline = document.querySelector('.case-ai-vercel .design-storyline');
if (caseStoryline) {
  const caseStorylineLinks = [...caseStoryline.querySelectorAll('a')];
  const syncStoryline = () => {
    const currentHash = window.location.hash;
    const currentSection = currentHash === '#interaction' ? 1 : currentHash === '#assistant' ? 2 : 0;
    caseStorylineLinks.forEach((link, index) => {
      const isCurrent = currentHash === '#decisions' || currentHash === '#interaction' || currentHash === '#assistant'
        ? index === currentSection
        : index === 0;
      link.classList.toggle('is-current', isCurrent);
    });
  };
  window.addEventListener('hashchange', syncStoryline);
  syncStoryline();
}
