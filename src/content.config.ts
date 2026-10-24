import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'yaml';

// Featured projects keep the order they have in the YAML file.
const projects = defineCollection({
  loader: file('src/data/projects.yaml', {
    parser: (text) =>
      (parse(text) as Record<string, unknown>[]).map((entry, order) => ({ id: entry.slug, order, ...entry })),
  }),
  schema: z.object({
    order: z.number(),
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    stack: z.array(z.string()).default([]),
    status: z.enum(['active', 'playtest', 'archived', 'client']),
    repo: z.string().optional(),
    links: z
      .object({
        live: z.url().optional(),
        play: z.url().optional(),
        itch: z.url().optional(),
        source: z.url().optional(),
      })
      .default({}),
    image: z.string().optional(),
    spec: z.string().optional(),
  }),
});

export const collections = { projects };
