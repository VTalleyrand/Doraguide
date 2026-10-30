import './UseCases.css';

const UseCases = () => {
  const launchCities = [
    {
      city: 'New York',
      slug: 'new-york',
      locations: 152,
      color: 'var(--marker-indigo)',
    },
    {
      city: 'Amsterdam',
      slug: 'amsterdam',
      locations: 50,
      color: 'var(--marker-blue)',
    },
    {
      city: 'Paris',
      slug: 'paris',
      locations: 63,
      color: 'var(--marker-green)',
    },
    {
      city: 'Milan',
      slug: 'milan',
      locations: 60,
      color: 'var(--marker-orange)',
    },
    {
      city: 'Barcelona',
      slug: 'barcelona',
      locations: 50,
      color: 'var(--marker-blue)',
    },
    {
      city: 'Palermo',
      slug: 'palermo',
      locations: 25,
      color: 'var(--marker-yellow)',
    },
  ];

  return (
    <section className="use-cases" id="cities">
      <div className="use-cases__inner">
        <p className="use-cases__eyebrow">Available now</p>
        <h2 className="use-cases__title">
          <span className="use-cases__title-number">400+</span>
          <span className="use-cases__title-copy">reasons to look up.</span>
        </h2>
        <p className="use-cases__lede">
          From forgotten theaters in Palermo to immigrant stories in New York and
          hidden histories in Amsterdam.
        </p>
        <div className="use-cases__grid">
          {launchCities.map((entry) => (
            <a
              key={entry.city}
              className="use-cases__card"
              href={`/cities/${entry.slug}`}
              style={{ '--use-cases-city-color': entry.color }}
            >
              <h3>{entry.city}</h3>
              <p>
                <span className="use-cases__card-number">{entry.locations}</span>
                <span className="use-cases__card-label">guides</span>
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
