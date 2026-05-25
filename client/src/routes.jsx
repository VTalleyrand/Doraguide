import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';
import Press from './pages/Press.jsx';
import CityVote from './pages/CityVote.jsx';
import StoryListen from './pages/StoryListen.jsx';
import {
  STORY_ROUTE_BASE,
  STORY_ROUTE_PREFIX,
  getFeaturedStoryBySlug,
} from './data/featuredLocations.js';

export const routes = {
  '/': Home,
  '/about': About,
  '/terms': Terms,
  '/privacy': Privacy,
  '/press': Press,
  '/vote': CityVote,
};

export const normalizePath = (path) => {
  if (!path || path === '') return '/';
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
};

export const getStorySlugFromPath = (path) => {
  const normalizedPath = normalizePath(path);
  if (normalizedPath === STORY_ROUTE_BASE) return '';
  if (!normalizedPath.startsWith(STORY_ROUTE_PREFIX)) return '';
  return decodeURIComponent(normalizedPath.slice(STORY_ROUTE_PREFIX.length));
};

export const isStoryPath = (path) => {
  const normalizedPath = normalizePath(path);
  return (
    normalizedPath === STORY_ROUTE_BASE ||
    normalizedPath.startsWith(STORY_ROUTE_PREFIX)
  );
};

export const isValidStoryPath = (path) => {
  const slug = getStorySlugFromPath(path);
  return Boolean(slug && getFeaturedStoryBySlug(slug));
};

export const resolvePageForPath = (path) => {
  const normalizedPath = normalizePath(path);
  if (routes[normalizedPath]) return routes[normalizedPath];
  if (isValidStoryPath(normalizedPath)) return StoryListen;
  return routes['/'];
};
