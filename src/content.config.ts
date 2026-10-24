import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
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

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing };
