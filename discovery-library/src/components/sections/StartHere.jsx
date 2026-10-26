import Reveal from '../ui/Reveal';
import ResCard from './ResCard';
import { RES_CARDS } from '../../data';

function StartHere() {
  return (
    <section className="section">
      <div className="wrap">
        <Reveal className="sh">
          <h2>Pick where to start</h2>
          <p>Four places to learn, catch up and plan ahead.</p>
        </Reveal>
        <div className="cards4">
          {RES_CARDS.map((c, i) => <ResCard key={c.to} card={c} index={i} />)}
        </div>
      </div>
    </section>
  );
}

export default StartHere;