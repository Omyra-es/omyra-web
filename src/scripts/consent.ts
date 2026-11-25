// Consentimiento de cookies y píxeles publicitarios (Meta y TikTok).
// Nada de Meta ni de TikTok se carga hasta que la persona acepta «Publicidad y medición».
// Mientras no ha elegido, los eventos de la página se guardan en memoria (no salen del navegador) y se envían
// solo si acepta en esta misma visita. Si rechaza, se descartan.

type Ids = { meta: string | null; tiktok: string | null };
type Params = Record<string, string | number | undefined>;
type Ev = { name: string; params?: Params; id?: string };

const KEY = 'omyra-consent';
const MAX_AGE = 1000 * 60 * 60 * 24 * 365; // se vuelve a preguntar a los 12 meses
const VERSION = 1;

declare global {
  interface Window {
    fbq?: any; _fbq?: any; ttq?: any; TiktokAnalyticsObject?: string;
    omyraTrack?: (name: string, params?: Params, eventId?: string) => void;
    omyraCookies?: { open: () => void };
    __omyraQ?: [string, Params | undefined, string | undefined][];
  }
}

const ids: Ids = (() => {
  try { return JSON.parse(document.getElementById('px-cfg')?.textContent || '{}'); } catch { return { meta: null, tiktok: null }; }
})();
const enabled = Boolean(ids.meta || ids.tiktok);

function read(): boolean | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!c || c.v !== VERSION || Date.now() - c.ts > MAX_AGE) return null;
    return Boolean(c.ads);
  } catch { return null; }
}
function write(ads: boolean) {
  try { localStorage.setItem(KEY, JSON.stringify({ v: VERSION, ads, ts: Date.now() })); } catch { /* sin almacenamiento: se vuelve a preguntar */ }
}

