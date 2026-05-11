import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { normalizePath, routes } from './routes.jsx';

export function render(pathname) {
  const locationPath = normalizePath(pathname);
  const Page = routes[locationPath] || routes['/'];

  return renderToString(
    <App locationPath={locationPath} locationHash="">
      <Page />
    </App>
  );
}
