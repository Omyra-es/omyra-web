// Fotos de ambiente de distintos sectores (Unsplash, licencia Unsplash). Créditos en src/assets/fotos/sectores/CREDITOS.md
import type { ImageMetadata } from 'astro';
import fisio from '../assets/fotos/sectores/fisio.jpg';
import masaje from '../assets/fotos/sectores/masaje.jpg';
import mascotas from '../assets/fotos/sectores/mascotas.jpg';
import mascotas2 from '../assets/fotos/sectores/mascotas2.jpg';
import tatuaje from '../assets/fotos/sectores/tatuaje.jpg';
import barberia from '../assets/fotos/sectores/barberia.jpg';
import spa from '../assets/fotos/sectores/spa.jpg';
import peluqueria from '../assets/fotos/sectores/peluqueria.jpg';
import unas from '../assets/fotos/sectores/unas.jpg';
import westie from '../assets/fotos/sectores/westie.jpg';
import golden from '../assets/fotos/sectores/golden.jpg';
import estetica from '../assets/fotos/sectores/estetica.jpg';
import microblading from '../assets/fotos/sectores/microblading.jpg';
import labios from '../assets/fotos/sectores/labios.jpg';
import lifting from '../assets/fotos/lifting-pestanas.jpg';
import cejas from '../assets/fotos/laminado-cejas.jpg';

export type Photo = { label: string; alt: string; img: ImageMetadata; pos?: string };
export const photos = {
  fisio: { label: 'Fisioterapia', alt: 'Fisioterapeuta tratando la pierna de un paciente', img: fisio, pos: '60% 40%' },
  masaje: { label: 'Masajes', alt: 'Masaje en la espalda en una camilla', img: masaje },
  mascotas: { label: 'Mascotas', alt: 'Perro pequeño corriendo feliz por el césped', img: mascotas, pos: '70% 50%' },
  mascotas2: { label: 'Mascotas', alt: 'Retrato de un perro sobre fondo rosa', img: mascotas2 },
  tatuaje: { label: 'Tatuaje', alt: 'Tatuador trabajando en un brazo con guantes negros', img: tatuaje },
  barberia: { label: 'Barberías', alt: 'Barbero arreglando la barba de un cliente', img: barberia },
  spa: { label: 'Spa', alt: 'Piedras calientes sobre una espalda en un spa', img: spa },
  peluqueria: { label: 'Peluquerías', alt: 'Peluquera secando el pelo de una clienta', img: peluqueria },
  westie: { label: 'Mascotas', alt: 'Westie blanco mirando a un lado con su collar', img: westie, pos: '50% 30%' },
  golden: { label: 'Mascotas', alt: 'Golden retriever sonriente en el jardín', img: golden, pos: '50% 30%' },
  estetica: { label: 'Estética', alt: 'Esteticista aplicando una mascarilla facial con pincel', img: estetica, pos: '50% 35%' },
  pestanas: { label: 'Pestañas', alt: 'Lifting de pestañas en un centro de belleza', img: lifting, pos: '50% 45%' },
  cejas: { label: 'Cejas', alt: 'Diseño y laminado de cejas', img: cejas, pos: '50% 40%' },
  microblading: { label: 'Cejas', alt: 'Profesional diseñando unas cejas para microblading', img: microblading, pos: '45% 40%' },
  labios: { label: 'Estética', alt: 'Labios con acabado natural tras un tratamiento estético', img: labios, pos: '50% 50%' },
  unas: { label: 'Uñas', alt: 'Manos con manicura de diseño', img: unas },
} satisfies Record<string, Photo>;
