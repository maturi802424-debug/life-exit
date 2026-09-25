// LIFE EXIT v1.5.0 — EASY uses text; NORMAL uses a non-verbal environmental cue.
(() => {
 const nativeRandom=Math.random.bind(Math);
 const hints=['💡 ヒント：天井の照明を、ひとつずつ見比べてみよう。','💡 ヒント：照明の「色」に注目してみよう。','💡 ヒント：通路の奥まで、見え方を確かめてみよう。','💡 ヒント：いちばん奥の「出口」をよく見てみよう。','💡 ヒント：出口の形や向きに注目してみよう。','💡 ヒント：通路に置かれている物の「場所」を見てみよう。','💡 ヒント：床の近くにある物を思い出してみよう。','💡 ヒント：左右の壁や扉の数を見比べてみよう。','💡 ヒント：足元だけでなく、天井も見上げてみよう。','💡 ヒント：壁のポスターの「大きさ」を見比べてみよう。'];
 let phase=0,anomaly=false,timer=null;
 const sel=d=>document.querySelector('[data-diff="'+d+'"]')?.classList.contains('selected');
 const active=()=>document.querySelector('#start')?.classList.contains('hidden')&&document.querySelector('#ending')?.classList.contains('hidden');
 function normalCue(){clearTimeout(timer);timer=setTimeout(()=>{if(!sel('normal')||!active()||document.body.classList.contains('deciding'))return;let e=document.querySelector('#normalHintPulse');if(!e){e=document.createElement('div');e.id='normalHintPulse';document.body.appendChild(e)}e.classList.remove('play');void e.offsetWidth;e.classList.add('play');try{navigator.vibrate?.(18)}catch{}},4200)}
 function easyCue(i){clearTimeout(timer);timer=setTimeout(()=>{if(!sel('easy')||!active())return;const g=document.querySelector('#guide');if(!g||document.body.classList.contains('deciding'))return;g.classList.add('easyHint');g.textContent=hints[i]||'💡 ヒント：いつもの通路と見比べてみよう。'},2800)}
 Math.random=function(){const r=nativeRandom();if(!active()||(!sel('easy')&&!sel('normal')))return r;const chance=sel('easy')?.62:.70;if(phase===0){anomaly=r<chance;phase=anomaly?1:0}else{const i=Math.min(hints.length-1,Math.floor(r*hints.length));phase=0;if(anomaly){if(sel('easy'))easyCue(i);else normalCue()}}return r};
 const ready=()=>{const g=document.querySelector('#guide');if(!g)return requestAnimationFrame(ready);new MutationObserver(()=>{if(!g.textContent.startsWith('💡'))g.classList.remove('easyHint');if(g.textContent.includes('前回との違い')||g.textContent.includes('いつもの通路'))phase=0}).observe(g,{childList:true,characterData:true,subtree:true})};ready();
})();