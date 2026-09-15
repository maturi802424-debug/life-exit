// LIFE EXIT poster readability + message upgrade.
// Important: app.js draws the title once, then later draws body lines at y=285 etc.
// We suppress ALL original body draws after replacing the first one, preventing old text from painting over titles.
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
    const lines=[]; let line='';
    for(const ch of [...text]){
      if(line && ctx.measureText(line+ch).width>maxWidth){lines.push(line);line=ch}else line+=ch;
    }
    if(line)lines.push(line);
    return lines;
  }

  function drawTitle(ctx,title){
    ctx.save();
    ctx.fillStyle='#111512';
    let size=76;
    const maxWidth=680;
    while(size>44){ctx.font=`900 ${size}px sans-serif`;if(ctx.measureText(title).width<=maxWidth)break;size-=4}
    // Extra-large safe margins. No maxWidth scaling is needed after measuring.
    originalFillText.call(ctx,title,150,142);
    ctx.restore();
  }

  CanvasRenderingContext2D.prototype.fillText=function(text,x,y,maxWidth){
    const canvas=this.canvas;
    if(canvas?.width!==1024||canvas?.height!==768)return originalFillText.call(this,text,x,y,maxWidth);
    let s=state.get(canvas);
    if(!s){s={title:null,bodyDrawn:false};state.set(canvas,s)}

    if(y===145){
      s.title=String(text);
      drawTitle(this,s.title);
      return;
    }

    // app.js body-copy region. Replace once, then suppress every remaining original line.
    if(y>=270&&y<620&&s.title){
      if(!s.bodyDrawn){
        s.bodyDrawn=true;
        const copy=strongCopy[s.title]||String(text);
        this.save();
        this.fillStyle='#161816';
        this.font='900 50px sans-serif';
        const lines=splitLines(this,copy,680).slice(0,4);
        const lineHeight=74,startY=lines.length<=2?345:305;
        lines.forEach((line,i)=>originalFillText.call(this,line,150,startY+i*lineHeight));
        this.restore();
      }
      return;
    }

    return originalFillText.call(this,text,x,y,maxWidth);
  };
})();