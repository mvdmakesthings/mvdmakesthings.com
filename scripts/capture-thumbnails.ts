// Screenshots each featured project that has a live URL and an `image` filename
// in projects.yaml, at 1200x750, into src/assets/projects/. Run by hand when a
// live site changes; the images are committed.
//
//   pnpm thumbnails            all projects with an image
//   pnpm thumbnails groundwerk just one

import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { parse } from 'yaml';

interface Entry {
  slug: string;
  image?: string;
  links?: { live?: string; play?: string };
}

const only = process.argv.slice(2);
const projects = parse(await readFile('src/data/projects.yaml', 'utf8')) as Entry[];
const targets = projects.filter(
  (p) => p.image && (p.links?.live || p.links?.play) && (only.length === 0 || only.includes(p.slug)),
);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 750 }, colorScheme: 'light' });
for (const project of targets) {
  const url = project.links!.live ?? project.links!.play!;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.waitForTimeout(4000); // let games and canvases draw their first frame
  await page.screenshot({ path: `src/assets/projects/${project.image}` });
  console.log(`thumbnail: ${project.slug} <- ${url}`);
}
await browser.close();
