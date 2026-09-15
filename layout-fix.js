import * as THREE from 'three';

// LIFE EXIT corridor art direction layer.
// Keeps every poster physically clear of doors and adds original environmental detail.
const originalRender = THREE.WebGLRenderer.prototype.render;
let fixed=false;
const mat=(c,r=.8,m=.02)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
function box(parent,x,y,z,w,h,d,material){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);o.position.set(x,y,z);parent.add(o);return o}
function plant(parent,x,z){
  const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);
  box(g,0,.28,0,.42,.55,.42,mat(0x262927,.65,.12));
  const stem=mat(0x405b31,.85),leaf=mat(0x52743d,.88);
  for(let i=0;i<5;i++){const s=new THREE.Mesh(new THREE.CylinderGeometry(.025,.035,.7+i*.07,6),stem);s.position.set((i-2)*.035,.82,0);s.rotation.z=(i-2)*.12;g.add(s);const l=new THREE.Mesh(new THREE.SphereGeometry(.16,8,6),leaf);l.scale.set(.6,1.5,.35);l.position.set((i-2)*.11,1.15+i*.06,0);l.rotation.z=(i-2)*.35;g.add(l)}
}
THREE.WebGLRenderer.prototype.render=function(scene,camera){
  if(!fixed&&scene){
    fixed=true;
    const posters=[],frames=[],doors=[],world=scene.children.find(o=>o.type==='Group')||scene;
    scene.traverse(o=>{
      if(!o.isMesh)return;const p=o.geometry?.parameters||{};
      if(o.geometry?.type==='PlaneGeometry'&&Math.abs((p.width||0)-2.22)<.02&&Math.abs((p.height||0)-1.52)<.02)posters.push(o);
      if(o.geometry?.type==='BoxGeometry'&&Math.abs((p.width||0)-.07)<.02&&Math.abs((p.height||0)-1.72)<.02&&Math.abs((p.depth||0)-2.42)<.02)frames.push(o);
      if(o.geometry?.type==='BoxGeometry'&&Math.abs((p.height||0)-2.75)<.03&&Math.abs((p.depth||0)-1.65)<.03)doors.push(o);
    });

    // Dedicated poster bays: one poster per bay, far from every door footprint.
    // Door centers: 2,-7,-16,-25,-34,-43. Poster bays sit between them.
    const bays=[-2.45,-2.45,-11.45,-11.45,-20.45,-20.45,-29.45,-29.45];
    posters.forEach((p,i)=>{if(i<8){p.position.z=bays[i];p.position.y=1.82;p.scale.set(.86,.86,1);p.renderOrder=3;p.material.depthWrite=true}});
    frames.forEach((f,i)=>{if(i<8){f.position.z=bays[i];f.position.y=1.82;f.scale.set(.9,.9,.9)}});

    // Recess doors slightly into the wall so they can never occlude a poster from an oblique view.
    doors.forEach(d=>{d.position.x=Math.sign(d.position.x)*3.09});

    // Warm wall-wash lights above poster bays, inspired by the visual concept but built in 3D.
    const used=new Set();
    bays.forEach((zz,i)=>{const side=i%2?-1:1,key=side+':'+zz;if(used.has(key))return;used.add(key);const l=new THREE.PointLight(0xffd993,.34,4.3,2);l.position.set(side*2.55,3.05,zz);world.add(l)});

    // Environmental storytelling: plants, wall bands and small ceiling markers.
    plant(world,2.35,-9.2);plant(world,-2.35,-27.2);plant(world,2.35,-45.2);
    for(const side of [-1,1])box(world,side*3.0,.18,-25,.035,.18,64,mat(0x55534c,.7,.18));
    for(const zz of [-4.8,-13.8,-22.8,-31.8,-40.8]){
      const marker=box(world,0,3.61,zz,.7,.025,.16,new THREE.MeshBasicMaterial({color:0xb69b43}));marker.rotation.y=0;
    }
    // Extra bench gives the corridor a memorable baseline object for anomaly play.
    box(world,-2.25,.28,-39.2,1.15,.12,2.15,mat(0x766b55,.58,.18));
    box(world,-2.62,.14,-39.2,.12,.28,1.8,mat(0x333533,.7,.25));
    box(world,-1.88,.14,-39.2,.12,.28,1.8,mat(0x333533,.7,.25));
  }
  return originalRender.call(this,scene,camera);
};