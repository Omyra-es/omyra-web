// Datos globales. Cambiar aquí se refleja en toda la web.
export const site = {
  name: 'Omyra',
  url: 'https://omyra.es',
  description:
    'Software de reservas online y gestión de citas para negocios que trabajan con cita previa: agenda, equipo, clientes, pagos, bonos, promociones y facturación.',
  locale: 'es_ES',
  contact: {
    email: 'hola@omyra.es',
    supportEmail: 'servicioclientes@omyra.es', // solo para clientes ya dados de alta
    phone: '+34 624 27 04 77',
    phoneHref: 'tel:+34624270477',
    whatsappHref: 'https://wa.me/34624270477',
    location: 'Madrid, España',
  },
};

export const nav = [
  { label: 'Funcionalidades', href: '/funcionalidades' },
  { label: 'Reservas online', href: '/reservas-online' },
  { label: 'Gestión del negocio', href: '/gestion-del-negocio' },
  { label: 'Precios', href: '/precios' },
  { label: 'Contacto', href: '/contacto' },
];

// Botones de toda la web. Cambiar aquí el texto o la dirección se refleja en todas las páginas.
export const cta = {
  start: { label: 'Empieza ahora', short: 'Empieza', href: '/empieza' },
  buy: { label: 'Contratar Omyra', href: '/empieza' },
  demo: { label: 'Solicitar una demo', href: '/contacto' },
  discover: { label: 'Descubrir Omyra', href: '/funcionalidades' },
};

export const legal = [
  { label: 'Aviso legal', href: '/aviso-legal' },
  { label: 'Privacidad', href: '/privacidad' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Condiciones de contratación', href: '/condiciones-de-contratacion' },
  { label: 'Encargo del tratamiento', href: '/encargo-del-tratamiento' },
];

// Formulario de demo. Conexión con HubSpot pendiente de revisar el portal.
// ID del portal y del formulario: datos públicos, no secretos. Envío directo, sin script de seguimiento.
export const hubspot = {
  portalId: '149137748' as string | null, // portal HubSpot de Omyra (centro de datos UE)
  formId: 'a18c31d2-a5aa-46a0-a8ea-9c0f17253cc3' as string | null, // «Solicitud de demo · Web»
  endpoint: 'https://api-eu1.hsforms.com/submissions/v3/integration/submit',
};

// Calendly (plan gratuito): enlace público del evento de demo, por ejemplo 'https://calendly.com/omyra/demo'.
// Mientras sea null, la página de contacto muestra solo el formulario.
export const calendly = {
  url: 'https://calendly.com/reuniones-omyra/30min' as string | null,
};

// Alta online (/empieza). Contrato con la app de Omyra: docs/alta-autonoma/ALTA-ONLINE.md.
// Mientras endpoint sea null, el formulario funciona pero no envía nada y anuncia que el alta abre muy pronto.
export const signup = {
  endpoint: null as string | null, // p. ej. 'https://app.omyra.es/api/public/signup'
  termsVersion: '2026-11',
  plan: 'omyra-mensual',
  loginUrl: 'https://clientes.omyra.es' as string | null, // entrada a la app, para «ya existe una cuenta»
  // Mientras no haya endpoint: enlace de pago de Stripe (Payment Link). Al pulsar «Ir al pago» se abre con el
  // correo ya puesto. Ojo: así la cuenta NO se crea sola al pagar (ver ALTA-ONLINE.md).
  // Prueba: 'https://buy.stripe.com/test_cNi4grgJvgNu6II8Tb2wU00' · Real: 'https://buy.stripe.com/cNi3cn8cZ9l2d76glD2wU01'
  paymentLink: 'https://buy.stripe.com/cNi3cn8cZ9l2d76glD2wU01' as string | null,
  // Después de pagar, Stripe vuelve a omyra.es/gracias?session_id={CHECKOUT_SESSION_ID} y desde ahí se lleva al
  // cliente a su cuenta. Poner aquí la página de bienvenida de la app (p. ej. 'https://app.omyra.es/bienvenida').
  // Obligatorio antes de publicar: sin esta dirección la página de gracias no puede llevar a la cuenta.
  appWelcomeUrl: 'https://clientes.omyra.es' as string | null,
};

// Altas a medias: formulario de HubSpot «Alta iniciada · Web» (campos: email, firstname, lastname,
// phone, company, paso_del_alta y origen_del_alta). Mientras sea null, no se envía.
export const hubspotSignup = {
  formId: '11190f17-b3bb-4dd9-b24f-fee44d58cd8b' as string | null,
};
