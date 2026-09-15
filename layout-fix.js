import * as THREE from 'three';

// LIFE EXIT v1.4.1 — guaranteed poster/door clearance.
// Posters are moved to dedicated bays that do not share a Z footprint with any door.
const originalRender=THREE.WebGLRenderer.prototype.render;
let fixed=false;
const mat=(c,r=.8,m=.02)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
function box(parent,x,y,z,w,h,d,material){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);o.position.set(x,y,z);parent.add(o);return o}
function plant(parent,x,z){const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);box(g,0,.28,0,.38,.55,.38,mat(0x262927,.65,.12));const stem=mat(0x405b31,.85),leaf=mat(0x52743d,.88);for(let i=0;i<5;i++){const s=new THREE.Mesh(new THREE.CylinderGeometry(.025,.035,.65+i*.06,6),stem);s.position.set((i-2)*.035,.8,0);s.rotation.z=(i-2)*.12;g.add(s);const l=new THREE.Mesh(new THREE.SphereGeometry(.15,8,6),leaf);l.scale.set(.6,1.45,.35);l.position.set((i-2)*.1,1.12+i*.05,0);l.rotation.z=(i-2)*.35;g.add(l)}}
THREE.WebGLRenderer.prototype.render=function(scene,camera){if(!fixed&&scene){fixed=true;const posters=[],frames=[],doors=[],world=scene.children.find(o=>o.type==='Group')||scene;scene.traverse(o=>{if(!o.isMesh)return;const p=o.geometry?.parameters||{};if(o.geometry?.type==='PlaneGeometry'&&Math.abs((p.width||0)-2.22)<.02&&Math.abs((p.height||0)-1.52)<.02)posters.push(o);if(o.geometry?.type==='BoxGeometry'&&Math.abs((p.width||0)-.07)<.02&&Math.abs((p.height||0)-1.72)<.02&&Math.abs((p.depth||0)-2.42)<.02)frames.push(o);if(o.geometry?.type==='BoxGeometry'&&Math.abs((p.height||0)-2.75)<.04&&Math.abs((p.depth||0)-1.65)<.04)doors.push(o)});
// Door centers are 2,-7,-16,-25,-34,-43. Their half-depth is .825.
// These bays are centered >2.5m from the nearest door and each poster is reduced to 1.70m wall-span.
const bays=[-2.5,-2.5,-11.5,-11.5,-20.5,-20.5,-29.5,-29.5];
posters.forEach((p,i)=>{if(i<8){p.position.z=bays[i];p.position.y=1.82;p.scale.set(.70,.86,1);p.position.x=Math.sign(p.position.x)*2.93;p.renderOrder=5}});
frames.forEach((f,i)=>{if(i<8){f.position.z=bays[i];f.position.y=1.82;f.scale.set(.72,.9,.72);f.position.x=Math.sign(f.position.x)*2.99}});
// Push doors behind the wall plane. This removes foreground occlusion even at sharp viewing angles.
doors.forEach(d=>{d.position.x=Math.sign(d.position.x)*3.18});
// Visual baseline objects for later anomaly variations.
const used=new Set();bays.forEach((zz,i)=>{const side=i%2?-1:1,key=side+':'+zz;if(used.has(key))return;used.add(key);const l=new THREE.PointLight(0xffd993,.28,3.8,2);l.position.set(side*2.5,3.05,zz);world.add(l)});
plant(world,2.25,-9.4);plant(world,-2.25,-27.4);plant(world,2.25,-45.2);
for(const side of [-1,1])box(world,side*3.0,.18,-25,.025,.18,64,mat(0x55534c,.7,.18));
for(const zz of [-4.8,-13.8,-22.8,-31.8,-40.8])box(world,0,3.61,zz,.65,.025,.14,new THREE.MeshBasicMaterial({color:0xb69b43}));
box(world,-2.25,.28,-39.2,1.05,.12,1.9,mat(0x766b55,.58,.18));
}return originalRender.call(this,scene,camera)};