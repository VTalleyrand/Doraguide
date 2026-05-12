const CitySelector = ({ listItems, onCitySelect }) => (
  <div className="map-experience__city-section map-experience__city-section--compact">
    <div className="map-experience__city-label map-experience__city-label--compact">
      Choose a city
    </div>
    <div className="map-experience__city-grid">
      {listItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`map-experience__city-btn map-experience__city-btn--compact ${
            item.isActive ? 'is-active' : ''
          }`}
          style={{
            '--map-stop-color': item.markerColor,
            '--map-stop-foreground': item.markerForeground,
          }}
          onClick={() => onCitySelect(item.id)}
        >
          <span className="map-experience__city-btn-title">{item.title}</span>
          <span className="map-experience__city-btn-meta">{item.duration}</span>
        </button>
      ))}
    </div>
  </div>
);

export default CitySelector;
