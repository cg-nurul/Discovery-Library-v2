import Link from '../ui/Link';
import { FOOT_LINKS, SITE_URLS } from '../../data';
import Logo from '../../assets/Discovery Library Light Logo.svg?react';

function Footer() {
  return (
    <footer className="foot">
      <div className="in">
        
        <nav className="foot-links">
          <span className="foot-copy">© 2026 Discovery Library</span>
          {FOOT_LINKS.map(([to, label]) => <Link key={label} to={to}>{label}</Link>)}
        </nav>
        <div className="foot-left">
          <div className="foot-text">
            Comprehensive learning, research, and compliance support for VET students and trainers.
          </div>
          <Link to={SITE_URLS.home} className="foot-brand" aria-label="Discovery Library home">
            <Logo
              className="foot-logo"
              role="img"
              aria-label="Discovery Library"
              viewBox="0 0 300 150"
              preserveAspectRatio="xMidYMid meet"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;