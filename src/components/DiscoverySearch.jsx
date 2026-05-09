import { useEffect, useState } from 'react';
import * as riveReact from '@rive-app/react-canvas';
import favoritesAnimation from '../assets/favorites.riv?url';
import './DiscoverySearch.css';

const riveExports = riveReact.Layout ? riveReact : riveReact.default;
const { Alignment, EventType, Fit, Layout, useRive } = riveExports;

const placeTypes = [
  { label: 'Bridges', phrase: 'bridges', color: '#3B97FA', foreground: '#ffffff' },
  { label: 'Statues', phrase: 'statues', color: '#6265FA', foreground: '#ffffff' },
  { label: 'Parks', phrase: 'parks', color: '#04C977', foreground: '#ffffff' },
  { label: 'Museums', phrase: 'museums', color: '#6265FA', foreground: '#ffffff' },
  { label: 'Markets', phrase: 'markets', color: '#3B97FA', foreground: '#ffffff' },
  { label: 'Neighborhoods', phrase: 'neighborhoods', color: '#F9D452', foreground: '#1f1b16' },
  { label: 'Theaters', phrase: 'theaters', color: '#FE8101', foreground: '#ffffff' },
  { label: 'Waterfronts', phrase: 'waterfronts', color: '#04C977', foreground: '#ffffff' },
  { label: 'Churches', phrase: 'churches', color: '#FE8101', foreground: '#ffffff' },
  { label: 'Hidden corners', phrase: 'hidden corners', color: '#F9D452', foreground: '#1f1b16' },
];

const launchCities = [
  'New York',
  'Paris',
  'Milan',
  'Palermo',
  'Amsterdam',
  'Barcelona',
];

const pickNextRandomIndex = (length, currentIndex) => {
  if (length <= 1) return 0;

  let nextIndex = currentIndex;
  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * length);
  }

  return nextIndex;
};

const hoverPreviewEnabled = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function DiscoverySearch() {
  const [cycleStep, setCycleStep] = useState(0);
  const [cityIndex, setCityIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [playbackConfig, setPlaybackConfig] = useState(null);
  const { RiveComponent, rive } = useRive(
    {
      src: favoritesAnimation,
      autoplay: false,
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center,
      }),
      onRiveReady: (riveInstance) => {
        const artboard = riveInstance.contents?.artboards?.[0];
        const firstStateMachine = artboard?.stateMachines?.[0]?.name;
        const firstAnimation = artboard?.animations?.[0];

        if (firstStateMachine) {
          setPlaybackConfig({
            type: 'stateMachine',
            name: firstStateMachine,
          });
          return;
        }

        if (firstAnimation) {
          setPlaybackConfig({
            type: 'animation',
            name: firstAnimation,
          });
        }
      },
    },
    {
      shouldUseIntersectionObserver: false,
    }
  );

  const activePool =
    selectedIndices.length > 0
      ? selectedIndices
      : placeTypes.map((_, index) => index);
  const orderedIndices = [
    ...selectedIndices,
    ...placeTypes
      .map((_, index) => index)
      .filter((index) => !selectedIndices.includes(index)),
  ];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCycleStep((current) => current + 1);
      setCityIndex((current) =>
        pickNextRandomIndex(launchCities.length, current)
      );
    }, 1800);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!rive || !playbackConfig) return;

    const resetParams =
      playbackConfig.type === 'stateMachine'
        ? { stateMachines: playbackConfig.name, autoplay: true }
        : { animations: playbackConfig.name, autoplay: true };

    rive.reset(resetParams);

    if (playbackConfig.type !== 'animation') return;

    const restartAnimation = () => {
      rive.reset({
        animations: playbackConfig.name,
        autoplay: true,
      });
    };

    rive.on(EventType.Stop, restartAnimation);

    return () => {
      rive.off(EventType.Stop, restartAnimation);
    };
  }, [rive, playbackConfig]);

  const activeIndex =
    previewIndex !== null
      ? previewIndex
      : activePool[cycleStep % activePool.length];
  const activePlaceType = placeTypes[activeIndex];
  const activeCity = launchCities[cityIndex];

  const handleTagPreview = (index) => {
    if (!hoverPreviewEnabled()) return;
    setPreviewIndex(index);
  };

  const clearTagPreview = () => {
    setPreviewIndex(null);
  };

  const handleTagToggle = (index) => {
    setPreviewIndex(null);
    setSelectedIndices((current) => {
      if (current.includes(index)) {
        return current.filter((value) => value !== index);
      }

      return [...current, index];
    });
  };

  return (
    <section
      className="discovery-search"
      aria-labelledby="discovery-search-title"
    >
      <div className="discovery-search__inner">
        <div className="discovery-search__hero">
          <div className="discovery-search__copy">
            <p className="discovery-search__eyebrow">What you can expect</p>
            <h2 className="discovery-search__title" id="discovery-search-title">
              <span className="discovery-search__title-line">More than</span>
              <br />
              <span className="discovery-search__title-line">landmarks.</span>
            </h2>
            <p className="discovery-search__kicker">
              <span className="discovery-search__phrase">
                <span className="discovery-search__chunk">Discover</span>
                <span
                  key={activePlaceType.phrase}
                  className="discovery-search__term"
                  style={{ '--discovery-term-color': activePlaceType.color }}
                >
                  {activePlaceType.phrase}
                </span>
              </span>
              <span className="discovery-search__phrase">
                <span className="discovery-search__chunk">as you walk through</span>
                <span className="discovery-search__city">{activeCity}</span>
              </span>
            </p>
          </div>
          <div className="discovery-search__animation" aria-hidden="true">
            <RiveComponent className="discovery-search__animation-canvas" />
          </div>
        </div>
        <p className="discovery-search__label">Choose what to explore</p>
        <div
          className="discovery-search__tags"
          aria-label="Examples of places found in Dora"
        >
          {orderedIndices.map((index) => {
            const tag = placeTypes[index];

            return (
            <button
              type="button"
              key={tag.label}
              className={`discovery-search__tag ${
                index === activeIndex ? 'is-active' : ''
              } ${selectedIndices.includes(index) ? 'is-selected' : ''}`}
              onMouseEnter={() => handleTagPreview(index)}
              onMouseLeave={clearTagPreview}
              onFocus={() => handleTagPreview(index)}
              onBlur={() => {
                if (hoverPreviewEnabled()) {
                  clearTagPreview();
                }
              }}
              onClick={() => handleTagToggle(index)}
              aria-pressed={selectedIndices.includes(index)}
              aria-label={`Highlight ${tag.label}`}
              style={{
                '--discovery-tag-color': tag.color,
                '--discovery-tag-foreground': tag.foreground,
              }}
            >
              {tag.label}
            </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default DiscoverySearch;
