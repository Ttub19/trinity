/* ================= render ================= */
function scrollBottom(){ const a = document.getElementById('app'); a.scrollTop = a.scrollHeight; }
function rerender(keepScroll){
  stopPlayer(); anaStop();
  const app = document.getElementById('app'), y = app.scrollTop;
  app.classList.remove('slide-l', 'slide-r');
  app.innerHTML = state.screen === 'home' ? home() : state.screen === 'reels' ? reelsScreen() : state.screen === 'buy' ? buyScreen(IPOS[state.ipo]) : state.screen === 'funds' ? fundsScreen() : state.screen === 'fund' ? fundScreen(FUNDS[state.fund]) : state.screen === 'market' ? marketScreen() : state.screen === 'profile' ? profileScreen() : ipoScreen(IPOS[state.ipo]);
  app.scrollTop = keepScroll ? y : 0;
  document.querySelector('.screen').classList.toggle('dark', state.screen === 'reels');
  const navOf = {reels:'reels', funds:'funds', fund:'funds', market:'market', profile:'none'}[state.screen] || 'home';
  document.querySelectorAll('[data-nav]').forEach(b => b.setAttribute('aria-current', b.dataset.nav === navOf ? 'page' : 'false'));
  const dock = document.getElementById('aibar'); dock.hidden = state.screen === 'reels' || state.screen === 'buy' || (state.screen === 'profile' && state.pf === 'topup');
  bind(); notes();
  if (state.screen === 'reels') bindReels();
  if (state.screen === 'buy') bindBuy();
}
function go(next){ anaStop(); Object.assign(state, next); rerender(); }
function bind(){
  const app = document.getElementById('app');
  app.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => go({screen:'ipo', ipo:b.dataset.open, tab:'summary'})));
  const find = document.getElementById('find');
  if (find){
    let cat = 'all';
    const filter = () => {
      const q = find.value.trim().toLowerCase().replace('เซเว่น', '7-eleven').replace('เอไอเอส', 'ais').replace('คาเฟ่อเมซอน', 'café amazon').replace('อเมซอน', 'amazon').replace('กาแฟ', 'café').replace('กสิกร', 'k plus').replace('เอ็มเค', 'mk').replace('เซ็นทรัล', 'central').replace('ทรู', 'true').replace('ดีแทค', 'dtac').replace('พิซซ่า', 'pizza').replace('บานาน่า', 'banana').replace('เมเจอร์', 'major');
      let shown = 0;
      app.querySelectorAll('#stocklist .srow').forEach(t => { const hit = (!q || t.dataset.find.includes(q)) && (cat === 'all' || t.dataset.cat === cat); t.hidden = !hit; if (hit) shown++; });
      document.getElementById('noresult').hidden = shown > 0;
      /* show matches right under the box, so typing gives an answer without scrolling */
      const box = document.getElementById('findres');
      if (box){
        if (!q){ box.hidden = true; box.innerHTML = ''; }
        else {
          const hits = [...app.querySelectorAll('#stocklist .srow')].filter(t => !t.hidden).slice(0, 4).map(t => IPOS[t.dataset.open]).filter(Boolean);
          box.hidden = false;
          box.innerHTML = hits.length ? hits.map(s => `<button type="button" data-open="${s.id}"><b>${esc(s.ticker)}</b><span>${esc(s.brand.split(' · ')[0])}</span>${CHEV}</button>`).join('') + (shown > 4 ? `<small>และอีก ${shown - 4} ตัวในรายการด้านล่าง</small>` : '')
                                     : '<small>ยังไม่มีหุ้นนี้ในเดโม ลองพิมพ์ชื่อแบรนด์อื่น เช่น เซเว่น หรือ AIS</small>';
          box.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => go({screen:'ipo', ipo:b.dataset.open, tab:'summary'})));
        }
      }
    };
    find.addEventListener('input', filter);
    app.querySelectorAll('[data-cat-btn]').forEach(b => b.addEventListener('click', () => {
      cat = b.dataset.catBtn;
      app.querySelectorAll('[data-cat-btn]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      filter();
    }));
  }
  app.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', () => go({screen:'home'})));
  app.querySelectorAll('[data-fund]').forEach(b => b.addEventListener('click', () => go({screen:'fund', fund:b.dataset.fund})));
  app.querySelectorAll('[data-backfunds]').forEach(b => b.addEventListener('click', () => go({screen:'funds'})));
  app.querySelectorAll('[data-watch]').forEach(b => b.addEventListener('click', () => toggleWatch(b.dataset.watch)));
  app.querySelectorAll('[data-ft]').forEach(b => b.addEventListener('click', () => { const y = app.scrollTop; state.ft = b.dataset.ft; rerender(); const hd = app.querySelector('.fseg'); if (hd && y > hd.offsetTop) app.scrollTop = hd.offsetTop; }));
  app.querySelectorAll('[data-fv]').forEach(b => b.addEventListener('click', () => { state.fv = b.dataset.fv; rerender(true); const nb = app.querySelector(`[data-fv="${b.dataset.fv}"]`); if (nb) nb.focus(); }));
  app.querySelectorAll('[data-ff]').forEach(b => b.addEventListener('click', () => { state.ff = b.dataset.ff; rerender(true); }));
  app.querySelectorAll('[data-buycard]').forEach(b => b.addEventListener('click', () => openBuy(b.dataset.buycard, 'card', state.reel, 'l')));
  app.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => { state.tab = b.dataset.tab; const y = document.getElementById('app').scrollTop; rerender(); const hd = document.querySelector('.seg'); if (hd && y > hd.offsetTop) document.getElementById('app').scrollTop = hd.offsetTop; }));
  app.querySelectorAll('[data-src]').forEach(b => b.addEventListener('click', () => { const n = document.getElementById(b.getAttribute('aria-controls')); const open = b.getAttribute('aria-expanded') === 'true'; b.setAttribute('aria-expanded', String(!open)); n.hidden = open; }));
  const ipo = IPOS[state.ipo];
  app.querySelectorAll('[data-ask]').forEach(b => b.addEventListener('click', () => ask(ipo, b.dataset.ask)));
  const f = document.getElementById('askform');
  if (f) f.addEventListener('submit', e => { e.preventDefault(); const v = document.getElementById('askinput').value.trim(); if (v) ask(ipo, v); });
  const cn = document.getElementById('checknews');
  if (cn) cn.addEventListener('click', checkPasted);
  bindMore(app);
  app.querySelectorAll('[data-reelof]').forEach(b => b.addEventListener('click', () => go({screen:'reels', reel:REELS.findIndex(r => r.id === b.dataset.reelof)})));
}
function bindMore(app){
  const on = (sel, fn) => app.querySelectorAll(sel).forEach(b => b.addEventListener('click', () => fn(b)));
  on('[data-mkt-rec]', () => go({screen:'market', mt:'rec'}));
  on('[data-goto]', b => go({screen:b.dataset.goto}));
  const mtt = app.querySelector('.seg.scroll [aria-selected="true"]'); if (mtt){ const tr = mtt.parentElement; tr.scrollLeft = mtt.offsetLeft - (tr.clientWidth - mtt.offsetWidth) / 2; }
  on('[data-profile]', () => go({screen:'profile', pf:'main', pfDirect:false, from:state.screen}));
  on('[data-topup]', () => go({screen:'profile', pf:'topup', pfDirect:true, from:state.screen}));
  on('[data-pfback]', () => { if ((state.pf || 'main') !== 'main' && !state.pfDirect) go({pf:'main'}); else go({screen:state.from && state.from !== 'profile' ? state.from : 'home'}); });
  on('[data-pfgo]', b => go({pf:b.dataset.pfgo}));
  on('[data-mt]', b => { state.mt = b.dataset.mt; rerender(); const hd = app.querySelector('.fseg'); if (hd && app.scrollTop > hd.offsetTop) app.scrollTop = hd.offsetTop; });
  on('[data-sf]', b => { state.sf = b.dataset.sf; rerender(true); });
  on('[data-gofunds]', b => { const v = b.dataset.gofunds; go(v === 'watch' ? {screen:'funds', ft:'watch'} : {screen:'funds', ft:'ipo', fv:v}); });
  on('[data-todo]', b => toast(b.dataset.todo + ' ยังไม่เปิดใช้ในเดโมนี้'));
  on('[data-askai]', () => openSheet());
  app.querySelectorAll('[data-ana]').forEach(b => b.addEventListener('click', () => { if (ana.running && ana.id === b.dataset.ana){ anaStop(); return; } anaStop(); voice.unlocked = true; unlockAudio(); anaPlay(b.dataset.ana, 0); }));
  on('[data-about]', () => { const n = document.getElementById('aboutbox'); n.hidden = !n.hidden; });
  on('[data-theme-set]', b => { setTheme(b.dataset.themeSet); rerender(true); });
  on('[data-pref]', b => { const p = getPrefs(); p[b.dataset.pref] = !p[b.dataset.pref]; try { localStorage.setItem('owly.prefs', JSON.stringify(p)); } catch(e){} rerender(true); toast(p[b.dataset.pref] ? 'เปิดการเตือนแล้ว (เดโมยังไม่ส่งแจ้งเตือนจริง)' : 'ปิดการเตือนแล้ว'); });
  on('[data-amt]', b => { state.amt = +b.dataset.amt; rerender(true); });
  on('[data-way]', b => { state.way = +b.dataset.way; rerender(true); });
  const amt = document.getElementById('amt');
  if (amt) amt.addEventListener('input', () => {
    const v = Math.round(Number(amt.value)), ok = v >= 20 && v <= 50000; state.amt = v;
    document.getElementById('dotopup').disabled = !ok;
    const hint = document.getElementById('amthint'); hint.textContent = amtMsg(v); if (ok) hint.removeAttribute('role'); else hint.setAttribute('role', 'alert');
    amt.closest('.amtinput').classList.toggle('bad', !ok); if (ok) amt.removeAttribute('aria-invalid'); else amt.setAttribute('aria-invalid', 'true');
    document.getElementById('dotopup').textContent = topupLabel(ok ? v : 0);
    document.getElementById('afterbal').textContent = '฿ ' + nf(walletState().bal + (ok ? v : 0));
    app.querySelectorAll('[data-amt]').forEach(q => q.setAttribute('aria-pressed', String(+q.dataset.amt === v)));
  });
  if (amt) amt.addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); document.getElementById('dotopup').click(); } });
  const go2 = document.getElementById('dotopup');
  if (go2) go2.addEventListener('click', () => {
    const v = Math.round(state.amt || 0); if (!(v >= 20 && v <= 50000)) return;
    const w = walletState(); w.bal += v; w.tx.unshift({d:todayISO(), k:'in', a:v, m:'เติมเงินผ่าน' + TOPUP_WAYS[state.way ?? 0][0] + ' (จำลอง)'}); w.tx = w.tx.slice(0, 50); saveWallet();
    go({pf:'done'});
  });
  on('[data-reset]', () => {
    if (!state.resetAt || Date.now() - state.resetAt > 5000){ state.resetAt = Date.now(); const t = document.querySelector('[data-reset] .mtx b'); if (t){ t.textContent = 'แตะอีกครั้งเพื่อยืนยันรีเซ็ต'; setTimeout(() => { if (t.isConnected) t.textContent = 'รีเซ็ตข้อมูลเดโม'; }, 5000); } toast('แตะอีกครั้งภายใน 5 วินาทีเพื่อยืนยัน'); return; }
    state.resetAt = 0; ['owly.wallet', 'owly.watch', 'owly.prefs', 'owly.theme'].forEach(k => { try { localStorage.removeItem(k); } catch(e){} });
    state.wallet = null; state.watch = []; setTheme('auto'); rerender(); toast('รีเซ็ตข้อมูลเดโมแล้ว');
  });
}
bindDock();
document.querySelectorAll('[data-nav]').forEach(b => b.addEventListener('click', () => go(b.dataset.nav === 'reels' ? {screen:'reels', reel:0} : b.dataset.nav === 'funds' ? {screen:'funds'} : b.dataset.nav === 'market' ? {screen:'market'} : {screen:'home'})));
function notes(){
  const i = stepIndex();
  document.getElementById('steps').innerHTML = STEPS.map((s, k) => `<li><button type="button" data-step="${k}" ${k === i ? 'aria-current="step"' : ''}><span class="n">${k + 1}</span><span>${s.label}</span></button></li>`).join('');
  document.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => go({...STEPS[+b.dataset.step].go})));
  const n = NOTES[i];
  const ipo = IPOS[state.ipo];
  const extra = state.screen === 'ipo' && ipo && !ipo.real ? '<p class="small muted" style="margin:0">ตอนนี้กำลังดูบริษัทสมมติ กดขั้นที่ 2 เพื่อกลับไปที่ PHAT</p>' : '';
  document.getElementById('notecard').innerHTML = `<div class="crit-tags">${n.tags.map(t => `<span>${t}</span>`).join('')}</div><h2>${n.title}</h2><ul>${n.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>${extra}`;
}
document.addEventListener('keydown', e => {
  if (e.target.closest('input,textarea')) return;
  const i = stepIndex();
  if (e.key === 'ArrowRight' && i < STEPS.length - 1) go({...STEPS[i + 1].go});
  if (e.key === 'ArrowLeft' && i > 0) go({...STEPS[i - 1].go});
});
rerender();
