// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Dominio previsto (solo para URL canónicas y sitemap). Este proyecto no despliega nada.
const NOINDEX = ['/404'];

export default defineConfig({
  site: 'https://omyra.es',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap({ filter: (page) => !NOINDEX.some((p) => page.replace(/\/$/, '').endsWith(p)) })],
  devToolbar: { enabled: false },
  image: { responsiveStyles: false },
});
