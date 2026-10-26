/**
 * Discovery Library — Homepage (header + footer included)
 *
 * Setup:
 *   npm i three@0.128.0      (pinned to match the reference's lighting exactly)
 *
 * Usage:
 *   import DiscoveryLibraryHome from './DiscoveryLibraryHome';
 *   <DiscoveryLibraryHome />
 *
 * Notes:
 *  - All internal links go through <Link>. It renders plain "#/route" hrefs like the
 *    reference. To use React Router, change the body of <Link> to <RouterLink to={to} />.
 *  - Styles are injected as global CSS (same as the reference, which is a full-page design).
 *    Move the CSS string into a .css file if you prefer.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/* ============================== DATA ============================== */

const SESSIONS = [
  { cat: 'live', type: 'Live session', title: 'Referencing Clinic: APA 7th Edition', d: '26', mon: 'Sep', wd: 'Sat', time: '3:00 PM – 4:00 PM AEST', iso: '2026-09-26T05:00:00Z' },
  { cat: 'workshop', type: 'Workshop', title: 'Research Skills Workshop: Finding Credible Sources', d: '03', mon: 'Oct', wd: 'Sat', time: '10:00 AM – 11:30 AM AEST', iso: '2026-10-03T00:00:00Z' },
  { cat: 'webinar', type: 'Webinar', title: 'Using AI Responsibly in Your Coursework', d: '10', mon: 'Oct', wd: 'Sat', time: '11:00 AM – 12:00 PM AEDT', iso: '2026-10-10T00:00:00Z' },
  { cat: 'workshop', type: 'Workshop', title: 'Numeracy Clinic: Assessment Math & Measurements', d: '17', mon: 'Oct', wd: 'Sat', time: '2:00 PM – 3:30 PM AEDT', iso: '2026-10-17T03:00:00Z' },
  { cat: 'live', type: 'Live session', title: 'ASQA Standards Update: Information Briefing', d: '24', mon: 'Oct', wd: 'Sat', time: '1:00 PM – 2:30 PM AEDT', iso: '2026-10-24T02:00:00Z' },
];

function nextSession() {
  const now = Date.now();
  return SESSIONS.find((s) => new Date(s.iso).getTime() > now) || SESSIONS[0];
}

const WORD_LESSONS = [
  'Opening & Quitting the Program',
  'How to Create a Document, Add & Format Text',
  'Page Formatting',
  'Paragraph Formatting',
  'Word Formatting Styles',
];

const RES_CARDS = [
  { to: '/videos', cls: 'c-em', icon: 'play', t: 'Training Videos', d: 'Curated video lessons on VET compliance, technology, and assessor standards.' },
  { to: '/links', cls: 'c-gold', icon: 'link', t: 'Useful Links & Tools', d: 'Directory of academic search engines, research databases, and style manuals.' },
  { to: '/recordings', cls: 'c-mint', icon: 'rewind', t: 'Session Recordings', d: 'Catch up on past live clinics, workshops, and compliance briefings anytime.' },
  { to: '/sessions', cls: 'c-amber', icon: 'calendar', t: 'Upcoming Sessions', d: 'Live referencing clinics, numeracy workshops, and ASQA webinars.', isNew: true },
];

const QUICK = [
  { k: 'Journal article', ref: 'Lee, A. (2023). Enhancing student engagement in vocational education. Journal of VET Research, 12(3), 45–60. https://doi.org/10.1016/j.vet.2023.01.004', it: '(Lee, 2023)', n: 'Include volume, issue in parentheses, page range, and DOI URL whenever available.' },
  { k: 'Webpage', ref: 'Nguyen, T. (2025, May 12). Managing academic momentum in blended learning. Discovery Learning Insights. https://discoverylibrary.com.au/resources/momentum', it: '(Nguyen, 2025)', n: 'Include the site name when it differs from the author. Provide full URL.' },
  { k: 'Blog post', ref: 'Patel, R. (2025, June 3). Five principles for responsible AI usage in TAFE and VET. Education Tomorrow. https://educationtomorrow.edu.au/ai-principles', it: '(Patel, 2025)', n: 'Format like a webpage, specifying the specific blog publication name.' },
  { k: 'Ebook', ref: 'Smith, J. (2024). Essential vocational training and workplace assessment (2nd ed.). Academic Press. https://doi.org/10.1007/978-3-030-12345-6', it: '(Smith, 2024)', n: 'Include book edition in parentheses if applicable, followed by publisher and DOI/URL.' },
];

const NAV_LINKS = [
  { to: '/resources', label: 'Resources', icon: 'book' },
  { to: '/videos', label: 'Videos', icon: 'play' },
  { to: '/sessions', label: 'Sessions', icon: 'calendar' },
  { to: '/referencing', label: 'Referencing', icon: 'doc' },
  { to: '/newsletter', label: 'Newsletter', icon: 'mailNav' },
];

const MOBILE_LINKS = [
  ['/', 'Home'], ['/resources', 'Library Resources'], ['/videos', 'Training Videos'], ['/links', 'Useful Links & Tools'],
  ['/recordings', 'Session Recordings'], ['/sessions', 'Upcoming Sessions'], ['/referencing', 'Referencing Guide'],
  ['/newsletter', 'Newsletters'], ['/llnd', 'My LLND Portal'], ['/contact', 'Contact Us & FAQ'],
];

const FOOT_LINKS = [
  ['/resources', 'All Resources'], ['/videos', 'Training Videos'], ['/links', 'Useful Links & Tools'], ['/recordings', 'Recordings'],
  ['/sessions', 'Sessions Calendar'], ['/referencing', 'APA 7th Guide'], ['/newsletter', 'Newsletter Archive'],
  ['/llnd', 'My LLND Support'], ['/contact', 'Contact & FAQ'],
];

