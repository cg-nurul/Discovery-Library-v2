import Link from '../ui/Link';
import Icon from '../ui/Icon';
import SpecularButton from '../ui/SpecularButton';
import RippleButton from '../ui/RippleButton';
import { NAV_LINKS, MOBILE_LINKS } from '../../data';
import Logo from '../../assets/Discovery Library Light Logo.svg?react';

function Header({ scrolled, menuOpen, setMenuOpen, onSearch, currentRoute = '/' }) {
  const close = () => setMenuOpen(false);

  return (
    <>
      <nav className={`top${scrolled ? ' scrolled' : ''}`} id="nav">
        <Link to="/" className="brand" aria-label="Discovery Library home">
          <Logo
            className="logo"
            role="img"
            aria-label="Discovery Library"
            viewBox="0 0 300 150"
            preserveAspectRatio="xMidYMid meet"
          />
        </Link>
        <div className="navlinks">
          {NAV_LINKS.map((l) => {
            const isActive = currentRoute === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                style={isActive ? { background: 'rgba(255,200,58,0.12)', color: 'var(--gold)', fontWeight: 600 } : undefined}
              >
                <Icon name={l.icon} />
                <span>{l.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="navcta">
          <button type="button" className="nav-search-btn" onClick={onSearch} aria-label="Search library resources" title="Quick Search (Ctrl+K)">
            <Icon name="search" />
          </button>
          <RippleButton as={Link} to="/llnd" className="btn btn-ghost" rippleColor="var(--em)">
            <Icon name="lock" />My LLND Portal
          </RippleButton>
          <SpecularButton
            as={Link}
            to="/consultation"
            className="btn btn-gold"
            radius={12}
            lineColor="#ffffff"
            baseColor="#ffd860"
            intensity={1.2}
          >
            Book a Consultation
          </SpecularButton>
          <button type="button" className="burger" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </nav>
      <div className={`mnav${menuOpen ? ' open' : ''}`} id="mnav">
        {MOBILE_LINKS.map(([to, label]) => (
          <Link
            key={to}
            to={to}
            onClick={close}
            style={currentRoute === to ? { color: 'var(--gold)' } : undefined}
          >
            {label}
          </Link>
        ))}
        <SpecularButton
          as={Link}
          to="/consultation"
          className="btn btn-gold"
          onClick={close}
          radius={12}
          lineColor="#ffffff"
          baseColor="#ffd860"
          intensity={1.2}
        >
          Book a Consultation
        </SpecularButton>
      </div>
    </>
  );
}

export default Header;