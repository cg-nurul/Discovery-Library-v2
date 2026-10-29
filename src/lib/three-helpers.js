/* ============================== 3D (three.js) ============================== */

import * as THREE from 'three';

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

export { glowTexture, makeBook, disposeScene };