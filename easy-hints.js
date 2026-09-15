// Contextual EASY-mode hints without revealing the answer outright.
// Loaded before app.js so it can observe the round's anomaly randomization.
(() => {
  const nativeRandom = Math.random.bind(Math);
  const hints = [
    '💡 ヒント：天井の照明を、ひとつずつ見比べてみよう。',
    '💡 ヒント：照明の「色」に注目してみよう。',
    '💡 ヒント：通路の奥まで、見え方を確かめてみよう。',
    '💡 ヒント：いちばん奥の「出口」をよく見てみよう。',
    '💡 ヒント：出口の形や向きに注目してみよう。',
    '💡 ヒント：通路に置かれている物の「場所」を見てみよう。',
    '💡 ヒント：床の近くにある物を思い出してみよう。',
    '💡 ヒント：左右の壁や扉の数を見比べてみよう。',
    '💡 ヒント：足元だけでなく、天井も見上げてみよう。',
    '💡 ヒント：壁のポスターの「大きさ」を見比べてみよう。'
  ];
  let phase = 0, anomalyRound = false, hintTimer = null;

  const isEasy = () => document.querySelector('[data-diff="easy"]')?.classList.contains('selected');
  const gameActive = () => document.querySelector('#start')?.classList.contains('hidden') && document.querySelector('#ending')?.classList.contains('hidden');

  function showHint(index) {
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => {
      if (!isEasy() || !gameActive()) return;
      const guide = document.querySelector('#guide');
      if (!guide || document.body.classList.contains('deciding')) return;
      guide.classList.add('easyHint');
      guide.textContent = hints[index] || '💡 ヒント：いつもの通路と、ひとつずつ見比べてみよう。';
    }, 2800);
  }

  Math.random = function() {
    const r = nativeRandom();
    if (!isEasy() || !gameActive()) return r;
    if (phase === 0) {
      anomalyRound = r < .62;
      phase = anomalyRound ? 1 : 0;
    } else {
      const index = Math.min(hints.length - 1, Math.floor(r * hints.length));
      phase = 0;
      if (anomalyRound) showHint(index);
    }
    return r;
  };

  // Each new round resets the observer state and removes the previous hint styling.
  const ready = () => {
    const guide = document.querySelector('#guide');
    if (!guide) return requestAnimationFrame(ready);
    new MutationObserver(() => {
      if (!guide.textContent.startsWith('💡')) guide.classList.remove('easyHint');
      if (guide.textContent.includes('前回との違い') || guide.textContent.includes('いつもの通路')) phase = 0;
    }).observe(guide, {childList:true, characterData:true, subtree:true});
  };
  ready();
})();