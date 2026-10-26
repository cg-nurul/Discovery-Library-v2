function Backdrop() {
  const sparkPath = 'M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0z';
  const sparks = [
    { left: '12%', top: '24%', delay: '.2s' },
    { left: '78%', top: '14%', delay: '1.4s', size: 12 },
    { left: '88%', top: '62%', delay: '2.2s' },
    { left: '6%', top: '70%', delay: '3s', size: 11 },
    { left: '46%', top: '86%', delay: '1s' },
  ];
  return (
    <div className="glow" aria-hidden="true">
      <i className="g1" /><i className="g2" /><i className="g3" /><i className="g4" />
      <div className="dots" />
      <div className="ring r1" /><div className="ring r2" /><div className="ring r3" />
      {sparks.map((s, i) => (
        <span key={i} className="spark" style={{ left: s.left, top: s.top, animationDelay: s.delay, ...(s.size ? { width: s.size, height: s.size } : {}) }}>
          <svg viewBox="0 0 24 24"><path d={sparkPath} /></svg>
        </span>
      ))}
    </div>
  );
}

export default Backdrop;