/* ================= simulated buy (idea demo: no real order is ever sent) ================= */
const BUDGET = 2000;          // monthly budget the user set for themselves (simulated)
const FEE = 0.0017;           // simulated fee rate
function openBuy(id, from, reel, dir){
  const p = IPOS[id].simPrice;
  Object.assign(state, {screen:'buy', ipo:id, from, reel: reel ?? state.reel, qty: Math.max(1, Math.floor(1000 / p)), done:false, ack:false});
  rerender();
  const app = document.getElementById('app');
  app.classList.remove('slide-l', 'slide-r'); void app.offsetWidth; app.classList.add(dir === 'r' ? 'slide-r' : 'slide-l');
}
function buyTotals(ipo, q){
  const gross = ipo.simPrice * q, fee = Math.round(gross * FEE * 100) / 100;
  return {gross, fee, total: gross + fee};
}
function buyScreen(ipo){
  const q = state.qty, t = buyTotals(ipo, q), warn = ipo.signals, na = Object.values(ipo.checks).filter(x => x === 'na').length;
  const backLabel = state.from === 'reels' ? 'กลับไปที่คลิป' : 'กลับไปที่การ์ด';
  const head = `
    <div class="topbar"><button class="back" type="button" data-buyback aria-label="${backLabel}"><svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true"><path d="M11 3L5 9l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><span class="chip sim">โหมดจำลอง ไม่ใช่การซื้อจริง</span></div>
    <div class="buyhead"><div class="m">${esc(ipo.brand)} · ${ipo.ticker} · ${ipo.market}</div><h2>ซื้อหุ้น ${ipo.ticker}</h2>
      <div class="price"><b class="num">${ipo.simPrice.toFixed(2)}</b><span>บาทต่อหุ้น · ราคาจำลองสำหรับเดโม</span></div></div>`;
  if (state.done) return head + `
    <div class="buywrap"><div class="card done">
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="26" fill="var(--good-soft)"/><path d="M17 29l7.5 7.5L39 21" fill="none" stroke="var(--good)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <h3>ส่งคำสั่งซื้อจำลองแล้ว</h3>
      <p class="num">ซื้อ ${ipo.ticker} ${fmt(q)} หุ้น ที่ ${ipo.simPrice.toFixed(2)} บาท รวมประมาณ ${fmt(t.total)} บาท</p>
      <p class="small muted">นี่คือการจำลอง ไม่มีเงินหรือหุ้นเปลี่ยนมือ ในเวอร์ชันจริง ปุ่มนี้จะส่งคำสั่งผ่านบัญชีหุ้นของผู้ใช้กับโบรกเกอร์</p>
      <button class="btn" type="button" data-buyback>${backLabel}</button>
      <button class="textbtn" type="button" data-open="${ipo.id}">อ่านการ์ดเต็มของ ${ipo.ticker}</button>
    </div></div>`;
  return head + `
    <div class="buywrap">
      <div class="card riskmini">${ring(ipo, 56)}<div><b>ก่อนซื้อ อ่าน 6 เรื่องนี้แล้วหรือยัง</b>
        ${warn.length ? `<ul>${warn.map(sg => `<li>${esc(sg.title)}</li>`).join('')}</ul>` : `<p class="ok">ยังไม่พบเรื่องที่ต้องระวังจากข้อมูลที่มี</p>`}
        ${na ? `<p class="hintline">อีก ${na} เรื่องยังไม่มีข้อมูล</p>` : ''}
        <button class="textbtn" type="button" data-open="${ipo.id}" style="margin-top:2px">อ่านการ์ดเต็ม</button></div></div>
      <div class="card"><label for="qty"><b>จำนวนหุ้น</b></label>
        <div class="qty"><button type="button" data-step="-1" aria-label="ลดจำนวนหุ้น">−</button><input id="qty" type="number" inputmode="numeric" min="1" step="1" value="${q}"><button type="button" data-step="1" aria-label="เพิ่มจำนวนหุ้น">+</button></div>
        <div class="quick">${[1, 10, 100].map(n => `<button type="button" data-setq="${n}">${n} หุ้น</button>`).join('')}<button type="button" data-setq="${Math.max(1, Math.floor(1000 / ipo.simPrice))}">ราว 1,000 บาท</button></div>
        <p class="hintline" id="oddlot"></p>
      </div>
      <div class="card">
        <div class="metric"><span>ราคา × จำนวน</span><b class="num" id="t-gross"></b></div>
        <div class="metric"><span>ค่าธรรมเนียมโดยประมาณ (จำลอง)</span><b class="num" id="t-fee"></b></div>
        <div class="metric"><span><b>รวมที่ต้องจ่าย</b></span><b class="num" id="t-total" style="font-size:18px"></b></div>
        <p class="hintline" style="margin-top:12px">งบลงทุนเดือนนี้ที่ตั้งไว้ ${fmt(BUDGET)} บาท (จำลอง)</p>
        <div class="budget" id="budget" role="img"><i></i></div>
        <p class="hintline" id="budgetnote"></p>
      </div>
      <label class="ack"><input type="checkbox" id="ack" ${state.ack ? 'checked' : ''}><span>ฉันอ่านเรื่องที่ควรรู้ของ ${ipo.ticker} แล้ว และเข้าใจว่าราคาหุ้นขึ้นลงได้ อาจขาดทุนได้</span></label>
      <button class="btn confirm" type="button" id="confirmbuy" disabled>ส่งคำสั่งซื้อจำลอง</button>
      <p class="disclaimer" style="padding:0;margin:0">หน้านี้เป็นไอเดียสำหรับนำเสนอ ราคาและค่าธรรมเนียมเป็นตัวเลขจำลอง ไม่ใช่คำแนะนำการลงทุน</p>
    </div>`;
}
function bindBuy(){
  const app = document.getElementById('app'), ipo = IPOS[state.ipo];
  const back = () => state.from === 'reels' ? go({screen:'reels', reel:state.reel}) : go({screen:'ipo', ipo:ipo.id, tab:'summary'});
  app.querySelectorAll('[data-buyback]').forEach(b => b.addEventListener('click', back));
  const input = document.getElementById('qty'); if (!input) return;
  const ack = document.getElementById('ack'), btn = document.getElementById('confirmbuy');
  const paintTotals = () => {
    const q = state.qty, t = buyTotals(ipo, q);
    document.getElementById('t-gross').textContent = fmt(t.gross) + ' บาท';
    document.getElementById('t-fee').textContent = fmt(t.fee) + ' บาท';
    document.getElementById('t-total').textContent = fmt(t.total) + ' บาท';
    const pct = Math.min(100, t.total / BUDGET * 100), bar = document.getElementById('budget');
    bar.querySelector('i').style.width = pct + '%'; bar.classList.toggle('over', t.total > BUDGET);
    bar.setAttribute('aria-label', 'ใช้งบไป ' + Math.round(t.total / BUDGET * 100) + '% ของงบเดือนนี้');
    document.getElementById('budgetnote').textContent = t.total > BUDGET ? 'เกินงบที่ตั้งไว้ ' + fmt(t.total - BUDGET) + ' บาท ลองลดจำนวนหุ้นดูก่อน' : 'ยังอยู่ในงบ เหลืออีก ' + fmt(BUDGET - t.total) + ' บาท';
    document.getElementById('oddlot').textContent = q < 100 ? 'ซื้อต่ำกว่า 100 หุ้นจะเป็นหุ้นเศษ (odd lot) ซึ่งซื้อขายแยกกระดาน' : 'ครบ 100 หุ้นขึ้นไป ซื้อขายในกระดานปกติ';
    btn.disabled = !(ack.checked && q >= 1);
  };
  const setQ = n => { state.qty = Math.max(1, Math.min(100000, Math.floor(n) || 1)); input.value = state.qty; paintTotals(); };
  input.addEventListener('input', () => { const n = parseInt(input.value, 10); if (n >= 1){ state.qty = Math.min(100000, n); paintTotals(); } });
  input.addEventListener('blur', () => setQ(parseInt(input.value, 10)));
  app.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => setQ(state.qty + +b.dataset.step)));
  app.querySelectorAll('[data-setq]').forEach(b => b.addEventListener('click', () => setQ(+b.dataset.setq)));
  ack.addEventListener('change', () => { state.ack = ack.checked; paintTotals(); });
  btn.addEventListener('click', () => { state.done = true; rerender(); });
  paintTotals();
}

