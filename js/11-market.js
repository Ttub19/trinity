/* ================= market ================= */
const MKT_TABS = [['rec','แนะนำ'],['th','ตลาดหุ้น'],['gold','ทอง'],['bond','ตราสารหนี้'],['stock','หุ้นรายตัว']];
const MKT_SRC = {
  rec:[['https://www.set.or.th/th/market/index/set100/overview','SET (มูลค่าซื้อขาย)'],FINN_TERM],
  th:[['https://www.set.or.th/th/market/index/set/overview','ตลาดหลักทรัพย์แห่งประเทศไทย (SET)']],
  gold:[['https://www.goldtraders.or.th/','สมาคมค้าทองคำ']],
  bond:[['https://www.thaibma.or.th/EN/Market/YieldCurve/Government.aspx','ThaiBMA: Government Bond Yield Curve']],
  stock:[['https://www.set.or.th/th/market/index/set100/overview','SET (หุ้นไทย)'],['https://finance.yahoo.com/','Yahoo Finance (หุ้นสหรัฐฯ)']]
};
function idxCard(k, big){
  const i = LIVE.idx[k], up = i.p > 0 ? 'up' : i.p < 0 ? 'down' : 'flat';
  return big ? `<div class="idxbig"><div class="m">ดัชนี ${k} · ${LIVE.asof}</div><div class="v num">${nf(i.l)}</div>
      <div class="vc">${chgHTML(i.p)}<span class="num ${up}">${i.c > 0 ? '+' : ''}${nf(i.c)} จุด</span></div>
      <div class="hl2"><span>สูงสุด <b class="num">${nf(i.h)}</b></span><span>ต่ำสุด <b class="num">${nf(i.lo)}</b></span><span>มูลค่า <b class="num">${nf(i.v / 1000, 1)}</b> พันล้านบาท</span></div></div>`
    : `<div class="idxmini"><span class="m">${k}</span><b class="num">${nf(i.l)}</b>${chgHTML(i.p)}</div>`;
}
function moverRow([s, last, p, v]){
  const own = Object.values(IPOS).find(x => x.ticker === s);
  return qrow({sym:s, mkt:'TH', sub:(v ? 'มูลค่า ' + nf(v, 0) + ' ลบ.' : own ? own.brand.split(' · ')[0] : LIVE.names[s] || 'หุ้นใน SET100'), p, last, cur:'THB', open:own ? own.id : null});
}

