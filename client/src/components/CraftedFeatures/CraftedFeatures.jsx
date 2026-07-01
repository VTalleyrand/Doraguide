import { useEffect, useRef, useState } from 'react';
import favoritesImage from '../../assets/images/favorites.png';
import liveActivitiesImage from '../../assets/images/live_activities.png';
import painPointImage from '../../assets/images/pain_point.png';
import pressPlayImage from '../../assets/images/pressplay.png';
import roamImage from '../../assets/images/roam.png';
import shakeImage from '../../assets/images/shake.png';
import transcriptionImage from '../../assets/images/transcription.png';
import './CraftedFeatures.css';

const screenImages = [
  {
    id: 'favorites',
    label: 'Favorites screen',
    title: 'Save favorite places',
    description:
      'Keep stories and discoveries close for later.',
    src: favoritesImage,
    tone: 'green',
  },
  {
    id: 'live',
    label: 'Live Activities screen',
    title: 'Keep the next stop visible',
    description:
      'See your route and playback from the Lock Screen.',
    src: liveActivitiesImage,
    tone: 'indigo',
  },
  {
    id: 'pain',
    label: 'Pain point screen',
    title: 'Stop searching across tabs',
    description:
      'Find the story without digging through articles and websites.',
    src: painPointImage,
    tone: 'orange',
  },
  {
    id: 'press',
    label: 'Press play screen',
    title: 'Tap and listen',
    description:
      'Start a story from the map the moment curiosity strikes.',
    src: pressPlayImage,
    tone: 'yellow',
  },
  {
    id: 'roam',
    label: 'Roam screen',
    title: 'Roam with friends',
    description:
      'Keep everyone listening to the same story in sync.',
    src: roamImage,
    tone: 'green',
  },
  {
    id: 'shake',
    label: 'Shake screen',
    title: 'Shake to discover',
    description:
      'Let Dora choose a nearby place or route for you.',
    src: shakeImage,
    tone: 'orange',
  },
  {
    id: 'transcription',
    label: 'Transcription screen',
    title: 'Read anytime',
    description:
      'Read, listen, or follow along whenever you want.',
    src: transcriptionImage,
    tone: 'indigo',
  },
];

const CraftedFeatures = () => {
  const [activeScreenId, setActiveScreenId] = useState(null);
  const stageRef = useRef(null);
  const hasInitializedScroll = useRef(false);
  const userPauseUntil = useRef(0);
  const activeScreen = screenImages.find((screen) => screen.id === activeScreenId);

  const pauseForManualScroll = () => {
    userPauseUntil.current = performance.now() + 1400;
  };

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    let frameId;
    let previousTime = performance.now();

    const keepScrollCentered = () => {
      const groupWidth = stage.scrollWidth / 3;

      if (groupWidth <= 0) {
        return;
      }

      if (!hasInitializedScroll.current) {
        stage.scrollLeft = groupWidth;
        hasInitializedScroll.current = true;
        return;
      }

      if (stage.scrollLeft < groupWidth * 0.5) {
        stage.scrollLeft += groupWidth;
      } else if (stage.scrollLeft > groupWidth * 1.5) {
        stage.scrollLeft -= groupWidth;
      }
    };

    const tick = (time) => {
      const delta = time - previousTime;
      previousTime = time;

      if (!activeScreenId && time > userPauseUntil.current) {
        stage.scrollLeft += (delta / 1000) * 24;
      }

      keepScrollCentered();
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [activeScreenId]);

  return (
    <section className="crafted-features" id="crafted">
      <div
        ref={stageRef}
        className="crafted-features__screen-stage"
        aria-label="Dora app screens scrolling preview"
        onKeyDown={pauseForManualScroll}
        onMouseLeave={() => setActiveScreenId(null)}
        onPointerDown={pauseForManualScroll}
        onTouchStart={pauseForManualScroll}
        onWheel={pauseForManualScroll}
      >
        <div className="crafted-features__track">
          {[0, 1, 2].map((groupIndex) => (
            <div
              className="crafted-features__screen-group"
              key={groupIndex}
              aria-hidden={groupIndex === 1 ? undefined : 'true'}
            >
              {screenImages.map((screen) => (
                <button
                  type="button"
                  className={`crafted-features__screen crafted-features__screen--${screen.tone}`}
                  key={`${groupIndex}-${screen.id}`}
                  aria-label={`Focus ${screen.label}`}
                  tabIndex={groupIndex === 1 ? 0 : -1}
                  onFocus={() => setActiveScreenId(screen.id)}
                  onMouseEnter={() => setActiveScreenId(screen.id)}
                  onBlur={() => setActiveScreenId(null)}
                >
                  <img src={screen.src} alt={screen.label} loading="lazy" />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div
        className={`crafted-features__caption${
          activeScreen ? ' is-visible' : ''
        }`}
        aria-live="polite"
      >
        {activeScreen && (
          <>
            <h3>{activeScreen.title}</h3>
            <p>{activeScreen.description}</p>
          </>
        )}
      </div>
    </section>
  );
};

export default CraftedFeatures;
