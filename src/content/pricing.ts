// ÚNICA fuente del precio y sus condiciones. No duplicar cifras en las páginas.
export const pricing = {
  amount: '29,90',
  amountNumber: 29.9,
  currency: '€',
  currencyCode: 'EUR',
  tax: '+ IVA',
  period: 'al mes',
  get full() {
    return `${this.amount} ${this.currency} ${this.tax} ${this.period}`;
  },
  included: [
    'Todas las funcionalidades',
    'Profesionales ilimitados',
    'Sin comisiones de Omyra por reserva',
    'Sin comisiones de Omyra por pagos',
    'Sin coste de implementación',
    'Sin permanencia',
    'Sin paquetes ni sobrecostes de mensajes',
  ],
  thirdParty:
    'Stripe, Meta (WhatsApp) o tu banco pueden aplicar sus propias condiciones y tarifas, independientes de Omyra.',
};
