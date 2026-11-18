// Guarda de dónde llega la visita (UTM de redes y anuncios, ref, página de entrada y referrer)
// durante la visita, para enviarlo con el alta. Solo la primera entrada de la sesión.
const KEY = 'omyra-origen';
try {
  if (!sessionStorage.getItem(KEY)) {
    const q = new URLSearchParams(location.search);
    const src: Record<string, string> = { page: location.pathname };
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ref']) {
      const v = q.get(k);
      if (v) src[k] = v.slice(0, 200);
    }
    if (document.referrer && !document.referrer.startsWith(location.origin)) src.referrer = document.referrer.slice(0, 500);
    sessionStorage.setItem(KEY, JSON.stringify(src));
  }
} catch { /* sin almacenamiento: el alta se envía sin origen */ }
