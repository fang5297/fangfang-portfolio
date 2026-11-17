/* Keep evidence available without making it part of the initial reading path. */
(() => {
  const revealTarget = (hash, scroll = true) => {
    if (!hash || hash === '#') return;
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    let parent = target.parentElement;
    while (parent) {
      if (parent.tagName === 'DETAILS') parent.open = true;
      parent = parent.parentElement;
    }
    if (scroll) requestAnimationFrame(() => requestAnimationFrame(() => {
      const offset = (document.querySelector('.portfolio-header')?.offsetHeight || 64) + 16;
      window.scrollTo({top:target.getBoundingClientRect().top + scrollY - offset, behavior:'instant'});
    }));
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || !link.hash || link.origin !== location.origin || link.pathname !== location.pathname || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!document.getElementById(decodeURIComponent(link.hash.slice(1)))) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    revealTarget(link.hash);
  });
  window.addEventListener('hashchange', () => revealTarget(location.hash));
  window.addEventListener('load', () => revealTarget(location.hash), {once:true});
  revealTarget(location.hash);
})();
