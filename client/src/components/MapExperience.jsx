import { useState, useEffect, useRef, useMemo } from 'react';
import './MapExperience.css';
import newYorkAudio from '../assets/audio/new_york.mp3';
import parisAudio from '../assets/audio/paris.mp3';
import milanAudio from '../assets/audio/milan.mp3';
import palermoAudio from '../assets/audio/palermo.mp3';

const appMarkerColors = {
  Art: '#6265FA',
  Nature: '#04C977',
  Cultural: '#3B97FA',
  Historical: '#FE8101',
  Neighborhood: '#F9D452',
};

const markerStyleForCategory = (category) => ({
  color: appMarkerColors[category] || appMarkerColors.Cultural,
  glyphColor: '#ffffff',
  glyphText: 'D',
});

const markerColorForCategory = (category) =>
  appMarkerColors[category] || appMarkerColors.Cultural;

const MapDockPlayGlyph = () => (
  <svg
    className="map-experience__viz-dock-play-glyph"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M6.5145 2.14251C6.20556 1.95715 5.82081 1.95229 5.5073 2.1298C5.19379 2.30731 5 2.63973 5 3V21C5 21.3603 5.19379 21.6927 5.5073 21.8702C5.82081 22.0477 6.20556 22.0429 6.5145 21.8575L21.5145 12.8575C21.8157 12.6768 22 12.3513 22 12C22 11.6487 21.8157 11.3232 21.5145 11.1425L6.5145 2.14251Z"
    />
  </svg>
);

const MapDockPauseGlyph = () => (
  <svg
    className="map-experience__viz-dock-play-glyph"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M4 4C4 3.44772 4.44772 3 5 3H9C9.55228 3 10 3.44772 10 4V20C10 20.5523 9.55228 21 9 21H5C4.44772 21 4 20.5523 4 20V4Z"
    />
    <path
      fill="currentColor"
      d="M14 4C14 3.44772 14.4477 3 15 3H19C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21H15C14.4477 21 14 20.5523 14 20V4Z"
    />
  </svg>
);

