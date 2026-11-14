const FUND_ICON = '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path d="M4 9.5L11 4l7 5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v6.5M9.3 10v6.5M12.7 10v6.5M16 10v6.5M3.5 18.5h15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
function starIcon(on){ return `<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.6l2.2 4.7 5.1.7-3.7 3.6.9 5.1L10 14.2l-4.5 2.4.9-5.1L2.7 8l5.1-.7z" fill="${on ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`; }
function starBtn(id){
  const on = state.watch.includes(id);
  return `<button type="button" class="star" data-watch="${id}" aria-pressed="${on}" aria-label="${on ? 'เลิกติดตาม ' : 'ติดตาม '}${FUNDS[id].code}">${starIcon(on)}</button>`;
}
function stockChip(id){ const s = IPOS[id]; return `<button type="button" class="hold" data-open="${id}"><b>${s.ticker}</b><span>${esc(s.brand.split(' · ')[0])}</span></button>`; }
function fundCard(id){
  const f = FUNDS[id], ix = f.index ? INDEXES[f.index] : null, st = fundStatus(f);
  const body = ix ? `
    <span class="fund-m">${esc(f.amc)} · ลงทุนตามดัชนี ${f.index}${f.type === 'ipo' ? ' · RMF' : ''}</span>
    <span class="fund-brands">${ix.stocks.slice(0, 5).map(s => `<i>${IPOS[s].ticker}</i>`).join('')}${ix.stocks.length > 5 ? `<i class="more">+${ix.stocks.length - 5}</i>` : ''}</span>
    <span class="fund-n">มีหุ้นในแอป Trinity 2.0 <b class="num">${ix.stocks.length}</b> ตัว${f.type === 'ipo' ? ' (เมื่อกองเริ่มลงทุน)' : ''}</span>`
    : `
    <span class="fund-m">${esc(f.amc)}</span>
    <span class="fund-tag">${esc(f.tag)}</span>
    <span class="fund-n">${f.min ? `ขั้นต่ำ <b class="num">${f.min.toLocaleString('en-US')}</b> บาท` : 'ขั้นต่ำดูในหนังสือชี้ชวน'} · ${f.risk ? `เสี่ยง <b class="num">${f.risk}</b>/8` : 'ระดับเสี่ยงดูในหนังสือชี้ชวน'}${f.term ? ` · อายุ <b>${f.term}</b>` : ''}</span>`;
  return `<div class="fundwrap"><button type="button" class="fund" data-fund="${id}">
    <span class="fund-top"><span class="fcode">${f.code}</span><span class="chip c-info">${f.kind}</span></span>
    <b>${esc(f.name)}</b>${body}
    ${st ? `<span class="fund-st"><span class="chip ${st.cls}">${st.label}</span><span>เสนอขาย ${fmtP(f)}</span></span>` : ''}
  </button>${starBtn(id)}</div>`;
}
const FUND_FILTERS = [['all','ทั้งหมด'],['SET50','SET50'],['SET100','SET100'],['SETHD','ปันผลสูง']];
const TYPE_INTRO = {
  general:'กองทุนเปิดที่ซื้อขายได้ต่อเนื่อง ไม่มีวันครบอายุ ตอนนี้ Trinity 2.0 แสดงกองทุนดัชนีหุ้นไทยที่ถือหุ้นแบรนด์ในแอป',
  ipo:'IPO กองทุน คือกองทุนใหม่ที่เปิดขายหน่วยลงทุนครั้งแรกในช่วงสั้นๆ ซื้อได้เฉพาะช่วงที่ บลจ. กำหนด หลังปิดขายกองถึงเริ่มลงทุนจริง',
  term:'Term Fund คือกองทุนที่มีอายุกำหนด เช่น 3 หรือ 6 เดือน ซื้อได้เฉพาะช่วงเสนอขายแล้วถือจนครบกำหนด ขายคืนก่อนอาจทำไม่ได้หรือได้เงินไม่เต็ม ส่วนมากลงทุนตราสารหนี้ ไม่ได้รับประกันผลตอบแทน'
};
const KINDS = [['all','ทั้งหมด'],['term','Term Fund'],['general','กองทุนทั่วไป']];
function fundsOfKind(k, filt){
  const all = Object.keys(FUNDS);
  const rank = id => { const f = FUNDS[id], st = fundStatus(f); return !st ? 1 : st.s === 'closed' ? 2 : 0; };
  const byClose = (a, b) => rank(a) - rank(b) || (FUNDS[a].to || '9999').localeCompare(FUNDS[b].to || '9999');
  if (k === 'term') return all.filter(id => FUNDS[id].type === 'term').sort(byClose);
  if (k === 'general') return all.filter(id => FUNDS[id].type === 'general' && (filt === 'all' || FUNDS[id].index === filt));
  return all.sort(byClose);
}
const kindCount = k => fundsOfKind(k, 'all').filter(i => { const st = fundStatus(FUNDS[i]); return !st || st.s !== 'closed'; }).length;
function fundsScreen(){
  const ft = state.ft === 'watch' ? 'watch' : 'ipo', filt = state.ff || 'all';
  const fv = state.fv || 'all';
  const soon = state.watch.filter(id => { const s = fundStatus(FUNDS[id]); return s && s.s === 'open' && s.left <= 2; });
  const watchEmpty = `<div class="card watch-empty"><img src="${OWL}" alt="" width="56" height="56"><p><b>ยังไม่ได้ติดตามกองทุนไหน</b><br>กดดาวที่มุมการ์ดกองทุนเพื่อเก็บไว้ที่นี่ จะเห็นวันปิดขายของกองที่สนใจในที่เดียว</p><button class="btn" type="button" data-ft="ipo">ดูกองทุน IPO</button></div>`;
  let body;
  if (ft === 'watch'){
    body = `${soon.length ? `<p class="ftintro warn">มี ${soon.length} กองที่ติดตามปิดขายภายใน 2 วัน: ${soon.map(id => FUNDS[id].code).join(', ')}</p>` : ''}
    <div class="sec-title"><h2>กองทุนที่ติดตาม</h2><em>${state.watch.length} กอง</em></div>
    ${state.watch.length ? `<div class="slist">${state.watch.map(fundRow).join('')}</div>` : watchEmpty}
    <p class="disclaimer">รายการที่ติดตามเก็บไว้ในเครื่องนี้เท่านั้น ข้อมูลนี้ไม่ใช่คำแนะนำการลงทุน</p>`;
  } else {
    const ids = fundsOfKind(fv, filt);
    body = `<div class="cats kinds" role="group" aria-label="ประเภทกองทุน">${KINDS.map(([k, l]) => `<button type="button" data-fv="${k}" aria-pressed="${fv === k}">${l} <span class="num">${kindCount(k)}</span></button>`).join('')}</div>
    ${fv === 'general' ? `<div class="cats" role="group" aria-label="กรองตามดัชนี">${FUND_FILTERS.map(([f, l]) => `<button type="button" data-ff="${f}" aria-pressed="${filt === f}">${l}</button>`).join('')}</div>` : ''}
    <div class="sec-title"><h2>${fv === 'all' ? 'กองทุนทั้งหมด' : fv === 'term' ? 'Term Fund' : 'กองทุนดัชนีหุ้นไทย'}</h2><em>${ids.length} กอง${fv !== 'general' ? ' · เรียงตามวันปิดขาย' : ''}</em></div>
    <p class="ftintro">${fv === 'all' ? 'รวมกองที่เปิดขายอยู่ก่อน เรียงตามวันปิดขายใกล้สุด แล้วตามด้วยกองทุนทั่วไปที่ซื้อได้ต่อเนื่อง' : TYPE_INTRO[fv]}</p>
    <div class="slist">${ids.map(fundRow).join('')}</div>
    ${fv !== 'term' ? `<div class="sec-title"><h2>ดัชนีคืออะไร</h2><em>ตะกร้าหุ้นที่ตลาดคัดให้</em></div>
    <div class="group gloss">${Object.values(INDEXES).map(ix => `<details><summary>${ix.name} <span>${esc(ix.plain)}</span></summary><p>ตลาดหลักทรัพย์ฯ ทบทวนรายชื่อทุก 6 เดือน หุ้นในแอป Trinity 2.0 ที่อยู่ในดัชนีนี้ตอนนี้: ${ix.stocks.map(s => IPOS[s].ticker).join(', ')} <a href="${ix.url}">ดูรายชื่อทั้งหมดที่ SET</a></p></details>`).join('')}</div>` : ''}
    <p class="disclaimer">${fv !== 'term' ? INDEX_ASOF + ' กองทุนดัชนีถือหุ้นตามรายชื่อในดัชนี สัดส่วนแต่ละตัวดูได้ใน Factsheet ของกองทุน ' : ''}${fv !== 'general' ? 'ช่วงเสนอขายอ่านจากรายชื่อกองทุนเปิดใหม่ ณ 10 พ.ย. 2569 ดูเงื่อนไขล่าสุดที่หนังสือชี้ชวนก่อนซื้อ ' : ''}ข้อมูลนี้ไม่ใช่คำแนะนำการลงทุน</p>`;
  }
  return `
    <div class="topband">
    ${appbar()}
    <section class="hero fundhero" aria-label="กองทุนคืออะไร">
      <h1>ไม่อยากเลือกหุ้นเอง<br>ซื้อทั้ง<span class="hl">ตะกร้า</span>ได้</h1>
      <p>กองทุนเอาเงินของหลายคนมารวมกัน แล้วให้ผู้จัดการกองทุนลงทุนแทน ซื้อกองเดียวก็ได้หลายสิบตัว</p>
      <img class="hero-owl" src="${OWL}" alt="" width="120" height="120">
    </section>
    </div>
    <div class="seg fseg two"><div class="track" role="tablist" aria-label="หมวดกองทุน">${TYPES.map(([k, l]) => `<button role="tab" type="button" data-ft="${k}" aria-selected="${ft === k}">${l}${k === 'watch' && state.watch.length ? ` <span class="num">${state.watch.length}</span>` : ''}</button>`).join('')}</div></div>
    ${body}`;
}
function fundScreen(f){
  const ix = f.index ? INDEXES[f.index] : null, st = fundStatus(f), on = state.watch.includes(f.id);
  const kv = f.type === 'general'
    ? [['ลงทุนตาม', 'ดัชนี ' + f.index], ['ความเสี่ยง', `${f.risk} <small>จาก 8</small>`], ['ซื้อยังไง', f.kind === 'ETF' ? 'ในตลาดหุ้น' : 'ผ่านแอป']]
    : [[f.term ? 'อายุกอง' : 'ปิดขาย', f.term || fmtD(f.to)], ['ขั้นต่ำ', f.min ? f.min.toLocaleString('en-US') + ' <small>บาท</small>' : '<small>ดูหนังสือชี้ชวน</small>'], ['ความเสี่ยง', f.risk ? `${f.risk} <small>จาก 8</small>` : '<small>ดูหนังสือชี้ชวน</small>']];
  const about = ix ? `ซื้อหุ้นทุกตัวใน${ix.name === 'SETHD' ? 'ดัชนีหุ้นปันผลสูง' : 'ดัชนี'} ${ix.name} คือ ${esc(ix.plain)} บริษัทใหญ่ได้สัดส่วนมากกว่า ผลตอบแทนจึงขึ้นลงใกล้เคียงดัชนี${f.what ? ' ' + esc(f.what) : ''}` : esc(f.what);
  const riskLi = f.risk ? `<li><i></i><b>ความเสี่ยงระดับ ${f.risk}</b><span>${RISK_TXT[f.risk] || 'ตัวเลขยิ่งสูงยิ่งเสี่ยง จาก 1 ถึง 8'}</span></li>` : `<li><i></i><b>ระดับความเสี่ยง</b><span>ดูในหนังสือชี้ชวนของกอง</span></li>`;
  const howLi = f.type === 'general' ? `<li><i></i><b>${esc(f.how)}</b><span>${f.kind === 'ETF' ? 'ใช้บัญชีหุ้น ราคาเปลี่ยนระหว่างวัน' : 'ซื้อขายวันละครั้งตามราคา NAV สิ้นวัน'}</span></li>` : `<li><i></i><b>${esc(f.how)}</b><span>${f.type === 'term' ? 'ขายคืนก่อนครบกำหนดอาจทำไม่ได้หรือได้เงินไม่เต็ม' : 'หลังปิดขายกองถึงเริ่มลงทุนและซื้อขายได้ตามเงื่อนไขของกอง'}</span></li>`;
  const stocks = ix
    ? `<h3 class="fh">หุ้นในแอป Trinity 2.0 ที่กองนี้ถืออยู่</h3>${f.type === 'ipo' ? `<p class="small muted fnote" style="margin:0 16px 8px">กองนี้ยังอยู่ช่วง IPO จะเริ่มซื้อหุ้นหลังปิดขาย แต่นโยบายคือลงทุนตามดัชนี ${ix.name}</p>` : ''}
    <div class="holds">${ix.stocks.map(stockChip).join('')}</div>
    <p class="small muted fnote">ยังมีหุ้นตัวอื่นในดัชนีอีก ดูรายชื่อเต็มได้ที่ <a href="${ix.url}">SET</a> · ${INDEX_ASOF}</p>`
    : `<div class="card"><p class="small" style="margin:0">${esc(f.noStocks || 'ดูรายการลงทุนในหนังสือชี้ชวน')}</p></div>`;
  return `
    <div class="topbar"><button class="back" type="button" data-backfunds aria-label="กลับไปหน้ากองทุน"><svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true"><path d="M11 3L5 9l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><span class="tbr"><span class="chip c-info">${f.kind}</span>${starBtn(f.id)}</span></div>
    <div class="ipohead">
      <div class="m">${f.code} · ${esc(f.amc)}</div>
      <h2>${esc(f.name)}</h2>
      ${st ? `<div class="m" style="margin-top:6px"><span class="chip ${st.cls}">${st.label}</span> เสนอขาย ${fmtP(f)}</div>` : ''}
      <div class="kv">${kv.map(([l, v]) => `<div><span>${l}</span><b class="num" style="font-size:${v.length > 12 ? 13 : 16}px">${v}</b></div>`).join('')}</div>
      <button type="button" class="btn watchbtn ${on ? 'on' : ''}" data-watch="${f.id}" aria-pressed="${on}">${starIcon(on)}<span>${on ? 'ติดตามอยู่ กดเพื่อเลิกติดตาม' : 'ติดตามกองนี้'}</span></button>
    </div>
    <div class="card about"><span class="chip c-info brandtag">กองนี้ทำอะไร</span>
      <p>${about}</p>
      <ul class="money">${riskLi}${howLi}</ul></div>
    ${stocks}
    <div class="card"><ul class="fsrc">${f.srcs.map(([u, n]) => `<li><a href="${u}">${esc(n)}</a></li>`).join('')}${ix ? `<li><a href="${ix.url}">รายชื่อหุ้นในดัชนี ${ix.name} (ตลาดหลักทรัพย์ฯ)</a></li>` : ''}</ul></div>
    <p class="disclaimer">Trinity 2.0 แสดงข้อมูลเพื่อให้เข้าใจกองทุน ไม่ใช่คำแนะนำให้ซื้อหรือขาย อ่านหนังสือชี้ชวนก่อนลงทุน</p>`;
}
function fundsOfStockHTML(ipo){
  const ids = fundsHolding(ipo.id);
  const inIx = Object.values(INDEXES).filter(ix => ix.stocks.includes(ipo.id)).map(ix => ix.name);
  const hasIpo = ids.some(id => FUNDS[id].type === 'ipo');
  return `
    <h3>กองทุนที่ถือหุ้นตัวนี้</h3>
    <div class="card fundsof">${ids.length ? `
      <p class="small muted" style="margin:0 0 10px">${ipo.ticker} อยู่ในดัชนี ${inIx.join(' · ')} กองทุนดัชนีเหล่านี้จึงถือ ${ipo.ticker} อยู่ด้วย</p>
      <div class="fundrow">${ids.map(id => `<button type="button" class="fchip" data-fund="${id}"><b>${FUNDS[id].code}</b><span>${FUNDS[id].index}${FUNDS[id].type === 'ipo' ? ' · IPO' : ''}</span></button>`).join('')}</div>${hasIpo ? '<p class="small muted" style="margin:8px 0 0">กองที่เป็น IPO จะเริ่มซื้อหุ้นหลังปิดขาย</p>' : ''}`
      : `<p class="small" style="margin:0">ยังไม่พบในกองทุนดัชนีที่ Trinity 2.0 ติดตาม เพราะ ${ipo.ticker} ไม่ได้อยู่ในดัชนี SET50, SET100 หรือ SETHD รอบนี้ กองทุนแบบเลือกหุ้นเองอาจถืออยู่ ดูได้จาก Factsheet ของแต่ละกองทุน</p>`}
      <p class="small muted" style="margin:10px 0 0">${INDEX_ASOF}</p></div>`;
}


