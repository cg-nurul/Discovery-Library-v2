import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { glowTexture, makeBook, disposeScene } from '../../lib/three-helpers';
import { prefersReduced } from '../../lib/utils';

/** Fixed full-screen ambient scene: gem, rings, orbiting books, sparkles. */
function AmbientScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch { return undefined; }

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

export default AmbientScene;