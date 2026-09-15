// LIFE EXIT poster readability + message upgrade.
// Long theme titles are auto-fitted inside a strict safe area so they never clip.
(() => {
  const originalFillText = CanvasRenderingContext2D.prototype.fillText;
  const strongCopy = {
    '健康': '休む勇気が、明日の自分を強くする。',
    '人間関係': '大切な人との時間は、今しかつくれない。',
    '自己成長': '失敗の数だけ、人は強くなれる。',
    '自己実現': '理想を描く力が、人生を動かす。',
    '仕事': '忙しさではない。何を生み出したか。',
    '経済': '未来の自由は、今日のお金の選択で決まる。',
    '空間・環境': '環境を選ぶことは、人生を選ぶこと。',
    '自由な時間': '時間はできるものではない。自分でつくるものだ。',
    '貢献': '自分を満たした力が、誰かを照らす力になる。'
  };
  const state = new WeakMap();

  function splitLines(ctx, text, maxWidth) {
    const chars = [...text], lines = [];
    let line = '';
    for (const ch of chars) {
      if (ctx.measureText(line + ch).width > maxWidth && line) {
        lines.push(line); line = ch;
      } else line += ch;
    }
    if (line) lines.push(line);
    return lines;
  }

  function fitTitle(ctx, text) {
    let size = 82;
    const maxWidth = 760;
    do {
      ctx.font = `900 ${size}px sans-serif`;
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 4;
    } while (size > 48);
    return size;
  }

  CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
    const canvas = this.canvas;
    if (canvas?.width !== 1024 || canvas?.height !== 768) {
      return originalFillText.call(this, text, x, y, maxWidth);
    }

    let s = state.get(canvas);
    if (!s) { s = { title: null, bodyDrawn: false }; state.set(canvas, s); }

    if (y === 145) {
      s.title = String(text);
      this.save();
      this.fillStyle = '#111512';
      const size = fitTitle(this, s.title);
      this.font = `900 ${size}px sans-serif`;
      // 120px left safe margin + 760px maximum text width = 120px right margin.
      originalFillText.call(this, s.title, 120, 142, 760);
      this.restore();
      return;
    }

    if (y >= 270 && y < 620 && s.title && strongCopy[s.title]) {
      if (s.bodyDrawn) return;
      s.bodyDrawn = true;
      this.save();
      this.fillStyle = '#161816';
      this.font = '900 54px sans-serif';
      const lines = splitLines(this, strongCopy[s.title], 720).slice(0, 4);
      const lineHeight = 78;
      const startY = lines.length <= 2 ? 335 : 300;
      lines.forEach((line, i) => originalFillText.call(this, line, 120, startY + i * lineHeight, 720));
      this.restore();
      return;
    }

    return originalFillText.call(this, text, x, y, maxWidth);
  };
})();