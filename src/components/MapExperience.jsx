import { useState, useEffect, useRef } from 'react';
import './MapExperience.css';
import newYorkAudio from '../assets/new_york.mp3';
import parisAudio from '../assets/paris.mp3';
import milanAudio from '../assets/milan.mp3';
import palermoAudio from '../assets/palermo.mp3';

const appMarkerColors = {
  Art: '#6265FA',
  Nature: '#04C977',
  Cultural: '#3B97FA',
  Historical: '#FE8101',
  Neighborhood: '#F9D452',
};

const markerStyleForCategory = (category) => {
  return {
    color: appMarkerColors[category] || appMarkerColors.Cultural,
    glyphColor: '#ffffff',
    glyphText: 'D',
  };
};

const markerColorForCategory = (category) =>
  appMarkerColors[category] || appMarkerColors.Cultural;

const MapExperience = () => {
  const [status, setStatus] = useState('Loading the map preview...');
  const [activeStopId, setActiveStopId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControl, setShowControl] = useState(false);
  const [fallbackState, setFallbackState] = useState({
    visible: false,
    title: 'Map preview unavailable.',
    detail: 'The interactive preview is not available right now.',
  });
  const audioRef = useRef(null);
  const endedHandlerRef = useRef(null);
  const playbackRequestRef = useRef(0);
  const statusControlRef = useRef(null);
  const statusRegionRef = useRef(null);
  const mapViewRef = useRef(null);

  const sampleStops = [
    {
      id: 'new-york',
      title: 'New York City',
      category: 'Art',
      coordinate: { latitude: 40.748541, longitude: -73.985758 },
      audioSrc: newYorkAudio,
      tone: { frequencies: [349.23, 440, 587.33], duration: 1.9 },
    },
    {
      id: 'paris',
      title: 'Paris',
      category: 'Nature',
      coordinate: { latitude: 48.8566, longitude: 2.3522 },
      audioSrc: parisAudio,
      tone: { frequencies: [415.3, 554.37, 659.25], duration: 1.6 },
    },
    {
      id: 'milan',
      title: 'Milan',
      category: 'Historical',
      coordinate: { latitude: 45.4642, longitude: 9.19 },
      audioSrc: milanAudio,
      tone: { frequencies: [329.63, 493.88, 659.25], duration: 1.7 },
    },
    {
      id: 'palermo',
      title: 'Palermo',
      category: 'Neighborhood',
      coordinate: { latitude: 38.1157, longitude: 13.3615 },
      audioSrc: palermoAudio,
      tone: { frequencies: [392, 523.25, 698.46], duration: 2.1 },
    },
  ];

  const stopById = new Map(sampleStops.map((stop) => [stop.id, stop]));
  const [listItems, setListItems] = useState([]);
  const annotationsRef = useRef(new Map());
  const isMapReadyRef = useRef(false);
  const mapRetryTimerRef = useRef(null);
  const mapRetryCountRef = useRef(0);
  const activeStateRef = useRef({
    stopId: null,
    baseSpan: null,
    suppressMapSelect: null,
    map: null,
    isPlaying: false,
  });

  useEffect(() => {
    initializeMapExperience();

    return () => {
      if (mapRetryTimerRef.current) {
        window.clearTimeout(mapRetryTimerRef.current);
        mapRetryTimerRef.current = null;
      }
      mapRetryCountRef.current = 0;

      stopAudio();

      const currentMap = activeStateRef.current.map;
      if (currentMap && typeof currentMap.destroy === 'function') {
        try {
          currentMap.destroy();
        } catch (error) {
          console.warn('Failed to destroy map instance during cleanup', error);
        }
      }

      activeStateRef.current.map = null;
      activeStateRef.current.stopId = null;
      activeStateRef.current.baseSpan = null;
      activeStateRef.current.suppressMapSelect = null;
      annotationsRef.current.clear();
      isMapReadyRef.current = false;
    };
  }, []);

  useEffect(() => {
    const mapViewEl = mapViewRef.current;
    if (!mapViewEl || typeof MutationObserver === 'undefined') return;

    const clearFalseFallback = () => {
      const hasRenderedMapSurface =
        mapViewEl.childElementCount > 0 ||
        mapViewEl.querySelector('canvas, .mapkit-map, .mapkit-annotation-container');

      if (hasRenderedMapSurface) {
        isMapReadyRef.current = true;
        setFallbackState((prev) =>
          prev.visible ? { ...prev, visible: false } : prev
        );
      }
    };

    clearFalseFallback();

    const observer = new MutationObserver(() => {
      clearFalseFallback();
    });

    observer.observe(mapViewEl, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleHeroStoryRequest = (event) => {
      const stopId = event?.detail?.stopId;
      if (!stopId) return;
      focusStop(stopId, { source: 'list' });
    };

    window.addEventListener('dora:play-story-stop', handleHeroStoryRequest);

    return () => {
      window.removeEventListener(
        'dora:play-story-stop',
        handleHeroStoryRequest
      );
    };
  }, []);

  const initializeMapExperience = () => {
    buildStopList();
    initializeMap();
  };

  const scheduleMapRetry = () => {
    if (mapRetryTimerRef.current) return;
    mapRetryTimerRef.current = window.setTimeout(() => {
      mapRetryTimerRef.current = null;
      initializeMap();
    }, 260);
  };

  const isMapKitAlreadyInitializedError = (error) => {
    const message =
      typeof error?.message === 'string' ? error.message.toLowerCase() : '';
    return message.includes('already') && message.includes('initial');
  };

  const buildStopList = () => {
    const items = sampleStops.map((stop) => ({
      id: stop.id,
      title: stop.title,
      markerColor: markerColorForCategory(stop.category),
      markerForeground: '#ffffff',
      isActive: false,
    }));
    setListItems(items);
  };

  const initializeMap = () => {
    if (isMapReadyRef.current && activeStateRef.current.map) {
      setFallbackState((prev) => ({ ...prev, visible: false }));
      return;
    }

    const mapkitApi = window.mapkit;
    if (!mapkitApi) {
      mapRetryCountRef.current += 1;
      const shouldRetry = mapRetryCountRef.current <= 20;
      if (shouldRetry) {
        setStatus('Loading the map preview...');
        scheduleMapRetry();
        return;
      }
      console.warn('MapKit JS not available on window after retries.');
      showMapFallback(
        'Map preview unavailable.',
        'The interactive map could not load. Check your connection and try again.'
      );
      return;
    }
    mapRetryCountRef.current = 0;

    const tokenMeta = document.querySelector('meta[name="mapkit-token"]');
    const token = tokenMeta ? tokenMeta.content.trim() : '';

    if (!token) {
      showMapFallback(
        'Map preview unavailable.',
        'The map preview is not available right now.'
      );
      return;
    }

    const expiryMs = readTokenExpiry(token);
    if (expiryMs && Date.now() >= expiryMs) {
      const expiryLabel = new Date(expiryMs).toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      });
      showMapFallback(
        'Map token expired.',
        `The map preview expired on ${expiryLabel}. Refresh the page and try again.`
      );
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
      if (isMapKitAlreadyInitializedError(error)) {
        console.info('MapKit already initialized; continuing with map setup.');
      } else {
        console.error('MapKit initialization failed', error);
        showMapFallback(
          'Map preview unavailable.',
          'The interactive map could not start. Try refreshing the page.'
        );
        return;
      }
    }

    let configuredMap;
    try {
      const mapOptions = {
        showsMapTypeControl: false,
        showsCompass: mapkitApi.FeatureVisibility.Hidden,
        showsUserLocationControl: false,
        showsZoomControl: false,
      };

      configuredMap = new mapkitApi.Map('dora-map', mapOptions);
    } catch (error) {
      console.error('MapKit map creation failed', error);
      showMapFallback(
        'Map preview unavailable.',
        'Your browser could not start the embedded Apple Map preview.'
      );
      return;
    }

    setFallbackState((prev) => ({ ...prev, visible: false }));
    isMapReadyRef.current = true;

    setStatus('');

    activeStateRef.current.map = configuredMap;

    sampleStops.forEach((stop) => {
      const coordinate = new mapkitApi.Coordinate(
        stop.coordinate.latitude,
        stop.coordinate.longitude
      );
      const markerStyle = markerStyleForCategory(stop.category);
      const annotation = new mapkitApi.MarkerAnnotation(coordinate, {
        title: stop.title,
        subtitle: stop.subtitle,
        ...markerStyle,
      });
      annotation.data = { id: stop.id };
      configuredMap.addAnnotation(annotation);
      annotationsRef.current.set(stop.id, annotation);
    });

    const bounds = computeBounds(sampleStops);
    const span = new mapkitApi.CoordinateSpan(bounds.spanLat, bounds.spanLon);
    const center = new mapkitApi.Coordinate(bounds.centerLat, bounds.centerLon);
    configuredMap.region = new mapkitApi.CoordinateRegion(center, span);
    activeStateRef.current.baseSpan = span;

    configuredMap.addEventListener('select', (event) => {
      const { annotation } = event || {};
      const id = annotation?.data?.id;
      if (!id) return;

      const shouldSuppress = activeStateRef.current.suppressMapSelect === id;
      activeStateRef.current.suppressMapSelect = null;
      if (shouldSuppress) return;

      focusStop(id, { source: 'map' });
    });

    configuredMap.addEventListener('deselect', () => {
      activeStateRef.current.suppressMapSelect = null;
    });
  };

  const focusStop = (stopId, options = {}) => {
    const stop = stopById.get(stopId);
    if (!stop) return;

    const resolvedOptions = {
      source: options.source || 'list',
      autoPlay: options.autoPlay ?? true,
    };

    const isAlreadyPlaying =
      resolvedOptions.autoPlay &&
      activeStateRef.current.stopId === stopId &&
      activeStateRef.current.isPlaying;

    if (isAlreadyPlaying) return;

    setListItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        isActive: item.id === stopId,
      }))
    );

    const annotation = annotationsRef.current.get(stopId);
    const map = activeStateRef.current.map;
    if (annotation && map && resolvedOptions.source !== 'map') {
      try {
        const span =
          activeStateRef.current.baseSpan ||
          (map.region && map.region.span) ||
          new window.mapkit.CoordinateSpan(0.04, 0.04);
        activeStateRef.current.suppressMapSelect = stopId;
        if (typeof map.selectAnnotation === 'function') {
          map.selectAnnotation(annotation);
        } else {
          annotation.selected = true;
        }
        map.region = new window.mapkit.CoordinateRegion(
          annotation.coordinate,
          span
        );
      } catch (error) {
        if (activeStateRef.current.suppressMapSelect === stopId) {
          activeStateRef.current.suppressMapSelect = null;
        }
        console.warn('Unable to update map selection', error);
      }
    }

    activeStateRef.current.stopId = stopId;
    setActiveStopId(stopId);

    if (resolvedOptions.autoPlay) {
      if (!playStopAudio(stop)) {
        setStatus(
          'Audio preview is not available in this browser. Try another browser to listen.'
        );
      }
    } else {
      setStatus(`${stop.title} selected.`);
    }
  };

  const playStopAudio = (stop) => {
    if (stop.audioSrc) {
      const requestId = playbackRequestRef.current + 1;
      playbackRequestRef.current = requestId;

      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.preload = 'auto';
      }

      const element = audioRef.current;
      stopAudio({ invalidatePlayback: false });

      // Ensure old listeners from previous stops do not leak stale status text.
      if (endedHandlerRef.current) {
        element.removeEventListener('ended', endedHandlerRef.current);
        endedHandlerRef.current = null;
      }

      element.src = stop.audioSrc;
      element.currentTime = 0;
      element.volume = 1;

      const handleEnded = () => {
        if (playbackRequestRef.current !== requestId) return;
        stopAudio();
        setStatus(`Finished playing ${stop.title}.`, { showControl: false });
        setIsPlaying(false);
        setShowControl(false);
      };
      endedHandlerRef.current = handleEnded;
      element.addEventListener('ended', handleEnded);

      const updateToPlaying = () => {
        if (playbackRequestRef.current !== requestId) return;
        activeStateRef.current.isPlaying = true;
        setIsPlaying(true);
        setShowControl(true);
        renderNowPlaying(false, stop.id);
      };

      const playPromise = element.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.then(updateToPlaying).catch((error) => {
          if (playbackRequestRef.current !== requestId) return;
          console.warn(
            'Audio playback failed; falling back to generated tone.',
            error
          );
          stopAudio({ invalidatePlayback: false });
          if (!playTone(stop)) {
            setStatus(
              'Audio preview is not available in this browser. Try another browser to listen.'
            );
          }
        });
      } else {
        updateToPlaying();
      }

      return true;
    }

    return playTone(stop);
  };

  const playTone = (stop) => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;

    let audioContext;
    try {
      audioContext = new AudioCtx();
      if (audioContext.state === 'suspended')
        audioContext.resume().catch(() => {});
    } catch (error) {
      return false;
    }

    setStatus(`Playing a short preview for ${stop.title}.`, {
      showControl: false,
    });
    activeStateRef.current.isPlaying = true;
    setIsPlaying(true);
    setShowControl(false);

    const duration = stop.tone?.duration || 1.8;
    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
    gain.connect(audioContext.destination);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.7, now + 0.08);
    gain.gain.linearRampToValueAtTime(0, now + duration);

    const frequencies = stop.tone?.frequencies || [392, 523.25, 659.25];
    const detuneCents = stop.tone?.detuneCents || [0, -35, 25];
    const oscillators = frequencies.map((frequency, index) => {
      const osc = audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);
      const detune = detuneCents[index % detuneCents.length];
      if (detune) osc.detune.setValueAtTime(detune, now);
      osc.connect(gain);
      osc.start(now + index * 0.05);
      osc.stop(now + duration);
      return osc;
    });

    const stopFn = () => {
      oscillators.forEach((osc) => {
        try {
          osc.stop();
        } catch {}
        try {
          osc.disconnect();
        } catch {}
      });
      try {
        gain.disconnect();
      } catch {}
      activeStateRef.current.isPlaying = false;
      setIsPlaying(false);
      setShowControl(false);
    };

    setTimeout(() => {
      stopFn();
      setStatus('Choose a city and tap to hear another sample story.');
    }, duration * 1000 + 150);

    return true;
  };

  const stopAudio = ({ invalidatePlayback = true } = {}) => {
    if (invalidatePlayback) {
      playbackRequestRef.current += 1;
    }

    if (audioRef.current) {
      if (endedHandlerRef.current) {
        audioRef.current.removeEventListener('ended', endedHandlerRef.current);
        endedHandlerRef.current = null;
      }
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    activeStateRef.current.isPlaying = false;
    setIsPlaying(false);
    setShowControl(false);
  };

  const computeBounds = (stops) => {
    const initial = stops[0].coordinate;
    let minLat = initial.latitude;
    let maxLat = initial.latitude;
    let minLon = initial.longitude;
    let maxLon = initial.longitude;

    stops.forEach((stop) => {
      const { latitude, longitude } = stop.coordinate;
      minLat = Math.min(minLat, latitude);
      maxLat = Math.max(maxLat, latitude);
      minLon = Math.min(minLon, longitude);
      maxLon = Math.max(maxLon, longitude);
    });

    const paddingFactor = 1.35;
    const latDelta = Math.max(0.02, (maxLat - minLat) * paddingFactor);
    const lonDelta = Math.max(0.02, (maxLon - minLon) * paddingFactor);

    return {
      centerLat: (minLat + maxLat) / 2,
      centerLon: (minLon + maxLon) / 2,
      spanLat: latDelta,
      spanLon: lonDelta,
    };
  };

  const renderNowPlaying = (isPaused = false, stopIdOverride = null) => {
    const stopId =
      stopIdOverride || activeStateRef.current.stopId || activeStopId;
    const stop = stopById.get(stopId);
    if (!stop) return;
    const message = isPaused
      ? `Paused: ${stop.title}`
      : `Now Playing: ${stop.title}`;
    setStatus(message, { showControl: true, isPaused });
  };

  const showMapFallback = (title, detail) => {
    setStatus(detail || title);
    setFallbackState({
      visible: true,
      title,
      detail: detail || '',
    });
  };

  const readTokenExpiry = (token) => {
    try {
      const payloadSegment = token.split('.')[1];
      if (!payloadSegment) return null;
      const normalized = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(
        normalized.length + ((4 - (normalized.length % 4)) % 4),
        '='
      );
      const payload = JSON.parse(window.atob(padded));
      return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  };

  const handleControlClick = () => {
    if (isPlaying) {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        activeStateRef.current.isPlaying = false;
        setIsPlaying(false);
        renderNowPlaying(true, activeStateRef.current.stopId);
      }
    } else {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => {
            activeStateRef.current.isPlaying = true;
            setIsPlaying(true);
            renderNowPlaying(false, activeStateRef.current.stopId);
          })
          .catch((error) => {
            console.warn('Audio resume failed', error);
          });
      }
    }
  };

  const handleStopClick = (stopId) => {
    focusStop(stopId, { source: 'list' });
  };

  const shouldShowStatus = Boolean(status) || showControl;

  return (
    <section className="map-experience" id="listen">
      <div className="map-experience__container">
        <div className="map-experience__text">
          <h2>Try a Dora audio stop right now.</h2>
          <p>
            Tap a stop or marker to hear a sample story.
          </p>
          {shouldShowStatus && (
            <div
              ref={statusRegionRef}
              className="map-experience__status"
              role="status"
              aria-live="polite"
            >
              <span className="map-experience__status-text">{status}</span>
              <button
                ref={statusControlRef}
                className={`map-experience__status-control ${
                  showControl ? 'is-visible' : 'is-hidden'
                }`}
                type="button"
                onClick={handleControlClick}
                aria-hidden={!showControl}
                tabIndex={showControl ? 0 : -1}
                disabled={!showControl}
                aria-label={
                  isPlaying ? 'Pause audio preview' : 'Resume audio preview'
                }
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          )}
          <div className="map-experience__list">
            {listItems.map((item) => (
              <article
                key={item.id}
                className={`map-experience__item ${
                  item.isActive ? 'is-active' : ''
                }`}
                style={{
                  '--map-stop-color': item.markerColor,
                  '--map-stop-foreground': item.markerForeground,
                }}
              >
                <button
                  type="button"
                  className="map-experience__item-button"
                  onClick={() => handleStopClick(item.id)}
                  aria-pressed={item.isActive}
                >
                  <span className="map-experience__item-title">
                    {item.title}
                  </span>
                </button>
              </article>
            ))}
          </div>
        </div>
        <div
          className={`map-experience__map ${
            fallbackState.visible ? 'has-fallback' : ''
          }`}
        >
          <div
            ref={mapViewRef}
            id="dora-map"
            className="map-experience__map-view"
            role="presentation"
            aria-label="Preview of Dora tour stops"
          ></div>
          <div
            className="map-experience__fallback"
            id="mapkit-fallback"
            hidden={!fallbackState.visible}
          >
            <p className="map-experience__fallback-title">
              {fallbackState.title}
            </p>
            <p className="smallprint">
              {fallbackState.detail}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapExperience;
