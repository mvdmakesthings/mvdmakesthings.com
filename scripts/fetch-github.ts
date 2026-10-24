// Fetches Michael's public repos into src/data/github.json for the "More on GitHub"
// feed. Runs before every build. On any failure it keeps the committed file and
// warns, so a GitHub outage or rate limit never breaks a deploy.
//
//   node scripts/fetch-github.ts         (set GITHUB_TOKEN for a higher rate limit)

import { readFile, writeFile } from 'node:fs/promises';
import { githubExclude } from '../src/data/github-exclude.ts';

const USER = 'mvdmakesthings';
const OUT = new URL('../src/data/github.json', import.meta.url);
const API = `https://api.github.com/users/${USER}/repos?per_page=100&type=owner&sort=pushed`;

interface ApiRepo {
  name: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  pushed_at: string;
  stargazers_count: number;
  archived: boolean;
  fork: boolean;
  html_url: string;
}

export interface Repo {
  name: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  pushedAt: string;
  stars: number;
  archived: boolean;
  url: string;
}

async function main() {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'mvdmakesthings.com build',
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const response = await fetch(API, { headers, signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`GitHub responded ${response.status} ${response.statusText}`);
  const data = (await response.json()) as ApiRepo[];

  const repos: Repo[] = data
    .filter((repo) => !repo.fork && !githubExclude.includes(repo.name))
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      homepage: repo.homepage || null,
      language: repo.language,
      pushedAt: repo.pushed_at.slice(0, 10),
      stars: repo.stargazers_count,
      archived: repo.archived,
      url: repo.html_url,
    }));

  const next = JSON.stringify({ user: USER, repos }, null, 2) + '\n';
  const current = await readFile(OUT, 'utf8').catch(() => '');
  if (next === current) {
    console.log(`github: ${repos.length} repos, unchanged`);
    return;
  }
  await writeFile(OUT, next);
  console.log(`github: wrote ${repos.length} repos to src/data/github.json`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`github: fetch failed (${message}); keeping the committed src/data/github.json`);
});
