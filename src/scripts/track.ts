// Envía un evento de medición (Meta y TikTok) respetando el consentimiento.
// Si el script de consentimiento aún no se ha cargado, el evento espera en una cola en memoria.
type Params = Record<string, string | number | undefined>;
declare global { interface Window { __omyraQ?: [string, Params | undefined, string | undefined][] } }

export function track(name: string, params?: Params, eventId?: string) {
  if (typeof window.omyraTrack === 'function') window.omyraTrack(name, params, eventId);
  else (window.__omyraQ ||= []).push([name, params, eventId]);
}

/** Etiquetas UTM guardadas al entrar (scripts/source.ts), para añadirlas a los eventos de alta y demo. */
export function utm(): Params {
  try {
    const o = JSON.parse(sessionStorage.getItem('omyra-origen') || '{}');
    return { utm_source: o.utm_source, utm_medium: o.utm_medium, utm_campaign: o.utm_campaign, utm_content: o.utm_content };
  } catch { return {}; }
}

/** Una sola vez por visita (o para siempre con `persist`), por clave. */
export function once(key: string, persist = false): boolean {
  const k = `omyra-px-${key}`;
  try {
    const store = persist ? localStorage : sessionStorage;
    if (store.getItem(k)) return false;
    store.setItem(k, '1');
  } catch { /* sin almacenamiento: se envía igualmente */ }
  return true;
}
