import './Press.css';

const Press = () => {
  return (
    <section className="press-page">
      <div className="press-page__inner">
        <header className="press-hero">
          <div className="press-hero__copy">
            <h1>Press</h1>
            <p className="press-hero__intro">
              Get Dora press and media information here, or reach out directly
              for coverage, interviews, or partnership conversations.
            </p>
          </div>
          <div className="press-hero__contact">
            <a href="mailto:press@doraguide.com">press@doraguide.com</a>
            <a href="mailto:hello@doraguide.com">hello@doraguide.com</a>
          </div>
        </header>

        <section className="press-contact">
          <div className="press-contact__copy">
            <h2>Press and media requests</h2>
            <p>
              For interviews, early coverage, product questions, or partnership
              requests, reach out directly by email.
            </p>
          </div>
          <a
            className="primary-btn"
            href="https://docs.google.com/forms/d/e/1FAIpQLSdJFFJN6tyLpKh5g0WvLWzTQ1IOtyw48im_OGJqYCILGNcp6w/viewform"
            target="_blank"
            rel="noreferrer"
          >
            Contact Press
          </a>
        </section>
      </div>
    </section>
  );
};

export default Press;
