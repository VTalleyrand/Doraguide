import './Press.css';

const PRESS_KIT_PATH = '/dora-press-kit.zip';

const Press = () => {
  return (
    <section className="press-page">
      <div className="press-page__inner">
        <header className="press-hero">
          <div className="press-hero__copy">
            <h1>Press</h1>
            <p className="press-hero__intro">
              Download the Dora press kit for logos, product images, and media
              information.
            </p>
          </div>
          <div className="press-hero__contact">
            <a
              className="primary-btn"
              href={PRESS_KIT_PATH}
              download="dora-press-kit.zip"
            >
              Download press kit
            </a>
          </div>
        </header>
      </div>
    </section>
  );
};

export default Press;
