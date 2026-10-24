import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import github from '../data/github.json';
import { githubExclude } from '../data/github-exclude';

export type Project = CollectionEntry<'projects'>['data'];

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

const images = import.meta.glob<{ default: ImageMetadata }>('../assets/projects/*.{png,jpg,jpeg,webp}', {
  eager: true,
});

export function projectImage(file?: string): ImageMetadata | undefined {
  if (!file) return undefined;
  const match = Object.entries(images).find(([path]) => path.endsWith(`/${file}`));
  if (!match) throw new Error(`projects.yaml: image "${file}" is not in src/assets/projects/`);
  return match[1].default;
}

export async function featuredProjects(): Promise<Project[]> {
  const entries = await getCollection('projects');
  return entries.map((entry) => entry.data).sort((a, b) => a.order - b.order);
}

/** The GitHub feed minus excluded repos and anything already featured. */
export async function githubRepos(): Promise<{ current: Repo[]; earlier: Repo[] }> {
  const featured = new Set((await featuredProjects()).map((p) => p.repo?.toLowerCase()).filter(Boolean));
  const repos = (github.repos as Repo[]).filter(
    (repo) => !githubExclude.includes(repo.name) && !featured.has(repo.name.toLowerCase()),
  );
  return {
    current: repos.filter((repo) => !repo.archived),
    earlier: repos.filter((repo) => repo.archived),
  };
}

export const statusLabel: Record<Project['status'], string> = {
  active: 'Active',
  playtest: 'In playtest',
  archived: 'Archived',
  client: 'Client work',
};

export const linkLabels = {
  live: 'Live',
  play: 'Play in your browser',
  itch: 'itch.io',
  source: 'Source',
} as const;
