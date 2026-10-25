// Prints the resume page to public/resume.pdf (US Letter) with Playwright.
// Local only; Vercel never runs it. Builds the site, serves dist/ from a tiny
// static server, prints /resume/, then stops the server.
//
//   pnpm resume:pdf

import { execSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { chromium } from '@playwright/test';

const DIST = 'dist';
const TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

execSync('pnpm exec astro build', { stdio: 'inherit' });

const server = createServer(async (request, response) => {
  // Add index.html before normalizing: on Windows, normalize turns the trailing / into \.
  let pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://x').pathname);
  if (pathname.endsWith('/')) pathname += 'index.html';
  const path = normalize(pathname);
  try {
    const body = await readFile(join(DIST, path));
    response.writeHead(200, { 'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise<void>((resolve) => server.listen(0, resolve));
const { port } = server.address() as { port: number };

try {
  const browser = await chromium.launch();
  const page = await browser.newPage({ colorScheme: 'light' });
  await page.goto(`http://localhost:${port}/resume/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: 'public/resume.pdf', format: 'Letter', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log('resume: wrote public/resume.pdf');
} finally {
  server.close();
}
