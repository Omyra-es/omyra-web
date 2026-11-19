// Páginas por sector (SEO). Solo funciones que Omyra tiene hoy: las mismas que se describen
// en /funcionalidades, /reservas-online y /gestion-del-negocio. Los servicios de ejemplo son
// ilustrativos: cada negocio crea los suyos.
import type { ImageMetadata } from 'astro';
import type { photos } from './photos';
import type { faq } from './faq';
import agendaDia from '../assets/producto/agenda-dia.jpg';
import clienteFicha from '../assets/producto/cliente-ficha.jpg';
import servicios from '../assets/producto/servicios.jpg';
import bono from '../assets/producto/bono-modal.jpg';
import documentos from '../assets/producto/documentos.jpg';
import senales from '../assets/producto/pagos-senales.jpg';
import promo from '../assets/producto/promo-modal.jpg';
import equipo from '../assets/producto/equipo.jpg';

type PhotoId = keyof typeof photos;
type FaqId = keyof typeof faq;
export type Point = { pain: string; t: string; d: string };
export type SectorPage = {
  slug: string;
  name: string; // nombre corto para enlaces
  title: string; // <title>
  description: string; // meta description
  eyebrow: string;
  h1: string;
  lead: string;
  photos: [PhotoId, PhotoId];
  points: Point[];
  shot: { img: ImageMetadata; alt: string; eyebrow: string; h: string; d: string; list: string[] };
  services: string[]; // ejemplos de catálogo
  faqs: FaqId[];
};

