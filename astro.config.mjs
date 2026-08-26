// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Se um dia migrar para dominio proprio, troque `site` e rode `npm run build`.
// O arquivo public/CNAME tambem precisa existir para dominio customizado.
export default defineConfig({
  site: 'https://gustavo-oliveira7.github.io',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
