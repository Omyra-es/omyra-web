// Datos globales. Cambiar aquí se refleja en toda la web.
export const site = {
  name: 'Omyra',
  url: 'https://omyra.es',
  description:
    'Software de reservas online y gestión de citas para negocios que trabajan con cita previa: agenda, equipo, clientes, pagos, bonos, promociones y facturación.',
  locale: 'es_ES',
  contact: {
    email: 'hola@omyra.es',
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

export const cta = {
  demo: { label: 'Solicitar una demo', href: '/contacto' },
  discover: { label: 'Descubrir Omyra', href: '/funcionalidades' },
};

export const legal = [
  { label: 'Aviso legal', href: '/aviso-legal' },
  { label: 'Privacidad', href: '/privacidad' },
  { label: 'Cookies', href: '/cookies' },
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
