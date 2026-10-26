import Link from '../ui/Link';
import Reveal from '../ui/Reveal';
import { SESSIONS } from '../../data';

function ComingUp() {
  return (
    <section className="section">
      <div className="wrap">
        <Reveal className="sh">
          <h2>Coming up</h2>
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
              <span className="typetag">{s.type}</span>
            </Reveal>
          ))}
        </Reveal>
        <Reveal style={{ marginTop: 26 }}>
          <Link to="/sessions" className="btn btn-ghost">See all sessions</Link>
        </Reveal>
      </div>
    </section>
  );
}

export default ComingUp;