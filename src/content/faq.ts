import { pricing } from './pricing';

export type Faq = { q: string; a: string };

export const faq: Record<string, Faq> = {
  negocios: { q: '¿Para qué negocios es Omyra?', a: 'Para negocios que trabajan con citas: centros de estética, peluquerías, spas y centros de bienestar, fisioterapia, masajes, estudios de tatuaje, cuidado de mascotas y otros servicios con cita previa. Te enseñamos en la demo cómo encaja con tu forma de trabajar.' },
  precio: { q: '¿Cuánto cuesta?', a: `${pricing.full}. Un único plan con todas las funcionalidades, profesionales ilimitados y sin permanencia.` },
  marketplace: { q: '¿Omyra es un marketplace?', a: 'No. Omyra no es un directorio donde los clientes comparan negocios. Cada negocio tiene su propia página de reservas, con su logo, sus colores y sus servicios, y la comparte en sus canales: Instagram, WhatsApp, Google o su web.' },
  comisiones: { q: '¿Cobráis comisión por reserva o por pago?', a: 'No. Omyra no cobra comisiones por reserva ni por pago. Si activas Stripe, Stripe aplica sus propias tarifas por cada cobro con tarjeta.' },
  movil: { q: '¿Funciona en el móvil?', a: 'Sí. Desde el móvil consultas tu agenda, revisas tus clientes y recibes avisos de nuevas reservas. Funciona desde el navegador y puedes añadirla a la pantalla de inicio. La configuración completa del negocio se hace desde un ordenador.' },
  whatsapp: { q: '¿Cómo funciona el asistente de WhatsApp?', a: 'Conectas el WhatsApp Business de tu negocio y el asistente atiende las solicitudes de cita. Puedes elegir si responde solo a clientes registrados o a cualquier número. Si llega una consulta que no puede resolver, Omyra te muestra en el dashboard una alerta de mensajes que requieren tu atención, y la respondes desde WhatsApp Business. Los mensajes están sujetos a las condiciones de Meta; Omyra no vende paquetes de mensajes.' },
  profesionales: { q: '¿Hay límite de profesionales?', a: 'No. Puedes añadir a todo tu equipo sin coste adicional, cada profesional con sus servicios, su horario y sus ausencias.' },
  personalizar: { q: '¿Puedo personalizar mi página de reservas?', a: 'Sí. Tu página muestra tu logo, tus colores y tus servicios con foto, descripción, duración y precio. Tú decides qué servicios se pueden reservar online.' },
  valoracion: { q: '¿Puedo ofrecer una cita de valoración antes de un servicio?', a: 'Sí. Puedes crear un servicio de valoración, gratuito o de pago, para conocer lo que necesita cada cliente antes de planificar un trabajo más largo o complejo. La valoración la hace tu equipo.' },
  pagos: { q: '¿Qué diferencia hay entre el pago manual y Stripe?', a: 'Con el pago manual, el cliente paga por Bizum o transferencia, la cita queda pendiente y tú la confirmas al marcar «Pago recibido»; si vence el plazo, se cancela y el hueco se libera. Stripe permite cobrar con tarjeta al reservar y requiere activación.' },
  bonos: { q: '¿Puedo vender bonos y crear promociones?', a: 'Sí. Creas bonos de sesiones con precio y caducidad, y los asignas desde la ficha del cliente. Y creas códigos promocionales con descuento, fechas, servicios y límites de uso, que tus clientes introducen al reservar.' },
  facturacion: { q: '¿Puedo emitir facturas con Omyra?', a: 'Sí. Puedes crear facturas completas y simplificadas, con series, tipos de IVA y borradores, emitirlas con VERI*FACTU, descargarlas en PDF y exportarlas para tu gestoría.' },
  calendar: { q: '¿Se conecta con Google Calendar?', a: 'Sí. Cada profesional puede conectar su Google Calendar para ver allí sus citas de Omyra. La sincronización va de Omyra a Google: los eventos que crees en Google no se importan a Omyra.' },
  documentos: { q: '¿Puedo pedir que firmen consentimientos?', a: 'Sí. Puedes asociar documentos a servicios o a clientes, indicar si requieren firma y su caducidad, y Omyra puede solicitar la firma por enlace en los correos de la cita. Conserva el histórico de versiones.' },
  informes: { q: '¿Qué informes tiene Omyra?', a: 'Un informe diario con las citas, los cobros por método de pago, el valor de los servicios realizados, las sesiones de bono y los clientes nuevos, además de los indicadores del día en el dashboard y resúmenes por correo si los activas: uno diario cada mañana y otro semanal los lunes.' },
  permanencia: { q: '¿Hay permanencia?', a: 'No. Es una suscripción mensual sin permanencia y sin coste de implementación.' },
  demo: { q: '¿Cómo es la demo?', a: 'Una videollamada en la que te enseñamos Omyra con un negocio de ejemplo y resolvemos tus dudas sobre tu caso. Escríbenos o llámanos y la organizamos.' },
};

export const pick = (...keys: (keyof typeof faq)[]) => keys.map((k) => faq[k]);
