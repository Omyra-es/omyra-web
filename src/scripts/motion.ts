// Movimiento con propósito. Sin librerías. Respeta prefers-reduced-motion.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1) Aparición al entrar en pantalla
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }),
  { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
);
document.querySelectorAll('.reveal, .mark, [data-in]').forEach((el) => io.observe(el));

// 2) Vídeos: cargar y reproducir solo cuando son visibles, pausar fuera
const vio = new IntersectionObserver((entries) => entries.forEach((e) => {
  const v = e.target as HTMLVideoElement;
  if (e.isIntersecting && !reduce) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
}), { threshold: 0.3 });
document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]').forEach((v) => vio.observe(v));

// 3) Cabecera: compacta al desplazarse
const header = document.querySelector<HTMLElement>('.hdr');
const onScroll = () => header?.classList.toggle('is-scrolled', scrollY > 24);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

// 4) Menú móvil
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const panel = document.getElementById('menu-movil');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  panel?.toggleAttribute('data-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
panel?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle?.click()));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') { toggle.click(); toggle.focus(); } });

// 5) Pestañas accesibles con indicador deslizante
document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const ink = root.querySelector<HTMLElement>('.tabs__ink');
  const select = (t: HTMLButtonElement, focus = false) => {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')!)?.toggleAttribute('hidden', !on);
    });
    if (ink) { ink.style.width = `${t.offsetWidth}px`; ink.style.transform = `translateX(${t.offsetLeft}px)`; }
    if (focus) t.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      const k = e.key; let n = -1;
      if (k === 'ArrowRight') n = (i + 1) % tabs.length; else if (k === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length; else if (k === 'Home') n = 0; else if (k === 'End') n = tabs.length - 1;
      if (n >= 0) { e.preventDefault(); select(tabs[n], true); }
    });
  });
  const init = () => select(tabs.find((t) => t.getAttribute('aria-selected') === 'true') ?? tabs[0]);
  init(); addEventListener('resize', init);
});

// 6) Agenda que se completa con el scroll (fallback sin animation-timeline)
const fill = document.querySelectorAll<HTMLElement>('[data-fill]');
if (fill.length) {
  const fio = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); fio.unobserve(e.target); }
  }), { threshold: 0.35 });
  fill.forEach((f) => fio.observe(f));
}

// 7) Cinta de sectores: botón de pausa
document.querySelectorAll<HTMLButtonElement>('[data-marquee-toggle]').forEach((b) => b.addEventListener('click', () => {
  const m = b.closest('.marquee'); const paused = m?.classList.toggle('is-paused');
  b.setAttribute('aria-pressed', String(!!paused)); b.textContent = paused ? 'Reanudar' : 'Pausar';
}));
