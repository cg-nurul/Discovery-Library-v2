import Link from '../ui/Link';
import { FOOT_LINKS } from '../../data';
import Logo from '../../assets/Discovery Library Light Logo.svg?react';

function Footer() {
  return (
    <footer className="foot">
      <div className="in">
        <div className="foot-left">
          <Link to="/" className="foot-brand" aria-label="Discovery Library home">
            <Logo
              className="foot-logo"
              role="img"
              aria-label="Discovery Library"
              viewBox="0 0 300 150"
              preserveAspectRatio="xMidYMid meet"
            />
          </Link>
          <div className="foot-text">
            Comprehensive learning, research, and compliance support for VET students and trainers.
          </div>
        </div>
        <nav className="foot-links">
          {FOOT_LINKS.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
          <span className="foot-copy">© 2026 Discovery Library</span>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;