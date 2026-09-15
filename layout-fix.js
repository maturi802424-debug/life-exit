import * as THREE from 'three';

// Corridor layout fix: some poster meshes were placed at nearly the same Z
// positions as door meshes, so the black doors physically covered half a poster.
const originalRender = THREE.WebGLRenderer.prototype.render;
let fixed = false;

THREE.WebGLRenderer.prototype.render = function(scene, camera) {
  if (!fixed && scene) {
    fixed = true;
    const posters = [];
    const frames = [];

    scene.traverse(obj => {
      if (!obj.isMesh) return;
      const p = obj.geometry?.parameters || {};
      if (obj.geometry?.type === 'PlaneGeometry' && Math.abs((p.width || 0) - 2.22) < .01 && Math.abs((p.height || 0) - 1.52) < .01) posters.push(obj);
      if (obj.geometry?.type === 'BoxGeometry' && Math.abs((p.width || 0) - .07) < .01 && Math.abs((p.height || 0) - 1.72) < .01 && Math.abs((p.depth || 0) - 2.42) < .01) frames.push(obj);
    });

    // Doors are centered at z=2,-7,-16,-25,-34,... .
    // Place poster pairs midway between doors, one on each wall.
    const safeZ = [-2.5, -2.5, -11.5, -11.5, -20.5, -20.5, -29.5, -29.5];
    posters.forEach((poster, i) => { if (i < safeZ.length) poster.position.z = safeZ[i]; });
    frames.forEach((frame, i) => { if (i < safeZ.length) frame.position.z = safeZ[i]; });
  }
  return originalRender.call(this, scene, camera);
};
