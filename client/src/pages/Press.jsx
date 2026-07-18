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
              for coverage or partnership conversations.
            </p>
          </div>
          <div className="press-hero__contact">
            <a className="primary-btn" href="mailto:hello@volele.co">
              Email us
            </a>
          </div>
        </header>
      </div>
    </section>
  );
};

export default Press;
