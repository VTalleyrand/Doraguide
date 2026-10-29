import './NotFound.css';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/help', label: 'Help' },
  { href: '/press', label: 'Press' },
];

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
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

export default NotFound;
