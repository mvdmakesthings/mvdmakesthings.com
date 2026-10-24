import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

export type Project = CollectionEntry<'projects'>['data'];

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
