import CitySelector from './CitySelector';

const MapListenPanel = ({
  activeStop,
  listItems,
  status,
  statusRegionRef,
  shouldShowStatus,
  onCitySelect,
}) => (
  <div className="map-experience__listen-column">
    {shouldShowStatus && (
      <div
        ref={statusRegionRef}
        className="map-experience__listen-status"
        role="status"
        aria-live="polite"
      >
        {status}
      </div>
    )}

    <div className="map-experience__panel map-experience__panel--listen">
      <div className="map-experience__listen-head">
        <div className="map-experience__chips">
          <span className="map-experience__chip">{activeStop.title}</span>
          <span className="map-experience__chip">{activeStop.duration}</span>
        </div>

        <h3 className="map-experience__listen-story-title">
          {activeStop.title}
        </h3>

        <p className="map-experience__listen-hook">{activeStop.hook}</p>
      </div>

      <CitySelector listItems={listItems} onCitySelect={onCitySelect} />
      <p className="map-experience__listen-hint">
        Select a city or tap a marker to hear a sample story.
      </p>
    </div>
  </div>
);

export default MapListenPanel;