/* popular: ranked by today's traded value on SET (real snapshot), among the stocks Trinity 2.0 covers */
function popularOwly(){ return Object.values(IPOS).filter(s => LIVE.th[s.ticker]).sort((a, b) => LIVE.th[b.ticker].v - LIVE.th[a.ticker].v); }
function popRow(s, i){
  const q = LIVE.th[s.ticker];
  return qrow({sym:s.ticker, mkt:'TH', sub:s.brand.split(' · ')[0] + ' · ' + nf(q.v, 0) + ' ลบ.', p:q.p, last:q.l, cur:'THB', open:s.id, pre:`<span class="rank r${i + 1}">${i + 1}</span>`});
}
function recTab(){
  const pops = popularOwly().slice(0, 5);
  const closing = Object.keys(FUNDS).filter(id => { const s = fundStatus(FUNDS[id]); return s && s.s === 'open' && s.left <= 3; }).sort((a, b) => FUNDS[a].to.localeCompare(FUNDS[b].to)).slice(0, 4);
  const play = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect x="3.5" y="3" width="13" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 7.5l4 2.5-4 2.5z" fill="currentColor"/></svg>';
  return `<div class="sec-title" style="margin-top:6px"><h2>หุ้นยอดนิยมวันนี้</h2><em>แบรนด์ที่ Trinity 2.0 อ่านให้</em></div>
    <div class="slist">${pops.map(popRow).join('')}</div>
    <p class="asof" style="margin-top:8px">จัดอันดับจากมูลค่าซื้อขายล่าสุด (ลบ. = ล้านบาท) ณ ${LIVE.asof} ไม่ใช่จำนวนคนเปิดดูในแอป เดโมนี้ยังไม่มีข้อมูลจากผู้ใช้จริง</p>
    <div class="sec-title"><h2>ตลาดคึกคักสุดวันนี้</h2><em>มูลค่าซื้อขายสูงสุดใน SET100</em></div><div class="slist">${LIVE.val.map(moverRow).join('')}</div>
    ${closing.length ? `<div class="sec-title"><h2>กองทุนใกล้ปิดขาย</h2><em>ภายใน 3 วัน</em></div><div class="slist">${closing.map(fundRow).join('')}</div>
    <button class="textbtn" type="button" data-gofunds="all" style="margin:8px 20px 0">ดูกองทุนทั้งหมด</button>` : ''}
    <div class="sec-title"><h2>น้องฮูกพาเรียนรู้</h2><em>ความรู้ ไม่ใช่คำแนะนำซื้อขาย</em></div>
    <div class="mgroup" style="margin:0 16px">
      <button type="button" class="mrow" data-reelof="news-intro"><span class="mic">${play}</span><span class="mtx"><b>รู้จักหุ้นใน 1 นาที</b><small>คลิปสั้นมีเสียง ปัดคลิปเพื่อซื้อจำลอง</small></span>${CHEV}</button>
      <button type="button" class="mrow" data-askai><span class="mic">${IC.chat}</span><span class="mtx"><b>ถามน้องฮูก (AI)</b><small>ศัพท์หุ้น กองทุน หรือบริษัทที่สนใจ</small></span>${CHEV}</button>
      <button type="button" class="mrow" data-goto="home"><span class="mic">${IC.info}</span><span class="mtx"><b>อ่านการ์ดหุ้นแบรนด์ดัง</b><small>ตรวจ 6 เรื่องก่อนซื้อ จากงบและข่าว</small></span>${CHEV}</button>
    </div>`;
}
function marketScreen(){
  const mt = state.mt || 'rec';
  let body = '';
  if (mt === 'rec') body = recTab();
  else if (mt === 'th'){
    body = `${idxCard('SET', true)}
      <div class="idxgrid">${['SET50','SET100','SETHD','SETESG','mai'].map(k => idxCard(k)).join('')}</div>
      <div class="sec-title"><h2>ขึ้นแรงสุดวันนี้</h2><em>ในกลุ่ม SET100</em></div><div class="slist">${LIVE.gain.map(moverRow).join('')}</div>
      <div class="sec-title"><h2>ลงแรงสุดวันนี้</h2><em>ในกลุ่ม SET100</em></div><div class="slist">${LIVE.lose.map(moverRow).join('')}</div>
      <div class="sec-title"><h2>ซื้อขายมูลค่าสูงสุด</h2><em>ล้านบาท</em></div><div class="slist">${LIVE.val.map(moverRow).join('')}</div>`;
  } else if (mt === 'gold'){
    const g = LIVE.gold, spread = g.barSell - g.barBuy;
    body = `<div class="goldcard"><div class="m">ทองคำแท่ง 96.5% · ราคาต่อ 1 บาททองคำ</div>
        <div class="gprice"><div><span>สมาคมรับซื้อ</span><b class="num">${nf(g.barBuy)}</b></div><div><span>สมาคมขายออก</span><b class="num">${nf(g.barSell)}</b></div></div>
        <div class="vc">${chgHTML(g.barChgDay / g.barSell * 100)}<span class="num down">${g.barChgDay} บาท เทียบกับวันก่อนหน้า</span></div>
        <div class="m" style="margin-top:8px">ประกาศครั้งที่ ${g.no} · ${g.t}</div></div>
      <div class="slist kvlist">
        <div class="srow static"><span class="sr-id"><b>ทองรูปพรรณ 96.5%</b><span class="sub"><em>ราคาขายออก</em></span></span><span></span><span class="sr-px"><b class="num">${nf(g.ornSell)}</b> <small>THB</small></span><span></span></div>
        <div class="srow static"><span class="sr-id"><b>ฐานภาษีทองรูปพรรณ</b><span class="sub"><em>ใช้คิดภาษีมูลค่าเพิ่ม</em></span></span><span></span><span class="sr-px"><b class="num">${nf(g.ornTax)}</b> <small>THB</small></span><span></span></div>
      </div>
      <div class="card about" style="margin:14px 16px 0"><span class="chip c-info brandtag">อ่านราคาทองยังไง</span>
        <p>ราคารับซื้อกับขายออกต่างกัน ${nf(spread, 0)} บาท คิดเป็นราว ${nf(spread / g.barSell * 100)}% ของราคาขายออก ถ้าซื้อวันนี้แล้วขายคืนทันทีจะขาดทุนเท่าส่วนต่างนี้ ราคาทองต้องขึ้นเกินส่วนต่างก่อนถึงจะเริ่มกำไร</p></div>`;
  } else if (mt === 'bond'){
    const pts = LIVE.curve, W = 340, H = 150, px = i => 14 + i * (W - 28) / (pts.length - 1), mn = 0.6, mx = 3.4, py = v => 12 + (H - 34) * (1 - (v - mn) / (mx - mn));
    const path = pts.map(([, v], i) => (i ? 'L' : 'M') + px(i).toFixed(1) + ' ' + py(v).toFixed(1)).join(' ');
    body = `<div class="card ycard"><div class="m">ผลตอบแทนพันธบัตรไทย (% ต่อปี) · ${LIVE.bondAsof}</div>
        <svg viewBox="0 0 ${W} ${H + 6}" width="100%" role="img" aria-label="ผลตอบแทนพันธบัตรไทย ตั้งแต่ ${nf(pts[0][1])} เปอร์เซ็นต์ที่อายุ 3 เดือน ถึง ${nf(pts[pts.length - 1][1])} เปอร์เซ็นต์ที่อายุ 30 ปี">
          ${[1, 2, 3].map(v => `<line x1="10" x2="${W - 8}" y1="${py(v)}" y2="${py(v)}" stroke="var(--line)"/><text x="12" y="${py(v) - 3}" font-size="11" text-anchor="start" style="fill:var(--muted)">${v}%</text>`).join('')}
          <path d="${path} L${px(pts.length - 1)} ${H - 22} L${px(0)} ${H - 22}Z" fill="var(--lens-soft)" opacity=".7"/><path d="${path}" fill="none" stroke="var(--lens)" stroke-width="2.4" stroke-linejoin="round"/>
          ${pts.map(([l, v], i) => `<circle cx="${px(i)}" cy="${py(v)}" r="3.2" fill="var(--lens)"/><text x="${px(i)}" y="${H - 6}" font-size="11" text-anchor="middle" style="fill:var(--muted)">${l}</text>`).join('')}
        </svg>
        <p class="small muted" style="margin:6px 0 0">ถือนานขึ้น ผลตอบแทนต่อปีสูงขึ้น: 1 ปี <b class="num">${nf(pts[1][1])}%</b> · 5 ปี <b class="num">${nf(pts[4][1])}%</b> · 10 ปี <b class="num">${nf(pts[5][1])}%</b></p></div>
      <div class="sec-title"><h2>รุ่นอ้างอิง</h2><em>yield % · เปลี่ยนจากเมื่อวาน (bps)</em></div>
      <div class="slist">${LIVE.bonds.map(([c, n, ttm, y, bp]) => `<div class="srow static"><span class="sr-id"><b>${c}</b><span class="sub"><em>${n} · เหลือ ${ttm} ปี</em></span></span><span class="chg ${bp > 0 ? 'up' : bp < 0 ? 'down' : 'flat'}">${TRI[bp > 0 ? 'up' : bp < 0 ? 'down' : 'flat']}<span class="num">${nf(Math.abs(bp))} bps</span></span><span class="sr-px"><b class="num">${nf(y)}</b> <small>%</small></span><span></span></div>`).join('')}</div>
      <p class="small muted" style="margin:8px 20px 0">1 bps = 0.01 จุดเปอร์เซ็นต์ ▼ คือ yield ลดลงจากเมื่อวาน</p>
      <button class="promo" type="button" data-gofunds="term" style="margin-top:14px"><span class="fundico">${FUND_ICON}</span><span><b>อยากถือตราสารหนี้แบบง่ายๆ</b><span>ดู Term Fund ที่เปิดขายอยู่ในแอป</span></span>${CHEV}</button>`;
  } else {
    const f = state.sf || 'all';
    const us = Object.entries(LIVE.us).map(([s, u]) => ({sym:s, mkt:'US', sub:u.n, p:u.pc, last:u.p, cur:'USD'}));
    const thOrder = ['SCB', 'TISCO', 'CPALL', 'GULF', 'PTT', 'BDMS', 'ADVANC', 'KBANK', 'CRC', 'MINT'];
    const th = thOrder.map(t => { const own = Object.values(IPOS).find(x => x.ticker === t), q = LIVE.th[t]; return {sym:t, mkt:'TH', sub:own ? own.brand.split(' · ')[0] : LIVE.names[t], p:q.p, last:q.l, cur:'THB', open:own ? own.id : null}; });
    const mixed = [th[0], th[1], us[0], th[2], th[3], th[4], th[5], th[6]].concat(us.slice(1), th.slice(7));
    const rows = (f === 'TH' ? th : f === 'US' ? us : f === 'own' ? th.filter(r => r.open) : mixed);
    body = `<div class="cats" role="group" aria-label="กรองตามตลาด">${[['all','ทั้งหมด'],['TH','หุ้นไทย'],['US','หุ้นสหรัฐฯ'],['own','มีการ์ด Trinity 2.0']].map(([k, l]) => `<button type="button" data-sf="${k}" aria-pressed="${f === k}">${l}</button>`).join('')}</div>
      <div class="slist">${rows.map(qrow).join('')}</div>
      <div class="idxgrid" style="margin-top:14px">${Object.entries(LIVE.usIdx).map(([k, u]) => `<div class="idxmini"><span class="m">${k}</span><b class="num">${nf(u.p)}</b>${chgHTML(u.pc)}</div>`).join('')}</div>
      <p class="small muted" style="margin:10px 20px 0">หุ้นไทย ณ ${LIVE.asof} · หุ้นสหรัฐฯ ${LIVE.usAsof} · แถวที่มีลูกศรกดดูการ์ด Trinity 2.0 ได้</p>`;
  }
  return `
    <div class="topband">${appbar()}
      <section class="hero mhero" aria-label="ตลาดวันนี้"><h1>ตลาดวันนี้<br>ดูครบ<span class="hl">ในที่เดียว</span></h1><img class="hero-owl" src="${OWL}" alt="" width="120" height="120"></section>
    </div>
    <div class="seg fseg scroll"><div class="track" role="tablist" aria-label="ประเภทตลาด">${MKT_TABS.map(([k, l]) => `<button role="tab" type="button" data-mt="${k}" aria-selected="${mt === k}">${l}</button>`).join('')}</div></div>
    <div class="mbody">${body}</div>
    <div class="card" style="margin:16px 16px 0"><p class="small" style="margin:0 0 6px"><b>ที่มาของข้อมูล</b></p><ul class="fsrc">${MKT_SRC[mt].map(([u, n]) => `<li><a href="${u}">${esc(n)}</a></li>`).join('')}</ul></div>
    <p class="disclaimer">ข้อมูลนี้ Trinity 2.0 ดึงมาเก็บไว้ ณ ${LIVE.asof} ไม่ใช่ราคาเรียลไทม์ ใช้ประกอบความเข้าใจเท่านั้น ไม่ใช่คำแนะนำการลงทุน</p>`;
}

