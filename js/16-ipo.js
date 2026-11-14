function ipoScreen(ipo){
  const tabs = [['summary','สรุป'],['fin','งบ'],['news','ข่าว'],['ai','ถาม AI']];
  return `
    <div class="topbar"><button class="back" type="button" data-back aria-label="กลับหน้าแรก"><svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true"><path d="M11 3L5 9l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><span class="chip c-info">งบจริงปี 2568</span></div>
    <div class="ipohead">
      <div class="m">${esc(ipo.brand)} · ${ipo.ticker} · ${ipo.market} · หมวด${esc(ipo.sector)}</div>
      <h2>${esc(ipo.name)}</h2>
      <div class="m">${ipo.when}</div>
      <div class="kv">${ipo.kv.map(([l, v, u]) => `<div><span>${l}</span><b class="num">${v} <small>${u}</small></b></div>`).join('')}</div>
    </div>
    <div class="seg"><div class="track" role="tablist" aria-label="หัวข้อในการ์ด">${tabs.map(([k, l]) => `<button role="tab" type="button" data-tab="${k}" aria-selected="${state.tab === k}">${l}</button>`).join('')}</div></div>
    <div class="tab">${({summary, fin, news, ai})[state.tab](ipo)}</div>
    <p class="disclaimer">การ์ดนี้ให้ข้อมูลประกอบการตัดสินใจ ไม่ใช่คำแนะนำให้ซื้อหรือไม่ซื้อ</p>`;
}