// ---- Píxeles (código base oficial de cada proveedor, cargado de forma asíncrona) ----
let loaded = false;
function loadPixels() {
  if (loaded) return;
  loaded = true;
  if (ids.meta) {
    /* eslint-disable */
    (function (f: any, b: Document, e: string, v: string) {
      if (f.fbq) return;
      const n: any = (f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); });
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      const t = b.createElement(e) as HTMLScriptElement; t.async = true; t.src = v;
      b.head.appendChild(t);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', ids.meta);
    window.fbq('track', 'PageView');
  }
  if (ids.tiktok) {
    (function (w: any, d: Document, t: string) {
      w.TiktokAnalyticsObject = t;
      const ttq: any = (w[t] = w[t] || []);
      ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent'];
      ttq.setAndDefer = function (o: any, m: string) { o[m] = function () { o.push([m].concat(Array.prototype.slice.call(arguments, 0))); }; };
      for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (id: string) { const e = ttq._i[id] || []; for (let n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e; };
      ttq.load = function (id: string, opts?: any) {
        const u = 'https://analytics.tiktok.com/i18n/pixel/events.js';
        ttq._i = ttq._i || {}; ttq._i[id] = []; ttq._i[id]._u = u; ttq._t = ttq._t || {}; ttq._t[id] = +new Date(); ttq._o = ttq._o || {}; ttq._o[id] = opts || {};
        const s = d.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = `${u}?sdkid=${id}&lib=${t}`;
        d.head.appendChild(s);
      };
    })(window, document, 'ttq');
    window.ttq.load(ids.tiktok);
    window.ttq.page();
  }
}

// ---- Eventos: mismo nombre lógico para los dos proveedores ----
// Nombres de Meta → TikTok. Los que no están aquí se envían como evento propio con el mismo nombre.
const META_STD = new Set(['ViewContent', 'Lead', 'InitiateCheckout', 'Purchase', 'CompleteRegistration']);
const TO_TIKTOK: Record<string, string | null> = {
  ViewContent: 'ViewContent', Lead: 'SubmitForm', LeadDemo: 'Contact', InitiateCheckout: 'InitiateCheckout',
  Purchase: 'CompletePayment', CompleteRegistration: null, UsoCalculadora: 'UsoCalculadora',
};

// Producto que se mide en la vista del alta, el paso al pago y el alta pagada.
const PRODUCT_ID = 'omyra-plan-mensual';
const WITH_PRODUCT = new Set(['ViewContent', 'InitiateCheckout', 'Purchase']);

function send(ev: Ev) {
  const p = Object.fromEntries(Object.entries(ev.params || {}).filter(([, v]) => v !== undefined && v !== ''));
  const product = WITH_PRODUCT.has(ev.name);
  if (ids.meta && window.fbq) {
    const name = ev.name === 'LeadDemo' ? 'Lead' : ev.name;
    const opts = ev.id ? { eventID: ev.id } : undefined;
    const mp = product ? { ...p, content_ids: [PRODUCT_ID], content_type: 'product' } : p;
    if (META_STD.has(name)) window.fbq('track', name, mp, opts); else window.fbq('trackCustom', name, mp, opts);
  }
  if (ids.tiktok && window.ttq) {
    const name = ev.name in TO_TIKTOK ? TO_TIKTOK[ev.name] : ev.name;
    const tp = product ? { ...p, content_id: PRODUCT_ID, content_type: 'product' } : p;
    if (name) window.ttq.track(name, tp, ev.id ? { event_id: ev.id } : undefined);
  }
}

let state: boolean | null = enabled ? read() : false;
const pending: Ev[] = [];
window.omyraTrack = (name, params, id) => {
  if (!enabled || state === false) return;
  if (state === true) send({ name, params, id }); else pending.push({ name, params, id });
};
// Eventos que las páginas lanzaron antes de que este script se cargara.
(window.__omyraQ || []).splice(0).forEach(([n, p, i]) => window.omyraTrack!(n, p, i));

function grant() {
  state = true;
  loadPixels();
  pending.splice(0).forEach(send);
}
function revoke(wasGranted: boolean) {
  state = false;
  pending.length = 0;
  // Borra las cookies propias que dejan los píxeles en omyra.es y recarga para descargar sus scripts.
  const host = location.hostname.replace(/^www\./, '');
  for (const c of document.cookie.split(';').map((s) => s.split('=')[0].trim())) {
    if (/^(_fbp|_fbc|_ttp|_tt_enable_cookie|ttcsid)/.test(c)) {
      for (const dom of ['', `; domain=${host}`, `; domain=.${host}`]) document.cookie = `${c}=; Max-Age=0; path=/${dom}`;
    }
  }
  if (wasGranted && loaded) location.reload();
}

// ---- Banner y panel ----
const banner = document.getElementById('ck-banner');
const panel = document.getElementById('ck-panel') as HTMLDialogElement | null;
const adsBox = document.getElementById('ck-ads') as HTMLInputElement | null;

function hideBanner() { if (banner) banner.hidden = true; document.documentElement.classList.remove('ck-open'); }
function choose(ads: boolean) {
  const before = state;
  write(ads);
  hideBanner();
  panel?.open && panel.close();
  if (ads) grant(); else revoke(before === true);
}
function openPanel() {
  if (!panel) return;
  if (adsBox) adsBox.checked = state === true;
  if (typeof panel.showModal === 'function') panel.showModal(); else panel.setAttribute('open', '');
}
window.omyraCookies = { open: openPanel };

document.querySelectorAll<HTMLElement>('[data-ck]').forEach((el) => el.addEventListener('click', (e) => {
  const a = el.dataset.ck;
  if (a === 'accept') choose(true);
  else if (a === 'reject') choose(false);
  else if (a === 'settings') { e.preventDefault(); openPanel(); }
  else if (a === 'save') choose(Boolean(adsBox?.checked));
  else if (a === 'close') panel?.close();
}));

if (enabled) {
  if (state === null) { if (banner) { banner.hidden = false; document.documentElement.classList.add('ck-open'); } }
  else if (state === true) grant();
} else {
  // Sin píxeles configurados no hay nada que consentir: no se muestra el banner.
  document.querySelectorAll<HTMLElement>('[data-ck-only]').forEach((el) => (el.hidden = true));
}

export {};
