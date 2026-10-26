import { useRef } from 'react';
import Icon from '../ui/Icon';
import Reveal from '../ui/Reveal';
import { prefersReduced } from '../../lib/utils';

function ResCard({ card, index }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const fine = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    if (!fine || prefersReduced()) return;
    const c = ref.current; const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    c.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`);
    c.style.setProperty('--rx', `${(-y * 12).toFixed(2)}deg`);
  };
  const onLeave = () => { ref.current.style.setProperty('--ry', '0deg'); ref.current.style.setProperty('--rx', '0deg'); };
  return (
    <Reveal className="tilt-wrap" delay={index * 0.09}>
      <a ref={ref} href={`#${card.to}`} className={`rcard glass ${card.cls}`} onPointerMove={onMove} onPointerLeave={onLeave}>
        {card.isNew && <span className="badge-new">Active</span>}
        <span className="ico"><Icon name={card.icon} /></span>
        <h3>{card.t}</h3>
        <p>{card.d}</p>
        <span className="go"><Icon name="arrow" /></span>
      </a>
    </Reveal>
  );
}

export default ResCard;