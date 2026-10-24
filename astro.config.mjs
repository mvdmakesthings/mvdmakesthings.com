// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';

// Last-changed date for each post URL, from frontmatter, so the sitemap can carry lastmod.
const postDates = new Map(
  readdirSync('src/content/writing')
    .filter((name) => /\.mdx?$/.test(name))
    .map((name) => {
      const data = parse(readFileSync(`src/content/writing/${name}`, 'utf8').split(/^---$/m)[1]);
      return [`https://mvdmakesthings.com/writing/${name.replace(/\.mdx?$/, '')}/`, data.updatedDate ?? data.pubDate];
    }),
);

const fontsource = (pkg, file) => `./node_modules/@fontsource-variable/${pkg}/files/${file}`;

// https://astro.build/config
export default defineConfig({
  site: 'https://mvdmakesthings.com',
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        const date = postDates.get(item.url);
        return date ? { ...item, lastmod: new Date(date).toISOString() } : item;
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      // Both themes are emitted as CSS variables; global.css picks one per site theme.
      themes: { light: 'github-light-high-contrast', dark: 'github-dark-default' },
      defaultColor: false,
      wrap: false,
    },
  },
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
      // Body text never swaps fonts mid-read: if Newsreader isn't ready almost at once,
      // this page view keeps the metric-matched fallback. Avoids layout shift on slow links.
      display: 'optional',
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
