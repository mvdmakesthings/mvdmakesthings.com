import { getCollection, type CollectionEntry } from 'astro:content';

export type Piece = CollectionEntry<'art'>;
export type Media = Piece['data']['media'][number];

/** Gallery order: explicit `order` first, then newest year. */
export async function pieces(): Promise<Piece[]> {
  const all = await getCollection('art');
  return all.sort(
    (a, b) =>
      (a.data.order ?? Infinity) - (b.data.order ?? Infinity) || (b.data.year ?? 0) - (a.data.year ?? 0),
  );
}

export const isPlaceholder = (piece: Piece) => piece.id.toUpperCase().startsWith('PLACEHOLDER');

export const pieceMeta = (piece: Piece) =>
  [piece.data.medium, piece.data.dimensions, piece.data.year && String(piece.data.year)].filter(Boolean).join(', ');

/** The public link for a media item, without share-tracking parameters. */
export function mediaLink(media: Media): string {
  const url = new URL(media.url);
  if (media.kind === 'instagram') {
    const id = url.pathname.match(/\/(?:reel|p)\/([^/]+)/)?.[1];
    if (!id) throw new Error(`art: can't find a post id in ${media.url}`);
    return `https://www.instagram.com/reel/${id}/`;
  }
  return `${url.origin}${url.pathname}`.replace(/\/$/, '');
}

/** The URL of the provider's embeddable player. */
export function mediaEmbed(media: Media): string {
  const link = mediaLink(media);
  if (media.kind === 'instagram') return `${link}embed/`;
  const params = new URLSearchParams({ url: link, visual: 'true', show_artwork: 'true', show_comments: 'false' });
  return `https://w.soundcloud.com/player/?${params}`;
}

export const mediaProvider = (media: Media) => (media.kind === 'instagram' ? 'Instagram' : 'SoundCloud');

export const mediaAction = (media: Media) =>
  media.kind === 'instagram' ? 'Watch on Instagram' : 'Listen on SoundCloud';

/** "Video", "3 videos", "Audio": a short note on what a piece holds. */
export function mediaSummary(media: Media[]): string | undefined {
  if (media.length === 0) return undefined;
  const videos = media.filter((m) => m.kind === 'instagram').length;
  const audio = media.length - videos;
  return [videos && (videos === 1 ? 'Video' : `${videos} videos`), audio && 'Audio'].filter(Boolean).join(' and ');
}
