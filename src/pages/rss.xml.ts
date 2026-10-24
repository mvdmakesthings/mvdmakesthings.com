import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../data/site';
import { postUrl, posts } from '../lib/writing';

export async function GET(context: APIContext) {
  const items = await posts();
  return rss({
    title: `${site.title}: Writing`,
    description: `Notes from ${site.name} on building things.`,
    site: context.site!,
    items: items.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
      categories: post.data.tags,
    })),
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>en-us</language><atom:link href="${new URL('rss.xml', context.site)}" rel="self" type="application/rss+xml"/>`,
  });
}
