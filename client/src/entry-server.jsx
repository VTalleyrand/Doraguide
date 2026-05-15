import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { normalizePath, resolvePageForPath } from './routes.jsx';

export function render(pathname) {
  const locationPath = normalizePath(pathname);
  const Page = resolvePageForPath(locationPath);

  return renderToString(
    <App locationPath={locationPath} locationHash="">
      <Page routePath={locationPath} />
    </App>
  );
}
