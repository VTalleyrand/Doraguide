import { useRef, useState } from 'react';
import { appStoreUrl } from '../../metadata.js';
import './Hero.css';

const storyButtonThemes = [
  { background: '#6265FA', foreground: '#ffffff', stopId: 'new-york' },
  { background: '#04C977', foreground: '#ffffff', stopId: 'paris' },
  { background: '#FE8101', foreground: '#ffffff', stopId: 'milan' },
  { background: '#F9D452', foreground: '#ffffff', stopId: 'palermo' },
];

const pickRandomStoryTheme = () =>
  storyButtonThemes[Math.floor(Math.random() * storyButtonThemes.length)];

const Hero = () => {
  const [storyButtonTheme, setStoryButtonTheme] = useState(null);
  const storyButtonThemeRef = useRef(null);

  const updateStoryButtonTheme = (theme) => {
    storyButtonThemeRef.current = theme;
    setStoryButtonTheme(theme);
  };

  const applyRandomStoryTheme = () => {
    if (storyButtonThemeRef.current) return;
    updateStoryButtonTheme(pickRandomStoryTheme());
  };

  const clearStoryTheme = () => {
    updateStoryButtonTheme(null);
  };

  const handleStoryClick = (event) => {
    event.preventDefault();

    const selectedTheme = storyButtonThemeRef.current || pickRandomStoryTheme();
    updateStoryButtonTheme(selectedTheme);

    const listenSection = document.getElementById('listen');
    if (listenSection) {
      listenSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.dispatchEvent(
      new CustomEvent('dora:play-story-stop', {
        detail: { stopId: selectedTheme.stopId },
      })
    );
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          <span className="hero-title-line">Understand the world</span>{' '}
          <br className="hero-title-break" aria-hidden="true" />
          <span className="hero-title-line hero-title-line--second">
            around you.
          </span>
        </h1>
        <p>
          The only app built for the moment curiosity strikes. Dora reveals the
          stories behind landmarks and places around you. No Googling. No Wikipedia.
          No endless tabs. See something interesting? Open Dora, tap the place, and
          press play.
        </p>
        <div className="hero-buttons">
          {/* <button className="primary-btn" type="button">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: '8px' }}
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download on iOS
          </button> */}
          <a
            className="primary-btn"
            href={appStoreUrl}
            target="_blank"
            rel="noreferrer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: '8px' }}
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download Dora
          </a>
          <a
            className={`secondary-btn hero-story-btn ${
              storyButtonTheme ? 'is-randomized' : ''
            }`}
            href="#listen"
            onMouseEnter={applyRandomStoryTheme}
            onMouseLeave={clearStoryTheme}
            onFocus={applyRandomStoryTheme}
            onBlur={clearStoryTheme}
            onClick={handleStoryClick}
            style={
              storyButtonTheme
                ? {
                    '--hero-story-bg': storyButtonTheme.background,
                    '--hero-story-border': storyButtonTheme.background,
                    '--hero-story-color': storyButtonTheme.foreground,
                  }
                : undefined
            }
          >
            Listen to a Story
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
