import type { APIRoute, GetStaticPaths } from 'astro';
import { renderCard, type Card } from '../../lib/og';
import { loadResume } from '../../lib/resume';
import { posts } from '../../lib/writing';

// One card per page except home. Base.astro points og:image here by path.
export const getStaticPaths = (async () => {
  const resume = loadResume();
  const cards: Record<string, Card> = {
    projects: { sheet: 'Projects', title: 'Projects', line: "Software, games, and hardware I've built." },
    writing: { sheet: 'Writing', title: 'Writing', line: 'Notes on building things: software, hardware, and the shop.' },
    art: { sheet: 'Art', title: 'Art', line: 'Installations, generative art, and music.' },
    resume: { sheet: 'Resume', title: resume.name, line: resume.title },
    '404': { sheet: '404', title: 'Missing part' },
  };
  for (const post of await posts()) {
    cards[`writing/${post.id}`] = { sheet: 'Writing', title: post.data.title, line: post.data.description };
  }
  return Object.entries(cards).map(([slug, card]) => ({ params: { slug }, props: card }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderCard(props as Card)), { headers: { 'Content-Type': 'image/png' } });
