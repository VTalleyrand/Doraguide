import mediaStories from './dora-media-stories.json' with { type: 'json' };

export const STORY_ROUTE_BASE = '/stories';
export const STORY_ROUTE_PREFIX = `${STORY_ROUTE_BASE}/`;

const CITY_FOLDER_PATTERN = /^([a-z0-9]+(?:_[a-z0-9]+)*)_([a-z]{2})$/i;
const TITLE_IGNORE_WORDS = new Set(['audio', 'neighborhood']);

/** Shared with the router and metadata (trailing slash trimmed except `/`). */
export function normalizeSitePath(path) {
  if (!path || path === '') return '/';
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
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

/** camelCase / snake_case / kebab-case filename → display title */
export function audioFilenameToTitle(filename) {
  const base = String(filename || '')
    .replace(/^.*\//, '')
    .replace(/\.mp3$/i, '')
    .trim();
  if (!base) return '';

  const words = base
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .filter((word) => !TITLE_IGNORE_WORDS.has(word.toLowerCase()))
    .map((word) => {
      if (/^\d+$/.test(word)) return word;
      if (word.length <= 2 && word === word.toUpperCase()) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

  return words.join(' ');
}

export function cityFolderToParts(cityFolder) {
  const match = String(cityFolder || '').match(CITY_FOLDER_PATTERN);
  if (!match) {
    return {
      cityFolder: String(cityFolder || ''),
      citySlug: String(cityFolder || ''),
      city: audioFilenameToTitle(String(cityFolder || '').replace(/_/g, ' ')),
      countryCode: '',
    };
  }

  const citySlug = match[1].toLowerCase();
  return {
    cityFolder: match[0],
    citySlug,
    city: audioFilenameToTitle(citySlug),
    countryCode: match[2].toUpperCase(),
  };
}

export function storyPathFor(citySlug, locationSlug) {
  return `${STORY_ROUTE_PREFIX}${citySlug}/${locationSlug}`;
}

/**
 * Parse `/stories/:city/:location` into parts.
 * Returns null for `/stories` or incomplete paths.
 */
export function getStoryPathParts(path) {
  const normalizedPath = normalizeSitePath(path);
  if (!normalizedPath.startsWith(STORY_ROUTE_PREFIX)) return null;

  const remainder = normalizedPath.slice(STORY_ROUTE_PREFIX.length);
  if (!remainder) return null;

  const segments = remainder.split('/').filter(Boolean).map((segment) => {
    try {
      return decodeURIComponent(segment);
    } catch {
      return segment;
    }
  });

  if (segments.length !== 2) return null;

  const [citySlug, locationSlug] = segments;
  if (!citySlug || !locationSlug) return null;
  return { citySlug, locationSlug };
}

/** @deprecated Prefer getStoryPathParts — kept for callers that expect a single path key. */
export function getStorySlugFromPath(path) {
  const parts = getStoryPathParts(path);
  return parts ? `${parts.citySlug}/${parts.locationSlug}` : '';
}

export function isStoryPathCandidate(path) {
  const normalizedPath = normalizeSitePath(path);
  return (
    normalizedPath === STORY_ROUTE_BASE ||
    normalizedPath.startsWith(STORY_ROUTE_PREFIX)
  );
}

const mediaBaseUrl = String(mediaStories.mediaBaseUrl || '')
  .trim()
  .replace(/\/+$/, '');

function buildStories(files) {
  const stories = [];
  const usedKeys = new Map();

  for (const relativePath of files) {
    if (typeof relativePath !== 'string') continue;
    const clean = relativePath.trim().replace(/^\/+/, '').replace(/^audio\//, '');
    const [cityFolder, filename] = clean.split('/').filter(Boolean);
    if (!cityFolder || !filename || !filename.toLowerCase().endsWith('.mp3')) {
      continue;
    }

    const city = cityFolderToParts(cityFolder);
    if (!CITY_FOLDER_PATTERN.test(city.cityFolder)) continue;

    const title = audioFilenameToTitle(filename);
    if (!title) continue;

    let locationSlug = titleToStorySlug(title);
    if (!locationSlug) continue;

    let pathKey = `${city.citySlug}/${locationSlug}`;
    if (usedKeys.has(pathKey)) {
      locationSlug = titleToStorySlug(`${title}_${filename.replace(/\.mp3$/i, '')}`);
      pathKey = `${city.citySlug}/${locationSlug}`;
    }
    usedKeys.set(pathKey, true);

    stories.push({
      id: pathKey,
      locationSlug,
      title,
      path: storyPathFor(city.citySlug, locationSlug),
      audioSrc: `${mediaBaseUrl}/${city.cityFolder}/${filename}`,
      citySlug: city.citySlug,
      city: city.city,
      cityFolder: city.cityFolder,
      filename,
    });
  }

  return stories.sort((a, b) => {
    const cityCmp = a.city.localeCompare(b.city);
    if (cityCmp !== 0) return cityCmp;
    return a.title.localeCompare(b.title);
  });
}

export const featuredStories = buildStories(
  Array.isArray(mediaStories.files) ? mediaStories.files : []
);

const featuredStoryByPathKey = new Map(
  featuredStories.map((story) => [story.id, story])
);

export function getFeaturedStoryBySlug(slugOrPath) {
  if (!slugOrPath) return null;
  const normalized = String(slugOrPath).replace(/^\/+/, '').replace(/^stories\//, '');
  return featuredStoryByPathKey.get(normalized) || null;
}

export function getFeaturedStoryByPath(path) {
  const parts = getStoryPathParts(path);
  if (!parts) return null;
  return getFeaturedStoryBySlug(`${parts.citySlug}/${parts.locationSlug}`);
}

export const storyRouteNames = Object.fromEntries(
  featuredStories.map((story) => [story.path, story.title])
);

export const storyRoutePaths = featuredStories.map((story) => story.path);

export const defaultFeaturedStory = featuredStories[0] || null;

export const doraMediaBaseUrl = mediaBaseUrl;

export function getCityMediaFolderUrl(citySlug) {
  const story = featuredStories.find((entry) => entry.citySlug === citySlug);
  return story ? `${mediaBaseUrl}/${story.cityFolder}` : '';
}

export function getCityIntroAudioSrc(citySlug) {
  const cityStories = featuredStories.filter((entry) => entry.citySlug === citySlug);
  if (cityStories.length === 0) return '';

  const exact = cityStories.find(
    (entry) =>
      entry.locationSlug === citySlug ||
      entry.filename.replace(/\.mp3$/i, '').toLowerCase() === citySlug
  );
  if (exact) return exact.audioSrc;

  const prefixed = cityStories.find((entry) =>
    entry.filename.toLowerCase().startsWith(citySlug.replace(/_/g, ''))
  );
  return (prefixed || cityStories[0]).audioSrc;
}
