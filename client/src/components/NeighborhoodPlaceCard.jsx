import { useEffect, useRef, useState } from 'react';
import {
  isMapKitAlreadyInitializedError,
  readTokenExpiry,
} from './MapExperience/mapExperienceUtils.js';

const MAX_MAP_RETRIES = 20;

const NeighborhoodPlaceCard = ({ isSelected, landmark, onSelect }) => {
  const previewRef = useRef(null);
  const [visualState, setVisualState] = useState('loading');
  const hasCoordinates =
    Number.isFinite(landmark.latitude) && Number.isFinite(landmark.longitude);

  useEffect(() => {
    if (!hasCoordinates || !previewRef.current) return undefined;

    let preview;
    let retryCount = 0;
    let retryTimer;
    let disposed = false;

    const setUnavailable = () => {
      if (!disposed) setVisualState('unavailable');
    };

    const retryLibraryLoad = () => {
      retryCount += 1;
      if (retryCount <= MAX_MAP_RETRIES) {
        retryTimer = window.setTimeout(initializePreview, 260);
        return true;
      }
      setUnavailable();
      return false;
    };

    const initializePreview = async () => {
      if (disposed) return;
      const mapkitApi = window.mapkit;

      if (!mapkitApi) {
        retryLibraryLoad();
        return;
      }

      const token = document
        .querySelector('meta[name="mapkit-token"]')
        ?.content.trim();
      if (!token) {
        setUnavailable();
        return;
      }

      const expiryMs = readTokenExpiry(token);
      if (expiryMs && Date.now() >= expiryMs) {
        setUnavailable();
        return;
      }

      try {
        if (!mapkitApi.initialized) {
          mapkitApi.init({
            authorizationCallback(done) {
              done(token);
            },
          });
        }
      } catch (error) {
        if (!isMapKitAlreadyInitializedError(error)) {
          setUnavailable();
          return;
        }
      }

      let LookAroundPreview;
      try {
        LookAroundPreview = mapkitApi.LookAroundPreview;
      } catch {
        retryLibraryLoad();
        return;
      }

      if (!LookAroundPreview) {
        retryLibraryLoad();
        return;
      }

      try {
        preview = new LookAroundPreview(
          previewRef.current,
          { latitude: landmark.latitude, longitude: landmark.longitude },
          {
            isNavigationEnabled: false,
            isScrollEnabled: false,
            isZoomEnabled: false,
            showsPointsOfInterest: false,
            showsRoadLabels: false,
          }
        );
        preview.addEventListener('load', () => {
          if (!disposed) setVisualState('ready');
        });
        preview.addEventListener('error', setUnavailable);
      } catch (error) {
        if (error instanceof Error && error.message.includes('available after loading')) {
          retryLibraryLoad();
          return;
        }
        setUnavailable();
      }
    };

    initializePreview();

    return () => {
      disposed = true;
      if (retryTimer) window.clearTimeout(retryTimer);
      if (preview && typeof preview.destroy === 'function') preview.destroy();
    };
  }, [hasCoordinates, landmark.latitude, landmark.longitude]);

  const hasVisual = hasCoordinates && visualState !== 'unavailable';

  return (
    <button
      className={`neighborhood-guide__place ${
        hasVisual ? '' : 'neighborhood-guide__place--text-only'
      } ${isSelected ? 'is-selected' : ''}`}
      type="button"
      onClick={() => onSelect(landmark)}
      aria-pressed={isSelected}
    >
      {hasCoordinates && (
        <div
          className={`neighborhood-guide__place-visual ${
            visualState === 'ready' ? 'is-ready' : ''
          }`}
          ref={previewRef}
          aria-hidden="true"
        />
      )}
      <div className="neighborhood-guide__place-copy">
        <h3>{landmark.name}</h3>
        {landmark.description && <p>{landmark.description}</p>}
      </div>
    </button>
  );
};

export default NeighborhoodPlaceCard;
