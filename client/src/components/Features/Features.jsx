import ommisImage from '../../assets/images/ommis.png';
import FeatureScene from './FeatureScene';
import './Features.css';

const features = [
  {
    id: 'guide',
    title: "Discover what's nearby",
    description:
      'Start wherever you are. Dora uncovers the landmarks, architecture, neighborhoods, and hidden places waiting around you.',
    accent: 'accent-guide',
  },
  {
    id: 'tour',
    title: 'Shake',
    description:
      "Can't decide? Shake your phone and let Dora surprise you with a place or route based on your interests.",
    accent: 'accent-tour',
  },
  {
    id: 'discover',
    title: 'Follow a Route',
    description:
      'Follow a recommended route or create your own to connect places through stories worth discovering.',
    accent: 'accent-discover',
  },
  {
    id: 'explore-create',
    title: 'Roam with Friends',
    description:
      'Start a shared session and listen to the same stories with perfectly synchronized playback.',
    accent: 'accent-explore-create',
    image: ommisImage,
    imageAlt: 'Dora shared listening preview',
  },
];

const Features = () => (
  <section className="showcase" id="features">
    <div className="showcase-inner">
      <h2 className="showcase-title">Explore on your own terms</h2>
      <div className="bento-grid">
        {features.map((feature) => (
          <article
            key={feature.id}
            className={`bento-card bento-card--${feature.id} ${feature.accent}`}
          >
            <div
              className="bento-media"
              aria-hidden={feature.id === 'discover' ? undefined : true}
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
