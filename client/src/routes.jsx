import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';
import Press from './pages/Press.jsx';
import Help from './pages/Help.jsx';
import CityVote from './pages/CityVote.jsx';
import StoryListen from './pages/StoryListen.jsx';
import {
  STORY_ROUTE_BASE,
  STORY_ROUTE_PREFIX,
  getFeaturedStoryBySlug,
  getStorySlugFromPath,
  isStoryPathCandidate,
  normalizeSitePath,
} from './data/featuredLocations.js';

export const routes = {
  '/': Home,
  '/about': About,
  '/terms': Terms,
  '/privacy': Privacy,
  '/press': Press,
  '/help': Help,
  '/support': Help,
  '/vote': CityVote,
};

export const normalizePath = normalizeSitePath;

export { getStorySlugFromPath, STORY_ROUTE_BASE, STORY_ROUTE_PREFIX };

export const isStoryPath = isStoryPathCandidate;

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
