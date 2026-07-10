import { useEffect, useState } from 'react';
import { appStoreUrl } from '../../metadata.js';
import './Header.css';

const appleIcon = (
  <svg
    className="design-btn__icon"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') closeMenu();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [isMenuOpen]);

  const navItems = [
    { id: 'listen', label: 'Listen' },
    { id: 'features', label: 'Features' },
    { id: 'cities', label: 'Cities' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Primary">
        <a href="/" className="logo" onClick={closeMenu}>
          Dora
        </a>
        <button
          type="button"
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          id="menu-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="nav-links"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span></span>
          <span></span>
        </button>
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`} id="nav-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <a href={`/#${item.id}`} onClick={closeMenu}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          className="design-btn"
          href={appStoreUrl}
          target="_blank"
          rel="noreferrer"
        >
          {appleIcon}
          Download on iOS
        </a>
      </nav>
    </header>
  );
};

export default Header;
