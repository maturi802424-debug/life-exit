// LIFE EXIT v1.4.1 — first round is always the unchanged corridor.
// app.js calls Math.random once for anomaly selection inside round().
(() => {
  const nativeRandom=Math.random.bind(Math);
  let forceNormal=false;
  let restoreTimer=null;
  Math.random=function(){
    if(forceNormal){forceNormal=false;clearTimeout(restoreTimer);return .999999;}
    return nativeRandom();
  };
  function arm(){
    forceNormal=true;
    clearTimeout(restoreTimer);
    // Safety: only affect the immediate round setup, never later gameplay randomness.
    restoreTimer=setTimeout(()=>{forceNormal=false},250);
    const guide=document.querySelector('#guide');
    if(guide) guide.textContent='まずは異変のない「いつもの通路」を歩いて、景色を覚えてください';
  }
  addEventListener('DOMContentLoaded',()=>{
    document.querySelector('#startBtn')?.addEventListener('click',arm,{capture:true});
    document.querySelector('#again')?.addEventListener('click',arm,{capture:true});
  });
})();