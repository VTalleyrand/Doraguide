import { cityGuides, getGuideNeighborhoods } from '../data/cityGuides.js';
import './CityGuide.css';

const CityGuidesIndex = () => (
  <section className="city-guide" aria-labelledby="city-guides-title">
    <div className="city-guide__hero">
      <div className="city-guide__inner">
        <h1 id="city-guides-title">City guides</h1>
        <p className="city-guide__intro">
          Browse Dora's guides to places to see in {cityGuides.length} cities, with the stories
          behind the landmarks around you.
        </p>
      </div>
    </div>

    <div className="city-guide__content city-guide__inner">
      <div className="city-guide__neighborhoods">
        {cityGuides.map((city) => (
          <a
            className="city-guide__neighborhood"
            href={`/cities/${city.routeSlug}`}
            key={city.routeSlug}
          >
            <div className="city-guide__neighborhood-heading">
              <h3>{city.name}</h3>
              <p>
                {city.landmarks.length} places in {getGuideNeighborhoods(city).length}{' '}
                neighborhoods
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default CityGuidesIndex;
