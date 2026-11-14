/* ================= global chat (bottom dock) ================= */
const gchat = [];
const todayThai = () => { const t = todayISO(); return fmtD(t); };
function appContext(){
  const stocks = Object.values(IPOS).map(s => ({หุ้น:s.ticker, แบรนด์:s.brand, หมวด:s.sector, ธุรกิจ:s.what, ตัวเลขหลัก:s.kv.map(([l, v, u]) => l + ' ' + v + ' ' + u), สัญญาณที่พบ:foundCount(s) + ' จาก 6 เรื่อง', สรุป:s.summary, อยู่ในกองทุน:fundsHolding(s.id).map(i => FUNDS[i].code)}));
  const funds = Object.values(FUNDS).map(f => { const st = fundStatus(f); return {รหัส:f.code, ชื่อ:f.name, ประเภท:TYPE_NAME[f.type], บลจ:f.amc, ดัชนี:f.index || undefined, ระดับความเสี่ยง:f.risk || 'ยังไม่มีข้อมูล', ขั้นต่ำ:f.min ? f.min + ' บาท' : 'ยังไม่มีข้อมูล', ช่วงเสนอขาย:st ? fmtP(f) : undefined, สถานะ:st ? st.label : undefined, อายุกอง:f.term, นโยบาย:f.what || f.tag, ที่มา:f.srcs.map(s => s[1])}; });
  return JSON.stringify({วันนี้:todayThai(), หุ้นในแอป:stocks, กองทุน:funds, ดัชนี:Object.values(INDEXES).map(ix => ({ชื่อ:ix.name, คืออะไร:ix.plain, หุ้นในแอป:ix.stocks.map(s => IPOS[s].ticker)})), กองทุนที่ผู้ใช้ติดตาม:state.watch.map(id => FUNDS[id].code)});
}
function gsys(){
  let focus = '';
  if (state.screen === 'ipo' && IPOS[state.ipo]) focus = '\n\nผู้ใช้กำลังดูการ์ดหุ้นนี้อยู่:\n' + context(IPOS[state.ipo]);
  if (state.screen === 'fund' && FUNDS[state.fund]) focus = '\n\nผู้ใช้กำลังดูกองทุนนี้อยู่: ' + FUNDS[state.fund].code;
  return 'คุณคือน้องฮูก ผู้ช่วยในแอป Trinity 2.0 ตอบเป็นภาษาไทย สั้น ไม่เกิน 6 บรรทัด ใช้เฉพาะข้อมูลแอปด้านล่าง ห้ามเดาหรือใช้ความรู้ภายนอก ถ้าไม่มีข้อมูลให้บอกตรงๆ ว่าแอปไม่มีข้อมูลนี้ และแนะนำให้ดูหนังสือชี้ชวนหรือถาม บลจ. ห้ามแนะนำให้ซื้อหรือขาย ห้ามบอกว่ากองไหนดีกว่า ห้ามคาดการณ์ผลตอบแทน เมื่อพูดถึงกองทุนที่เสนอขายให้บอกวันปิดขาย ปิดท้ายด้วยบรรทัด "ที่มา:" ตามด้วยชื่อแหล่งที่อยู่ในข้อมูล หรือ "ข้อมูลในแอป Trinity 2.0" ห้ามเขียนคำว่า JSON ห้ามใช้ markdown\n\nข้อมูลแอป:\n' + appContext() + focus;
}
function gSuggestions(){
  if (state.screen === 'fund' && FUNDS[state.fund]) { const c = FUNDS[state.fund].code; return ['กอง ' + c + ' ทำอะไร', c + ' เหมาะกับคนแบบไหน', 'กองทุนไหนกำลังเปิดขายอยู่']; }
  if (state.screen === 'funds') return ['กองทุนไหนกำลังเปิดขายอยู่', 'IPO กองทุนต่างจากกองทั่วไปยังไง', 'Term Fund คืออะไร', 'KBANK อยู่ในกองทุนอะไรบ้าง'];
  if (state.screen === 'ipo' && IPOS[state.ipo]) { const t = IPOS[state.ipo].ticker; return ['สรุป ' + t + ' ให้หน่อย', t + ' อยู่ในกองทุนอะไรบ้าง', 'ศัพท์ที่ควรรู้ก่อนอ่านการ์ดนี้']; }
  return ['กองทุนไหนกำลังเปิดขายอยู่', 'กองทุนดัชนีต่างจากซื้อหุ้นเองยังไง', 'CPALL อยู่ในกองทุนอะไรบ้าง', 'Term Fund คืออะไร'];
}
function gContextLabel(){
  if (state.screen === 'ipo' && IPOS[state.ipo]) return 'กำลังดูหุ้น ' + IPOS[state.ipo].ticker;
  if (state.screen === 'fund' && FUNDS[state.fund]) return 'กำลังดูกองทุน ' + FUNDS[state.fund].code;
  if (state.screen === 'funds') return 'กำลังดูหน้ากองทุน';
  return 'ถามได้ทั้งเรื่องหุ้นและกองทุนในแอป';
}
/* offline answer built only from the app's own data */
function gLocal(q){
  const t = q.toLowerCase(), open = type => Object.values(FUNDS).filter(f => f.type === type && fundStatus(f) && fundStatus(f).s !== 'closed').sort((a, b) => a.to.localeCompare(b.to));
  const line = f => `${f.code}: ${fundStatus(f).label} (${fmtP(f)})`;
  const stock = Object.values(IPOS).find(s => { const br = s.brand.split(' · ')[0].toLowerCase(); return new RegExp('(^|[^a-z0-9])' + s.ticker.toLowerCase() + '([^a-z0-9]|$)').test(t) || (br.length >= 3 && t.includes(br)); });
  const fund = Object.values(FUNDS).find(f => t.includes(f.code.toLowerCase()));
  if (fund) return `${fund.code} ${fund.name}\n${fund.what || fund.tag}\nที่มา: ${fund.srcs[0][1]}`;
  if (stock) { const fs = fundsHolding(stock.id).map(i => FUNDS[i].code); return /กองทุน|อยู่ใน|ถือ/.test(t) ? `${stock.ticker} ${fs.length ? 'อยู่ในดัชนีที่กองทุนเหล่านี้ลงทุนตาม: ' + fs.join(', ') : 'ยังไม่พบในกองทุนดัชนีที่ Trinity 2.0 ติดตาม'}\nที่มา: ข้อมูลในแอป Trinity 2.0` : `${stock.ticker}: ${stock.summary}\nที่มา: การ์ดของ Trinity 2.0`; }
  if (/ipo|เปิดขาย|เสนอขาย|ออกใหม่/.test(t)) { const l = open('ipo').concat(open('term')); return l.length ? 'กองที่กำลังเปิดขาย:\n' + l.map(line).join('\n') + '\nที่มา: InfoQuest, Finnomena' : 'ตอนนี้ไม่มีกองที่เปิดขายในรายการของ Trinity 2.0'; }
  if (/term|ครบกำหนด|พันธบัตร|ตราสารหนี้/.test(t)) return 'Term Fund คือกองทุนที่มีอายุกำหนด ซื้อได้เฉพาะช่วงเสนอขายแล้วถือจนครบกำหนด\n' + open('term').map(line).join('\n') + '\nที่มา: Finnomena';
  if (/ติดตาม/.test(t)) return state.watch.length ? 'กองที่ติดตามอยู่: ' + state.watch.map(id => FUNDS[id].code).join(', ') : 'ยังไม่ได้ติดตามกองทุนไหน กดดาวที่การ์ดกองทุนได้เลย';
  return null;
}
function gRender(){
  const log = document.getElementById('gchatlog');
  log.innerHTML = gchat.length ? gchat.map(m => `<div class="bubble ${m.role === 'user' ? 'me' : 'ai'}">${esc(m.content)}</div>`).join('') : `<div class="bubble ai">สวัสดี น้องฮูกตอบจากข้อมูลหุ้นและกองทุนในแอปนี้ บอกที่มาทุกครั้ง และไม่แนะนำให้ซื้อหรือขาย ถามได้เลย</div>`;
  document.getElementById('gsuggest').innerHTML = gSuggestions().map(q => `<button type="button" data-gask="${esc(q)}">${esc(q)}</button>`).join('');
  log.scrollTop = log.scrollHeight;
}
function setInert(on){ ['app', 'aibar'].forEach(id => { const e = document.getElementById(id); if (e) e.inert = on; }); const n = document.querySelector('.tabbar'); if (n) n.inert = on; }
function openSheet(){
  const s = document.getElementById('sheet');
  document.getElementById('sheetctx').textContent = gContextLabel();
  gRender(); s.hidden = false; setInert(true);
  setTimeout(() => document.getElementById('ginput').focus(), 30);
}
function closeSheet(){ document.getElementById('sheet').hidden = true; setInert(false); const b = document.getElementById('aibar'); if (!b.hidden) b.focus(); }
let gBusy = false;
async function gask(q){
  if (gBusy) return;
  gBusy = true;
  const status = document.getElementById('gstatus'), logEl = document.getElementById('gchatlog');
  gchat.push({role:'user', content:q}); gRender(); document.getElementById('ginput').focus();
  const bubble = document.createElement('div'); bubble.className = 'bubble ai'; bubble.textContent = 'น้องฮูกกำลังดูข้อมูลในแอป...';
  logEl.appendChild(bubble); logEl.scrollTop = logEl.scrollHeight; status.textContent = '';
  const done = (text, note) => { bubble.textContent = text; gchat.push({role:'assistant', content:text}); status.textContent = note || ''; logEl.scrollTop = logEl.scrollHeight; gBusy = false; };
  try {
    const sample = await getSampler();
    if (!sample){ const a = gLocal(q); if (a) return done(a, 'คำตอบจากข้อมูลในแอป (โหมดออฟไลน์)'); return done('โหมดออฟไลน์ตอบได้เฉพาะเรื่องกองทุนที่เปิดขาย Term Fund หรือชื่อหุ้นและกองทุน เช่น KBANK', ''); }
    const msgs = [{role:'user', content:gsys() + '\n\nคำถามแรก: ' + gchat[0].content}];
    for (let i = 1; i < gchat.length; i++) msgs.push({role:gchat[i].role, content:gchat[i].content});
    const res = await sample(msgs, {cache:false, modelTier:'quick', onText:({text}) => { bubble.textContent = text; logEl.scrollTop = logEl.scrollHeight; }});
    done(res.text, sample.provider ? 'ตอบโดย AI ฟรีจาก ' + sample.provider + ' อย่าพิมพ์ข้อมูลส่วนตัว' : '');
  } catch(e){
    const a = gLocal(q);
    if (a) done(a, e && e.code === 'rate_limited' ? 'AI ฟรีจำกัดจำนวนครั้ง จึงตอบจากข้อมูลในแอปแทน' : 'แสดงคำตอบจากข้อมูลในแอปแทน');
    else { bubble.remove(); gchat.pop(); status.textContent = e && e.code === 'rate_limited' ? 'AI ฟรีจำกัดจำนวนครั้ง รอราว 15 วินาทีแล้วลองใหม่' : 'ตอนนี้ AI ตอบไม่ได้ ลองกดคำถามแนะนำ'; gBusy = false; gRender(); }
  }
}
function bindDock(){
  document.getElementById('aibar').addEventListener('click', openSheet);
  document.getElementById('sheetclose').addEventListener('click', closeSheet);
  document.getElementById('gform').addEventListener('submit', e => { e.preventDefault(); const i = document.getElementById('ginput'), v = i.value.trim(); if (v){ i.value = ''; gask(v); } });
  document.getElementById('gsuggest').addEventListener('click', e => { const b = e.target.closest('[data-gask]'); if (b) gask(b.dataset.gask); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !document.getElementById('sheet').hidden) closeSheet(); });
  document.getElementById('sheet').addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...document.getElementById('sheet').querySelectorAll('button,input')].filter(x => !x.disabled && x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  });
}