const formatClock = (totalSeconds) => {
  const t = Number.isFinite(totalSeconds)
    ? Math.max(0, Math.floor(totalSeconds))
    : 0;
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

/** Parses labels like "6:28" used in `sampleStops[].duration`. */
const parseClockLabelToSeconds = (label) => {
  if (!label || typeof label !== 'string') return 0;
  const match = label.trim().match(/^(\d+):(\d{2})$/);
  if (!match) return 0;
  const m = Number(match[1]);
  const s = Number(match[2]);
  if (!Number.isFinite(m) || !Number.isFinite(s) || s > 59) return 0;
  return m * 60 + s;
};

const sampleStops = [
  {
    id: 'new-york',
    title: 'New York',
    category: 'Art',
    duration: '6:28',
    coordinate: { latitude: 40.748541, longitude: -73.985758 },
    hook: 'A fast-moving introduction to the city’s layers: Dutch trading post, immigrant capital, skyscraper laboratory, cultural engine.',
    audioSrc: newYorkAudio,
    tone: { frequencies: [349.23, 440, 587.33], duration: 1.9 },
  },
  {
    id: 'paris',
    title: 'Paris',
    category: 'Nature',
    duration: '6:48',
    coordinate: { latitude: 48.8566, longitude: 2.3522 },
    hook: 'A story of river islands, revolutions, boulevards, cafés, museums, and the rituals that make Paris feel like Paris.',
    audioSrc: parisAudio,
    tone: { frequencies: [415.3, 554.37, 659.25], duration: 1.6 },
  },
  {
    id: 'milan',
    title: 'Milan',
    category: 'Historical',
    duration: '6:30',
    coordinate: { latitude: 45.4642, longitude: 9.19 },
    hook: 'A compact introduction to Milan through its cathedral, courtyards, fashion houses, factories, and quiet design intelligence.',
    audioSrc: milanAudio,
    tone: { frequencies: [329.63, 493.88, 659.25], duration: 1.7 },
  },
  {
    id: 'palermo',
    title: 'Palermo',
    category: 'Neighborhood',
    duration: '5:40',
    coordinate: { latitude: 38.1157, longitude: 13.3615 },
    hook: 'Arab-Norman palaces, baroque churches, chaotic markets, and Mediterranean sea air.',
    audioSrc: palermoAudio,
    tone: { frequencies: [392, 523.25, 698.46], duration: 2.1 },
  },
];

const DEFAULT_STOP_ID = 'new-york';

const MapExperience = () => {
  const [status, setStatus] = useState('');
  const [activeStopId, setActiveStopId] = useState(DEFAULT_STOP_ID);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControl, setShowControl] = useState(false);
  const [mapAwaitingPlay, setMapAwaitingPlay] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [fallbackState, setFallbackState] = useState({
    visible: false,
    title: 'Map preview unavailable.',
    detail: 'The interactive preview is not available right now.',
  });
  const audioRef = useRef(null);
  const endedHandlerRef = useRef(null);
  const playbackRequestRef = useRef(0);
  const statusRegionRef = useRef(null);
  const mapViewRef = useRef(null);
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

  const stopById = useMemo(
    () => new Map(sampleStops.map((stop) => [stop.id, stop])),
    []
  );

  const [listItems, setListItems] = useState(() =>
    sampleStops.map((stop) => ({
      id: stop.id,
      title: stop.title,
      duration: stop.duration,
      markerColor: markerColorForCategory(stop.category),
      markerForeground: '#ffffff',
      isActive: stop.id === DEFAULT_STOP_ID,
    }))
  );

  const activeStop =
    stopById.get(activeStopId) ?? stopById.get(DEFAULT_STOP_ID) ?? null;
  const clipDurationSeconds = activeStop
    ? parseClockLabelToSeconds(activeStop.duration)
    : 0;

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
        mapViewEl.querySelector(
          'canvas, .mapkit-map, .mapkit-annotation-container'
        );

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
      focusStop(stopId, { source: 'list', autoPlay: true });
    };

    window.addEventListener('dora:play-story-stop', handleHeroStoryRequest);

    return () => {
      window.removeEventListener(
        'dora:play-story-stop',
        handleHeroStoryRequest
      );
    };
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !activeStopId) return;

    const sync = () => {
      setElapsedSeconds(Math.floor(el?.currentTime || 0));
    };

    if (isPlaying) {
      sync();
      el.addEventListener('timeupdate', sync);
      el.addEventListener('seeked', sync);
      return () => {
        el.removeEventListener('timeupdate', sync);
        el.removeEventListener('seeked', sync);
      };
    }

    if (showControl && el.readyState >= 1) {
      sync();
    }
    return undefined;
  }, [isPlaying, showControl, activeStopId]);

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
    setListItems(
      sampleStops.map((stop) => ({
        id: stop.id,
        title: stop.title,
        duration: stop.duration,
        markerColor: markerColorForCategory(stop.category),
        markerForeground: '#ffffff',
        isActive: stop.id === DEFAULT_STOP_ID,
      }))
    );
  };

  const showMapFallback = (title, detail) => {
    setStatus(detail || title || '');
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

    activeStateRef.current.map = configuredMap;

    sampleStops.forEach((stop) => {
      const coordinate = new mapkitApi.Coordinate(
        stop.coordinate.latitude,
        stop.coordinate.longitude
      );
      const markerStyle = markerStyleForCategory(stop.category);
      const annotation = new mapkitApi.MarkerAnnotation(coordinate, {
        title: stop.title,
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

      focusStop(id, { source: 'map', autoPlay: false });
    });

    configuredMap.addEventListener('deselect', () => {
      activeStateRef.current.suppressMapSelect = null;
      setMapAwaitingPlay(false);
    });
  };

  const focusStop = (stopId, options = {}) => {
    const stop = stopById.get(stopId);
    if (!stop) return;

    const resolvedOptions = {
      source: options.source || 'list',
      autoPlay: options.autoPlay ?? true,
    };

    const shouldAdjustMap =
      options.adjustMap ??
      (resolvedOptions.autoPlay && resolvedOptions.source === 'list');

    if (activeStateRef.current.stopId !== stopId) {
      stopAudio();
    }

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
    if (annotation && map && shouldAdjustMap) {
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
    setElapsedSeconds(0);

    if (resolvedOptions.autoPlay) {
      setMapAwaitingPlay(false);
      if (!playStopAudio(stop)) {
        setStatus(
          'Audio preview is not available in this browser. Try another browser to listen.'
        );
      } else {
        setStatus('');
      }
    } else {
      if (resolvedOptions.source === 'map') {
        setMapAwaitingPlay(true);
      }
      if (resolvedOptions.source === 'list') {
        setMapAwaitingPlay(false);
      }
      setStatus('');
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
        setMapAwaitingPlay(false);
        setStatus(`Finished playing ${stop.title}.`);
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
        renderNowPlaying();
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

    setStatus(`Playing a short preview for ${stop.title}.`);
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
      setMapAwaitingPlay(false);
      setStatus('Choose a city and tap play to hear another sample story.');
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

  const renderNowPlaying = () => {
    setStatus('');
  };

  const handleCitySelect = (stopId) => {
    focusStop(stopId, { source: 'list', autoPlay: true });
  };

  const startOrTogglePlayback = () => {
    const sid = activeStopId;
    if (!sid) return;
    const stop = stopById.get(sid);
    if (!stop) return;

    if (isPlaying && audioRef.current && !audioRef.current.paused) {
      handlePauseResume();
      return;
    }

    if (
      showControl &&
      audioRef.current &&
      audioRef.current.paused &&
      activeStateRef.current.stopId === sid
    ) {
      handlePauseResume();
      return;
    }

    focusStop(sid, { source: 'list', autoPlay: true });
  };

  const handlePauseResume = () => {
    const sid = activeStateRef.current.stopId || activeStopId;
    if (!sid) return;

    if (isPlaying && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      activeStateRef.current.isPlaying = false;
      setIsPlaying(false);
      setElapsedSeconds(Math.floor(audioRef.current.currentTime || 0));
      renderNowPlaying();
    } else if (audioRef.current && audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => {
          activeStateRef.current.isPlaying = true;
          setIsPlaying(true);
          renderNowPlaying();
        })
        .catch((error) => {
          console.warn('Audio resume failed', error);
        });
    }
  };

  const hasSelection = Boolean(activeStop);
  const shouldShowMapDock =
    hasSelection && (isPlaying || showControl || mapAwaitingPlay);
  const shouldShowStatus = Boolean(status.trim());

  const displayElapsedSeconds =
    hasSelection && (isPlaying || showControl || mapAwaitingPlay)
      ? elapsedSeconds
      : 0;
  const countdownSeconds = Math.max(
    0,
    clipDurationSeconds - displayElapsedSeconds
  );

  const elapsedCountdownPair = `${formatClock(displayElapsedSeconds)} / ${formatClock(countdownSeconds)}`;

  return (
    <section className="map-experience" id="listen">
      <div className="map-experience__inner">
        <div className="map-experience__intro">
          <h2>Hear Dora in action.</h2>
        </div>

        <div className="map-experience__layout">
          <div className="map-experience__listen-column">
            {shouldShowStatus && (
              <div
                ref={statusRegionRef}
                className="map-experience__listen-status"
                role="status"
                aria-live="polite"
              >
                {status}
              </div>
            )}

            <div className="map-experience__panel map-experience__panel--listen">
              <div className="map-experience__listen-head">
                <div className="map-experience__chips">
                  <span className="map-experience__chip">{activeStop.title}</span>
                  <span className="map-experience__chip">{activeStop.duration}</span>
                </div>

                <h3 className="map-experience__listen-story-title">
                  {activeStop.title}
                </h3>

                <p className="map-experience__listen-hook">{activeStop.hook}</p>
              </div>

              <div className="map-experience__city-section map-experience__city-section--compact">
                <div className="map-experience__city-label map-experience__city-label--compact">
                  Choose a city
                </div>
                <div className="map-experience__city-grid">
                  {listItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`map-experience__city-btn map-experience__city-btn--compact ${
                        item.isActive ? 'is-active' : ''
                      }`}
                      style={{
                        '--map-stop-color': item.markerColor,
                        '--map-stop-foreground': item.markerForeground,
                      }}
                      onClick={() => handleCitySelect(item.id)}
                    >
                      <span className="map-experience__city-btn-title">
                        {item.title}
                      </span>
                      <span className="map-experience__city-btn-meta">
                        {item.duration}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <p className="map-experience__listen-hint">
                Select a city or tap a marker to hear a sample story.
              </p>
            </div>
          </div>

          <div
            className={`map-experience__panel map-experience__panel--viz ${
              fallbackState.visible ? 'has-fallback' : ''
            }`}
          >
            <div className="map-experience__viz map-experience__viz--mapkit">
              <div
                ref={mapViewRef}
                id="dora-map"
                className="map-experience__map-view"
                role="presentation"
                aria-label="Preview of Dora tour stops"
              />
              <div
                className="map-experience__fallback"
                id="mapkit-fallback"
                hidden={!fallbackState.visible}
              >
                <p className="map-experience__fallback-title">
                  {fallbackState.title}
                </p>
                <p className="map-experience__fallback-detail">
                  {fallbackState.detail}
                </p>
              </div>

              {shouldShowMapDock && (
                <div className="map-experience__viz-dock">
                  <div className="map-experience__viz-dock-text">
                    <div className="map-experience__viz-dock-eyebrow">
                      Discovering
                    </div>
                    <div className="map-experience__viz-dock-title">
                      {activeStop.title}
                    </div>
                    <div
                      className="map-experience__viz-dock-timer"
                      aria-label={`Elapsed ${formatClock(displayElapsedSeconds)}, ${formatClock(countdownSeconds)} remaining`}
                    >
                      {elapsedCountdownPair}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="map-experience__viz-dock-play"
                    onClick={startOrTogglePlayback}
                    aria-label={
                      isPlaying ? 'Pause audio preview' : 'Play audio preview'
                    }
                  >
                    <span
                      className="map-experience__viz-dock-play-crossfade"
                      aria-hidden="true"
                    >
                      <span
                        className={`map-experience__viz-dock-play-layer map-experience__viz-dock-play-layer--play ${
                          !isPlaying ? 'is-visible' : ''
                        }`}
                      >
                        <MapDockPlayGlyph />
                      </span>
                      <span
                        className={`map-experience__viz-dock-play-layer map-experience__viz-dock-play-layer--pause ${
                          isPlaying ? 'is-visible' : ''
                        }`}
                      >
                        <MapDockPauseGlyph />
                      </span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapExperience;