const SIG_ICON = {
  crit:'<svg class="ico" viewBox="0 0 22 22" aria-hidden="true"><path d="M7.2 2h7.6L20 7.2v7.6L14.8 20H7.2L2 14.8V7.2z" fill="var(--crit-soft)" stroke="var(--crit)" stroke-width="1.6" stroke-linejoin="round"/><path d="M11 6.5v5.5" stroke="var(--crit)" stroke-width="2" stroke-linecap="round"/><circle cx="11" cy="15.3" r="1.2" fill="var(--crit)"/></svg>',
  warn:'<svg class="ico" viewBox="0 0 22 22" aria-hidden="true"><path d="M11 2.8L20.4 19H1.6z" fill="var(--warn-soft)" stroke="var(--warn-fill)" stroke-width="1.6" stroke-linejoin="round"/><path d="M11 8.5v4.6" stroke="var(--warn)" stroke-width="2" stroke-linecap="round"/><circle cx="11" cy="16" r="1.2" fill="var(--warn)"/></svg>'
};
const SMALL_CHEV = '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M3.5 1.5L7 5l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function summary(ipo){
  const n = foundCount(ipo), v = Object.values(ipo.checks), nc = v.filter(x => x === 'crit').length, na = v.filter(x => x === 'na').length;
  return `
    ${anaCard(ipo)}
    <div class="card about"><span class="chip c-info brandtag">บริษัทนี้ทำอะไร</span><p>${esc(ipo.what)}</p>
      <ul class="money">${ipo.how.map(([a, b]) => `<li><i></i><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join('')}</ul></div>
    <div class="card">
      <div class="verdict">${ring(ipo, 112)}<div><div class="label">เรื่องที่ควรรู้ จาก 6 เรื่องที่ตรวจ</div><div class="count">${n ? `รุนแรง <b class="num">${nc}</b> · ควรระวัง <b class="num">${n - nc}</b>` : 'ยังไม่พบ'}</div><p>${na ? `อีก ${na} เรื่องยังไม่มีข้อมูล` : 'ตรวจครบทั้ง 6 เรื่อง'}</p></div></div>
      <ul class="legend">${CHECKS.map(k => { const st = ipo.checks[k.key]; return `<li class="${st === 'na' ? 's-na' : ''}"><i class="i-${st}"></i>${k.label}${st === 'na' ? ' (ยังไม่มีข้อมูล)' : ''}</li>`; }).join('')}</ul>
      <p class="summary-text">${esc(ipo.summary)}</p>
    </div>
    ${ipo.after ? `<div class="card outcome"><h3>หลังเข้าตลาดจริง</h3><p class="small muted" style="margin:2px 0 0">การ์ดใช้เฉพาะข้อมูลก่อนวันจอง ${ipo.when.replace('จอง ', '')} ส่วนนี้คือสิ่งที่เกิดขึ้นจริง</p><ul class="timeline">${ipo.after.map(a => `<li>${esc(a.text)} <a class="small" href="${SRC[a.src].url}">${SRC[a.src].outlet}</a></li>`).join('')}</ul></div>` : ''}
    <h3>เรื่องที่ต้องระวัง</h3>
    ${ipo.signals.length ? '' : `<div class="group"><div class="calm"><svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="9.2" fill="var(--good-soft)" stroke="var(--good)" stroke-width="1.6"/><path d="M7 11.3l2.7 2.7L15.2 8.4" fill="none" stroke="var(--good)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>ยังไม่พบเรื่องที่ต้องระวังจากข้อมูลที่มี แต่ยังมี ${na} เรื่องที่การ์ดนี้ยังไม่ได้ตรวจ ดูที่วงแหวนสีเทา</span></div></div>`}
    <div class="group"${ipo.signals.length ? '' : ' hidden'}>${ipo.signals.map((sg, i) => `<div class="sig ${sg.level}">${SIG_ICON[sg.level] || SIG_ICON.warn}<div><span class="lvl">${sg.level === 'crit' ? 'รุนแรง' : 'ควรระวัง'}</span><b>${esc(sg.title)}</b><p>${esc(sg.text)}</p><button class="textbtn" type="button" aria-expanded="false" aria-controls="src-${i}" data-src>${SMALL_CHEV}ดูที่มาของตัวเลข</button><div class="srcnote" id="src-${i}" hidden>${esc(sg.src)}</div></div></div>`).join('')}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="ghostbtn" type="button" data-buycard="${ipo.id}"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M2.5 3.5h2.2l1.9 9h8.6l1.6-6.3H6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="16" r="1.4" fill="currentColor"/><circle cx="14.2" cy="16" r="1.4" fill="currentColor"/></svg>ซื้อจำลอง</button><button class="ghostbtn" type="button" data-reelof="${ipo.id}"><svg width="18" height="18" viewBox="0 0 22 22" aria-hidden="true"><rect x="4" y="2.5" width="14" height="17" rx="3.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 8l5 3-5 3z" fill="currentColor"/></svg>ดูการ์ดนี้เป็นคลิปสั้น</button></div>
    <h3>จุดแข็ง</h3>
    <div class="card"><ul class="list">${ipo.strengths.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
    <h3>คำถามที่ควรถามก่อนตัดสินใจ</h3>
    <div class="card"><ol class="list">${ipo.questions.map(x => `<li>${esc(x)}</li>`).join('')}</ol></div>
    ${fundsOfStockHTML(ipo)}`;
}

function profitBars(ipo){
  const f = ipo.fin, v = f.profit, W = 330, H = 200, top = 34, h = 120, max = Math.max(...v) * 1.1, colW = (W - 20) / v.length;
  let o = `<svg class="bars" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${ipo.fin.title || 'กำไรสุทธิ'}ของ ${ipo.ticker}"><defs><pattern id="est-${ipo.id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="var(--slate-soft)"/><line x1="0" y1="0" x2="0" y2="6" stroke="var(--slate)" stroke-width="2.4"/></pattern></defs>`;
  o += `<line x1="0" x2="${W}" y1="${top + h}" y2="${top + h}" stroke="var(--line)"/>`;
  v.forEach((x, i) => {
    const w = Math.min(colW * 0.56, 64), bh = x / max * h, bx = 10 + i * colW + (colW - w) / 2, y = top + h - bh, est = (f.est || []).includes(i);
    const grow = i ? Math.round((x / v[i - 1] - 1) * 1000) / 10 : null;
    o += `<rect x="${bx}" y="${y}" width="${w}" height="${bh}" rx="4" fill="${est ? `url(#est-${ipo.id})` : grow !== null && grow < 0 ? 'var(--crit)' : 'var(--slate)'}"/>`;
    o += `<text class="v num" x="${bx + w / 2}" y="${y - 8}" font-size="12" text-anchor="middle">${est ? '≈' : ''}${fmt(x)}</text>`;
    o += `<text x="${bx + w / 2}" y="${top + h + 18}" font-size="12" text-anchor="middle">${f.labels[i]}</text>`;
    if (grow !== null) o += `<text x="${bx + w / 2}" y="${top + h + 34}" font-size="11.5" text-anchor="middle" style="fill:${grow < 0 ? 'var(--crit)' : 'var(--good)'};font-weight:600">${grow > 0 ? '+' : ''}${grow}%</text>`;
  });
  return o + '</svg>';
}
function fin(ipo){
  const f = ipo.fin;
  return `
    <div class="card">
      <h3>${f.title || 'กำไรสุทธิ'} ${f.labels.length > 1 ? f.labels.length + ' ปี ' : 'ปี ' + f.labels[0] + ' '}(ล้านบาท)</h3>
      <p class="small muted" style="margin-bottom:8px">แท่งลายคือปีที่ Trinity 2.0 คำนวณย้อนจากอัตราการเติบโตที่สื่อรายงาน แท่งแดงคือปีที่กำไรลดลง</p>
      ${profitBars(ipo)}
      <p class="small muted" style="margin-top:6px">ที่มา: ${f.src}</p>
    </div>
    <div class="card"><h3>ตัวเลขสำคัญ</h3>${f.metrics.map(([a, b]) => `<div class="metric"><span>${a}</span><b class="num">${b}</b></div>`).join('')}</div>
    ${ipo.pe ? `<div class="card"><h3>ราคาเทียบกับกลุ่ม (P/E)</h3>
      <div class="pe-row"><span>${ipo.ticker}</span><div class="pe-bar me" style="width:80%"></div><span class="num">${ipo.pe} เท่า</span></div>
      <div class="pe-row"><span>${esc(ipo.peerName)}</span><div class="pe-bar" style="width:80%"></div><span class="num">≈${ipo.peerPe} เท่า</span></div>
      <p class="small muted" style="margin-top:8px">${esc(ipo.peNote)}</p></div>` : `<div class="card"><h3>ราคาเทียบกับกลุ่ม (P/E)</h3><p>ยังไม่มีข้อมูล P/E จากแหล่งที่ตรวจแล้ว การ์ดจึงขึ้นเรื่องนี้เป็นสีเทา</p></div>`}`;
}

function news(ipo){
  const claims = CLAIMS.filter(c => c.stock === ipo.id);
  return `
    <div class="rule"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.2" fill="none" stroke="var(--slate)" stroke-width="1.6"/><path d="M10 9v5" stroke="var(--slate)" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="6.2" r="1.1" fill="var(--slate)"/></svg><div><b>เกณฑ์</b> นับเฉพาะสื่อที่เป็นอิสระต่อกัน ข่าวประชาสัมพันธ์ฉบับเดียวกันที่ลงหลายเว็บนับเป็น 1 แหล่ง ข่าวจะขึ้นว่า "น่าเชื่อถือ" เมื่อมีอย่างน้อย 2 แหล่งและตรงกันอย่างน้อย 80%</div></div>
    <h3>ข่าวของ ${ipo.ticker} ที่ตรวจแล้ว</h3>
    <div class="group">${claims.map(c => { const r = scoreClaim(c); const barCol = r.cls === 'c-good' ? 'var(--good)' : r.cls === 'c-crit' ? 'var(--crit)' : 'var(--warn)';
      return `<div class="claim">
        <div class="claim-top"><b>${esc(c.text)}</b><span class="chip ${r.cls}">${r.verdict}</span></div>
        <div class="meter" aria-hidden="true"><i style="width:${r.pct}%;background:${barCol}"></i></div>
        <div class="small muted num">ตรงกัน ${r.pct}% จาก ${r.n} แหล่งที่เป็นอิสระ</div>
        ${c.why ? `<div class="why">${esc(c.why)}</div>` : ''}
        <div class="srcs">${c.topicSources.map(id => `<a href="${SRC[id].url}" class="${c.copies.includes(id) ? 'copy' : c.disagree.includes(id) ? 'disagree' : 'agree'}" title="${esc(SRC[id].title)}">${SRC[id].outlet}${c.copies.includes(id) ? ' (สำเนา)' : ''}</a>`).join('')}</div>
      </div>`; }).join('')}</div>
    <div class="card"><h3>ได้ข่าวมาจากที่อื่น ลองวางตรวจ</h3>
      <p class="small muted" style="margin-bottom:10px">AI จะเทียบกับข่าวที่รวบรวมไว้ด้านบน แล้วบอกว่าตรงกัน ขัดกัน หรือยังยืนยันไม่ได้</p>
      <textarea id="pasted" aria-label="ข้อความข่าวที่ต้องการตรวจ" placeholder="เช่น ${ipo.ticker} ปันผลปีนี้ 5 บาท"></textarea>
      <div style="display:flex;gap:8px;align-items:center;margin-top:8px"><button class="btn" type="button" id="checknews">ตรวจข่าวนี้</button><span class="offline" id="newsstatus"></span></div>
      <div id="newsresult" class="small" style="margin-top:8px"></div>
    </div>`;
}

