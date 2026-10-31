import {
  formatPlaceCount,
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
                <p>{formatPlaceCount(neighborhood.landmarkCount)} in Dora</p>
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
    </section>
  );
};

export default CityGuide;