export const sectorPages: SectorPage[] = [
  {
    slug: 'software-para-peluquerias',
    name: 'Peluquerías y barberías',
    title: 'Programa de citas para peluquerías y barberías · Omyra',
    description: 'Software de reservas online y agenda para peluquerías y barberías: tu página de reservas con tu marca, agenda por estilista, ficha de cada cliente, señales, bonos y facturación. 29,90 € + IVA al mes.',
    eyebrow: 'Para peluquerías y barberías',
    h1: 'Tu peluquería, <span class="gold">abierta a reservas 24 h.</span>',
    lead: 'Tus clientes reservan corte, color o barba desde tu Instagram o tu WhatsApp a cualquier hora, con el estilista que prefieran, y la cita entra directa en tu agenda.',
    photos: ['peluqueria', 'barberia'],
    points: [
      { pain: '«¿Tienes hueco el sábado?» a medianoche.', t: 'Reservan solos, a cualquier hora', d: 'Tu página de reservas con tu logo y tus servicios. Solo ven los huecos libres según tus horarios.' },
      { pain: '«¿Me lo hace Marta?»', t: 'Cada estilista, con su agenda', d: 'Cada profesional con sus servicios y su horario, con hasta dos turnos al día. El cliente elige a quien quiere o «Cualquiera».' },
      { pain: 'Un color no dura lo mismo que un corte.', t: 'Cada servicio con su duración', d: 'Corte, color, mechas o arreglo de barba, cada uno con su duración y su precio, para que la agenda cuadre sola.' },
      { pain: '«La última vez, ¿qué tono usamos?»', t: 'La ficha de cada cliente', d: 'Historial de citas, notas internas, fotos y archivos. Lo que hiciste la última vez, a mano cuando vuelve.' },
      { pain: 'Un balayage que no se presenta.', t: 'Señal para los servicios largos', d: 'Pide una señal por Bizum o transferencia, o con tarjeta mediante Stripe, para asegurar las citas que lo necesitan.' },
      { pain: 'Clientes que quieres que vuelvan.', t: 'Bonos y códigos promocionales', d: 'Vende bonos de sesiones y crea códigos de descuento con fechas, servicios y límites de uso.' },
    ],
    shot: { img: agendaDia, alt: 'Agenda del día de Omyra con las citas de cada profesional', eyebrow: 'La agenda', h: 'Todo el equipo, <span class="gold-ink">de un vistazo.</span>', d: 'Las citas del día por profesional, cuántas están confirmadas y dónde queda hueco.', list: ['Ausencias y vacaciones sin cancelar citas', 'Festivos de tu localidad', 'Aviso en el móvil con cada nueva reserva', 'Sincronización con el Google Calendar de cada profesional'] },
    services: ['Corte de pelo', 'Color', 'Mechas y balayage', 'Peinado', 'Tratamiento capilar', 'Corte y arreglo de barba'],
    faqs: ['marketplace', 'profesionales', 'pagos', 'comisiones', 'movil', 'precio'],
  },
  {
    slug: 'software-para-centros-de-estetica',
    name: 'Centros de estética',
    title: 'Software para centros de estética · Reservas, fichas y consentimientos | Omyra',
    description: 'Programa de gestión para centros de estética: reservas online con tu marca, citas de valoración, consentimientos con firma por enlace, fotos en la ficha del cliente, bonos de sesiones y facturación con VERI*FACTU.',
    eyebrow: 'Para centros de estética',
    h1: 'Tu centro de estética, <span class="gold">en orden.</span>',
    lead: 'Reservas online con tu marca, la ficha completa de cada clienta con sus fotos y consentimientos, y los bonos de tratamiento controlados sesión a sesión.',
    photos: ['estetica', 'labios'],
    points: [
      { pain: '«Antes de reservar, ¿me lo puedes valorar?»', t: 'Citas de valoración', d: 'Ofrece una valoración previa, gratuita o de pago, como un servicio más que se reserva online.' },
      { pain: 'El consentimiento en papel, otra vez.', t: 'Consentimientos con firma por enlace', d: 'Asocia documentos a servicios o a clientes, con firma por enlace en los correos de la cita, caducidad e histórico de versiones.' },
      { pain: '«¿Cómo estaba antes del tratamiento?»', t: 'Fotos y notas en la ficha', d: 'Guarda fotos y archivos en la cita o en la ficha, junto al historial y tus notas internas.' },
      { pain: 'Tratamientos de varias sesiones.', t: 'Bonos de sesiones', d: 'Crea bonos con precio y caducidad, asígnalos desde la ficha. Cada bono se aplica a las sesiones de su servicio.' },
      { pain: 'Indicaciones que la clienta olvida.', t: 'Indicaciones antes de la cita', d: 'Si el servicio tiene instrucciones previas, le llegan con la confirmación, en texto o en documento.' },
      { pain: 'Una cabina vacía por un plantón.', t: 'Señales al reservar', d: 'Pide una señal en los servicios largos: pago manual que confirmas al recibirlo, o tarjeta con Stripe.' },
    ],
    shot: { img: documentos, alt: 'Documentos y consentimientos de Omyra con firma y caducidad', eyebrow: 'Documentos', h: 'Consentimientos, <span class="gold-ink">sin papeles.</span>', d: 'Cada documento ligado a su servicio o a su clienta, con su firma y su fecha.', list: ['Documentos que requieren firma o solo lectura', 'Firma por enlace en los correos de la cita', 'Caducidad de cada documento', 'Histórico de versiones'] },
    services: ['Limpieza facial', 'Tratamiento corporal', 'Depilación', 'Micropigmentación', 'Valoración previa', 'Bono de sesiones'],
    faqs: ['valoracion', 'documentos', 'bonos', 'pagos', 'facturacion', 'precio'],
  },
  {
    slug: 'software-para-fisioterapia',
    name: 'Fisioterapia',
    title: 'Programa de citas para fisioterapia · Agenda, bonos y facturas | Omyra',
    description: 'Software de citas para clínicas y centros de fisioterapia: agenda por fisioterapeuta, reservas online, bonos de sesiones, consentimientos con firma por enlace, recordatorios por correo y facturación con VERI*FACTU.',
    eyebrow: 'Para fisioterapia',
    h1: 'Más tiempo para tus pacientes, <span class="gold">menos para la agenda.</span>',
    lead: 'Tus pacientes piden cita online con su fisioterapeuta, controlas sus bonos de sesiones y emites las facturas desde el mismo panel.',
    photos: ['fisio', 'masaje'],
    points: [
      { pain: 'El teléfono suena en mitad de una sesión.', t: 'Citas online, a cualquier hora', d: 'Tu página de reservas con tus servicios y tu equipo. El paciente elige fisioterapeuta, fecha y hora.' },
      { pain: 'Cada fisio con su horario.', t: 'Agenda por fisioterapeuta', d: 'Cada profesional con sus servicios, sus turnos, sus ausencias y los festivos de tu localidad.' },
      { pain: '«¿Cuántas sesiones me quedan?»', t: 'Bonos de sesiones', d: 'Bonos de 5 o 10 sesiones con precio y caducidad, asignados desde la ficha y aplicados a las sesiones de su servicio.' },
      { pain: 'El consentimiento informado.', t: 'Documentos con firma por enlace', d: 'Asocia el consentimiento al servicio y Omyra lo solicita por enlace en los correos de la cita.' },
      { pain: 'Pacientes que olvidan la cita.', t: 'Recordatorios por correo', d: 'Confirmación al reservar y recordatorio antes de la cita, con la antelación que elijas.' },
      { pain: 'Las facturas a final de mes.', t: 'Facturación con VERI*FACTU', d: 'Facturas completas y simplificadas, con series y tipos de IVA, en PDF y exportables para tu gestoría.' },
    ],
    shot: { img: bono, alt: 'Asignación de un bono de sesiones en Omyra', eyebrow: 'Bonos', h: 'Tratamientos por sesiones, <span class="gold-ink">bajo control.</span>', d: 'Cada bono ligado a su servicio, con sus sesiones, su precio y su caducidad.', list: ['Bonos con sesiones, precio y caducidad', 'Se asignan desde la ficha del paciente', 'Historial de citas y notas internas', 'Informe diario con citas y cobros'] },
    services: ['Primera visita', 'Sesión de fisioterapia', 'Punción seca', 'Drenaje linfático', 'Rehabilitación', 'Bono de 5 sesiones'],
    faqs: ['documentos', 'bonos', 'facturacion', 'calendar', 'profesionales', 'precio'],
  },
  {
    slug: 'software-para-masajes-y-spa',
    name: 'Masajes, spas y bienestar',
    title: 'Software de reservas para masajes, spas y centros de bienestar · Omyra',
    description: 'Reservas online para centros de masajes, spas y bienestar: servicios de 30, 60 o 90 minutos, agenda por terapeuta, indicaciones antes de la cita, bonos, códigos promocionales y señales. Sin comisiones por reserva.',
    eyebrow: 'Para masajes, spas y bienestar',
    h1: 'Que reservar contigo <span class="gold">ya sea relajante.</span>',
    lead: 'Tu carta de masajes y tratamientos en tu propia página de reservas, con la duración y el precio de cada uno, y la agenda de cada terapeuta siempre al día.',
    photos: ['spa', 'masaje'],
    points: [
      { pain: '«¿El de 60 o el de 90 minutos?»', t: 'Cada servicio con su duración', d: 'Masajes y tratamientos con foto, descripción, duración y precio, ordenados por categorías.' },
      { pain: 'Reservas que llegan por todas partes.', t: 'Tu propia página de reservas', d: 'Compártela en Instagram, WhatsApp, Google o tu web. Tus clientes reservan contigo, no en un directorio.' },
      { pain: '«Llega 10 minutos antes.»', t: 'Indicaciones antes de la cita', d: 'Las instrucciones de cada servicio llegan con la confirmación, para que el cliente venga preparado.' },
      { pain: 'Clientes que vuelven cada mes.', t: 'Bonos de sesiones', d: 'Vende bonos de sesiones con precio y caducidad, ligados a cada servicio.' },
      { pain: 'Temporadas más flojas.', t: 'Códigos promocionales', d: 'Descuentos con fechas, servicios y límites de uso, que tus clientes introducen al reservar.' },
      { pain: 'Un hueco perdido por un plantón.', t: 'Señales al reservar', d: 'Por Bizum o transferencia que confirmas al recibirlo, o con tarjeta mediante Stripe.' },
    ],
    shot: { img: servicios, alt: 'Catálogo de servicios de Omyra con foto, descripción, duración y precio', eyebrow: 'Tu carta', h: 'Tus tratamientos, <span class="gold-ink">bien presentados.</span>', d: 'Tú decides qué se reserva online, con qué duración y precio, y quién lo realiza.', list: ['Categorías, fotos, duración y precio', 'Servicios visibles al público o solo internos', 'Cada cuántos minutos empiezan las citas', 'Terapeutas ilimitados, sin coste adicional'] },
    services: ['Masaje relajante 60 min', 'Masaje descontracturante 90 min', 'Piedras calientes', 'Ritual facial', 'Circuito de spa', 'Bono de masajes'],
    faqs: ['marketplace', 'personalizar', 'bonos', 'pagos', 'comisiones', 'precio'],
  },
  {
    slug: 'software-para-unas-pestanas-y-cejas',
    name: 'Uñas, pestañas y cejas',
    title: 'Programa de citas para uñas, pestañas y cejas · Omyra',
    description: 'Reservas online para estudios de uñas, pestañas y cejas: manicura, rellenos, lifting o microblading con su duración, ficha de cada clienta, consentimientos, señales, bonos y promociones. 29,90 € + IVA al mes.',
    eyebrow: 'Para uñas, pestañas y cejas',
    h1: 'Citas cortas, <span class="gold">agenda en orden.</span>',
    lead: 'Manicuras, rellenos, lifting o microblading: tus clientas reservan desde tu Instagram el servicio exacto, con su duración, y tú solo te ocupas de trabajar.',
    photos: ['unas', 'pestanas'],
    points: [
      { pain: 'Cien mensajes por Instagram para cuadrar citas.', t: 'Tu enlace de reservas', d: 'Ponlo en tu bio de Instagram o en tu WhatsApp. La clienta elige servicio, profesional, fecha y hora.' },
      { pain: 'Un relleno no es una uña nueva.', t: 'Servicios a tu medida', d: 'Cada servicio con su duración, su precio y su foto. Tú decides cada cuántos minutos empiezan las citas.' },
      { pain: '«¿Qué diseño llevaba la última vez?»', t: 'Ficha con fotos e historial', d: 'Historial de citas, hábitos, notas internas, fotos y archivos de cada clienta.' },
      { pain: 'Microblading y consentimientos.', t: 'Documentos con firma por enlace', d: 'El consentimiento ligado al servicio, firmado por enlace antes de la cita, con su caducidad.' },
      { pain: 'Una ausencia te descuadra la tarde.', t: 'Señales al reservar', d: 'Pide una señal en los servicios que lo necesiten, por Bizum, transferencia o tarjeta con Stripe.' },
      { pain: 'Clientas fieles cada tres semanas.', t: 'Bonos y promociones', d: 'Bonos de sesiones y códigos de descuento con fechas, servicios y límites de uso.' },
    ],
    shot: { img: clienteFicha, alt: 'Ficha de una clienta en Omyra con historial, notas y documentos', eyebrow: 'Tus clientas', h: 'Cada clienta, <span class="gold-ink">como la recuerdas.</span>', d: 'Lo que le hiciste, lo que prefiere y lo que tienes pendiente, en una sola ficha.', list: ['Historial de citas y servicios', 'Hábitos y notas internas', 'Fotos y archivos en la cita o en la ficha', 'Consentimientos y su caducidad'] },
    services: ['Manicura semipermanente', 'Uñas de gel y relleno', 'Pedicura', 'Lifting de pestañas', 'Extensiones de pestañas', 'Laminado y microblading de cejas'],
    faqs: ['personalizar', 'documentos', 'pagos', 'bonos', 'whatsapp', 'precio'],
  },
];

// Capturas de apoyo que no se usan como principal en cada sector.
export const extraShots = { senales, promo, equipo };
