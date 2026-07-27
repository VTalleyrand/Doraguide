import { useEffect } from 'react';
import Header from './components/Header/index.jsx';
import Footer from './components/Footer/index.jsx';
import TopBanner from './components/TopBanner/index.jsx';
import {
  isValidCityGuidePath,
  isValidNeighborhoodGuidePath,
  isValidStoryPath,
} from './routes.jsx';

function App({ children, locationPath, locationHash }) {
  const isHomePage = locationPath === '/';
  const isStoryPage = isValidStoryPath(locationPath);
  const isCityGuidePage =
    isValidCityGuidePath(locationPath) || isValidNeighborhoodGuidePath(locationPath);

  useEffect(() => {
    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';

    if (locationHash && isHomePage) {
      const target = document.querySelector(locationHash);
      if (target) {
        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;

        target.scrollIntoView({
          block: 'start',
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
        html.style.scrollBehavior = prevBehavior;
        return;
      }
    }

    window.scrollTo(0, 0);
    html.scrollTop = 0;
    document.body.scrollTop = 0;
    html.style.scrollBehavior = prevBehavior;
  }, [isHomePage, locationHash, locationPath]);

  return (
    <div
      className={`app-layout ${isHomePage ? 'app-layout--home' : ''} ${
        isStoryPage ? 'app-layout--story' : ''
      } ${isCityGuidePage ? 'app-layout--city-guide' : ''}`}
    >
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {!isStoryPage && <TopBanner />}
      {!isStoryPage && <Header />}
      <main className="main-content" id="main-content">
        {children}
      </main>
      {!isStoryPage && <Footer />}
    </div>
  );
}

export default App;