// Titles + blurbs used by the quick-search modal in the header
const SEARCH_VIDEOS = [
  ['Responsible Use of AI in VET', 'Guides VET trainers and students in adopting AI ethically, verifying facts, and upholding academic integrity.'],
  ['Popular AI Tools as of June 2026', 'A review of modern generative AI platforms for educators and student research workflows.'],
  ['Staff Obligations for Inventory Check', 'Procedural obligations for trainers and assessors when conducting equipment and asset audits.'],
  ['Student Course Attendance & Academic Momentum', 'Guidelines on tracking course progress, monitoring attendance, and timely student intervention.'],
  ['Inventory and Facility Management', 'Core standards of vocational training facilities and occupational safety compliance.'],
  ['Monitoring Student Progress & Attendance Policy', 'Attendance thresholds, warnings, and learning support referral pathways.'],
  ['Monitoring Policy: Key Updates', 'Recent changes to student monitoring protocols under revised VET sector frameworks.'],
  ['Counselling & Student Support Services', 'Mental health, crisis support, and welfare counselling available across all campuses.'],
  ['Overview of the Australian VET Sector', 'Orientation to the Australian VET landscape, ASQA, training packages, and RTO governance.'],
  ['Trainer and Assessor Requirements (Standards)', 'Vocational competency, current industry skills, and TAE credential requirements.'],
  ['Training & Assessment Strategy (TAS): Updated', 'How to read, implement, and adhere to the TAS document for each qualification.'],
  ['Training and Assessment Strategy Fundamentals', 'Core principles of developing and reviewing training and assessment strategies.'],
  ['Trainer Marking Quality Checklist', 'Rubrics, evidence gathering, and constructive feedback practices.'],
  ['Generation of Verifiable USI Transcript', 'Generating and verifying authenticated Unique Student Identifier transcripts.'],
  ['Critical Incident Awareness & Response', 'Emergency response workflows, reporting channels, and trauma-informed support.'],
  ['Training Rolling Intake Model', 'How flexible rolling intakes support continuous learning momentum.'],
  ['Comprehensive Training & Wellbeing Support', 'Frameworks connecting academic mentoring, English language assistance, and wellbeing resources.'],
];

/* ============================== HELPERS ============================== */

