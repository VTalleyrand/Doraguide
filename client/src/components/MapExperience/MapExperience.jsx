import { useState, useEffect, useRef, useMemo } from 'react';
import './MapExperience.css';
import MapPreview from './MapPreview';
import { DEFAULT_STOP_ID, sampleStops } from './mapExperienceData';
import {
  computeBounds,
  isMapKitAlreadyInitializedError,
  markerStyleForCategory,
  parseClockLabelToSeconds,
  readTokenExpiry,
} from './mapExperienceUtils';

const sampleLinkThemes = [
  { color: '#6265FA', stopId: 'new-york' },
  { color: '#04C977', stopId: 'paris' },
  { color: '#FE8101', stopId: 'milan' },
  { color: '#F9D452', stopId: 'palermo' },
];

const pickRandomSampleLinkTheme = () =>
  sampleLinkThemes[Math.floor(Math.random() * sampleLinkThemes.length)];

const MapExperience = () => {
  const [status, setStatus] = useState('');
  const [activeStopId, setActiveStopId] = useState(DEFAULT_STOP_ID);
  const [sampleLinkTheme, setSampleLinkTheme] = useState(null);
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
  const sampleLinkThemeRef = useRef(null);
  const endedHandlerRef = useRef(null);
  const errorHandlerRef = useRef(null);
  const playbackRequestRef = useRef(0);
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
    initializeMap();
  };

  const scheduleMapRetry = () => {
    if (mapRetryTimerRef.current) return;
    mapRetryTimerRef.current = window.setTimeout(() => {
      mapRetryTimerRef.current = null;
      initializeMap();
    }, 260);
  };

  const showMapFallback = (title, detail) => {
    setStatus(detail || title || '');
    setFallbackState({
      visible: true,
      title,
      detail: detail || '',
    });
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
    const audioSources = [stop.audioSrc, stop.fallbackAudioSrc].filter(
      (source, index, sources) => source && sources.indexOf(source) === index
    );

    if (audioSources.length > 0) {
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

      if (errorHandlerRef.current) {
        element.removeEventListener('error', errorHandlerRef.current);
        errorHandlerRef.current = null;
      }

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

      const finishWithTone = () => {
        if (!playTone(stop)) {
          setStatus(
            'Audio preview is not available in this browser. Try another browser to listen.'
          );
        }
      };

      const updateToPlaying = () => {
        if (playbackRequestRef.current !== requestId) return;
        activeStateRef.current.isPlaying = true;
        setIsPlaying(true);
        setShowControl(true);
        renderNowPlaying();
      };

      const playSource = (sourceIndex) => {
        if (playbackRequestRef.current !== requestId) return;

        const source = audioSources[sourceIndex];
        if (!source) {
          finishWithTone();
          return;
        }

        const tryNextSource = (error) => {
          if (playbackRequestRef.current !== requestId) return;
          console.warn('Audio playback failed; trying fallback source.', error);
          stopAudio({ invalidatePlayback: false });
          playSource(sourceIndex + 1);
        };

        errorHandlerRef.current = () => {
          tryNextSource(element.error);
        };
        element.addEventListener('error', errorHandlerRef.current, {
          once: true,
        });

        element.src = source;
        element.currentTime = 0;
        element.volume = 1;

        const playPromise = element.play();

        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.then(updateToPlaying).catch(tryNextSource);
        } else {
          updateToPlaying();
        }
      };

      playSource(0);

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
      setStatus('Choose a story and tap play to hear another sample.');
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
      if (errorHandlerRef.current) {
        audioRef.current.removeEventListener('error', errorHandlerRef.current);
        errorHandlerRef.current = null;
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

  const handleSampleStoryClick = () => {
    const themedStopId = sampleLinkThemeRef.current?.stopId;
    focusStop(themedStopId ?? activeStopId ?? DEFAULT_STOP_ID, {
      source: 'list',
      autoPlay: true,
    });
  };

  const applySampleLinkTheme = () => {
    if (sampleLinkThemeRef.current) return;
    const theme = pickRandomSampleLinkTheme();
    sampleLinkThemeRef.current = theme;
    setSampleLinkTheme(theme);
  };

  const clearSampleLinkTheme = () => {
    sampleLinkThemeRef.current = null;
    setSampleLinkTheme(null);
  };

  const hasSelection = Boolean(activeStop);
  const shouldShowMapDock =
    hasSelection && (isPlaying || showControl || mapAwaitingPlay);
  const shouldShowStatus = Boolean(status.trim());

  const displayElapsedSeconds =
    hasSelection && (isPlaying || showControl || mapAwaitingPlay)
      ? elapsedSeconds
      : 0;
  const totalDurationSeconds = clipDurationSeconds;

  return (
    <section className="map-experience" id="listen">
      <div className="map-experience__inner">
        <div className="map-experience__layout">
          <div className="map-experience__copy-column">
            <h2>Every place has a story.</h2>
            <p>
              Discover why places exist, what happened there, and how they shaped
              the world around us, from the places you pass every day to the ones
              you’re seeing for the first time.
            </p>
            <button
              type="button"
              className={`map-experience__sample-link ${
                sampleLinkTheme ? 'is-themed' : ''
              }`}
              onMouseEnter={applySampleLinkTheme}
              onMouseLeave={clearSampleLinkTheme}
              onFocus={applySampleLinkTheme}
              onBlur={clearSampleLinkTheme}
              onClick={handleSampleStoryClick}
              style={
                sampleLinkTheme
                  ? {
                      '--map-sample-link-hover-color': sampleLinkTheme.color,
                    }
                  : undefined
              }
            >
              Listen to a sample story →
            </button>
            {shouldShowStatus && (
              <div
                className="map-experience__listen-status"
                role="status"
                aria-live="polite"
              >
                {status}
              </div>
            )}
          </div>
          <MapPreview
            fallbackState={fallbackState}
            mapViewRef={mapViewRef}
            shouldShowMapDock={shouldShowMapDock}
            activeStop={activeStop}
            displayElapsedSeconds={displayElapsedSeconds}
            totalDurationSeconds={totalDurationSeconds}
            isPlaying={isPlaying}
            onTogglePlayback={startOrTogglePlayback}
          />
        </div>
      </div>
    </section>
  );
};

export default MapExperience;
