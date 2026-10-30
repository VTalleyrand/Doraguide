import { useRef, useState } from 'react';
import {
  formatPlaceCount,
  getNeighborhoodGuideByPath,
  getNeighborhoodGuideContent,
} from '../data/cityGuides.js';
import NeighborhoodMap from '../components/NeighborhoodMap.jsx';
import NeighborhoodPlaceCard from '../components/NeighborhoodPlaceCard.jsx';
import './NeighborhoodGuide.css';

const joinList = (items) => {
  if (items.length < 2) return items[0] || 'landmarks';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
};

const topicLabel = (category) => {
  const labels = {
    Art: 'art',
    Cultural: 'culture',
    Historical: 'history',
    Nature: 'nature',
  };
  return labels[category] || category.toLowerCase();
};

const NeighborhoodGuide = ({ routePath }) => {
  const guide = getNeighborhoodGuideByPath(routePath);

  if (!guide) return null;

  const { city, neighborhood } = guide;
  const { landmarks, categories } = getNeighborhoodGuideContent(neighborhood);
  const featuredNames = landmarks.slice(0, 3).map((landmark) => landmark.name);
  const topics = categories.map(topicLabel);
  const mapRef = useRef(null);
  const [selectedPlaceName, setSelectedPlaceName] = useState(null);
  const [visiblePlaceCount, setVisiblePlaceCount] = useState(10);
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);
  const visibleLandmarks = landmarks.slice(0, visiblePlaceCount);
  const remainingPlaceCount = Math.max(landmarks.length - visibleLandmarks.length, 0);

  const handlePlaceSelect = (landmark) => {
    setSelectedPlaceName(landmark.name);
    mapRef.current?.focusLandmark(landmark.name);
  };

  const handleMapMarkerSelect = (landmarkName) => {
    const landmarkIndex = landmarks.findIndex((landmark) => landmark.name === landmarkName);
    if (landmarkIndex < 0) return;

    setSelectedPlaceName(landmarkName);
    setVisiblePlaceCount((currentCount) =>
      Math.max(currentCount, Math.ceil((landmarkIndex + 1) / 6) * 6)
    );
  };

  return (
    <section className="neighborhood-guide" aria-labelledby="neighborhood-guide-title">
      <div className="neighborhood-guide__inner neighborhood-guide__content">
        <div className="neighborhood-guide__explore">
          <div className="neighborhood-guide__place-list">
            <a
              className="neighborhood-guide__back-link"
              href={`/cities/${city.routeSlug}`}
            >
              &larr; Back to {city.name}
            </a>
            <h1 id="neighborhood-guide-title">Places to see in {neighborhood.name}.</h1>
            <p className="neighborhood-guide__intro">
              Looking for the best places to see in {neighborhood.name}? Dora brings together{' '}
              {formatPlaceCount(neighborhood.landmarkCount)} spanning {joinList(topics)}. When a place catches
              your eye, press play in Dora to hear the story behind it.
              {!isIntroExpanded && (
                <>
                  {' '}
                  <button
                    className="neighborhood-guide__more-trigger"
                    type="button"
                    aria-expanded="false"
                    onClick={() => setIsIntroExpanded(true)}
                  >
                    more
                  </button>
                </>
              )}
            </p>
            <div className="neighborhood-guide__more-content" hidden={!isIntroExpanded}>
              <p className="neighborhood-guide__intro neighborhood-guide__intro--secondary">
                This {neighborhood.name} guide helps you find places worth seeing nearby and
                understand the local history around them before or during your visit.
              </p>
              <p className="neighborhood-guide__intro neighborhood-guide__intro--secondary">
                Start with {featuredNames.join(', ')}, then follow the stories that catch
                your attention as you explore {neighborhood.name} at your own pace.
              </p>
              <button
                className="neighborhood-guide__more-trigger neighborhood-guide__less-trigger"
                type="button"
                aria-expanded="true"
                onClick={() => setIsIntroExpanded(false)}
              >
                less
              </button>
            </div>
            <div
              className="neighborhood-guide__places"
              aria-label={`Places to see in ${neighborhood.name}`}
            >
              {visibleLandmarks.map((landmark) => (
                <NeighborhoodPlaceCard
                  isSelected={selectedPlaceName === landmark.name}
                  landmark={landmark}
                  key={landmark.name}
                  onSelect={handlePlaceSelect}
                />
              ))}
            </div>
            {remainingPlaceCount > 0 && (
              <button
                className="neighborhood-guide__show-more"
                type="button"
                onClick={() => setVisiblePlaceCount((count) => count + 6)}
              >
                Show {Math.min(remainingPlaceCount, 6)} more
              </button>
            )}
          </div>
          <div className="neighborhood-guide__map-column">
            <NeighborhoodMap
              neighborhoodName={neighborhood.name}
              landmarks={landmarks}
              onSelectLandmark={handleMapMarkerSelect}
              ref={mapRef}
              selectedLandmarkName={selectedPlaceName}
            />
          </div>
        </div>
      </div>

    </section>
  );
};

export default NeighborhoodGuide;
