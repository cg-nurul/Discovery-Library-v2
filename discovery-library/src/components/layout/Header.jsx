import Link from '../ui/Link';
import Icon from '../ui/Icon';
import NavOrb from '../three/NavOrb';
import { NAV_LINKS, MOBILE_LINKS } from '../../data';

function Header({ scrolled, menuOpen, setMenuOpen, onSearch }) {
  const close = () => setMenuOpen(false);
  return (
    <>
      <nav className={`top${scrolled ? ' scrolled' : ''}`} id="nav">
        <Link to="/" className="brand" aria-label="Discovery Library home">
          <NavOrb />
          <span>Discovery Library</span>
        </Link>
        <div className="navlinks">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to}>
              <Icon name={l.icon} />
              <span>{l.label}</span>
            </Link>
          ))}
        </div>
        <div className="navcta">
          <button type="button" className="nav-search-btn" onClick={onSearch} aria-label="Search library resources" title="Quick Search (Ctrl+K)">
            <Icon name="search" />
          </button>
          <Link to="/llnd" className="btn btn-ghost"><Icon name="lock" />My LLND Portal</Link>
          <Link to="/consultation" className="btn btn-gold">Book a Consultation</Link>
          <button type="button" className="burger" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </nav>
      <div className={`mnav${menuOpen ? ' open' : ''}`} id="mnav">
        {MOBILE_LINKS.map(([to, label]) => (
          <Link key={to} to={to} onClick={close}>{label}</Link>
        ))}
        <Link to="/consultation" className="btn btn-gold" onClick={close}>Book a Consultation</Link>
      </div>
    </>
  );
}

export default Header;