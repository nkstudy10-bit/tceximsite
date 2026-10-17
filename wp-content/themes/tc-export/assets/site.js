(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const closeMenu = () => {
    toggle?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const wasOpen = toggle?.getAttribute('aria-expanded') === 'true';
      closeMenu();
      document.querySelectorAll('.nav-products[open]').forEach(detail => {
        detail.open = false;
        if (!wasOpen) detail.querySelector('summary').focus();
      });
      if (wasOpen) toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    document.querySelectorAll('.nav-products[open]').forEach(detail => {
      if (!detail.contains(event.target)) detail.open = false;
    });
    if (!event.target.closest('.site-header')) closeMenu();
  });
  matchMedia('(min-width: 961px)').addEventListener('change', closeMenu);
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  const applyFilter = button => {
    const category = button.dataset.filter;
    let count = 0;
    filters.forEach(filter => {
      filter.classList.toggle('active', filter === button);
      filter.setAttribute('aria-pressed', String(filter === button));
    });
    cards.forEach(card => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
      if (!card.hidden) count++;
    });
    const sourcing = document.querySelector('[data-sourcing-card]');
    if (sourcing) sourcing.hidden = category !== 'all';
    const status = document.querySelector('#filter-status');
    if (status) status.textContent = `${count} ${count === 1 ? 'product' : 'products'} shown`;
  };
  filters.forEach(button => button.addEventListener('click', () => applyFilter(button)));
  const initial = filters.find(button => button.classList.contains('active'));
  if (initial) applyFilter(initial);
  document.querySelector('.form-error-summary')?.focus();
  const form = document.querySelector('#quote-form form');
  form?.addEventListener('submit', () => {
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Saving your enquiry…';
  });
  window.addEventListener('pageshow', () => {
    const submit = form?.querySelector('button[type="submit"]');
    if (submit?.disabled) { submit.disabled = false; submit.textContent = 'Send my enquiry →'; }
  });
  const reels = document.querySelector('.reels-carousel');
  if (reels) {
    const track = reels.querySelector('.reels-track');
    const prev = reels.querySelector('.reels-prev');
    const next = reels.querySelector('.reels-next');
    const videos = [...track.querySelectorAll('video')];
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const updateNav = () => {
      const max = track.scrollWidth - track.clientWidth;
      prev.hidden = track.scrollLeft <= 1;
      next.hidden = track.scrollLeft >= max - 1;
    };
    const step = direction => track.scrollBy({ left: direction * track.clientWidth * 0.8 });
    prev.addEventListener('click', () => step(-1));
    next.addEventListener('click', () => step(1));
    track.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav);
    updateNav();
    const tryPlay = video => video.play().catch(() => {});
    if (!reducedMotion && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) tryPlay(entry.target);
        else entry.target.pause();
      }), { threshold: 0.5 });
      videos.forEach(video => observer.observe(video));
    }
    videos.forEach(video => video.addEventListener('click', () => (video.paused ? tryPlay(video) : video.pause())));
    track.querySelectorAll('.reel-sound').forEach(button => button.addEventListener('click', () => {
      const video = button.parentElement.querySelector('video');
      const unmute = video.muted;
      videos.forEach(other => { other.muted = true; });
      track.querySelectorAll('.reel-sound').forEach(other => {
        other.setAttribute('aria-pressed', 'false');
        other.setAttribute('aria-label', 'Turn sound on');
      });
      if (unmute) {
        video.muted = false;
        button.setAttribute('aria-pressed', 'true');
        button.setAttribute('aria-label', 'Turn sound off');
        tryPlay(video);
      }
    }));
  }
})();
