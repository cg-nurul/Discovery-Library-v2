import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { disposeScene } from '../../lib/three-helpers';
import { prefersReduced } from '../../lib/utils';

/** Small spinning beacon next to the brand name. */
function NavOrb() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    let r;
    try { r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); } catch { return undefined; }
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

export default NavOrb;