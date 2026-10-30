import './NotFound.css';

function NotFound() {
  return (
    <section className="not-found-page">
      <div className="not-found-page__inner">
        <p className="not-found-page__code">404</p>
        <h1>This page doesn’t exist</h1>
        <p className="not-found-page__intro">
          The link may be broken or the page may have moved. Head back to the
          homepage or try one of these pages.
        </p>
        <nav className="not-found-page__links" aria-label="Main sections">
          <a href="/">Go Home</a>
        </nav>
      </div>
    </section>
  );
}

export default NotFound;
