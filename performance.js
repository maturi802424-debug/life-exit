import * as THREE from 'three';

// LIFE EXIT adaptive performance layer.
// Runs before app.js and transparently lightens GPU work on mobile devices.
const coarse = matchMedia('(pointer: coarse)').matches;
const small = Math.min(innerWidth, innerHeight) < 700;
const mobile = coarse || small;
const lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
const lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
const saveData = navigator.connection?.saveData === true;
const economy = mobile && (lowMemory || lowCPU || saveData);

if (mobile) {
  const originalSetPixelRatio = THREE.WebGLRenderer.prototype.setPixelRatio;
  THREE.WebGLRenderer.prototype.setPixelRatio = function(value) {
    // 0.9 is substantially lighter than 1.2 on high-DPI phones while retaining readability.
    const cap = economy ? 0.78 : 0.92;
    return originalSetPixelRatio.call(this, Math.min(value, cap));
  };

  const originalRender = THREE.WebGLRenderer.prototype.render;
  let optimized = false;
  THREE.WebGLRenderer.prototype.render = function(scene, camera) {
    if (!optimized && scene) {
      optimized = true;
      let lightIndex = 0;
      scene.traverse(obj => {
        if (obj.isPointLight) {
          // Keep the corridor illuminated but reduce expensive overlapping point lights.
          obj.userData.lifeExitOriginalIntensity = obj.intensity;
          if (economy && lightIndex % 2 === 1) obj.distance = Math.min(obj.distance || 9, 6.8);
          else obj.distance = Math.min(obj.distance || 10, 8.2);
          obj.castShadow = false;
          lightIndex++;
        }
        if (obj.isMesh) {
          obj.castShadow = false;
          obj.receiveShadow = false;
          if (obj.geometry?.attributes?.normal && economy && obj.material?.roughness > .8) {
            obj.frustumCulled = true;
          }
        }
      });
    }
    return originalRender.call(this, scene, camera);
  };
}

// Avoid expensive browser work while the tab is hidden and give touch input priority.
document.documentElement.style.touchAction = 'none';
window.__lifeExitPerformance = { mobile, economy };
