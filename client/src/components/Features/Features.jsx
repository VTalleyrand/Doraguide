import ommisImage from '../../assets/images/ommis.png';
import FeatureScene from './FeatureScene';
import './Features.css';

const features = [
  {
    id: 'guide',
    title: "See what's around you",
    description:
      'Choose a place, press play, and discover the people, moments, and stories that shaped it.',
    accent: 'accent-guide',
  },
  {
    id: 'tour',
    title: 'Follow a Path',
    description:
      'Discover connected places, stories, and moments that reveal a different side of the city.',
    accent: 'accent-tour',
  },
  {
    id: 'discover',
    title: 'Start where you are',
    description:
      'No fixed starting point. Every route begins from your location.',
    accent: 'accent-discover',
  },
  {
    id: 'explore-create',
    title: 'Roam with Friends',
    description:
      'Start a shared session and listen to the same stories together in real time.',
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
