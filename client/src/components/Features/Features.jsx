import ommisImage from '../../assets/images/ommis.png';
import FeatureScene from './FeatureScene';
import './Features.css';

const features = [
  {
    id: 'guide',
    title: "See what's around you",
    description:
      'Open the map, tap any landmark, and start listening instantly.',
    accent: 'accent-guide',
  },
  {
    id: 'tour',
    title: 'Follow a guided route',
    description:
      'Choose a recommended walking tour and let Dora guide you from stop to stop.',
    accent: 'accent-tour',
  },
  {
    id: 'discover',
    title: 'Start from wherever you are',
    description:
      'Dora builds routes from your location, so every walk can begin right where you stand.',
    accent: 'accent-discover',
  },
  {
    id: 'explore-create',
    title: 'Roam with Friends',
    description:
      'Sync Dora with your friends and let the city unfold around you.',
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
