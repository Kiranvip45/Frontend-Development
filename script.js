// Gallery + Lightbox + Filters + Keyboard navigation
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose = document.getElementById('lb-close');
  const lbNext = document.getElementById('lb-next');
  const lbPrev = document.getElementById('lb-prev');

  // Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      items.forEach(it => {
        if(f === 'all') it.classList.remove('hidden');
        else it.classList.toggle('hidden', it.dataset.category !== f);
      });
    });
  });

  // Build a function that returns visible image nodes in current filter
  function getVisibleImages(){
    return Array.from(document.querySelectorAll('.gallery-item:not(.hidden) img'));
  }

  // Open lightbox with index within visible images
  let visibleImgs = [];
  let currentIndex = 0;
  function openLightboxFromImg(imgEl){
    visibleImgs = getVisibleImages();
    currentIndex = visibleImgs.indexOf(imgEl);
    if(currentIndex < 0) currentIndex = 0;
    showLightbox();
  }

  function showLightbox(){
    const imgEl = visibleImgs[currentIndex];
    if(!imgEl) return;
    lbImg.src = imgEl.src;
    lbImg.alt = imgEl.alt || '';
    lbCaption.textContent = imgEl.dataset.title || imgEl.alt || '';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function next(){
    visibleImgs = getVisibleImages();
    currentIndex = (currentIndex + 1) % visibleImgs.length;
    showLightbox();
  }
  function prev(){
    visibleImgs = getVisibleImages();
    currentIndex = (currentIndex - 1 + visibleImgs.length) % visibleImgs.length;
    showLightbox();
  }

  // attach click handlers to every image
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', (e) => openLightboxFromImg(e.currentTarget));
  });

  // lightbox buttons
  lbClose.addEventListener('click', closeLightbox);
  lbNext.addEventListener('click', next);
  lbPrev.addEventListener('click', prev);

  // click outside image closes
  lightbox.addEventListener('click', (e) => {
    if(e.target === lightbox) closeLightbox();
  });

  // keyboard nav
  document.addEventListener('keydown', (e) => {
    if(lightbox.getAttribute('aria-hidden') === 'false'){
      if(e.key === 'ArrowRight') { next(); e.preventDefault(); }
      if(e.key === 'ArrowLeft') { prev(); e.preventDefault(); }
      if(e.key === 'Escape') { closeLightbox(); }
    }
  });
});
