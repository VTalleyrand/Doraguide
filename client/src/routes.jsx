import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';
import Press from './pages/Press.jsx';
import CityVote from './pages/CityVote.jsx';
import StoryListen from './pages/StoryListen.jsx';

const storyRoutePrefix = '/s/';

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
  if (!normalizedPath.startsWith(storyRoutePrefix)) return '';
  return decodeURIComponent(normalizedPath.slice(storyRoutePrefix.length));
};

export const resolvePageForPath = (path) => {
  const normalizedPath = normalizePath(path);
  return (
    routes[normalizedPath] ||
    (getStorySlugFromPath(normalizedPath) ? StoryListen : routes['/'])
  );
};
