/* Keep shared evidence links usable when their supporting material is folded. */
(() => {
  const findTarget = hash => {
    if (!hash || hash === '#') return null;
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
    catch { return null; }
  };
  const reveal = target => {
    let parent = target?.parentElement;
    while (parent) {
      if (parent.tagName === 'DETAILS') parent.open = true;
      parent = parent.parentElement;
    }
    // Preserve the previously shared link to the full AI strategy section.
    if (target?.id === 'strategy') target.querySelector('details')?.setAttribute('open', '');
  };
  const position = () => {
    const target = findTarget(location.hash);
    if (!target) return;
    reveal(target);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const offset = (document.querySelector('.portfolio-header')?.offsetHeight || 56) + 16;
      window.scrollTo({top: target.getBoundingClientRect().top + scrollY - offset, behavior:'instant'});
    }));
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.origin !== location.origin || link.pathname !== location.pathname) return;
    const target = findTarget(link.hash);
    if (target) reveal(target);
  });
  window.addEventListener('hashchange', position);
  window.addEventListener('load', position, {once:true});
  reveal(findTarget(location.hash));
})();
