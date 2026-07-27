import { appStoreUrl } from '../metadata.js';
import {
  getCityGuideByPath,
  getCityGuideFaq,
  getGuideNeighborhoods,
} from '../data/cityGuides.js';
import GuideFaq from '../components/GuideFaq.jsx';
import './CityGuide.css';

const CityGuide = ({ routePath }) => {
  const city = getCityGuideByPath(routePath);

  if (!city) return null;

  const neighborhoods = getGuideNeighborhoods(city);
  const faq = getCityGuideFaq(city);

  return (
    <section className="city-guide" aria-labelledby="city-guide-title">
      <div className="city-guide__hero">
        <div className="city-guide__inner">
          <h1 id="city-guide-title">Places to see in {city.name}.</h1>
          <p className="city-guide__intro">
            Looking for places to see in {city.name}? Dora brings together {city.landmarks.length}{' '}
            places across {neighborhoods.length} neighborhoods.
          </p>
        </div>
      </div>

      <div className="city-guide__content city-guide__inner">
        <header className="city-guide__heading">
          <h2>Explore neighborhoods in {city.name}</h2>
          <p>
            Each area has its own rhythm, history, and places worth stopping for.
          </p>
        </header>

        <div className="city-guide__neighborhoods">
          {neighborhoods.map((neighborhood) => (
            <a
              className="city-guide__neighborhood"
              href={`/cities/${city.routeSlug}/${neighborhood.routeSlug}`}
              key={neighborhood.name}
            >
              <div className="city-guide__neighborhood-heading">
                <h3>{neighborhood.name}</h3>
                <p>{neighborhood.landmarkCount} places in Dora</p>
              </div>
              <ul aria-label={`Highlights in ${neighborhood.name}`}>
                {neighborhood.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </a>
          ))}
        </div>

        <GuideFaq questions={faq} />
      </div>

      <aside className="city-guide__closing">
        <div className="city-guide__closing-inner">
          <h2>Ready to notice more?</h2>
          <p>
            When the world sparks your curiosity, open Dora and discover the stories behind the
            places around you.
          </p>
          <a className="primary-btn" href={appStoreUrl} target="_blank" rel="noreferrer">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download on iOS
          </a>
        </div>
      </aside>
    </section>
  );
};

export default CityGuide;
