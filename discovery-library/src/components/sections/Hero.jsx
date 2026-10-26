import { useMemo } from 'react';
import Link from '../ui/Link';
import { nextSession } from '../../data';

function Hero({ cueHidden }) {
  const ns = useMemo(() => nextSession(), []);
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-text">
            <span className="chip">
              <span className="live" />
              Next live session: {ns.title.split(':')[0]} · {ns.wd} {ns.d} {ns.mon}
            </span>
            <h1 className="mega">
              {['Study smarter', 'with everything', 'in one library.'].map((line, i) => (
                <span key={line} className="hl" style={{ '--i': i }}><span>{line}</span></span>
              ))}
            </h1>
            <p className="hero-sub">Training videos, session recordings, live workshops and an APA 7th referencing guide, all in one place for VET students and trainers.</p>
            <div className="hero-cta">
              <Link to="/resources" className="btn btn-gold btn-lg">Browse resources</Link>
              <Link to="/videos" className="btn btn-ghost btn-lg">Watch training videos</Link>
            </div>
          </div>
          <div />
        </div>
      </div>
      <div className="cue" aria-hidden="true" style={cueHidden ? { display: 'none' } : undefined}>
        <span className="mouse" />Scroll
      </div>
    </section>
  );
}

export default Hero;