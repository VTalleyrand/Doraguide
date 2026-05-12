import ommisImage from '../../assets/images/ommis.png';
import FeatureScene from './FeatureScene';
import './Features.css';

const features = [
  {
    id: 'guide',
    title: "Discover what's around you",
    description:
      'Select a landmark, press play, and learn the story behind it.',
    accent: 'accent-guide',
  },
  {
    id: 'tour',
    title: 'Routes that fit your day',
    description:
      'Pick a recommended tour, or build your own around the places that interest you.',
    accent: 'accent-tour',
  },
  {
    id: 'discover',
    title: 'Walk your way',
    description:
      'Dora builds routes from your location, so every walk can start right where you are.',
    accent: 'accent-discover',
  },
  {
    id: 'explore-create',
    title: 'Roam with Friends',
    description:
      'Sync Dora with your friends, host a tour, and let the city unfold around you.',
    accent: 'accent-explore-create',
    image: ommisImage,
    imageAlt: 'Dora shared listening preview',
  },
];

const Features = () => (
  <section className="showcase" id="features">
    <div className="showcase-inner">
      <h2 className="showcase-title">Discover cities your way.</h2>
      <div className="bento-grid">
        {features.map((feature) => (
          <article
            key={feature.id}
            className={`bento-card ${feature.accent}`}
          >
            <div
              className="bento-media"
              aria-hidden={
                feature.image || feature.id === 'tour' ? undefined : true
              }
            >
              <FeatureScene feature={feature} />
            </div>
            <div className="bento-body">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
