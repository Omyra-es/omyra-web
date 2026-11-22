// Configuración de la calculadora.
// El bloque «Black Friday sin miedo» y la línea «Prepara tu Black Friday» se muestran hasta el 30/11/2026 incluido
// y desaparecen solos a partir del 1/12/2026 (hora de Madrid).
export const BF_END = new Date('2026-12-01T00:00:00+01:00');

// Valores iniciales (los del caso de ejemplo de la especificación).
export const DEFAULTS = {
  name: '',
  price: 40,
  includesVat: true,
  vatPct: 21,
  prepMin: 10,
  serviceMin: 60,
  cleanMin: 10,
  adminMin: 10,
  materials: 5,
  consumables: 2,
  otherVariable: 1,
  fixedMonthly: 500,
  servicesPerMonth: 100,
  hourlyTarget: 15,
  promoType: 'pct' as 'pct' | 'eur' | 'fixed',
  pct: 20,
  eur: 8,
  fixed: 32,
  monthly: 1500,
};

export type CalcState = typeof DEFAULTS & { mode: 'promocion' | 'precios' };

// Límites de validación: [mínimo, máximo, mensaje]
export const LIMITS: Record<string, [number, number, string]> = {
  price: [1, 2000, 'Escribe un precio entre 1 y 2.000 €'],
  vatPct: [0, 30, 'El IVA tiene que estar entre 0 y 30 %'],
  prepMin: [0, 240, 'Entre 0 y 240 minutos'],
  serviceMin: [5, 600, 'Escribe la duración del servicio (de 5 a 600 minutos)'],
  cleanMin: [0, 240, 'Entre 0 y 240 minutos'],
  adminMin: [0, 240, 'Entre 0 y 240 minutos'],
  materials: [0, 1000, 'Escribe un importe entre 0 y 1.000 €'],
  consumables: [0, 1000, 'Escribe un importe entre 0 y 1.000 €'],
  otherVariable: [0, 1000, 'Escribe un importe entre 0 y 1.000 €'],
  fixedMonthly: [0, 100000, 'Escribe un importe entre 0 y 100.000 €'],
  servicesPerMonth: [1, 5000, 'Escribe cuántos servicios haces al mes (mínimo 1)'],
  hourlyTarget: [0, 500, 'Escribe un importe entre 0 y 500 €/h'],
  pct: [0, 60, 'El descuento tiene que estar entre 0 y 60 %'],
  eur: [0, Infinity, 'Escribe un descuento de 0 € o más'],
  fixed: [0, Infinity, 'Escribe un precio de 0 € o más'],
  monthly: [0, 100000, 'Escribe un importe entre 0 y 100.000 €'],
};

export const STORAGE_KEY = 'omyra-calculadora';
