// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://traced-back.pages.dev',
  integrations: [mdx()],
  compressHTML: true,

  vite: {
    plugins: [tailwindcss()]
  }
});