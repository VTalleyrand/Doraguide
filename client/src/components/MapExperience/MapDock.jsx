import { formatClock } from './mapExperienceUtils';

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

const MapDock = ({
  activeStop,
  displayElapsedSeconds,
  totalDurationSeconds,
  isPlaying,
  onTogglePlayback,
}) => {
  const elapsedTotalPair = `${formatClock(displayElapsedSeconds)} / ${formatClock(totalDurationSeconds)}`;

  return (
    <div className="map-experience__viz-dock">
      <div className="map-experience__viz-dock-text">
        <div className="map-experience__viz-dock-eyebrow">Discovering</div>
        <div className="map-experience__viz-dock-title">{activeStop.title}</div>
        <div
          className="map-experience__viz-dock-timer"
          aria-label={`Elapsed ${formatClock(displayElapsedSeconds)} of ${formatClock(totalDurationSeconds)}`}
        >
          {elapsedTotalPair}
        </div>
      </div>
      <button
        type="button"
        className="map-experience__viz-dock-play"
        onClick={onTogglePlayback}
        aria-label={isPlaying ? 'Pause audio preview' : 'Play audio preview'}
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
  );
};

export default MapDock;
