import featuredData from './featured-locations-media.json' with { type: 'json' };

export const STORY_ROUTE_BASE = '/stories';
export const STORY_ROUTE_PREFIX = `${STORY_ROUTE_BASE}/`;

/** Shared with the router and metadata (trailing slash trimmed except `/`). */
export function normalizeSitePath(path) {
  if (!path || path === '') return '/';
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
}

export function getStorySlugFromPath(path) {
  const normalizedPath = normalizeSitePath(path);
  if (normalizedPath === STORY_ROUTE_BASE) return '';
  if (normalizedPath.startsWith(STORY_ROUTE_PREFIX)) {
    return decodeURIComponent(normalizedPath.slice(STORY_ROUTE_PREFIX.length));
  }
  return '';
}

export function isStoryPathCandidate(path) {
  const normalizedPath = normalizeSitePath(path);
  return (
    normalizedPath === STORY_ROUTE_BASE ||
    normalizedPath.startsWith(STORY_ROUTE_PREFIX)
  );
}

export function titleToStorySlug(title) {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

export const featuredStories = featuredData.cities.flatMap((city) =>
  city.locations.map((location) => ({
    id: titleToStorySlug(location.title),
    title: location.title,
    hook: location.description,
    audioSrc: location.audioUrl,
    citySlug: city.citySlug,
    city: city.city,
  }))
);

const featuredStoryBySlug = new Map(
  featuredStories.map((story) => [story.id, story])
);

export function getFeaturedStoryBySlug(slug) {
  return featuredStoryBySlug.get(slug) || null;
}

export const storyRouteNames = Object.fromEntries(
  featuredStories.map((story) => [`${STORY_ROUTE_PREFIX}${story.id}`, story.title])
);

export const storyRoutePaths = Object.keys(storyRouteNames);

export const defaultFeaturedStory = featuredStories[0] || null;
