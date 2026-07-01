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

const positiveModulo = (value, length) => ((value % length) + length) % length;

const CraftedFeatures = () => {
  const [activeScreenId, setActiveScreenId] = useState(null);
  const [isMobileScroller, setIsMobileScroller] = useState(false);
  const [mobileCursor, setMobileCursor] = useState(screenImages.length * 2);
  const stageRef = useRef(null);
  const hasInitializedDesktopScroll = useRef(false);
  const hasInitializedMobileScroll = useRef(false);
  const userPauseUntil = useRef(0);
  const mobileScreenIndex = positiveModulo(mobileCursor, screenImages.length);
  const screenGroups = isMobileScroller ? [0, 1, 2, 3, 4] : [0, 1, 2];
  const mobileMiddleGroupStart = screenImages.length * 2;
  const activeScreen = isMobileScroller
    ? screenImages[mobileScreenIndex]
    : screenImages.find((screen) => screen.id === activeScreenId);

  const pauseForManualScroll = () => {
    userPauseUntil.current = performance.now() + 1400;
  };

  const centerMobileCursor = (cursor, behavior = 'smooth') => {
    const stage = stageRef.current;
    const target = stage?.querySelectorAll('.crafted-features__screen')[cursor];

    if (!stage || !target) return;

    stage.scrollTo({
      left: target.offsetLeft - (stage.clientWidth - target.clientWidth) / 2,
      behavior,
    });
  };

  const moveMobileCursor = (step) => {
    pauseForManualScroll();
    setMobileCursor((current) => current + step);
  };

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const updateIsMobileScroller = () => {
      const shouldUseMobileScroller = media.matches;
      setIsMobileScroller(shouldUseMobileScroller);

      if (shouldUseMobileScroller) {
        hasInitializedMobileScroll.current = false;
        setMobileCursor(screenImages.length * 2);
      }
    };

    updateIsMobileScroller();
    media.addEventListener('change', updateIsMobileScroller);

    return () => media.removeEventListener('change', updateIsMobileScroller);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;

    if (
      !stage ||
      isMobileScroller ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    let frameId;
    let previousTime = performance.now();

    const keepScrollCentered = () => {
      const groupWidth = stage.scrollWidth / 3;

      if (groupWidth <= 0) {
        return;
      }

      if (!hasInitializedDesktopScroll.current) {
        stage.scrollLeft = groupWidth;
        hasInitializedDesktopScroll.current = true;
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
  }, [activeScreenId, isMobileScroller]);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage || !isMobileScroller) {
      return undefined;
    }

    const frameId = requestAnimationFrame(() => {
      centerMobileCursor(
        mobileCursor,
        hasInitializedMobileScroll.current ? 'smooth' : 'auto'
      );
      hasInitializedMobileScroll.current = true;
    });

    let normalizeTimeout;

    if (
      mobileCursor < screenImages.length ||
      mobileCursor >= screenImages.length * 4
    ) {
      normalizeTimeout = window.setTimeout(() => {
        const normalizedCursor = mobileMiddleGroupStart + mobileScreenIndex;
        setMobileCursor(normalizedCursor);
        requestAnimationFrame(() => centerMobileCursor(normalizedCursor, 'auto'));
      }, 900);
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(normalizeTimeout);
    };
  }, [isMobileScroller, mobileCursor, mobileMiddleGroupStart, mobileScreenIndex]);

  return (
    <section className="crafted-features" id="crafted">
      <div className="crafted-features__mobile-controls" aria-label="Browse Dora app screens">
        <button
          type="button"
          className="crafted-features__mobile-control crafted-features__mobile-control--previous"
          aria-label="Previous screen"
          onClick={() => moveMobileCursor(-1)}
        >
          <span className="crafted-features__mobile-chevron" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="crafted-features__mobile-control crafted-features__mobile-control--next"
          aria-label="Next screen"
          onClick={() => moveMobileCursor(1)}
        >
          <span className="crafted-features__mobile-chevron" aria-hidden="true" />
        </button>
      </div>
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
          {screenGroups.map((groupIndex) => (
            <div
              className="crafted-features__screen-group"
              key={groupIndex}
              aria-hidden={
                groupIndex === (isMobileScroller ? 2 : 1) ? undefined : 'true'
              }
            >
              {screenImages.map((screen, screenIndex) => (
                <button
                  type="button"
                  className={`crafted-features__screen crafted-features__screen--${screen.tone}${
                    isMobileScroller &&
                    groupIndex * screenImages.length + screenIndex === mobileCursor
                      ? ' is-mobile-active'
                      : ''
                  }`}
                  key={`${groupIndex}-${screen.id}`}
                  aria-label={`Focus ${screen.label}`}
                  tabIndex={groupIndex === 1 && !isMobileScroller ? 0 : -1}
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
