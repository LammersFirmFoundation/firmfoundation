/**
 * Google's photo CDN encodes the requested size in the URL (`=s1920-c-rp-mo-br100`).
 * Apify hands back whatever Google had, which is the 1920px original — the five
 * reviewer avatars on the homepage totalled **8.67MB** to fill 48px circles.
 * Rewriting the size parameter drops that to ~64KB with no visible difference,
 * and costs nothing: Google resizes on their side.
 *
 * Applied at render, not in the data, so it covers both the live API response
 * and the static fallback snapshot without either having to know about it.
 */
export function sizedPhoto(url: string | undefined, px: number): string | undefined {
  if (!url) return url;
  // Only the `=s<number>` form carries a size; `=k-no` style URLs don't, and
  // rewriting those would break them.
  return url.replace(/=s\d+/, `=s${px}`);
}
