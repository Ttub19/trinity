/* ================= profile ================= */
const IC = {
  plus:'<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  out:'<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 16V4M5 9l5-5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  clock:'<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 6v4.4l3 1.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  bank:'<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 8l7-4.5L17 8M5 9v6M8.3 9v6M11.7 9v6M15 9v6M2.5 17h15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  star:'<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.6l2.2 4.7 5.1.7-3.7 3.6.9 5.1L10 14.2l-4.5 2.4.9-5.1L2.7 8l5.1-.7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  target:'<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  moon:'<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M16.5 11.5A6.5 6.5 0 018.5 3.5a6.5 6.5 0 108 8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  bell:'<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 14V9a5 5 0 0110 0v5l1.5 2h-13zM8 18h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  lock:'<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect x="4" y="9" width="12" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 9V6.5a3 3 0 016 0V9" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  chat:'<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5.5A2.5 2.5 0 015.5 3h9A2.5 2.5 0 0117 5.5v6a2.5 2.5 0 01-2.5 2.5H9l-4 3v-3a2.5 2.5 0 01-2-2.4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  info:'<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 9v5M10 6.2v.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  reset:'<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10a6 6 0 101.8-4.3M4 3.5v3.2h3.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
const TOPUP_AMTS = [500, 1000, 2000, 5000];
const TOPUP_WAYS = [['พร้อมเพย์', 'โอนผ่านแอปธนาคาร'], ['บัตรเดบิต', 'ตัดผ่านบัตร'], ['โอนเข้าบัญชีโบรกเกอร์', 'โอนเงินด้วยตัวเอง']];
function mrow(ic, title, sub, right, attr){ return `<button type="button" class="mrow" ${attr}><span class="mic">${IC[ic]}</span><span class="mtx"><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span>${right || CHEV}</button>`; }
const WAY_IC = [
  '<svg width="22" height="22" viewBox="0 0 22 22"><rect x="3" y="3" width="6" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="3" width="6" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="3" y="13" width="6" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M13 13h2v2h-2zM17 13h2M13 17h2M17 17h2v2" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg>',
  '<svg width="22" height="22" viewBox="0 0 22 22"><rect x="2.5" y="5" width="17" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M2.5 9h17M6 13.5h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  '<svg width="22" height="22" viewBox="0 0 22 22"><path d="M3.5 9L11 4.5 18.5 9M5.5 10v6M9 10v6M13 10v6M16.5 10v6M3 18.5h16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'];
const topupLabel = v => v ? `เติม ฿${v.toLocaleString('en-US')}` : 'ระบุจำนวนเงิน';
const amtMsg = v => !(v >= 20) ? 'เติมอย่างน้อย 20 บาท' : v > 50000 ? 'เติมได้ไม่เกิน 50,000 บาทต่อครั้ง' : 'เติมได้ครั้งละ 20 ถึง 50,000 บาท';
function profileScreen(){
  const w = walletState(), pf = state.pf || 'main', prefs = getPrefs();
  const back = `<div class="topbar"><button class="back" type="button" data-pfback aria-label="${pf === 'main' ? 'ปิดโปรไฟล์' : 'กลับไปโปรไฟล์'}"><svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true"><path d="M11 3L5 9l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><b class="pftitle">${{main:'โปรไฟล์', topup:'เติมเงิน', done:'เติมเงินแล้ว', history:'ประวัติธุรกรรม'}[pf]}</b><span class="chip sim">บัญชีทดลอง</span></div>`;
  if (pf === 'topup'){
    const amt = state.amt || 1000, way = state.way ?? 0, bad = !(amt >= 20 && amt <= 50000);
    return back + `<div class="pfwrap tuwrap">
      <div class="card"><div class="tuhead"><label for="amt"><b>จำนวนเงินที่เติม</b></label><span class="num">มีอยู่ ฿ ${nf(w.bal)}</span></div>
        <div class="amtinput${bad ? ' bad' : ''}"><span>฿</span><input id="amt" type="number" inputmode="numeric" enterkeyhint="done" min="20" max="50000" step="1" value="${amt}" aria-describedby="amthint" ${bad ? 'aria-invalid="true"' : ''}></div>
        <div class="quick tuquick">${TOPUP_AMTS.map(a => `<button type="button" data-amt="${a}" aria-pressed="${amt === a}">${a.toLocaleString('en-US')}</button>`).join('')}</div>
        <p class="hintline" id="amthint" ${bad ? 'role="alert"' : ''}>${amtMsg(amt)}</p></div>
      <div class="card"><b>ช่องทางเติมเงิน</b><div class="ways" role="radiogroup" aria-label="ช่องทางเติมเงิน">${TOPUP_WAYS.map(([t, s], i) => `<button type="button" class="way" role="radio" aria-checked="${way === i}" data-way="${i}"><span class="wic" aria-hidden="true">${WAY_IC[i]}</span><span><b>${t}</b><small>${s}</small></span><i></i></button>`).join('')}</div></div>
      <p class="disclaimer" style="padding:0;margin:0">เติมเงินในเดโมเป็นการจำลอง ไม่มีเงินจริงเข้าหรือออกจากบัญชีใดๆ ในเวอร์ชันจริงขั้นตอนนี้จะเชื่อมกับพร้อมเพย์หรือบัญชีโบรกเกอร์</p>
      <div class="tubar"><div class="tusum"><span>ยอดหลังเติม · ไม่มีค่าธรรมเนียม</span><b class="num" id="afterbal">฿ ${nf(w.bal + (bad ? 0 : amt))}</b></div>
        <button class="btn tubtn" type="button" id="dotopup" ${bad ? 'disabled' : ''}>${topupLabel(bad ? 0 : amt)}</button></div></div>`;
  }
  if (pf === 'done'){
    const t = w.tx[0];
    return back + `<div class="pfwrap"><div class="card done"><svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="26" fill="var(--good-soft)"/><path d="M17 29l7.5 7.5L39 21" fill="none" stroke="var(--good)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <h3>เติมเงินจำลองสำเร็จ</h3><p class="num">+ ฿ ${nf(t.a)} · ${esc(t.m)}</p><p class="num" style="margin:0">เงินพร้อมลงทุนตอนนี้ ฿ ${nf(w.bal)}</p>
      ${state.pfDirect && state.from && state.from !== 'profile' ? `<button class="btn" type="button" data-pfback>กลับไปหน้าเดิม</button><button class="textbtn" type="button" data-pfgo="main">ดูโปรไฟล์</button>` : `<button class="btn" type="button" data-pfgo="main">กลับไปโปรไฟล์</button>`}<button class="textbtn" type="button" data-pfgo="topup">เติมอีกครั้ง</button></div></div>`;
  }
  if (pf === 'history'){
    return back + `<div class="pfwrap">${w.tx.length ? `<div class="slist">${w.tx.map(t => `<div class="srow static txrow"><span class="sr-id"><b>${esc(t.m)}</b><span class="sub"><em>${fmtD(t.d)}</em></span></span><span></span><span class="sr-px"><b class="num ${t.k === 'in' ? 'up' : 'down'}">${t.k === 'in' ? '+' : '−'}${nf(t.a)}</b> <small>THB</small></span><span></span></div>`).join('')}</div>` : '<div class="card"><p class="small" style="margin:0">ยังไม่มีธุรกรรม</p></div>'}
      <p class="disclaimer" style="padding:0;margin:0">รายการทั้งหมดเป็นการจำลอง เก็บไว้ในเครื่องนี้เท่านั้น</p></div>`;
  }
  const th = getTheme(), thN = {auto:'ตามเครื่อง', light:'สว่าง', dark:'มืด'}[th];
  return back + `<div class="pfwrap">
    <div class="pfhead"><span class="av big" aria-hidden="true"><svg width="34" height="34" viewBox="0 0 22 22"><circle cx="11" cy="7.5" r="3.6" fill="currentColor"/><path d="M3.8 19c.6-4 3.5-6 7.2-6s6.6 2 7.2 6" fill="currentColor"/></svg></span><div><h2>ผู้ใช้เดโม</h2><div class="m">บัญชีทดลองสำหรับนำเสนอ Trinity 2.0</div></div></div>
    <div class="wallet"><div class="m">เงินพร้อมลงทุน</div><div class="bal num">฿ ${nf(w.bal)}</div>
      <div class="wbtns"><button type="button" class="btn" data-pfgo="topup">${IC.plus}เติมเงิน</button><button type="button" class="ghost" data-todo="ถอนเงิน">${IC.out}ถอนเงิน</button><button type="button" class="ghost" data-pfgo="history">${IC.clock}ประวัติ</button></div></div>
    <div class="pfstats"><button type="button" data-gofunds="watch"><b class="num">${state.watch.length}</b><span>กองที่ติดตาม</span></button><button type="button" data-pfgo="history"><b class="num">${w.tx.length}</b><span>ธุรกรรม</span></button><div><b class="num">${Object.keys(IPOS).length}</b><span>หุ้นในแอป</span></div></div>
    <div class="mgroup"><h3>การเงิน</h3>
      ${mrow('clock', 'ประวัติธุรกรรม', w.tx.length + ' รายการ', '', 'data-pfgo="history"')}
      ${mrow('bank', 'บัญชีธนาคารที่ผูกไว้', 'ใช้ถอนเงินและรับปันผล', '', 'data-todo="การผูกบัญชีธนาคาร"')}
      ${mrow('target', 'งบลงทุนต่อเดือน', 'เตือนเมื่อซื้อเกินงบ', `<span class="mval num">฿ ${nf(BUDGET, 0)}</span>`, 'data-todo="การแก้งบลงทุน"')}</div>
    <div class="mgroup"><h3>การลงทุน</h3>
      ${mrow('star', 'กองทุนที่ติดตาม', state.watch.length ? state.watch.map(i => FUNDS[i].code).slice(0, 3).join(', ') + (state.watch.length > 3 ? ' +' + (state.watch.length - 3) : '') : 'ยังไม่ได้ติดตามกองไหน', '', 'data-gofunds="watch"')}</div>
    <div class="mgroup"><h3>ตั้งค่า</h3>
      <div class="mrow static"><span class="mic">${IC.moon}</span><span class="mtx"><b>ธีมหน้าจอ</b><small>ตอนนี้: ${thN}</small></span></div>
      <div class="themeseg" role="radiogroup" aria-label="ธีมหน้าจอ">${[['auto', 'ตามเครื่อง'], ['light', 'สว่าง'], ['dark', 'มืด']].map(([k, l]) => `<button type="button" role="radio" aria-checked="${th === k}" data-theme-set="${k}">${l}</button>`).join('')}</div>
      <div class="mrow static"><span class="mic">${IC.bell}</span><span class="mtx"><b>เตือนกองทุนที่ใกล้ปิดขาย</b><small>เฉพาะกองที่กดดาวไว้ (เดโมยังไม่ส่งแจ้งเตือนจริง)</small></span><button type="button" class="switch" role="switch" aria-checked="${!!prefs.notify}" data-pref="notify" aria-label="เตือนกองทุนที่ใกล้ปิดขาย"><i></i></button></div>
      ${mrow('lock', 'ความปลอดภัยและ PIN', 'ล็อกแอปด้วย PIN หรือสแกนนิ้ว', '', 'data-todo="การตั้ง PIN"')}</div>
    <div class="mgroup"><h3>ช่วยเหลือ</h3>
      ${mrow('chat', 'ถามน้องฮูก (AI)', 'ถามเรื่องหุ้น กองทุน และศัพท์การเงิน', '', 'data-askai')}
      ${mrow('info', 'เกี่ยวกับ Trinity 2.0 และข้อจำกัด', '', '', 'data-about')}
      <div class="about-box" id="aboutbox" hidden><p>Trinity 2.0 เป็นต้นแบบสำหรับ Trinity Securities Future Finance Innovation Hackathon 2026 การซื้อ การเติมเงิน และยอดเงินทั้งหมดเป็นการจำลอง ข้อมูลตลาดเป็น snapshot ที่ดึงมาตามเวลาที่ระบุในแต่ละหน้า และไม่ใช่คำแนะนำการลงทุน</p></div>
      ${mrow('reset', 'รีเซ็ตข้อมูลเดโม', 'ล้างยอดเงิน ประวัติ และกองทุนที่ติดตาม', '', 'data-reset')}</div>
    <p class="disclaimer" style="padding:0;margin:14px 0 0">ข้อมูลโปรไฟล์ทั้งหมดเก็บในเบราว์เซอร์เครื่องนี้ ไม่ได้ส่งไปที่ใด</p></div>`;
}


