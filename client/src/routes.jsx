import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';
import Press from './pages/Press.jsx';
import Help from './pages/Help.jsx';
import CityVote from './pages/CityVote.jsx';
import StoryListen from './pages/StoryListen.jsx';
import CityGuide from './pages/CityGuide.jsx';
import NeighborhoodGuide from './pages/NeighborhoodGuide.jsx';
import {
  STORY_ROUTE_BASE,
  STORY_ROUTE_PREFIX,
  getFeaturedStoryByPath,
  getStorySlugFromPath,
  isStoryPathCandidate,
  normalizeSitePath,
} from './data/featuredLocations.js';
import {
  CITY_GUIDE_ROUTE_BASE,
  CITY_GUIDE_ROUTE_PREFIX,
  getCityGuideByPath,
  getNeighborhoodGuideByPath,
  isCityGuidePathCandidate,
} from './data/cityGuides.js';

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
export { CITY_GUIDE_ROUTE_BASE, CITY_GUIDE_ROUTE_PREFIX };

export const isStoryPath = isStoryPathCandidate;

export const isValidStoryPath = (path) => Boolean(getFeaturedStoryByPath(path));

export const isCityGuidePath = isCityGuidePathCandidate;

export const isValidCityGuidePath = (path) => Boolean(getCityGuideByPath(path));

export const isValidNeighborhoodGuidePath = (path) =>
  Boolean(getNeighborhoodGuideByPath(path));

export const resolvePageForPath = (path) => {
  const normalizedPath = normalizePath(path);
  if (routes[normalizedPath]) return routes[normalizedPath];
  if (isValidNeighborhoodGuidePath(normalizedPath)) return NeighborhoodGuide;
  if (isValidCityGuidePath(normalizedPath)) return CityGuide;
  if (isValidStoryPath(normalizedPath)) return StoryListen;
  return routes['/'];
};
