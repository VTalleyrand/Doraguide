import MapDock from './MapDock';

const MapPreview = ({
  fallbackState,
  mapViewRef,
  shouldShowMapDock,
  activeStop,
  displayElapsedSeconds,
  totalDurationSeconds,
  isPlaying,
  onTogglePlayback,
}) => (
  <div
    className={`map-experience__panel map-experience__panel--viz ${
      fallbackState.visible ? 'has-fallback' : ''
    }`}
  >
    <div className="map-experience__viz map-experience__viz--mapkit">
      <div
        ref={mapViewRef}
        id="dora-map"
        className="map-experience__map-view"
        role="presentation"
        aria-label="Preview of Dora tour stops"
      />
      <div
        className="map-experience__fallback"
        id="mapkit-fallback"
        hidden={!fallbackState.visible}
      >
        <p className="map-experience__fallback-title">{fallbackState.title}</p>
        <p className="map-experience__fallback-detail">{fallbackState.detail}</p>
      </div>

      {shouldShowMapDock && (
        <MapDock
          activeStop={activeStop}
          displayElapsedSeconds={displayElapsedSeconds}
          totalDurationSeconds={totalDurationSeconds}
          isPlaying={isPlaying}
          onTogglePlayback={onTogglePlayback}
        />
      )}
    </div>
  </div>
);

export default MapPreview;
