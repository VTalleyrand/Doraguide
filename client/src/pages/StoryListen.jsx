import { useMemo, useRef, useState } from 'react';
import {
  appMarkerColors,
  sampleStops,
} from '../components/MapExperience/mapExperienceData.js';
import {
  formatClock,
  parseClockLabelToSeconds,
} from '../components/MapExperience/mapExperienceUtils.js';
import '../components/Header/Header.css';
import './StoryListen.css';

const fallbackStory = sampleStops[0];
const earlyAccessUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSdJFFJN6tyLpKh5g0WvLWzTQ1IOtyw48im_OGJqYCILGNcp6w/viewform';
const storyRoutePrefix = '/s/';

const getStorySlugFromPath = (path) => {
  if (!path || !path.startsWith(storyRoutePrefix)) return '';
  return decodeURIComponent(path.slice(storyRoutePrefix.length));
};

const PlayIcon = () => (
  <svg className="story-listen__play-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M7 4.9c0-.8.87-1.29 1.55-.87l11.06 6.87c.64.4.64 1.34 0 1.74L8.55 19.51A1.02 1.02 0 0 1 7 18.64V4.9Z"
    />
  </svg>
);

const PauseIcon = () => (
  <svg className="story-listen__play-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M7 4h3.2c.55 0 1 .45 1 1v14c0 .55-.45 1-1 1H7a1 1 0 0 1-1-1V5c0-.55.45-1 1-1Zm6.8 0H17c.55 0 1 .45 1 1v14c0 .55-.45 1-1 1h-3.2a1 1 0 0 1-1-1V5c0-.55.45-1 1-1Z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg
    className="design-btn__icon"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const StoryListen = ({ routePath }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [loadedDuration, setLoadedDuration] = useState(0);

  const story = useMemo(() => {
    const slug = getStorySlugFromPath(routePath);
    return sampleStops.find((stop) => stop.id === slug) || fallbackStory;
  }, [routePath]);

  const markerColor = appMarkerColors[story.category] || appMarkerColors.Cultural;
  const fallbackDuration = parseClockLabelToSeconds(story.duration);
  const duration = loadedDuration || fallbackDuration;
  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        setIsPlaying(false);
      });
  };

  const handleSeek = (event) => {
    const audio = audioRef.current;
    const nextTime = Number(event.target.value);
    if (!Number.isFinite(nextTime)) return;

    setCurrentTime(nextTime);
    if (audio) {
      audio.currentTime = nextTime;
    }
  };

  return (
    <section
      className="story-listen"
      aria-labelledby="story-listen-title"
      style={{ '--story-accent': markerColor }}
    >
      <div className="story-listen__shell">
        <div className="story-listen__card">
          <a
            className="story-listen__eyebrow"
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            Dora audio story
          </a>

          <div className="story-listen__overlay">
            <h1 className="story-listen__title" id="story-listen-title">
              {story.title}
            </h1>
            <p className="story-listen__hook">{story.hook}</p>

            <div className="story-listen__player">
              <button
                type="button"
                className="story-listen__play"
                onClick={togglePlayback}
                aria-label={isPlaying ? 'Pause story' : 'Play story'}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>

              <div className="story-listen__progress-row">
                <span>{formatClock(currentTime)}</span>
                <span>{formatClock(duration)}</span>
              </div>

              <input
                className="story-listen__progress"
                type="range"
                min="0"
                max={duration || 0}
                step="1"
                value={Math.min(currentTime, duration || currentTime)}
                onChange={handleSeek}
                aria-label="Story progress"
                style={{ '--story-progress': `${progress * 100}%` }}
              />

              <div
                className={`story-listen__wave ${isPlaying ? 'is-playing' : ''}`}
                aria-hidden="true"
              >
                {Array.from({ length: 24 }, (_, index) => (
                  <span key={index} />
                ))}
              </div>
            </div>
          </div>

          <audio
            ref={audioRef}
            className="story-listen__audio"
            src={story.audioSrc}
            preload="metadata"
            onLoadedMetadata={(event) => {
              setLoadedDuration(Math.floor(event.currentTarget.duration || 0));
            }}
            onTimeUpdate={(event) => {
              setCurrentTime(Math.floor(event.currentTarget.currentTime || 0));
            }}
            onPlay={() => {
              setIsPlaying(true);
            }}
            onPause={() => {
              setIsPlaying(false);
            }}
            onEnded={() => {
              setIsPlaying(false);
              setCurrentTime(0);
            }}
          />
        </div>

        <a
          className="design-btn story-listen__cta"
          href={earlyAccessUrl}
          target="_blank"
          rel="noreferrer"
        >
          <AppleIcon />
          Get early access
        </a>
      </div>
    </section>
  );
};

export default StoryListen;
