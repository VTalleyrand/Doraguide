import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  computeBounds,
  isMapKitAlreadyInitializedError,
  markerStyleForCategory,
  readTokenExpiry,
} from './MapExperience/mapExperienceUtils.js';
import './NeighborhoodMap.css';

const MAX_MAP_RETRIES = 20;

const NeighborhoodMap = forwardRef(
  ({ neighborhoodName, landmarks, onSelectLandmark, selectedLandmarkName }, ref) => {
  const mapSurfaceRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const annotationsRef = useRef(new Map());
  const baseSpanRef = useRef(null);
  const pendingLandmarkRef = useRef(null);
  const onSelectLandmarkRef = useRef(onSelectLandmark);
  const [fallbackMessage, setFallbackMessage] = useState('');
  const mapLandmarks = useMemo(
    () =>
      landmarks.filter(
        (landmark) =>
          Number.isFinite(landmark.latitude) && Number.isFinite(landmark.longitude)
      ),
    [landmarks]
  );
  const mapLandmarkKey = mapLandmarks
    .map(
      (landmark) =>
        `${landmark.name}:${landmark.latitude}:${landmark.longitude}:${landmark.category}`
    )
    .join('|');

  useEffect(() => {
    onSelectLandmarkRef.current = onSelectLandmark;
  }, [onSelectLandmark]);

  const focusLandmark = (landmarkName) => {
    const map = mapInstanceRef.current;
    const annotation = annotationsRef.current.get(landmarkName);
    if (!map || !annotation || !window.mapkit) return false;

    try {
      if (typeof map.selectAnnotation === 'function') {
        map.selectAnnotation(annotation);
      } else {
        annotation.selected = true;
      }

      const span = baseSpanRef.current || new window.mapkit.CoordinateSpan(0.02, 0.02);
      map.region = new window.mapkit.CoordinateRegion(annotation.coordinate, span);
      return true;
    } catch (error) {
      console.warn('Unable to focus neighborhood map marker', error);
      return false;
    }
  };

  useImperativeHandle(ref, () => ({
    focusLandmark(landmarkName) {
      pendingLandmarkRef.current = landmarkName;
      if (focusLandmark(landmarkName)) pendingLandmarkRef.current = null;
    },
  }));

  useEffect(() => {
    if (!mapSurfaceRef.current || mapLandmarks.length === 0) return undefined;

    let map;
    let retryCount = 0;
    let retryTimer;
    let disposed = false;

    const showFallback = (message) => {
      if (!disposed) setFallbackMessage(message);
    };

    const retryLibraryLoad = () => {
      retryCount += 1;
      if (retryCount <= MAX_MAP_RETRIES) {
        retryTimer = window.setTimeout(initializeMap, 260);
        return true;
      }
      showFallback('The neighborhood map is not available right now.');
      return false;
    };

    const initializeMap = async () => {
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
        showFallback('The neighborhood map is not available right now.');
        return;
      }

      const expiryMs = readTokenExpiry(token);
      if (expiryMs && Date.now() >= expiryMs) {
        showFallback('The neighborhood map token has expired.');
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
          console.error('Neighborhood map initialization failed', error);
          showFallback('The neighborhood map is not available right now.');
          return;
        }
      }

      let MapConstructor;
      try {
        MapConstructor = mapkitApi.Map;
      } catch {
        retryLibraryLoad();
        return;
      }

      try {
        map = new MapConstructor('neighborhood-map', {
          showsMapTypeControl: false,
          showsCompass: mapkitApi.FeatureVisibility.Hidden,
          showsUserLocationControl: false,
          showsZoomControl: true,
        });

        const mapStops = mapLandmarks.map((landmark) => ({
          ...landmark,
          coordinate: {
            latitude: landmark.latitude,
            longitude: landmark.longitude,
          },
        }));

        mapStops.forEach((landmark) => {
          const annotation = new mapkitApi.MarkerAnnotation(
            new mapkitApi.Coordinate(
              landmark.coordinate.latitude,
              landmark.coordinate.longitude
            ),
            {
              ...markerStyleForCategory(landmark.category),
            }
          );
          annotation.data = { name: landmark.name };
          map.addAnnotation(annotation);
          annotationsRef.current.set(landmark.name, annotation);
        });

        const bounds = computeBounds(mapStops);
        const span = new mapkitApi.CoordinateSpan(bounds.spanLat, bounds.spanLon);
        map.region = new mapkitApi.CoordinateRegion(
          new mapkitApi.Coordinate(bounds.centerLat, bounds.centerLon),
          span
        );
        mapInstanceRef.current = map;
        baseSpanRef.current = span;
        map.addEventListener('select', (event) => {
          const landmarkName = event?.annotation?.data?.name;
          if (landmarkName) onSelectLandmarkRef.current?.(landmarkName);
        });

        if (pendingLandmarkRef.current && focusLandmark(pendingLandmarkRef.current)) {
          pendingLandmarkRef.current = null;
        }
        setFallbackMessage('');
      } catch (error) {
        if (error instanceof Error && error.message.includes('available after loading')) {
          retryLibraryLoad();
          return;
        }
        console.error('Neighborhood map creation failed', error);
        showFallback('The neighborhood map is not available right now.');
      }
    };

    initializeMap();

    return () => {
      disposed = true;
      if (retryTimer) window.clearTimeout(retryTimer);
      if (map && typeof map.destroy === 'function') {
        try {
          map.destroy();
        } catch (error) {
          console.warn('Failed to destroy neighborhood map', error);
        }
      }
      if (mapInstanceRef.current === map) mapInstanceRef.current = null;
      annotationsRef.current.clear();
      baseSpanRef.current = null;
    };
  // Card and marker selection re-render the parent. Recreate MapKit only when
  // the actual set of mapped locations changes, not for selection state.
  }, [mapLandmarkKey]);

  if (mapLandmarks.length === 0) return null;

  return (
    <section className="neighborhood-map" aria-label={`Map of places in ${neighborhoodName}`}>
      <div className="neighborhood-map__surface" id="neighborhood-map" ref={mapSurfaceRef} />
      {selectedLandmarkName && (
        <p className="neighborhood-map__selection" aria-live="polite">
          {selectedLandmarkName}
        </p>
      )}
      {fallbackMessage && <p className="neighborhood-map__fallback">{fallbackMessage}</p>}
    </section>
  );
  }
);

export default NeighborhoodMap;
