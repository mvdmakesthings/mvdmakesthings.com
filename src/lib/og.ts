// Social preview cards, drawn at build time by src/pages/og/[...slug].png.ts.
// The home page keeps its hand-made /og.jpg, which has the photo on it.
import { readFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { site } from '../data/site';

export interface Card {
  /** Sheet name in the title block, as in the site footer. */
  sheet: string;
  title: string;
  line?: string;
}

/** Where a page's card lives: /projects/ → /og/projects.png. */
export const ogImagePath = (pathname: string) =>
  pathname === '/' ? '/og.jpg' : `/og/${pathname.replace(/^\/|\/$/g, '')}.png`;

const font = (path: string) => readFileSync(`node_modules/@fontsource/${path}`);
const fonts = [
  { name: 'Display', data: font('big-shoulders-display/files/big-shoulders-display-latin-800-normal.woff'), weight: 800 },
  { name: 'Body', data: font('newsreader/files/newsreader-latin-400-normal.woff'), weight: 400 },
  { name: 'Body', data: font('newsreader/files/newsreader-latin-400-italic.woff'), weight: 400, style: 'italic' },
] as const;

// Colors from src/styles/tokens.css.
const paper = '#fbfbf9';
const ink = '#000000';
const pencil = '#6b665e';
const copper = '#a85a1c';

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string | false | undefined)[]): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children: children.filter(Boolean) },
});

const cell = (label: string, value: string, style: Record<string, unknown> = {}) =>
  h(
    'div',
    { flexDirection: 'column', justifyContent: 'center', padding: '0 28px', ...style },
    h('div', { fontSize: 20, color: pencil }, label),
    h('div', { fontSize: 30, marginTop: 2 }, value),
  );

function card({ sheet, title, line }: Card): Node {
  const titleSize = title.length > 40 ? 72 : title.length > 16 ? 96 : 132;
  return h(
    'div',
    { width: 1200, height: 630, background: paper, color: ink, fontFamily: 'Body' },
    h(
      'div',
      { width: 1152, height: 582, margin: 24, flexDirection: 'column', border: `2px solid ${ink}` },
      h(
        'div',
        { flex: 1, flexDirection: 'column', padding: '44px 52px 0' },
        h(
          'div',
          { alignItems: 'baseline' },
          h('div', { fontFamily: 'Display', fontWeight: 800, fontSize: 52 }, site.brand),
          h('div', { fontStyle: 'italic', fontSize: 30, color: pencil, marginLeft: 10 }, 'makes things'),
        ),
        h(
          'div',
          { flex: 1, flexDirection: 'column', justifyContent: 'center', paddingTop: 16 },
          h('div', { fontFamily: 'Display', fontWeight: 800, fontSize: titleSize, lineHeight: 1, maxWidth: 1000 }, title),
          line && h('div', { fontSize: 36, color: pencil, marginTop: 24, maxWidth: 960, lineHeight: 1.3 }, line),
        ),
        h('div', { width: 120, height: 8, background: copper, marginBottom: 36 }),
      ),
      h(
        'div',
        { height: 96, borderTop: `2px solid ${ink}` },
        cell('Drawn by', site.name, { width: 360, borderRight: `2px solid ${ink}` }),
        cell('Sheet', sheet, { width: 300, borderRight: `2px solid ${ink}` }),
        cell('Title', new URL(site.url).host, { flex: 1 }),
      ),
    ),
  );
}

export async function renderCard(data: Card): Promise<Buffer> {
  const svg = await satori(card(data) as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: fonts as unknown as Parameters<typeof satori>[1]['fonts'],
  });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