const prefersReduced = () =>
  typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ICONS = {
  play: <path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" />,
  link: (<><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>),
  rewind: (<><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 2" /></>),
  calendar: (<><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></>),
  book: (<><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>),
  copy: (<><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" /></>),
  lock: (<><rect x="5" y="11" width="14" height="10" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  doc: (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>),
  mailNav: (<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>),
};

function Icon({ name, className = '' }) {
  return (
    <svg className={`ic ${className}`} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  );
}

function Link({ to, children, ...rest }) {
  return <a href={`#${to}`} {...rest}>{children}</a>;
}

/** Scroll-triggered reveal (fade/slide in once). */
function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReduced() || !('IntersectionObserver' in window)) { setSeen(true); return undefined; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal${seen ? ' in' : ''} ${className}`.trim()} style={{ '--d': `${delay}s`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

/* ============================== 3D (three.js) ============================== */

function glowTexture(inner, mid) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, inner); gr.addColorStop(0.35, mid); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function makeBook(coverHex) {
  const g = new THREE.Group();
  const cover = new THREE.MeshStandardMaterial({ color: coverHex, roughness: 0.45, metalness: 0.15, emissive: coverHex, emissiveIntensity: 0.1 });
  const pages = new THREE.MeshStandardMaterial({ color: 0xfff2c4, roughness: 0.85, metalness: 0, emissive: 0x553d08, emissiveIntensity: 0.08 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xffc83a, roughness: 0.3, metalness: 0.75, emissive: 0xff9e2c, emissiveIntensity: 0.2 });
  const W = 1.0, H = 1.4, T = 0.26;
  const back = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.035), cover); back.position.z = -T / 2 + 0.0175;
  const front = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.035), cover); front.position.z = T / 2 - 0.0175;
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.07, H, T), cover); spine.position.x = -W / 2 + 0.035;
  const block = new THREE.Mesh(new THREE.BoxGeometry(W - 0.1, H - 0.1, T - 0.07), pages); block.position.x = 0.02;
  const band = new THREE.Mesh(new THREE.BoxGeometry(W * 0.6, 0.09, 0.012), gold); band.position.set(0.05, 0.28, T / 2 + 0.004);
  const band2 = new THREE.Mesh(new THREE.BoxGeometry(W * 0.36, 0.05, 0.012), gold); band2.position.set(0.05, 0.08, T / 2 + 0.004);
  g.add(back, front, spine, block, band, band2);
  return g;
}

function disposeScene(scene) {
  scene.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) {
      [].concat(o.material).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
    }
  });
}

/** Fixed full-screen ambient scene: gem, rings, orbiting books, sparkles. */
function AmbientScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) { return undefined; }
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    scene.add(new THREE.AmbientLight(0xffffff, 0.42));
    const key = new THREE.DirectionalLight(0xffffff, 0.58); key.position.set(3, 5, 4); scene.add(key);
    const pg = new THREE.PointLight(0xffc83a, 0.85, 24); pg.position.set(-4, 2, 4); scene.add(pg);
    const pe = new THREE.PointLight(0x19d68a, 0.85, 24); pe.position.set(4, -2.5, 4); scene.add(pe);

    const root = new THREE.Group(); scene.add(root);

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 1), new THREE.MeshStandardMaterial({ color: 0x19d68a, emissive: 0x075e3a, emissiveIntensity: 0.35, roughness: 0.3, metalness: 0.25, flatShading: true }));
    root.add(core);
    const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.18, 1), new THREE.MeshBasicMaterial({ color: 0xffc83a, wireframe: true, transparent: true, opacity: 0.38 }));
    root.add(wire);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('rgba(255,240,180,0.65)', 'rgba(25,214,138,.3)'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.35 }));
    halo.scale.set(4.2, 4.2, 1); root.add(halo);

    const ringGold = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.04, 16, 140), new THREE.MeshStandardMaterial({ color: 0xffc83a, metalness: 0.8, roughness: 0.25, emissive: 0xff9e2c, emissiveIntensity: 0.25 }));
    ringGold.rotation.x = 1.15; root.add(ringGold);
    const ringGreen = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.03, 16, 160), new THREE.MeshStandardMaterial({ color: 0x46f2aa, metalness: 0.5, roughness: 0.3, emissive: 0x19d68a, emissiveIntensity: 0.25 }));
    ringGreen.rotation.set(-0.5, 0.4, 0); root.add(ringGreen);

    const cfg = [
      { c: 0x0c4d32, r: 2.4, y: 0.7, a: 0.0, s: 0.82 }, { c: 0xb88612, r: 2.6, y: -0.5, a: 0.9, s: 0.88 }, { c: 0x0a3b26, r: 2.3, y: -1.1, a: 1.9, s: 0.76 },
      { c: 0xbf6816, r: 2.8, y: 1.2, a: 2.7, s: 0.8 }, { c: 0x2d8a63, r: 2.5, y: 0.1, a: 3.6, s: 0.72 }, { c: 0xc49b25, r: 2.4, y: 1.1, a: 4.5, s: 0.75 }, { c: 0x157d54, r: 2.7, y: -0.9, a: 5.4, s: 0.85 },
    ];
    const books = cfg.map((o, i) => {
      const pivot = new THREE.Group(); pivot.rotation.y = o.a;
      const b = makeBook(o.c); b.scale.setScalar(o.s); b.position.set(o.r, o.y, 0);
      b.rotation.set(0.3 * (i % 2 ? 1 : -1), 0.4, 0.25 * ((i % 3) - 1));
      pivot.add(b); root.add(pivot);
      return { pivot, book: b, o, i };
    });

    const N = 180, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
    const cg = new THREE.Color(0xffc83a), ce = new THREE.Color(0x8cf7c5);
    for (let k = 0; k < N; k++) {
      const rad = 3.5 + Math.random() * 3.5, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      pos[k * 3] = rad * Math.sin(ph) * Math.cos(th); pos[k * 3 + 1] = rad * Math.cos(ph) * 0.65; pos[k * 3 + 2] = rad * Math.sin(ph) * Math.sin(th);
      const cc = Math.random() > 0.5 ? cg : ce; col[k * 3] = cc.r * 0.7; col[k * 3 + 1] = cc.g * 0.7; col[k * 3 + 2] = cc.b * 0.7;
    }
    const pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pgeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pts = new THREE.Points(pgeo, new THREE.PointsMaterial({ size: 0.14, map: glowTexture('rgba(255,255,255,.8)', 'rgba(255,255,255,.2)'), vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }));
    root.add(pts);

    let aspect = 1;
    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      aspect = w / h;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      camera.aspect = aspect; camera.updateProjectionMatrix();
    };
    resize();

    let curPosX = 2.5, curPosY = 0, curScale = 0.65, curOpacity = 0.8;
    const s = { px: 0, py: 0, scroll: 0 };
    let tpx = 0, tpy = 0;

    const update = (t) => {
      const wide = aspect > 1.2, hw = 3.84 * aspect;
      const sc = wide ? Math.max(0.42, Math.min(0.85, (hw * 0.5 - 0.7) / 4.0)) : Math.max(0.32, Math.min(0.6, (hw - 0.3) / 4.5));
      const sp = Math.min(1, s.scroll * 3);
      const targetX = wide ? hw * 0.65 * (1 - sp * 0.8) : 0;
      const targetY = wide ? 0.1 + s.scroll * 2.2 : 1.6 + s.scroll * 2.2;
      const targetScale = sc * 0.72 * (1 - Math.min(0.2, s.scroll * 0.6));
      const targetOpacity = Math.max(0.2, 0.85 - s.scroll * 0.7);

      curPosX += (targetX - curPosX) * 0.06; curPosY += (targetY - curPosY) * 0.06;
      curScale += (targetScale - curScale) * 0.06; curOpacity += (targetOpacity - curOpacity) * 0.06;

      root.position.x = curPosX; root.position.y = curPosY; root.scale.setScalar(curScale);
      canvas.style.opacity = curOpacity.toFixed(3);

      root.rotation.y = t * 0.1 + s.scroll * Math.PI * 1.8 + s.px * 0.25;
      root.rotation.x = s.py * 0.15 + s.scroll * 0.2;
      core.rotation.y = t * 0.35; core.rotation.x = t * 0.2; wire.rotation.y = -t * 0.22;
      const pulse = 1 + Math.sin(t * 1.4) * 0.04; halo.scale.set(4.2 * pulse, 4.2 * pulse, 1);
      ringGold.rotation.z = t * 0.28; ringGreen.rotation.z = -t * 0.2;

      books.forEach((B) => {
        B.pivot.rotation.y = B.o.a + t * (0.12 + 0.018 * B.i);
        B.book.position.set(B.o.r, B.o.y + Math.sin(t * 0.8 + B.i * 1.5) * 0.2, 0);
        B.book.rotation.y += 0.004;
        B.book.rotation.x = 0.25 * (B.i % 2 ? 1 : -1) + Math.sin(t * 0.6 + B.i) * 0.09;
      });
      pts.rotation.y = -t * 0.02;
    };

    const reduce = prefersReduced();
    let raf = 0, running = false, t0 = 0;
    const loop = (ts) => {
      if (!running) return;
      if (!t0) t0 = ts;
      const t = (ts - t0) / 1000;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      s.scroll = Math.min(1, Math.max(0, window.scrollY / max));
      s.px += (tpx - s.px) * 0.05; s.py += (tpy - s.py) * 0.05;
      update(t); renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      if (reduce) { update(4); renderer.render(scene, camera); return; }
      running = true; raf = requestAnimationFrame(loop);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const onMove = (e) => { tpx = (e.clientX / window.innerWidth - 0.5) * 2; tpy = (e.clientY / window.innerHeight - 0.5) * 2; };
    const onVis = () => (document.hidden ? stop() : start());
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    start();

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      disposeScene(scene);
      renderer.dispose();
    };
  }, []);

  return <canvas id="scene" ref={canvasRef} aria-hidden="true" />;
}

/** Small spinning beacon next to the brand name. */
function NavOrb() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    let r;
    try { r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); } catch (e) { return undefined; }
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.setSize(28, 28, false);
    const sc = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 50); cam.position.z = 4.2;
    sc.add(new THREE.AmbientLight(0xffffff, 0.8));
    const pl = new THREE.PointLight(0xffc83a, 1.6, 12); pl.position.set(2, 2, 3); sc.add(pl);
    const grp = new THREE.Group(); sc.add(grp);

    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.6, 0), new THREE.MeshStandardMaterial({ color: 0x19d68a, emissive: 0x0b9a62, emissiveIntensity: 0.45, roughness: 0.3, metalness: 0.4 }));
    grp.add(core);
    const ringGold = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.05, 8, 32), new THREE.MeshStandardMaterial({ color: 0xffc83a, roughness: 0.25, metalness: 0.8, emissive: 0xff9e2c, emissiveIntensity: 0.2 }));
    ringGold.rotation.x = Math.PI / 3; grp.add(ringGold);
    const ringMint = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.04, 8, 36), new THREE.MeshStandardMaterial({ color: 0x8cf7c5, roughness: 0.3, metalness: 0.5, emissive: 0x19d68a, emissiveIntensity: 0.2 }));
    ringMint.rotation.y = Math.PI / 4; grp.add(ringMint);

    let targetRotY = 0, curRotY = 0, targetRotX = 0, curRotX = 0, raf = 0, alive = true;
    const onHash = () => { targetRotY += Math.PI * 2; targetRotX += (Math.random() - 0.5) * 0.6; };
    window.addEventListener('hashchange', onHash);

    const reduce = prefersReduced();
    const anim = (t) => {
      if (!alive) return;
      raf = requestAnimationFrame(anim);
      if (reduce) { r.render(sc, cam); return; }
      curRotY += (targetRotY - curRotY) * 0.08; curRotX += (targetRotX - curRotX) * 0.08;
      grp.rotation.y = curRotY + t * 0.0009; grp.rotation.x = curRotX + Math.sin(t * 0.001) * 0.15;
      core.rotation.y = t * 0.0018; ringGold.rotation.z = t * 0.0022; ringMint.rotation.z = -t * 0.0018;
      r.render(sc, cam);
    };
    raf = requestAnimationFrame(anim);

    return () => {
      alive = false; cancelAnimationFrame(raf);
      window.removeEventListener('hashchange', onHash);
      disposeScene(sc); r.dispose();
    };
  }, []);
  return <canvas ref={ref} width="56" height="56" className="brand-beacon" title="Discovery Navigation Beacon" aria-hidden="true" />;
}

/* ============================== LAYOUT PIECES ============================== */

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

function Header({ scrolled, menuOpen, setMenuOpen, onSearch }) {
  const close = () => setMenuOpen(false);
  return (
    <>
      <nav className={`top${scrolled ? ' scrolled' : ''}`} id="nav">
        <Link to="/" className="brand" aria-label="Discovery Library home">
          <NavOrb />
          <span>Discovery Library</span>
        </Link>
        <div className="navlinks">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to}>
              <Icon name={l.icon} />
              <span>{l.label}</span>
            </Link>
          ))}
        </div>
        <div className="navcta">
          <button type="button" className="nav-search-btn" onClick={onSearch} aria-label="Search library resources" title="Quick Search (Ctrl+K)">
            <Icon name="search" />
          </button>
          <Link to="/llnd" className="btn btn-ghost"><Icon name="lock" />My LLND Portal</Link>
          <Link to="/consultation" className="btn btn-gold">Book a Consultation</Link>
          <button type="button" className="burger" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </nav>
      <div className={`mnav${menuOpen ? ' open' : ''}`} id="mnav">
        {MOBILE_LINKS.map(([to, label]) => (
          <Link key={to} to={to} onClick={close}>{label}</Link>
        ))}
        <Link to="/consultation" className="btn btn-gold" onClick={close}>Book a Consultation</Link>
      </div>
    </>
  );
}

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

function SearchModal({ open, onClose }) {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) { setQ(''); setTimeout(() => inputRef.current && inputRef.current.focus(), 30); }
  }, [open]);

  const results = useMemo(() => {
    const term = q.toLowerCase().trim();
    const out = [];
    SEARCH_VIDEOS.forEach(([t, d]) => {
      if (!term || t.toLowerCase().includes(term) || d.toLowerCase().includes(term)) out.push({ type: 'Video', icon: 'play', title: t, desc: d, to: '/videos' });
    });
    SESSIONS.forEach((s) => {
      if (!term || s.title.toLowerCase().includes(term)) out.push({ type: `Session: ${s.type}`, icon: 'calendar', title: s.title, desc: `${s.wd} ${s.d} ${s.mon} · ${s.time}`, to: '/sessions' });
    });
    return out.slice(0, 8);
  }, [q]);

  return (
    <div className={`backdrop${open ? ' show' : ''}`} role="dialog" aria-modal="true" aria-labelledby="stitle" aria-hidden={!open} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ width: 640 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 id="stitle" style={{ fontSize: 20, display: 'flex', alignItems: 'center', gap: 10, marginTop: 0 }}>
            <Icon name="search" className="gold" />Quick Search Library
          </h3>
          <button type="button" onClick={onClose} style={{ color: 'var(--sub)', fontSize: 13.5, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--line)' }}>Esc</button>
        </div>
        <div className="sbox" style={{ marginBottom: 18 }}>
          <Icon name="search" />
          <input ref={inputRef} type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search videos, sessions, guides..." aria-label="Global search" />
        </div>
        <div style={{ display: 'grid', gap: 8, maxHeight: '50vh', overflowY: 'auto', paddingRight: 4 }}>
          {results.length === 0 && (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>No matching library items found for “{q}”.</div>
          )}
          {results.map((r, i) => (
            <Link key={i} to={r.to} className="linkrow" onClick={onClose} style={{ background: 'rgba(2,14,9,.4)', borderColor: 'var(--line)', marginBottom: 2 }}>
              <span className="lico" style={{ width: 32, height: 32 }}><Icon name={r.icon} /></span>
              <span className="ltext">
                <h4 style={{ fontSize: 14 }}>{r.title}</h4>
                <p style={{ fontSize: 12.5, color: 'var(--sub)', marginTop: 2 }}>{r.desc}</p>
              </span>
              <span className="ltag" style={{ fontSize: 10 }}>{r.type}</span>
              <span className="lgo"><Icon name="arrow" /></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================== HOME SECTIONS ============================== */

function Hero({ cueHidden }) {
  const ns = useMemo(nextSession, []);
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

function CiteRow({ label, text, onCopy }) {
  return (
    <div className="cite-row">
      <small>{label}</small>
      <div className="cite">
        <code>{text}</code>
        <button type="button" className="copy" onClick={() => onCopy(text)}><Icon name="copy" />Copy</button>
      </div>
    </div>
  );
}

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

function CtaBand() {
  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <Reveal className="cta-band">
          <h2>Stuck on an assignment?</h2>
          <p>Book a one-to-one consultation with the library team and get help that fits your course.</p>
          <div className="row">
            <Link to="/consultation" className="btn btn-gold btn-lg">Book a Consultation</Link>
            <Link to="/referencing" className="btn btn-ghost btn-lg">Try the referencing guide</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================== PAGE ============================== */

export default function DiscoveryLibraryHome() {
  const [scrolled, setScrolled] = useState(false);
  const [cueHidden, setCueHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  const progressRef = useRef(null);
  const mainRef = useRef(null);
  const footRef = useRef(null);
  const toastTimer = useRef(0);

  const notify = useCallback((msg) => {
    setToast({ show: true, msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2600);
  }, []);

  const copyText = useCallback((txt) => {
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) { /* ignore */ }
      ta.remove();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).catch(fallback);
    else fallback();
    notify('Citation copied to clipboard');
  }, [notify]);

  // Document title
  useEffect(() => { document.title = 'Discovery Library — Comprehensive Digital Library & Learning Support'; }, []);

  // Scroll progress bar, sticky-nav background, scroll cue
  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progressRef.current) progressRef.current.style.width = `${(window.scrollY / max) * 100}%`;
      setScrolled(window.scrollY > 8);
      setCueHidden(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Ctrl/Cmd+K toggles search, Esc closes overlays
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen((o) => !o); }
      if (e.key === 'Escape') { setSearchOpen(false); setMenuOpen(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll + make page content inert behind the mobile menu / search modal
  useEffect(() => {
    const blocked = menuOpen || searchOpen;
    document.body.style.overflow = blocked ? 'hidden' : '';
    [mainRef.current, footRef.current].forEach((el) => {
      if (!el) return;
      if (blocked) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, searchOpen]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  return (
    <div className="dl-app">
      <style>{CSS}</style>

      <div id="scrollProgress" ref={progressRef} />
      <Backdrop />
      <AmbientScene />

      <Header scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} onSearch={() => setSearchOpen(true)} />

      <main id="view" ref={mainRef} tabIndex={-1} className="page page-home">
        <Hero cueHidden={cueHidden} />
        <StartHere />
        <WordSeries />
        <ComingUp />
        <ApaQuick onCopy={copyText} />
        <CtaBand />
      </main>

      <div ref={footRef}><Footer /></div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className={`toast${toast.show ? ' show' : ''}`} role="status" aria-live="polite">
        <Icon name="check" /><span>{toast.msg}</span>
      </div>
    </div>
  );
}

/* ============================== STYLES ============================== */

const CSS = `


:root{
  --bg:#03140d; --bg2:#06231a;
  --panel:rgba(8,42,30,.68); --panel-solid:#08291d;
  --line:rgba(120,240,190,.16); --line-gold:rgba(255,200,58,.45);
  --em:#19D68A; --mint:#8CF7C5; --gold:#FFC83A; --amber:#FF9E2C;
  --cream:#FFF8E1; --sub:#A9C7B8; --ink:#1A1300;
  --f-head:'Bricolage Grotesque','Trebuchet MS',system-ui,sans-serif;
  --f-body:'Google Sans Flex','Segoe UI',system-ui,sans-serif;
  --f-mono:'JetBrains Mono',ui-monospace,Consolas,monospace;
  color-scheme:dark;
}
html{scroll-padding-top:calc(env(safe-area-inset-top,0px) + 84px);scroll-behavior:smooth;}
*,*::before,*::after{box-sizing:border-box;}
body{margin:0;background:var(--bg);color:var(--cream);font-family:var(--f-body);-webkit-font-smoothing:antialiased;overflow-x:hidden;line-height:1.5;font-variation-settings:'GRAD' 40;}
.dl-app{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);}
.dl-app h1,.dl-app h2,.dl-app h3,.dl-app h4{font-family:var(--f-head);margin:0;font-weight:700;letter-spacing:-.02em;line-height:1.12;}
.dl-app p{margin:0;}
.dl-app a,.dl-app button{color:inherit;text-decoration:none;font-family:inherit;cursor:pointer;}
.dl-app button{background:none;border:0;padding:0;}
.dl-app ol,.dl-app ul{margin:0;padding:0;list-style:none;}
.dl-app :focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:6px;}
.ic{width:1.15em;height:1.15em;flex-shrink:0;}
.ic.gold{color:var(--gold);}
.wrap{max-width:1200px;margin:0 auto;padding:0 28px;}

#scrollProgress{position:fixed;top:0;left:0;height:2.5px;width:0%;background:linear-gradient(90deg,var(--em),var(--gold));z-index:999;transition:width .1s ease;pointer-events:none;}

/* background glow */
.glow{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;background:
  radial-gradient(1200px 700px at 50% -10%,#093323 0%,transparent 70%),linear-gradient(180deg,var(--bg2),var(--bg) 70%);}
.glow i{position:absolute;border-radius:50%;display:block;}
.g1{width:680px;height:680px;left:-220px;top:-200px;background:radial-gradient(circle,rgba(25,214,138,.16),transparent 66%);animation:drift1 24s ease-in-out infinite alternate;}
.g2{width:600px;height:600px;right:-200px;top:18%;background:radial-gradient(circle,rgba(255,200,58,.10),transparent 66%);animation:drift2 28s ease-in-out infinite alternate;}
.g3{width:640px;height:640px;left:14%;bottom:-320px;background:radial-gradient(circle,rgba(20,180,120,.12),transparent 66%);animation:drift1 30s ease-in-out infinite alternate-reverse;}
.g4{width:340px;height:340px;right:22%;bottom:8%;background:radial-gradient(circle,rgba(255,158,44,.10),transparent 66%);animation:drift2 20s ease-in-out infinite alternate;}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,248,225,.07) 1px,transparent 1.2px);background-size:34px 34px;
  -webkit-mask-image:radial-gradient(ellipse at 50% 25%,#000 5%,transparent 72%);mask-image:radial-gradient(ellipse at 50% 25%,#000 5%,transparent 72%);}
.ring{position:absolute;border-radius:50%;border:1px solid rgba(255,200,58,.10);}
.ring.r1{width:760px;height:760px;right:-280px;top:-220px;animation:spin 80s linear infinite;}
.ring.r2{width:500px;height:500px;right:-150px;top:-90px;border-color:rgba(25,214,138,.14);border-style:dashed;animation:spin 120s linear infinite reverse;}
.ring.r3{width:420px;height:420px;left:-140px;bottom:6%;border-color:rgba(255,200,58,.08);animation:spin 100s linear infinite;}
.spark{position:absolute;width:16px;height:16px;color:rgba(255,200,58,.65);animation:twinkle 4s ease-in-out infinite;}
.spark svg{width:100%;height:100%;fill:currentColor;}
@keyframes drift1{to{transform:translate(90px,70px) scale(1.12);}}
@keyframes drift2{to{transform:translate(-80px,-60px) scale(1.1);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes twinkle{0%,100%{opacity:.10;transform:scale(.6) rotate(0);}50%{opacity:.45;transform:scale(1) rotate(45deg);}}

#scene{position:fixed;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;display:block;transition:opacity .5s ease;}

/* header */
#nav{padding-left:20px;padding-right:20px;width:100%;}
nav.top{position:sticky;top:env(safe-area-inset-top,0px);z-index:60;display:flex;align-items:center;justify-content:space-between;justify-self:center;gap:16px;
  padding:16px max(28px,calc((100vw - 1200px)/2 + 28px));transition:background .25s ease,box-shadow .25s ease,backdrop-filter .25s ease;}
nav.top.scrolled{background:rgba(3,20,13,.84);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 10px 30px rgba(0,0,0,.35);}
.brand{display:flex;align-items:center;gap:11px;font-family:var(--f-head);font-weight:800;font-size:20px;letter-spacing:-.02em;}
.brand-beacon{width:28px;height:28px;border-radius:50%;background:rgba(25,214,138,0.06);border:1px solid rgba(255,200,58,0.35);box-shadow:0 0 10px rgba(25,214,138,0.25);flex-shrink:0;}
.navlinks{display:flex;gap:4px;font-size:14.5px;font-weight:500;}
.navlinks a{display:inline-flex;align-items:center;gap:7px;padding:8px 14px;border-radius:100px;color:#d8eadf;transition:background .2s,color .2s;white-space:nowrap;}
.navlinks a:hover{background:rgba(255,255,255,.06);}
.navlinks a svg{width:1.05em;height:1.05em;opacity:.75;}
.navcta{display:flex;gap:10px;align-items:center;}
.nav-search-btn{width:38px;height:38px;border-radius:10px;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;color:var(--sub);transition:all .2s;}
.nav-search-btn:hover{color:var(--gold);border-color:var(--gold);background:rgba(255,200,58,.08);}
.burger{display:none;width:44px;height:44px;border-radius:12px;border:1px solid var(--line);align-items:center;justify-content:center;font-size:20px;}
.mnav{display:none;position:fixed;inset:0;z-index:55;background:rgba(3,20,13,.96);padding:96px 28px 40px;flex-direction:column;gap:8px;overflow-y:auto;}
.mnav.open{display:flex;}
.mnav a{display:flex;align-items:center;gap:12px;font-family:var(--f-head);font-size:22px;font-weight:700;padding:10px 0;border-bottom:1px solid var(--line);text-align:left;}
.mnav .btn{margin-top:10px;font-family:var(--f-body);font-size:15px;border-bottom:0;justify-content:center;padding:14px 20px;}

.btn{display:inline-flex;align-items:center;gap:8px;border-radius:12px;padding:11px 20px;font:600 14px/1 var(--f-body);white-space:nowrap;border:1px solid transparent;
  transition:transform .18s ease,box-shadow .2s ease,background .2s ease,border-color .2s ease;}
.btn:hover{transform:translateY(-2px);}
.btn-gold{background:linear-gradient(135deg,#FFD860,#FFB020);color:var(--ink);box-shadow:0 8px 24px rgba(255,184,32,.28);}
.btn-gold:hover{box-shadow:0 14px 34px rgba(255,184,32,.45);}
.btn-em{background:linear-gradient(135deg,#46F2AA,#12B877);color:#01160e;box-shadow:0 8px 24px rgba(25,214,138,.28);}
.btn-em:hover{box-shadow:0 14px 34px rgba(25,214,138,.45);}
.btn-ghost{background:rgba(255,255,255,.04);border-color:var(--line);color:var(--cream);}
.btn-ghost:hover{border-color:var(--em);background:rgba(25,214,138,.1);}
.btn-lg{padding:15px 26px;font-size:15px;border-radius:14px;}
.btn-sm{padding:9px 15px;font-size:13px;border-radius:10px;}

main#view{position:relative;z-index:2;outline:none;min-height:70vh;}
.page{animation:pagein .55s cubic-bezier(.2,.7,.2,1);}
@keyframes pagein{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}

.reveal{opacity:0;transform:translateY(26px) scale(.985);transition:opacity .75s cubic-bezier(.2,.7,.2,1),transform .75s cubic-bezier(.2,.7,.2,1);transition-delay:var(--d,0s);}
.reveal.in{opacity:1;transform:none;}

/* hero */
.hero{position:relative;min-height:calc(100svh - 76px);display:flex;align-items:center;padding:30px 0 110px;}
.hero-grid{display:grid;grid-template-columns:minmax(0,560px) 1fr;gap:40px;align-items:center;width:100%;}
.hero-text{position:relative;z-index:10;max-width:560px;}
.hero-text::before{content:"";position:absolute;inset:-40px -40px -40px -60px;background:radial-gradient(ellipse at 25% 40%,rgba(3,20,13,.82) 0%,transparent 70%);pointer-events:none;z-index:-1;border-radius:50%;}
.chip{display:inline-flex;align-items:center;gap:10px;padding:7px 15px 7px 11px;border-radius:100px;background:rgba(8,42,30,.82);border:1px solid var(--line);font-size:13.5px;color:#d8eadf;
  opacity:0;animation:rise2 .8s .1s cubic-bezier(.2,.8,.2,1) forwards;}
.chip .live{width:9px;height:9px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 0 rgba(255,200,58,.7);animation:ping 1.8s ease-out infinite;}
@keyframes ping{to{box-shadow:0 0 0 12px rgba(255,200,58,0);}}
.dl-app h1.mega{font-size:clamp(38px,6.5vw,78px);font-weight:800;letter-spacing:-.035em;line-height:1.04;margin-top:22px;}
.hl{display:block;overflow:hidden;padding-bottom:.1em;margin-bottom:-.1em;}
.hl>span{display:block;transform:translateY(112%);animation:rise .95s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(.16s * var(--i) + .2s);}
@keyframes rise{to{transform:none;}}
@keyframes rise2{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:none;}}
.hero-sub{margin-top:24px;font-size:clamp(15.5px,1.5vw,18.5px);color:var(--sub);max-width:500px;line-height:1.65;opacity:0;animation:rise2 .9s .85s cubic-bezier(.2,.8,.2,1) forwards;}
.hero-cta{margin-top:32px;display:flex;flex-wrap:wrap;gap:14px;opacity:0;animation:rise2 .9s 1.05s cubic-bezier(.2,.8,.2,1) forwards;}
.cue{position:absolute;left:50%;bottom:26px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;font-size:12.5px;color:var(--sub);opacity:0;animation:rise2 1s 1.6s forwards;}
.cue .mouse{width:24px;height:38px;border-radius:14px;border:1.5px solid rgba(255,248,225,.5);position:relative;}
.cue .mouse::after{content:"";position:absolute;left:50%;top:7px;width:4px;height:8px;margin-left:-2px;border-radius:3px;background:var(--gold);animation:wheel 1.6s ease-in-out infinite;}
@keyframes wheel{0%{opacity:0;transform:translateY(0);}30%{opacity:1;}100%{opacity:0;transform:translateY(12px);}}

.section{position:relative;padding:90px 0;}
.sh{max-width:640px;margin-bottom:46px;}
.dl-app .sh h2{font-size:clamp(30px,4.4vw,50px);font-weight:800;letter-spacing:-.03em;}
.sh p{margin-top:14px;color:var(--sub);font-size:17px;line-height:1.6;}
.glass{background:var(--panel);border:1px solid var(--line);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);}

/* resource cards */
.cards4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;perspective:1100px;}
.tilt-wrap{position:relative;display:flex;}
.rcard{position:relative;flex:1;display:flex;flex-direction:column;border-radius:22px;padding:26px 22px 24px;text-align:left;overflow:hidden;
  transform:perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateY(var(--ty,0px));
  transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease;}
.rcard::before{content:"";position:absolute;width:200px;height:200px;right:-70px;top:-70px;border-radius:50%;background:radial-gradient(circle,rgba(var(--cr),.3),transparent 65%);transition:transform .5s ease;}
.rcard:hover{--ty:-6px;border-color:rgba(var(--cr),.6);box-shadow:0 22px 50px rgba(0,0,0,.45),0 0 30px rgba(var(--cr),.14);}
.rcard:hover::before{transform:scale(1.4);}
.rcard .ico{position:relative;width:54px;height:54px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:24px;color:var(--c);
  background:rgba(var(--cr),.14);border:1px solid rgba(var(--cr),.4);margin-bottom:20px;animation:icoBreathe 5s ease-in-out infinite;}
@keyframes icoBreathe{0%,100%{box-shadow:0 0 0 0 rgba(var(--cr),0);}50%{box-shadow:0 0 0 6px rgba(var(--cr),.12);}}
.dl-app .rcard h3{font-size:20px;position:relative;}
.rcard p{margin-top:8px;font-size:14px;color:var(--sub);line-height:1.55;flex:1;position:relative;}
.rcard .go{margin-top:22px;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(var(--cr),.16);color:var(--c);position:relative;transition:transform .25s,background .25s,color .25s;}
.rcard:hover .go{transform:translateX(4px);background:var(--c);color:var(--ink);}
.badge-new{display:inline-flex;align-self:flex-start;margin-bottom:12px;background:var(--gold);color:var(--ink);font-size:11.5px;font-weight:700;padding:4px 10px;border-radius:100px;z-index:2;}
.c-em{--c:#19D68A;--cr:25,214,138;} .c-gold{--c:#FFC83A;--cr:255,200,58;} .c-mint{--c:#8CF7C5;--cr:140,247,197;} .c-amber{--c:#FF9E2C;--cr:255,158,44;}
.c-live{--c:#19D68A;--cr:25,214,138;} .c-webinar{--c:#FFC83A;--cr:255,200,58;} .c-workshop{--c:#8CF7C5;--cr:140,247,197;}

/* split sections */
.split{display:grid;grid-template-columns:1fr 1.05fr;gap:64px;align-items:center;}
.dl-app .split h2{font-size:clamp(28px,4vw,46px);font-weight:800;letter-spacing:-.03em;}
.split .lead{margin:16px 0 30px;color:var(--sub);font-size:17px;line-height:1.65;max-width:470px;}
.panel{border-radius:24px;padding:22px;}
.player{position:relative;aspect-ratio:16/9;border-radius:16px;overflow:hidden;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(90% 90% at 25% 15%,rgba(255,200,58,.3),transparent 60%),radial-gradient(80% 80% at 85% 100%,rgba(25,214,138,.35),transparent 60%),linear-gradient(135deg,#0d4a33,#06231a);}
.player .pl{width:68px;height:68px;border-radius:50%;background:linear-gradient(135deg,#FFD860,#FFB020);color:var(--ink);display:flex;align-items:center;justify-content:center;font-size:28px;box-shadow:0 0 0 10px rgba(255,200,58,.18),0 10px 34px rgba(255,184,32,.5);transition:transform .25s;}
.player:hover .pl{transform:scale(1.08);}
.player .cap{position:absolute;left:16px;bottom:14px;font-size:13px;font-weight:600;background:rgba(3,20,13,.7);padding:5px 11px;border-radius:8px;}
.mini{margin-top:18px;display:grid;gap:4px;counter-reset:l;}
.mini li{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:11px;font-size:14px;counter-increment:l;transition:background .2s;}
.mini li:hover{background:rgba(255,255,255,.05);}
.mini li::before{content:counter(l);width:26px;height:26px;border-radius:8px;background:rgba(25,214,138,.16);color:var(--em);font-weight:700;font-size:12.5px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.mini li:first-child{background:rgba(255,200,58,.08);}
.mini li:first-child::before{background:var(--gold);color:var(--ink);}

/* coming up */
.upnext{border-radius:24px;padding:10px;display:grid;gap:4px;}
.uprow{display:grid;grid-template-columns:64px 1fr auto;gap:18px;align-items:center;padding:14px 16px;border-radius:16px;transition:background .2s,opacity .75s cubic-bezier(.2,.7,.2,1),transform .75s cubic-bezier(.2,.7,.2,1);}
.uprow:hover{background:rgba(255,255,255,.05);}
.dl-app .uprow h3{font-size:17px;}
.uprow .m{font-size:13px;color:var(--sub);margin-top:3px;}
.datebadge{width:56px;height:60px;border-radius:14px;background:linear-gradient(160deg,rgba(255,200,58,.18),rgba(25,214,138,.12));border:1px solid rgba(255,200,58,.3);display:flex;flex-direction:column;align-items:center;justify-content:center;}
.datebadge b{font-family:var(--f-head);font-size:22px;font-weight:800;line-height:1;}
.datebadge span{font-size:11.5px;color:var(--gold);margin-top:3px;font-weight:600;}
.typetag{font-size:12px;font-weight:600;padding:5px 11px;border-radius:100px;background:rgba(var(--cr),.14);color:var(--c);border:1px solid rgba(var(--cr),.35);white-space:nowrap;}

/* APA quick cite */
.quick{border-radius:24px;padding:26px;}
.tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px;}
.tab{padding:8px 15px;border-radius:100px;font-size:13.5px;font-weight:600;border:1px solid var(--line);color:#cfe6da;transition:all .2s;}
.tab:hover{border-color:var(--em);}
.tab.on{background:var(--gold);color:var(--ink);border-color:var(--gold);}
.cite-row{margin-top:12px;}
.cite-row small{display:block;font-size:12.5px;color:var(--sub);margin-bottom:6px;}
.cite{display:flex;justify-content:space-between;align-items:center;gap:16px;background:rgba(2,14,9,.6);border:1px solid var(--line);border-left:3px solid var(--gold);border-radius:12px;padding:14px 16px;}
.cite code{font-family:var(--f-mono);font-size:13px;line-height:1.65;color:#eaf6ee;word-break:break-word;}
.copy{flex-shrink:0;display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;padding:7px 12px;border-radius:9px;border:1px solid rgba(255,200,58,.35);color:var(--sub);transition:all .2s;}
.copy:hover{border-color:var(--gold);color:var(--gold);}
.quick .note{margin-top:16px;font-size:13.5px;color:var(--sub);}

/* CTA band */
.cta-band{position:relative;border-radius:30px;padding:60px 48px;overflow:hidden;text-align:center;border:1px solid var(--line-gold);
  background:radial-gradient(70% 120% at 15% 0%,rgba(255,200,58,.25),transparent 60%),radial-gradient(70% 120% at 90% 100%,rgba(25,214,138,.3),transparent 60%),rgba(6,35,26,.85);}
.dl-app .cta-band h2{font-size:clamp(28px,4.2vw,48px);font-weight:800;letter-spacing:-.03em;max-width:640px;margin:0 auto;}
.cta-band p{margin:14px auto 30px;color:#cfe3d8;max-width:480px;font-size:17px;}
.cta-band .row{display:flex;justify-content:center;flex-wrap:wrap;gap:14px;}

/* footer */
footer.foot{position:relative;z-index:2;border-top:1px solid var(--line);margin-top:60px;padding:48px 0 54px;color:var(--sub);font-size:14px;}
.foot .in{display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap;}
.foot nav{display:flex;gap:18px 24px;flex-wrap:wrap;}
.foot a:hover{color:var(--gold);text-decoration:underline;text-underline-offset:3px;}

/* search modal */
.backdrop{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;background:rgba(1,10,6,.82);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;pointer-events:none;transition:opacity .25s;padding:20px;}
.backdrop.show{opacity:1;pointer-events:auto;}
.modal{width:540px;max-width:100%;max-height:90vh;overflow-y:auto;border-radius:24px;padding:30px;background:var(--panel-solid);border:1px solid var(--line-gold);box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 60px rgba(255,200,58,.12);transform:translateY(14px) scale(.97);transition:transform .3s cubic-bezier(.2,.8,.2,1);}
.backdrop.show .modal{transform:none;}
.sbox{position:relative;}
.sbox svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--sub);width:16px;height:16px;}
.sbox input{width:100%;background:rgba(2,14,9,.55);border:1px solid var(--line);border-radius:11px;padding:11px 12px 11px 38px;color:var(--cream);font:500 14px var(--f-body);}
.sbox input::placeholder{color:#7fa08f;}
.sbox input:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 3px rgba(255,200,58,.14);}
.linkrow{display:flex;align-items:center;gap:16px;padding:16px 18px;border-radius:12px;border:1px solid transparent;transition:background .15s ease,border-color .15s ease;}
.linkrow:hover{background:rgba(255,255,255,.03);border-color:var(--line);}
.linkrow .lico{width:38px;height:38px;border-radius:10px;background:rgba(255,200,58,.1);color:var(--gold);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.linkrow .ltext{flex:1;min-width:0;}
.linkrow .ltag{font-size:11px;font-weight:600;color:var(--sub);border:1px solid var(--line);border-radius:100px;padding:3px 10px;flex-shrink:0;}
.linkrow .lgo{color:var(--sub);flex-shrink:0;}

/* toast */
.toast{position:fixed;bottom:calc(28px + env(safe-area-inset-bottom,0px));left:50%;transform:translateX(-50%) translateY(20px);background:linear-gradient(135deg,#FFD860,#FFB020);color:var(--ink);font-size:14px;font-weight:700;padding:12px 22px;border-radius:12px;opacity:0;pointer-events:none;transition:all .3s;z-index:200;box-shadow:0 14px 36px rgba(0,0,0,.45);display:flex;align-items:center;gap:8px;}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}

@media(max-width:1020px){
  .cards4{grid-template-columns:repeat(2,1fr);}
  .split{grid-template-columns:1fr;gap:40px;}
  .hero-grid{grid-template-columns:1fr;}
  .navlinks,.navcta .btn-ghost{display:none;}
  .burger{display:flex;}
}
@media(max-width:640px){
  .wrap{padding:0 20px;}
  nav.top{padding:14px 20px;}
  .navcta .btn-gold{display:none;}
  .section{padding:70px 0;}
  .cards4{grid-template-columns:1fr;}
  .uprow{grid-template-columns:56px 1fr;} .uprow .typetag{grid-column:2;justify-self:start;}
  .cta-band{padding:44px 24px;}
  .cite{flex-direction:column;align-items:flex-start;}
  .hero{padding-bottom:130px;}
}
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;}
  .hl>span,.chip,.hero-sub,.hero-cta,.cue{opacity:1;transform:none;animation:none;}
  .reveal{opacity:1;transform:none;}
  html{scroll-behavior:auto;}
}
`;
