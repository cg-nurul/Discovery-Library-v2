import { useState } from 'react';
import Link from '../ui/Link';
import Reveal from '../ui/Reveal';
import CiteRow from './CiteRow';
import { QUICK } from '../../data';

function ApaQuick({ onCopy }) {
  const [i, setI] = useState(0);
  const q = QUICK[i];
  return (
    <section className="section">
      <div className="wrap split">
        <Reveal>
          <h2>Cite in APA 7th without the guesswork</h2>
          <p className="lead">Pick a source type, copy the format, and paste it into your assignment. The full guide covers every section, with a search to find what you need fast.</p>
          <Link to="/referencing" className="btn btn-gold btn-lg">Open the referencing guide</Link>
        </Reveal>
        <Reveal className="glass quick" delay={0.12}>
          <div className="tabs" role="tablist">
            {QUICK.map((x, k) => (
              <button key={x.k} type="button" role="tab" aria-selected={k === i} className={`tab${k === i ? ' on' : ''}`} onClick={() => setI(k)}>{x.k}</button>
            ))}
          </div>
          <CiteRow label="Reference list" text={q.ref} onCopy={onCopy} />
          <CiteRow label="In-text" text={q.it} onCopy={onCopy} />
          <p className="note">{q.n}</p>
        </Reveal>
      </div>
    </section>
  );
}

export default ApaQuick;