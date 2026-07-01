import { useEffect, useState } from 'react';

const shakePlaces = [
  {
    id: 'market',
    label: 'Market',
    x: 30,
    y: 32,
    color: 'var(--marker-orange)',
  },
  {
    id: 'park',
    label: 'Park',
    x: 68,
    y: 26,
    color: 'var(--marker-green)',
  },
  {
    id: 'museum',
    label: 'Museum',
    x: 52,
    y: 58,
    color: 'var(--marker-indigo)',
  },
  {
    id: 'theater',
    label: 'Theater',
    x: 24,
    y: 72,
    color: 'var(--marker-blue)',
  },
  {
    id: 'corner',
    label: 'Hidden corner',
    x: 76,
    y: 72,
    color: 'var(--marker-yellow)',
  },
];

const ShakeMapScene = () => {
  const [selectedPlaceId, setSelectedPlaceId] = useState(shakePlaces[2].id);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setSelectedPlaceId((currentPlaceId) => {
        const availablePlaces = shakePlaces.filter(
          (place) => place.id !== currentPlaceId
        );
        return availablePlaces[
          Math.floor(Math.random() * availablePlaces.length)
        ].id;
      });
    }, 3800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="feature-scene feature-scene--shake-map">
      <div className="feature-scene__shake-grid" aria-hidden="true">
        <span className="feature-scene__shake-block feature-scene__shake-block--one" />
        <span className="feature-scene__shake-block feature-scene__shake-block--two" />
        <span className="feature-scene__shake-block feature-scene__shake-block--three" />
        <span className="feature-scene__shake-route" />
        {shakePlaces.map((place) => (
          <span
            className={`feature-scene__shake-pin${
              place.id === selectedPlaceId ? ' is-selected' : ''
            }`}
            key={place.id}
            style={{
              '--pin-color': place.color,
              '--pin-x': `${place.x}%`,
              '--pin-y': `${place.y}%`,
            }}
          >
            <span className="feature-scene__shake-pin-icon" aria-hidden="true">
              <span />
            </span>
            {place.id === selectedPlaceId ? (
              <span className="feature-scene__shake-pin-label">{place.label}</span>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ShakeMapScene;
