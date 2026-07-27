import { useRef, useState } from 'react';
import { appStoreUrl } from '../metadata.js';
import {
  getNeighborhoodGuideByPath,
  getNeighborhoodGuideContent,
  getNeighborhoodGuideFaq,
} from '../data/cityGuides.js';
import GuideFaq from '../components/GuideFaq.jsx';
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
  const faq = getNeighborhoodGuideFaq(city, neighborhood);
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
            <h1 id="neighborhood-guide-title">Places to see in {neighborhood.name}.</h1>
            <p className="neighborhood-guide__intro">
              Looking for the best places to see in {neighborhood.name}? Dora brings together{' '}
              {neighborhood.landmarkCount} places spanning {joinList(topics)}. When a place catches
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

        <GuideFaq questions={faq} />
      </div>

      <aside className="neighborhood-guide__closing">
        <div className="neighborhood-guide__closing-inner">
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

export default NeighborhoodGuide;
