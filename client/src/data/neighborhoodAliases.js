/** Neighborhood name → route slug segment (shared by the catalog sync and the guides). */
export const routeSlugForNeighborhood = (value) =>
  value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * The upstream catalog labels some districts more than one way (e.g. Amsterdam's
 * "Centrum" and "Amsterdam-Centrum"), which would split one district across two
 * guide pages. Keyed by city slug, then by the alias's route slug; the value is
 * the canonical neighborhood name. Only list true duplicates here, never real
 * sub-areas. When adding an entry, also redirect the retired route in
 * server/index.mjs.
 */
export const NEIGHBORHOOD_ALIASES = {
  amsterdam: {
    centrum: 'Amsterdam-Centrum',
  },
};

export function canonicalNeighborhoodName(citySlug, neighborhood) {
  if (!neighborhood) return neighborhood;
  const aliases = NEIGHBORHOOD_ALIASES[citySlug];
  return aliases?.[routeSlugForNeighborhood(neighborhood)] ?? neighborhood;
}
