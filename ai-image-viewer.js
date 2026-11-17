(() => {
  const dialog = document.querySelector('#ai-image-viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('.ai-viewer-stage img');
  const title = dialog.querySelector('#ai-image-title');
  const sizeButton = dialog.querySelector('[data-ai-size]');
  const stage = dialog.querySelector('.ai-viewer-stage');
  let opener;
  let previousOverflow;
  document.querySelectorAll('[data-ai-image]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      title.textContent = image.alt;
      dialog.classList.remove('is-original');
      sizeButton.textContent = '原尺寸';
      sizeButton.setAttribute('aria-pressed', 'false');
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      stage.scrollTo(0, 0);
    });
  });
  sizeButton.addEventListener('click', () => {
    const original = dialog.classList.toggle('is-original');
    sizeButton.textContent = original ? '适应屏幕' : '原尺寸';
    sizeButton.setAttribute('aria-pressed', String(original));
    stage.scrollTo(0, 0);
  });
  dialog.querySelector('[data-ai-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    image.removeAttribute('src');
    opener?.focus({ preventScroll: true });
  });
})();
