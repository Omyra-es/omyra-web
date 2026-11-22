// Formato español para mostrar resultados. Solo aquí se redondea.
const eurFmt = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true });
const pctFmt = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const intFmt = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0, useGrouping: true });

// Intl en es-ES no agrupa los miles de 4 cifras (1500): lo forzamos para que se lea «1.500,00 €».
const group = (s: string) => s.replace(/^(-?\d{1,3})(\d{3})(?=,|$)/, '$1.$2');

export const eur = (n: number) => `${group(eurFmt.format(Math.abs(n) < 0.005 ? 0 : n)).replace("-", "−")}\u00a0€`;
export const pct1 = (n: number) => `${pctFmt.format(n)}\u00a0%`;
export const int = (n: number) => group(intFmt.format(n));
/** Descuento máximo: redondeado hacia abajo a número entero. */
export const pctFloor = (fraction: number) => `${Math.floor(fraction * 100 + 1e-9)}\u00a0%`;
export const pctPlain = (fraction: number) => `${+(fraction * 100).toFixed(1)}`.replace('.', ',') + "\u00a0%";

export function duration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function hours(h: number) {
  return Number.isInteger(h) ? `${int(h)} h` : `${pctFmt.format(h)} h`;
}

/** Acepta «40», «40,5», «40.5» y «1.500» o «1.500,50». Devuelve NaN si no es un número. */
export function parseNum(raw: string): number {
  let s = raw.trim().replace(/\s|€|%/g, '');
  if (!s) return NaN;
  if (s.includes(',') && s.includes('.')) s = s.replace(/\./g, '').replace(',', '.');
  else if (s.includes(',')) s = s.replace(',', '.');
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  return /^-?\d*\.?\d+$/.test(s) ? Number(s) : NaN;
}
