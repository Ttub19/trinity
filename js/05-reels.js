function reelsScreen(){
  return `<div class="reels" id="reels">${REELS.map((r, i) => r.type === 'anchor' ? anchorHTML(r, i) : `
    <section class="reel" data-reel="${i}" aria-label="คลิป ${esc(r.title)}">
      ${r.bg ? `<img class="reel-bg" src="${r.bg}" alt="">` : ''}
      <div class="progress" aria-hidden="true">${r.scenes.map(() => '<span><i></i></span>').join('')}</div>
      ${i === 2 ? '<div class="reelhint">แตะซ้ายหรือขวาเพื่อข้ามฉาก แตะกลางจอเพื่อหยุด</div>' : ''}
      ${r.ipo ? '<div class="swipehint" aria-hidden="true">ปัดไปด้านข้าง เพื่อซื้อจำลอง</div>' : ''}
      ${r.scenes.map((sc, k) => `<div class="scene${k === 0 ? ' on' : ''}" data-scene="${k}">${sceneHTML(r, sc)}</div>`).join('')}
      <div class="pausemark" hidden>หยุดชั่วคราว</div>
      <div class="reel-meta"><b>${esc(r.title)}</b><span class="tag">${r.tag}</span><small>สรุปจากการ์ดของ Trinity 2.0 ไม่ใช่คำแนะนำการลงทุน</small></div>
      ${r.ipo ? `<div class="reel-side"><button type="button" class="buy" data-buy="${r.ipo}" data-from="${i}" aria-label="ซื้อหุ้น ${IPOS[r.ipo].ticker} แบบจำลอง"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M2.5 3.5h2.2l1.9 9h8.6l1.6-6.3H6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="16" r="1.4" fill="currentColor"/><circle cx="14.2" cy="16" r="1.4" fill="currentColor"/></svg></button><span>ซื้อ</span><button type="button" data-opencard="${r.ipo}" aria-label="เปิดการ์ดเต็มของ ${IPOS[r.ipo].ticker}"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6.5 8h7M6.5 11h7M6.5 14h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button><span>การ์ด</span></div>` : ''}
    </section>`).join('')}</div>`;
}
function reelEl(i){ return document.querySelector(`.reel[data-reel="${i}"]`); }
function paint(){
  const el = reelEl(player.reel); if (!el || REELS[player.reel].type === 'anchor') return;
  el.querySelectorAll('.scene').forEach((s, k) => {
    const was = s.classList.contains('on'), now = k === player.scene;
    s.classList.toggle('on', now);
    if (now && !was) countUp(s);
  });
  el.querySelectorAll('.progress i').forEach((b, k) => {
    b.style.width = k < player.scene ? '100%' : k > player.scene ? '0%' : Math.min(100, player.t / SCENE_MS * 100) + '%';
  });
  el.querySelector('.pausemark').hidden = !player.paused;
}
function countUp(sceneEl){
  sceneEl.querySelectorAll('[data-count]').forEach(n => {
    const end = +n.dataset.count, suf = n.dataset.suffix || '', t0 = performance.now();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches){ n.textContent = end + suf; return; }
    const step = now => { const p = Math.min(1, (now - t0) / 900); n.textContent = Math.round(end * p) + suf; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}
function startReel(i){
  clearInterval(player.timer);
  anchorStop();
  if (REELS[i].type === 'anchor'){ player.reel = i; state.reel = i; anchorReset(i); return; }
  if (player.reel !== i){ const old = reelEl(player.reel); if (old) old.querySelectorAll('.scene').forEach((s, k) => s.classList.toggle('on', k === 0)); }
  Object.assign(player, {reel:i, scene:0, t:0, paused:false, ended:false});
  state.reel = i;
  const el = reelEl(i); if (el) el.querySelectorAll('.scene').forEach(s => s.classList.remove('on'));
  paint();
  player.timer = setInterval(tick, 50);
}
function tick(){
  if (player.paused || player.ended) return;
  player.t += 50;
  if (player.t >= SCENE_MS){
    const n = REELS[player.reel].scenes.length;
    if (player.scene < n - 1){ player.scene++; player.t = 0; }
    else { player.t = SCENE_MS; player.ended = true; }
  }
  paint();
}
function stopPlayer(){ clearInterval(player.timer); anchorStop(); if (player.io) player.io.disconnect(); player.io = null; }
function bindReels(){
  const box = document.getElementById('reels'); if (!box) return;
  box.scrollTop = (state.reel || 0) * box.clientHeight;
  player.io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) startReel(+e.target.dataset.reel); }), {root:box, threshold:0.6});
  box.querySelectorAll('.reel').forEach(r => player.io.observe(r));
  box.querySelectorAll('[data-tapstart]').forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.tapstart; voice.unlocked = true; unlockAudio(); b.hidden = true;
    if (voice.supported){ try { speechSynthesis.cancel(); speechSynthesis.resume(); } catch(e){} }
    const from = b.dataset.resume ? +b.dataset.resume : 0; delete b.dataset.resume;
    player.reel = i; anchorPlay(i, from);
  }));
  box.querySelectorAll('[data-mute]').forEach(b => b.addEventListener('click', () => {
    voice.muted = !voice.muted;
    box.querySelectorAll('[data-mute]').forEach(x => { x.setAttribute('aria-pressed', String(voice.muted)); x.classList.toggle('on', voice.muted); });
    if (player.running){ const i = player.reel, k = player.line; anchorStop(); anchorPlay(i, k); }
  }));
  box.querySelectorAll('[data-rewrite]').forEach(b => b.addEventListener('click', () => rewriteWithAI(+b.dataset.rewrite, b)));
  box.querySelectorAll('.reel').forEach(r => {
    let sx = 0, sy = 0, st = 0;
    r.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; st = Date.now(); });
    r.addEventListener('pointerup', e => {
      const dx = e.clientX - sx, dy = e.clientY - sy, id = REELS[+r.dataset.reel].ipo;
      if (!id || Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5 || Date.now() - st > 900) return;
      r.dataset.swiped = '1';
      openBuy(id, 'reels', +r.dataset.reel, dx > 0 ? 'r' : 'l');
    });
  });
  box.querySelectorAll('[data-buy]').forEach(b => b.addEventListener('click', () => openBuy(b.dataset.buy, 'reels', +b.dataset.from, 'l')));
  box.querySelectorAll('.reel').forEach(r => r.addEventListener('click', e => {
    if (r.dataset.swiped){ delete r.dataset.swiped; return; }
    if (e.target.closest('button,a')) return;
    const i = +r.dataset.reel; if (i !== player.reel) return;
    if (REELS[i].type === 'anchor'){
      if (!voice.unlocked) return;
      const x = (e.clientX - r.getBoundingClientRect().left) / r.clientWidth, n = REELS[i].lines.length;
      if (x < 0.3){ anchorStop(); anchorPlay(i, Math.max(0, player.line - 1)); }
      else if (x > 0.7){ anchorStop(); anchorPlay(i, Math.min(n - 1, player.line + 1)); }
      else if (player.running){ anchorStop(); const tap = r.querySelector('.tapstart'); tap.hidden = false; tap.querySelector('span').textContent = 'ฟังต่อ'; tap.dataset.resume = player.line; }
      return;
    }
    const x = (e.clientX - r.getBoundingClientRect().left) / r.clientWidth, n = REELS[i].scenes.length;
    if (x < 0.3){ player.scene = Math.max(0, player.scene - 1); player.t = 0; player.ended = false; }
    else if (x > 0.7){ if (player.scene < n - 1){ player.scene++; player.t = 0; } }
    else if (player.ended){ startReel(i); return; }
    else player.paused = !player.paused;
    paint();
  }));
  box.querySelectorAll('[data-opencard]').forEach(b => b.addEventListener('click', () => go({screen:'ipo', ipo:b.dataset.opencard, tab:'summary'})));
}


