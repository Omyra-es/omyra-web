// Calculadora de rentabilidad y promociones · fórmulas puras (sin DOM).
// Todo se calcula con todos los decimales; solo se redondea al mostrar (ver format.ts).
// Vocabulario: ingresos (sin IVA), costes, remuneración y excedente estimado. Nunca «beneficio».

export type PromoType = 'pct' | 'eur' | 'fixed';
export type Mode = 'promocion' | 'precios';

export interface ServiceInput {
  price: number; // P, tal como lo escribe ella
  includesVat: boolean;
  vatRate: number; // i, en tanto por uno (0.21)
  prepMin: number; // tp
  serviceMin: number; // ts
  cleanMin: number; // tl
  adminMin: number; // tg
}

export interface CostInput {
  materials: number; // m
  consumables: number; // c
  otherVariable: number; // o
  fixedMonthly: number; // F
  servicesPerMonth: number; // N (mínimo 1)
  hourlyTarget: number; // Oh
}

export interface PromoInput {
  type: PromoType;
  pct: number; // d, en tanto por uno
  eur: number; // descuento en €, con o sin IVA según el precio
  fixed: number; // precio cerrado, con o sin IVA según el precio
}

export const totalMinutes = (s: ServiceInput) => s.prepMin + s.serviceMin + s.cleanMin + s.adminMin;
export const workHours = (s: ServiceInput) => totalMinutes(s) / 60;
export const netOf = (amount: number, s: ServiceInput) => (s.includesVat ? amount / (1 + s.vatRate) : amount);
export const grossOf = (net: number, s: ServiceInput) => net * (1 + s.vatRate);
export const variableCosts = (c: CostInput) => c.materials + c.consumables + c.otherVariable;
export const fixedPerService = (c: CostInput) => c.fixedMonthly / Math.max(1, c.servicesPerMonth);
export const allocatedCosts = (c: CostInput) => variableCosts(c) + fixedPerService(c);
export const targetPay = (s: ServiceInput, c: CostInput) => workHours(s) * c.hourlyTarget;
export const minNetPrice = (s: ServiceInput, c: CostInput) => allocatedCosts(c) + targetPay(s, c);

/** Precio promocional tal como lo escribe ella (con IVA si su precio lo incluye). Limitado a [0, P]. */
export function promoPrice(s: ServiceInput, p: PromoInput): number {
  const P = s.price;
  const raw = p.type === 'pct' ? P * (1 - p.pct) : p.type === 'eur' ? P - p.eur : p.fixed;
  return Math.min(P, Math.max(0, raw));
}

export interface Analysis {
  hours: number;
  netPrice: number; // Pb
  cv: number;
  gf: number;
  ca: number;
  ro: number;
  minNet: number;
  minGross: number;
  saleNet: number; // Ppb en promoción, Pb en precios
  saleShown: number; // Pp tal como lo escribe ella (o P en precios)
  available: number; // por servicio, después de costes asignados
  availablePerHour: number;
  diffVsTarget: number; // = excedente estimado
  status: 'above' | 'on' | 'below';
  coversVariable: boolean; // Ppb > CV
  extraAppointmentsPct: number | null; // null si no cubre costes variables
  maxDiscount: number; // tanto por uno, ≥ 0
  priceBelowMin: boolean; // el precio habitual ya está por debajo del mínimo
  emptySlotValue: number; // Pb − CV
}

const EPS = 0.005; // medio céntimo: «en tu objetivo»

export function analyze(mode: Mode, s: ServiceInput, c: CostInput, p: PromoInput): Analysis {
  const hours = workHours(s);
  const netPrice = netOf(s.price, s);
  const cv = variableCosts(c);
  const gf = fixedPerService(c);
  const ca = cv + gf;
  const ro = hours * c.hourlyTarget;
  const minNet = ca + ro;
  const saleShown = mode === 'promocion' ? promoPrice(s, p) : s.price;
  const saleNet = netOf(saleShown, s);
  const available = saleNet - ca;
  const diff = available - ro;
  const coversVariable = saleNet > cv;
  return {
    hours,
    netPrice,
    cv,
    gf,
    ca,
    ro,
    minNet,
    minGross: grossOf(minNet, s),
    saleNet,
    saleShown,
    available,
    availablePerHour: hours > 0 ? available / hours : 0,
    diffVsTarget: diff,
    status: Math.abs(diff) < EPS ? 'on' : diff > 0 ? 'above' : 'below',
    coversVariable,
    extraAppointmentsPct: coversVariable ? ((netPrice - cv) / (saleNet - cv) - 1) * 100 : null,
    maxDiscount: netPrice > 0 ? Math.max(0, 1 - minNet / netPrice) : 0,
    priceBelowMin: netPrice < minNet - EPS,
    emptySlotValue: netPrice - cv,
  };
}

/** Modo precios: citas y horas para un objetivo mensual con este servicio. */
export function monthlyGoal(a: Analysis, monthlyTarget: number) {
  const perService = a.netPrice - a.ca;
  if (perService <= 0) return null;
  const appointments = Math.ceil(monthlyTarget / perService - 1e-9);
  return { appointments, hours: appointments * a.hours };
}
