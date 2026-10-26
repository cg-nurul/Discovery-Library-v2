import Icon from '../ui/Icon';
import Link from '../ui/Link';
import Reveal from '../ui/Reveal';
import { WORD_LESSONS } from '../../data';

function WordSeries() {
  return (
    <section className="section">
      <div className="wrap split">
        <Reveal>
          <h2>Learn Microsoft Word in 11 short lessons</h2>
          <p className="lead">From opening the program to tracking changes and comments. Work through the series in order, or jump to the lesson you need.</p>
          <Link to="/videos/word-series" className="btn btn-em btn-lg">Open the series</Link>
        </Reveal>
        <Reveal className="glass panel" delay={0.12}>
          <div className="player">
            <span className="pl"><Icon name="play" /></span>
            <span className="cap">Microsoft Word Skills</span>
          </div>
          <ol className="mini">
            {WORD_LESSONS.map((l) => <li key={l}>{l}</li>)}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

export default WordSeries;