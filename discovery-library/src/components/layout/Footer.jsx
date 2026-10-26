import Link from '../ui/Link';
import { FOOT_LINKS } from '../../data';

function Footer() {
  return (
    <footer className="foot">
      <div className="wrap in">
        <div>
          <b>© 2026 Discovery Library.</b> Comprehensive learning, research, and compliance support for VET students and trainers.
          <div style={{ marginTop: 6, fontSize: 12.5, color: 'rgba(169,199,184,.75)' }}>
            Discovery Library · AIBTGlobal Education Hub · Brisbane, Sydney, Melbourne, Adelaide, Hobart
          </div>
        </div>
        <nav>
          {FOOT_LINKS.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
        </nav>
      </div>
    </footer>
  );
}

export default Footer;