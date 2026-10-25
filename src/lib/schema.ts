// schema.org JSON-LD for search engines. Pages put graph(...) in a
// <script type="application/ld+json" slot="head"> tag.
import { getImage } from 'astro:assets';
import photo from '../../assets/bio-photo.jpg';
import { site } from '../data/site';

const abs = (path: string) => new URL(path, site.url).href;

export const personId = abs('/#person');
const websiteId = abs('/#website');

/** Who Michael is. Other nodes point here by @id instead of repeating it. */
export async function person() {
  const image = await getImage({ src: photo, width: 720, format: 'jpg' });
  return {
    '@type': 'Person',
    '@id': personId,
    name: site.name,
    alternateName: site.brand,
    url: site.url,
    image: abs(image.src),
    jobTitle: 'Engineering leader',
    description: site.description,
    address: { '@type': 'PostalAddress', addressLocality: 'Louisville', addressRegion: 'KY', addressCountry: 'US' },
    sameAs: Object.values(site.links),
  };
}

/** Names the site, so search results can show "MVD Makes Things" as the site name. */
export const website = () => ({
  '@type': 'WebSite',
  '@id': websiteId,
  name: site.title,
  alternateName: [site.brand, site.name],
  url: site.url,
  description: site.description,
  inLanguage: 'en-US',
  publisher: { '@id': personId },
});

/** The resume page is a profile of Michael. */
export const profilePage = async (url: string) => ({
  '@type': 'ProfilePage',
  url: abs(url),
  mainEntity: await person(),
  isPartOf: { '@id': websiteId },
});

/** One script tag's worth of nodes. */
export const graph = (...nodes: object[]) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });
