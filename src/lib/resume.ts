import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { z } from 'astro/zod';

const text = z.string().nullish().transform((v) => v ?? undefined);
const year = z.union([z.string(), z.number()]).nullish().transform((v) => (v == null ? undefined : String(v)));

const schema = z.object({
  name: z.string(),
  title: z.string(),
  location: z.string(),
  email: text,
  intro: text,
  links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
  experience: z
    .array(
      z.object({
        role: z.string(),
        company: z.string(),
        location: text,
        start: year,
        end: year,
        summary: text,
        highlights: z.array(z.string()).default([]),
        print: z.boolean().default(true),
      }),
    )
    .default([]),
  skills: z.array(z.object({ group: z.string(), items: z.array(z.string()) })).default([]),
  education: z.array(z.object({ school: z.string(), degree: text, year })).default([]),
  certifications: z
    .array(z.object({ name: z.string(), issuer: text, year, url: text, print: z.boolean().default(true) }))
    .default([]),
  talks: z.array(z.object({ title: z.string(), venue: text, year, url: text })).default([]),
});

export type Resume = z.infer<typeof schema>;

export function loadResume(): Resume {
  const raw = parse(readFileSync('src/data/resume.yaml', 'utf8'));
  const result = schema.safeParse(raw);
  if (!result.success) throw new Error(`src/data/resume.yaml: ${z.prettifyError(result.error)}`);
  return result.data;
}

/** True when a value is still a placeholder from the scaffold. */
export const isTodo = (value?: string) => !!value && value.trim().toUpperCase().startsWith('TODO');
