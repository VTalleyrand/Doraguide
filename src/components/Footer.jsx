import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">Dora</div>
        <nav className="site-footer__nav" aria-label="Footer">
          <a href="/about">About</a>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/press">Press</a>
        </nav>
        <p className="site-footer__note">Made on the road.</p>
      </div>
    </footer>
  );
};

export default Footer;
