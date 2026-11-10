/* ================= pieces ================= */
function ring(ipo, size){
  const r = size * 0.38, c = size / 2, C = 2 * Math.PI * r, seg = C / 6, gap = size > 60 ? 6 : 4;
  const col = {crit:'var(--crit)', warn:'var(--warn-fill)', ok:'var(--good)', na:'var(--na)'};
  const found = CHECKS.filter(k => ['crit','warn'].includes(ipo.checks[k.key])).length;
  let s = `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="พบสัญญาณเตือน ${found} จาก 6 เรื่อง">`;
  CHECKS.forEach((k, i) => {
    s += `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${col[ipo.checks[k.key]]}" stroke-width="${size * 0.11}" stroke-dasharray="${seg - gap} ${C - seg + gap}" stroke-dashoffset="${-i * seg}" transform="rotate(-90 ${c} ${c})" stroke-linecap="butt"/>`;
  });
  s += `<text x="${c}" y="${c + size * 0.08}" text-anchor="middle" font-size="${size * 0.26}" font-weight="700" fill="var(--ink)">${found}<tspan font-size="${size * 0.14}" fill="var(--muted)">/6</tspan></text></svg>`;
  return s;
}
function foundCount(ipo){ return CHECKS.filter(k => ['crit','warn'].includes(ipo.checks[k.key])).length; }
function levelChip(ipo){
  const n = foundCount(ipo), crit = Object.values(ipo.checks).includes('crit');
  return `<span class="chip ${n === 0 ? 'c-good' : crit ? 'c-crit' : 'c-warn'}">${n ? 'พบ ' + n + ' สัญญาณ' : 'ไม่พบสัญญาณ'}</span>`;
}

function bars(ipo){
  const f = ipo.fin, W = 330;
  if (f.kind === 'quarters'){
    const vals = f.profit, max = Math.max(...vals), min = Math.min(...vals, 0), span = max - min, h = 130, top = 26;
    const base = top + h * (max / span), colW = (W - 10) / vals.length;
    let s = `<svg class="bars" viewBox="0 0 ${W} 200" width="100%" role="img" aria-label="กำไรสุทธิรายไตรมาสของ ${ipo.ticker}">`;
    s += `<defs><pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="var(--muted)" stroke-width="2"/></pattern></defs>`;
    s += `<line x1="0" x2="${W}" y1="${base}" y2="${base}" stroke="var(--line)"/>`;
    vals.forEach((v, i) => {
      const x = 5 + i * colW + colW * 0.2, w = colW * 0.6, bh = Math.max(Math.abs(v) / span * h, 2), y = v >= 0 ? base - bh : base;
      const fill = i === f.after ? 'url(#hatch)' : i === f.hot ? 'var(--crit)' : v < 0 ? 'var(--na)' : 'var(--slate)';
      s += `<rect x="${x}" y="${y}" width="${w}" height="${bh}" rx="3" fill="${fill}"/>`;
      s += `<text class="v num" x="${x + w / 2}" y="${v >= 0 ? y - 5 : y + bh + 13}" font-size="11.5" text-anchor="middle">${fmt(v)}</text>`;
      s += `<text x="${x + w / 2}" y="194" font-size="11" text-anchor="middle">${f.labels[i]}</text>`;
    });
    return s + '</svg>';
  }
  const row = (vals, top, h, label, hotOn) => {
    const max = Math.max(...vals, 0), min = Math.min(...vals, 0), span = (max - min) || 1, base = top + h * (max / span), colW = (W - 60) / vals.length;
    let o = `<text x="0" y="${top + h / 2 + 4}" font-size="12" style="fill:var(--ink);font-weight:600">${label}</text><line x1="60" x2="${W}" y1="${base}" y2="${base}" stroke="var(--line)"/>`;
    vals.forEach((v, i) => {
      const x = 60 + i * colW + colW * 0.2, w = colW * 0.6, bh = Math.max(Math.abs(v) / span * h, 2), y = v >= 0 ? base - bh : base;
      const fill = hotOn && i === ipo.fin.hot ? 'var(--crit)' : v < 0 ? 'var(--na)' : 'var(--slate)';
      o += `<rect x="${x}" y="${y}" width="${w}" height="${bh}" rx="3" fill="${fill}"/><text class="v num" x="${x + w / 2}" y="${v >= 0 ? y - 4 : y + bh + 12}" font-size="11" text-anchor="middle">${fmt(v)}</text>`;
    });
    return o;
  };
  let s = `<svg class="bars" viewBox="0 0 ${W} 220" width="100%" role="img" aria-label="รายได้และกำไรสุทธิ 5 ปีของ ${ipo.ticker}">`;
  s += row(f.revenue, 18, 60, 'รายได้', false) + row(f.profit, 112, 60, 'กำไรสุทธิ', true);
  const colW = (W - 60) / f.labels.length;
  f.labels.forEach((l, i) => { s += `<text x="${60 + i * colW + colW / 2}" y="214" font-size="11" text-anchor="middle">${l}</text>`; });
  return s + '</svg>';
}

