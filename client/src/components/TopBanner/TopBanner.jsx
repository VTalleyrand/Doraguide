import { useMemo, useState } from 'react';
import { appStoreUrl } from '../../metadata.js';
import './TopBanner.css';

const bannerLeadDesktop =
  'Dora is live in 6 cities · New York, Paris, Amsterdam, Barcelona, Milan & Palermo';
const bannerLeadMobile = 'Dora is live in 6 cities';
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
    <span className="top-banner__lead top-banner__lead--desktop">
      {bannerLeadDesktop}
    </span>
    <span className="top-banner__lead top-banner__lead--mobile">
      {bannerLeadMobile}
    </span>
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
  const accentColor = useMemo(() => pickBannerAccent(), []);

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
