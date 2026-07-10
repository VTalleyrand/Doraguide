import { useEffect, useRef, useState } from 'react';
import { appStoreUrl } from '../../metadata.js';
import './TopBanner.css';

const bannerLead =
  'Dora is live in 6 cities · New York, Paris, Amsterdam, Barcelona, Milan & Palermo';
const bannerCta = 'Download now →';

const SEGMENT_COUNT = 4;

const bannerAccentColors = [
  'var(--marker-indigo)',
  'var(--marker-green)',
  'var(--marker-blue)',
  'var(--marker-orange)',
];

const bannerAccentStorageKey = 'dora-top-banner-accent-index';

const pickNextBannerAccentIndex = (previousIndex) => {
  const availableIndexes = bannerAccentColors
    .map((_, index) => index)
    .filter((index) => index !== previousIndex);

  return availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
};

const BannerSegment = ({ tabIndex, ariaHidden }) => (
  <a
    className="top-banner__segment"
    href={appStoreUrl}
    target="_blank"
    rel="noreferrer"
    tabIndex={tabIndex}
    aria-hidden={ariaHidden}
  >
    <span className="top-banner__lead">{bannerLead}</span>
    <span className="top-banner__cta">{bannerCta}</span>
  </a>
);

const BannerGroup = ({ inert = false }) => (
  <div className="top-banner__group" aria-hidden={inert ? 'true' : undefined}>
    {Array.from({ length: SEGMENT_COUNT }, (_, index) => (
      <BannerSegment
        key={index}
        tabIndex={inert || index > 0 ? -1 : 0}
        ariaHidden={inert || index > 0 ? 'true' : undefined}
      />
    ))}
  </div>
);

const TopBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [accentIndex, setAccentIndex] = useState(0);
  const hasSelectedAccent = useRef(false);

  useEffect(() => {
    if (hasSelectedAccent.current) return;
    hasSelectedAccent.current = true;

    const storedIndex = Number.parseInt(
      window.sessionStorage.getItem(bannerAccentStorageKey),
      10
    );
    const previousIndex = Number.isInteger(storedIndex) &&
      storedIndex >= 0 &&
      storedIndex < bannerAccentColors.length
      ? storedIndex
      : null;
    const nextIndex = pickNextBannerAccentIndex(previousIndex);

    window.sessionStorage.setItem(bannerAccentStorageKey, String(nextIndex));
    setAccentIndex(nextIndex);
  }, []);

  const dismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="top-banner"
      role="region"
      aria-label="Announcement"
      style={{ '--top-banner-accent': bannerAccentColors[accentIndex] }}
    >
      <div className="top-banner__viewport">
        <div className="top-banner__track">
          <BannerGroup />
          <BannerGroup inert />
        </div>
      </div>
      <button
        type="button"
        className="top-banner__close"
        aria-label="Dismiss announcement"
        onClick={dismiss}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
};

export default TopBanner;
