import { useEffect, useState } from 'react';
import { appStoreUrl } from '../../metadata.js';
import './TopBanner.css';

const STORAGE_KEY = 'dora-top-banner-dismissed';

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

const pickBannerAccent = () =>
  bannerAccentColors[Math.floor(Math.random() * bannerAccentColors.length)];

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
  const [isVisible, setIsVisible] = useState(false);
  const [accentColor, setAccentColor] = useState(bannerAccentColors[0]);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === '1') {
        return;
      }
    } catch {
      // Ignore storage access errors and show the banner.
    }

    setAccentColor(pickBannerAccent());
    setIsVisible(true);
  }, []);

  const dismiss = () => {
    setIsVisible(false);

    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Ignore storage write errors; banner still closes for this session.
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="top-banner"
      role="region"
      aria-label="Announcement"
      style={{ '--top-banner-accent': accentColor }}
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
