import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';
import Press from './pages/Press.jsx';

export const routes = {
  '/': Home,
  '/about': About,
  '/terms': Terms,
  '/privacy': Privacy,
  '/press': Press,
};

export const normalizePath = (path) => {
  if (!path || path === '') return '/';
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
};
