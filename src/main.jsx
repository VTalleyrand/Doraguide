import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';
import Press from './pages/Press.jsx';

const routes = {
  '/': Home,
  '/about': About,
  '/terms': Terms,
  '/privacy': Privacy,
  '/press': Press,
};

const normalizePath = (path) => {
  if (!path || path === '') return '/';
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
};

function RouterApp() {
  const [location, setLocation] = useState(() => ({
    pathname: normalizePath(window.location.pathname),
    hash: window.location.hash,
  }));

  useEffect(() => {
    const handlePopState = () => {
      setLocation({
        pathname: normalizePath(window.location.pathname),
        hash: window.location.hash,
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      if (link.target || link.hasAttribute('download')) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      window.history.pushState({}, '', `${url.pathname}${url.hash}`);
      setLocation({
        pathname: normalizePath(url.pathname),
        hash: url.hash,
      });
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const Page = routes[location.pathname] || Home;

  return (
    <App locationPath={location.pathname} locationHash={location.hash}>
      <Page />
    </App>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterApp />
  </StrictMode>
);
