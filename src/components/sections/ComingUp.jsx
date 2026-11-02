import Link from '../ui/Link';
import Reveal from '../ui/Reveal';
import RippleButton from '../ui/RippleButton';
import { SESSIONS, SITE_URLS } from '../../data';

function getSessionTypeIcon(type) {
  const norm = (type || '').toLowerCase();
  if (norm.includes('live')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="typetag-ico" aria-hidden="true">
        <path d="M4.9 19.1A10 10 0 0 1 2 12a10 10 0 0 1 2.9-7.1" />
        <path d="M7.8 16.2A6 6 0 0 1 6 12c0-1.7.7-3.2 1.8-4.2" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <path d="M16.2 7.8A6 6 0 0 1 18 12c0 1.7-.7 3.2-1.8 4.2" />
        <path d="M19.1 4.9A10 10 0 0 1 22 12a10 10 0 0 1-2.9 7.1" />
      </svg>
    );
  }
  if (norm.includes('workshop')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="typetag-ico" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="typetag-ico" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <polygon points="10 7 15 10 10 13 10 7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ComingUp() {
  return (
    <section className="section">
      <div className="wrap">
        <Reveal className="sh">
          <h2>
            Coming <span className="hl-word hl-gold">up</span>
          </h2>
          <p>Reserve your spot and set a reminder so you don’t miss a session.</p>
        </Reveal>
        <Reveal className="glass upnext">
          {SESSIONS.slice(0, 3).map((s, i) => (
            <Reveal key={s.title} className={`uprow c-${s.cat}`} delay={i * 0.1}>
              <div className="datebadge"><b>{s.d}</b><span>{s.mon}</span></div>
              <div>
                <h3>{s.title}</h3>
                <div className="m">{s.wd} · {s.time}</div>
              </div>
              <span className="typetag">
                {getSessionTypeIcon(s.type)}
                <span>{s.type}</span>
              </span>
            </Reveal>
          ))}
        </Reveal>
        <Reveal style={{ marginTop: 26 }}>
          <RippleButton as={Link} to={SITE_URLS.sessions} className="btn btn-ghost" rippleColor="var(--em)">
            See all sessions
          </RippleButton>
        </Reveal>
      </div>
    </section>
  );
}

export default ComingUp;