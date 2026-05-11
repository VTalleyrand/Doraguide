import ommisImage from '../assets/images/ommis.png';
import iphoneMockup from '../assets/images/iphone_mockup.png';
import discoverPoster from '../assets/images/discover-poster.jpg';
import discoverVideo from '../assets/videos/discover.mp4';
import './Features.css';

const FeatureScene = ({ feature }) => {
  if (feature.image) {
    return (
      <div className="feature-scene feature-scene--friends">
        <div className="feature-scene__stage">
          <div className="feature-scene__image-wrap">
            <img src={feature.image} alt={feature.imageAlt} />
          </div>
        </div>
      </div>
    );
  }

  if (feature.id === 'guide') {
    return (
      <div className="feature-scene feature-scene--guide">
        <div className="feature-scene__phone">
          <video
            className="feature-scene__phone-video"
            src={discoverVideo}
            autoPlay
            muted
            loop
            playsInline
            poster={discoverPoster}
            preload="auto"
          />
          <img
            className="feature-scene__phone-frame"
            src={iphoneMockup}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    );
  }

  if (feature.id === 'tour') {
    return (
      <div className="feature-scene feature-scene--tour">
        <div className="feature-scene__stage">
          <svg
            className="feature-scene__route"
            viewBox="0 0 420 220"
            aria-hidden="true"
          >
            <path d="M57 143 C116 54 178 180 236 88 S336 76 363 135" />
          </svg>
          <span className="feature-scene__route-stop feature-scene__route-stop--one feature-scene__route-stop--museum">
            <span className="feature-scene__route-point">D</span>
            <span className="feature-scene__route-label">Museum</span>
          </span>
          <span className="feature-scene__route-stop feature-scene__route-stop--two feature-scene__route-stop--market">
            <span className="feature-scene__route-point">D</span>
            <span className="feature-scene__route-label">Market</span>
          </span>
          <span className="feature-scene__route-stop feature-scene__route-stop--three feature-scene__route-stop--bridge">
            <span className="feature-scene__route-point">D</span>
            <span className="feature-scene__route-label">Bridge</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="feature-scene feature-scene--discover">
      <div className="feature-scene__stage">
        <div className="feature-scene__streets" />
        <div className="feature-scene__main-path" />
        <div className="feature-scene__detour-path" />
        <div className="feature-scene__detour-marker">
          <span />
        </div>
        <div className="feature-scene__detour-card">Hidden courtyard</div>
      </div>
    </div>
  );
};

const Features = () => {
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
      title: 'Create a custom tour',
      description:
        'Become an expert of any city by curating routes that fit your interests and turn historical sites, museums, parks, or landmarks into a tour that fits your taste and schedule.',
      accent: 'accent-tour',
    },
    {
      id: 'discover',
      title: 'Let Dora surprise you',
      description:
        'Dora helps you notice corners that are often overlooked and learn about what makes them special.',
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

  return (
    <section className="showcase" id="features">
      <div className="showcase-inner">
        <h2 className="showcase-title">
          Discover cities your way.
        </h2>
        <div className="bento-grid">
          {features.map((feature) => (
            <article
              key={feature.id}
              className={`bento-card ${feature.accent}`}
            >
              <div
                className="bento-media"
                aria-hidden={feature.image ? undefined : true}
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
};

export default Features;
