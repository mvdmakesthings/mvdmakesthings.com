import { getCollection, type CollectionEntry } from 'astro:content';

export type Piece = CollectionEntry<'art'>;

/** Gallery order: explicit `order` first, then newest year. */
export async function pieces(): Promise<Piece[]> {
  const all = await getCollection('art');
  return all.sort(
    (a, b) => (a.data.order ?? Infinity) - (b.data.order ?? Infinity) || b.data.year - a.data.year,
  );
}

export const isPlaceholder = (piece: Piece) => piece.id.toUpperCase().startsWith('PLACEHOLDER');

export const pieceMeta = (piece: Piece) =>
  [piece.data.medium, piece.data.dimensions, String(piece.data.year)].filter(Boolean).join(', ');
