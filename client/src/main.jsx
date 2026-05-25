import { StrictMode, useEffect, useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './global.css';
import App from './App.jsx';
import { getRouteMetadata, siteUrl, socialImage } from './metadata.js';
import {
  isStoryPath,
  isValidStoryPath,
  normalizePath,
  resolvePageForPath,
} from './routes.jsx';

const setMetaContent = (selector, content) => {
  const element = document.head.querySelector(selector);
  if (element) {
    element.setAttribute('content', content);
  }
};

const setCanonicalUrl = (href) => {
  const link = document.head.querySelector('link[rel="canonical"]');
  if (link) {
    link.setAttribute('href', href);
  }
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

  useEffect(() => {
    const normalized = normalizePath(location.pathname);

    if (isStoryPath(normalized) && !isValidStoryPath(normalized)) {
      window.history.replaceState({}, '', '/');
      setLocation({ pathname: '/', hash: '' });
    }
  }, [location.pathname]);

  useEffect(() => {
    const metadata = getRouteMetadata(location.pathname);
    const canonicalUrl = `${siteUrl}${metadata.canonicalPath}`;

    document.title = metadata.title;
    setCanonicalUrl(canonicalUrl);
    setMetaContent('meta[name="description"]', metadata.description);
    setMetaContent('meta[property="og:title"]', metadata.socialTitle);
    setMetaContent('meta[property="og:description"]', metadata.description);
    setMetaContent('meta[property="og:url"]', canonicalUrl);
    setMetaContent('meta[property="og:image"]', socialImage);
    setMetaContent('meta[name="twitter:title"]', metadata.socialTitle);
    setMetaContent('meta[name="twitter:description"]', metadata.description);
    setMetaContent('meta[name="twitter:image"]', socialImage);
  }, [location.pathname]);

  const Page = resolvePageForPath(location.pathname);

  return (
    <App locationPath={location.pathname} locationHash={location.hash}>
      <Page routePath={location.pathname} />
    </App>
  );
}

const rootElement = document.getElementById('root');
const app = (
  <StrictMode>
    <RouterApp />
  </StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