/* ================= screens ================= */
/* ================= shared pieces: rows, header, wallet ================= */
const TRI = {up:'<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 1.5L9 8H1z" fill="currentColor"/></svg>', down:'<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 8.5L1 2h8z" fill="currentColor"/></svg>', flat:'<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 5h7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'};
const CHEV = '<svg class="chev" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M5 2.5L9.5 7 5 11.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const flag = k => `<i class="flag ${k.toLowerCase()}" role="img" aria-label="${k === 'TH' ? 'ไทย' : 'สหรัฐฯ'}"></i>`;
function chgHTML(p){
  const k = p > 0.004 ? 'up' : p < -0.004 ? 'down' : 'flat';
  return `<span class="chg ${k}" aria-label="${k === 'up' ? 'เพิ่มขึ้น' : k === 'down' ? 'ลดลง' : 'ไม่เปลี่ยน'} ${nf(Math.abs(p))} เปอร์เซ็นต์">${TRI[k]}<span class="num">${nf(Math.abs(p))} %</span></span>`;
}
/* one row of the market-style list: ticker + flag/subtitle | change | price | chevron */
function qrow({sym, mkt, sub, p, last, cur, open, badge, pre}){
  const body = `
    <span class="sr-id"><b>${pre || ''}${esc(sym)}${badge || ''}</b><span class="sub">${flag(mkt)}<em>${esc(sub || mkt)}</em></span></span>
    ${chgHTML(p)}
    <span class="sr-px"><b class="num">${nf(last)}</b> <small>${cur}</small></span>
    ${open ? CHEV : '<span></span>'}`;
  return open ? `<button type="button" class="srow" data-open="${open}" data-find="${esc((sym + ' ' + (sub || '')).toLowerCase())}">${body}</button>` : `<div class="srow static">${body}</div>`;
}
function stockRow(id){
  const s = IPOS[id], q = LIVE.th[s.ticker], n = foundCount(s), crit = Object.values(s.checks).includes('crit');
  const badge = `<span class="sgn ${n === 0 ? 'ok' : crit ? 'crit' : 'warn'}">${n ? 'ควรรู้ ' + n : 'ไม่พบ'}</span>`;
  const sub = s.brand.split(' · ')[0];
  const html = q ? qrow({sym:s.ticker, mkt:'TH', sub, p:q.p, last:q.l, cur:'THB', open:id, badge}) : qrow({sym:s.ticker, mkt:'TH', sub, p:0, last:s.simPrice, cur:'THB', open:id, badge});
  return html.replace('class="srow"', `class="srow" data-cat="${s.cat}"`);
}
function fundShort(f){
  const st = fundStatus(f); if (!st) return '';
  return st.s === 'closed' ? 'ปิดขายแล้ว' : st.s === 'soon' ? 'เปิด ' + fmtD(f.from) : st.left === 0 ? 'ปิดขายวันนี้' : 'ปิดใน ' + st.left + ' วัน';
}
function fundRow(id){
  const f = FUNDS[id], st = fundStatus(f);
  const right = f.type === 'general' ? `<b>${f.kind === 'ETF' ? 'ETF' : 'กองดัชนี'}</b><small>ตาม ${f.index}</small>` : `<span class="chip ${st.cls}">${fundShort(f)}</span><small>${f.min ? 'ขั้นต่ำ ' + f.min.toLocaleString('en-US') : f.term || ''}</small>`;
  return `<div class="srow-wrap"><button type="button" class="srow fr" data-fund="${id}" data-find="${esc((f.code + ' ' + f.name).toLowerCase())}">
    <span class="sr-id"><b>${f.code}</b><span class="sub"><em>${esc(f.type === 'general' ? f.amc.replace('บลจ.', '') + ' · ' + f.name.replace(/^กองทุนเปิด\s*/, '') : f.tag)}</em></span></span>
    <span class="rk"><small>เสี่ยง</small><b class="num">${f.risk || '–'}</b></span>
    <span class="fr-r">${right}</span>
  </button>${starBtn(id)}</div>`;
}
function appbar(){
  const w = walletState();
  return `<header class="appbar">
    <button class="profbtn" type="button" data-profile aria-label="เปิดโปรไฟล์ เติมเงิน และตั้งค่า เงินพร้อมลงทุน ${nf(w.bal)} บาท">
      <span class="av" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="7.5" r="3.6" fill="currentColor"/><path d="M3.8 19c.6-4 3.5-6 7.2-6s6.6 2 7.2 6" fill="currentColor"/></svg></span>
      <span class="who"><small>เงินพร้อมลงทุน</small><b class="num">฿ ${nf(w.bal)}</b></span>${CHEV}
    </button>
    <button class="topupbtn" type="button" data-topup aria-label="เติมเงิน"><svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>เติมเงิน</button>
  </header>`;
}

/* wallet, theme and toast: demo only, kept in this browser */
function walletState(){
  if (!state.wallet){
    try { const w = JSON.parse(localStorage.getItem('owly.wallet')); if (w && typeof w.bal === 'number' && Array.isArray(w.tx)) state.wallet = w; } catch(e){}
    if (!state.wallet) state.wallet = {bal:2000, tx:[{d:'2026-11-10', k:'in', a:2000, m:'เงินตั้งต้นของบัญชีทดลอง'}]};
  }
  return state.wallet;
}
function saveWallet(){ try { localStorage.setItem('owly.wallet', JSON.stringify(state.wallet)); } catch(e){} }
function setTheme(v){
  const r = document.documentElement; if (v === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', v);
  try { localStorage.setItem('owly.theme', v); } catch(e){}
}
function getTheme(){ try { return localStorage.getItem('owly.theme') || 'auto'; } catch(e){ return 'auto'; } }
setTheme(getTheme());
let toastT = 0;
function toast(msg){
  const t = document.getElementById('toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2600);
}
function getPrefs(){ try { return JSON.parse(localStorage.getItem('owly.prefs')) || {}; } catch(e){ return {}; } }

