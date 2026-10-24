// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const fontsource = (pkg, file) => `./node_modules/@fontsource-variable/${pkg}/files/${file}`;

// https://astro.build/config
export default defineConfig({
  site: 'https://mvdmakesthings.com',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Big Shoulders Display',
      cssVariable: '--font-display',
      fallbacks: ['Arial Narrow', 'sans-serif'],
      options: {
        variants: [
          {
            src: [fontsource('big-shoulders-display', 'big-shoulders-display-latin-wght-normal.woff2')],
            weight: '100 900',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Newsreader',
      cssVariable: '--font-body',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          {
            src: [fontsource('newsreader', 'newsreader-latin-opsz-normal.woff2')],
            weight: '200 800',
            style: 'normal',
          },
          {
            src: [fontsource('newsreader', 'newsreader-latin-opsz-italic.woff2')],
            weight: '200 800',
            style: 'italic',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      fallbacks: ['ui-monospace', 'monospace'],
      options: {
        variants: [
          {
            src: [fontsource('jetbrains-mono', 'jetbrains-mono-latin-wght-normal.woff2')],
            weight: '100 800',
            style: 'normal',
          },
        ],
      },
    },
  ],
});
