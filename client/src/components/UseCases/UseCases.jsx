import './UseCases.css';

const UseCases = () => {
  const launchCities = [
    {
      city: 'New York',
      locations: 152,
      color: 'var(--marker-indigo)',
    },
    {
      city: 'Amsterdam',
      locations: 50,
      color: 'var(--marker-blue)',
    },
    {
      city: 'Paris',
      locations: 63,
      color: 'var(--marker-green)',
    },
    {
      city: 'Milan',
      locations: 60,
      color: 'var(--marker-orange)',
    },
    {
      city: 'Barcelona',
      locations: 50,
      color: 'var(--marker-blue)',
    },
    {
      city: 'Palermo',
      locations: 25,
      color: 'var(--marker-yellow)',
    },
  ];

  return (
    <section className="use-cases" id="cities">
      <div className="use-cases__inner">
        <p className="use-cases__eyebrow">At launch</p>
        <h2 className="use-cases__title">
          <span className="use-cases__title-number">400+</span>
          <span className="use-cases__title-copy">
            guides across 6 different cities.
          </span>
        </h2>
        <p className="use-cases__lede">
          Dora launches with narrated guides and tours for landmarks, art,
          museums, parks, and historical sites in New York, Paris, Milan,
          Palermo, Amsterdam, and Barcelona. More to come soon.
        </p>
        <div className="use-cases__grid">
          {launchCities.map((entry) => (
            <article
              key={entry.city}
              className="use-cases__card"
              style={{ '--use-cases-city-color': entry.color }}
            >
              <h3>{entry.city}</h3>
              <p>
                <span className="use-cases__card-number">{entry.locations}</span>
                <span className="use-cases__card-label">guides</span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
