/* ---------- น้องฮูก: original mascot, drawn in SVG ---------- */
function owlSVG(){
  const SL = '#4C6F8D', SL2 = '#3D5C78', MIST = '#84A3C0', SNOW = '#F4F9FC', NIGHT = '#141F31', TEAL = '#66D3FA', AMBER = '#F1AA53';
  const chev = (x, y) => `<path d="M${x - 6} ${y} l6 5 l6 -5" fill="none" stroke="${AMBER}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `<svg viewBox="0 0 200 224" role="img" aria-label="น้องฮูก นกฮูกผู้ช่วยอ่านข่าวของ Trinity 2.0"><g class="owl"><g class="body">
    <path d="M52 62 C38 44 36 26 42 10 C54 26 68 36 84 40 Z" fill="${SL}"/><path d="M148 62 C162 44 164 26 158 10 C146 26 132 36 116 40 Z" fill="${SL}"/>
    <path d="M26 116 q-10 54 30 84 q-6-44 6-84z" fill="${SL2}"/><path d="M174 116 q10 54 -30 84 q6-44 -6-84z" fill="${SL2}"/>
    <ellipse cx="100" cy="130" rx="74" ry="84" fill="${SL}"/>
    <path d="M58 148 Q100 128 142 148 Q148 196 100 212 Q52 196 58 148 Z" fill="${SNOW}"/>
    ${chev(78, 156)}${chev(100, 150)}${chev(122, 156)}${chev(89, 174)}${chev(111, 174)}${chev(100, 192)}
    <circle cx="68" cy="94" r="31" fill="${MIST}"/><circle cx="68" cy="94" r="22" fill="${SNOW}"/>
    <circle class="pupil" cx="70" cy="96" r="10" fill="${NIGHT}"/><circle cx="74" cy="91" r="3.2" fill="#fff"/>
    <ellipse class="lid" cx="68" cy="94" rx="23" ry="23" fill="${SL}"/>
    <path d="M154 118 L178 142" stroke="${TEAL}" stroke-width="10" stroke-linecap="round"/>
    <circle cx="132" cy="92" r="31" fill="${SNOW}" stroke="${TEAL}" stroke-width="7"/>
    <circle class="pupil" cx="134" cy="95" r="14" fill="${NIGHT}"/><circle cx="140" cy="88" r="4.4" fill="#fff"/>
    <ellipse class="lid" cx="132" cy="92" rx="27.5" ry="27.5" fill="${SL}"/>
    <path d="M114 74 Q120 66 128 64" fill="none" stroke="${TEAL}" stroke-width="3" stroke-linecap="round" opacity=".7"/>
    <path class="brow brow-l" d="M46 60 Q68 50 90 60" stroke="${SL2}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path class="brow brow-r" d="M110 54 Q134 42 158 54" stroke="${SL2}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path class="jaw" d="M92 126 L108 126 L100 141 Z" fill="#C98230"/>
    <path d="M88 116 L112 116 L100 136 Z" fill="${AMBER}"/>
    <path d="M78 212v8M85 213v8M92 212v8M108 212v8M115 213v8M122 212v8" stroke="${AMBER}" stroke-width="5.5" stroke-linecap="round"/>
  </g></g></svg>`;
}

function studioSVG(){
  const bars = [44,62,52,78,70,96,84,110].map((h, i) => `<rect x="${92 + i * 26}" y="${236 - h}" width="14" height="${h}" rx="2" fill="#ECCB88" opacity="${0.18 + i * 0.05}"/>`).join('');
  const city = [[0,40],[22,64],[40,48],[58,86],[80,58],[98,104],[120,70],[140,52],[160,92],[184,62],[204,118],[228,74],[250,56],[270,96],[292,66],[312,84],[334,50],[354,72],[372,44]].map(([x, h]) => `<rect x="${x}" y="${470 - h}" width="20" height="${h}" fill="#1F1A2E"/>`).join('');
  return `<svg class="studio" viewBox="0 0 390 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="390" height="700" fill="#1A1527"/>
    <g stroke="#241E36" stroke-width="1">${Array.from({length:14}, (_, i) => `<line x1="${i * 30}" y1="0" x2="${i * 30}" y2="470"/>`).join('')}</g>
    ${city}
    <rect x="62" y="96" width="266" height="166" rx="14" fill="#1A1527" stroke="#313D57" stroke-width="2"/>
    <g stroke="#2A3248">${[130,160,190,220].map(y => `<line x1="76" y1="${y}" x2="314" y2="${y}"/>`).join('')}</g>
    ${bars}
    <polyline points="90,214 118,198 144,206 170,176 196,184 222,152 248,162 274,128 300,136" fill="none" stroke="#ECCB88" stroke-width="2.5" stroke-linejoin="round" opacity=".55"/>
    <circle cx="300" cy="136" r="4.5" fill="#ECCB88" opacity=".7"/>
    <text x="80" y="120" font-size="11" fill="#ECCB88" opacity=".7" font-family="Bai Jamjuree, sans-serif" font-weight="600" letter-spacing="1.5">TRINITY 2.0</text>
    <circle cx="70" cy="40" r="90" fill="#ECCB88" opacity=".05"/><circle cx="330" cy="60" r="110" fill="#F1AA53" opacity=".04"/>
    <rect y="470" width="390" height="230" fill="#120E1C"/>
    <ellipse cx="195" cy="470" rx="220" ry="18" fill="#ECCB88" opacity=".06"/>
  </svg>`;
}
function deskSVG(){
  return `<svg viewBox="0 0 400 96" aria-hidden="true"><path d="M8 18 H392 L372 92 H28 Z" fill="#262035"/><rect x="0" y="8" width="400" height="16" rx="6" fill="#3B4866"/><rect x="0" y="8" width="400" height="3" rx="1.5" fill="#ECCB88" opacity=".6"/>
    <rect x="132" y="40" width="136" height="32" rx="8" fill="#1A1527" stroke="#ECCB88" stroke-opacity=".5"/>
    <text x="200" y="61" text-anchor="middle" font-size="14" font-weight="700" fill="#ECCB88" font-family="Bai Jamjuree, sans-serif">Trinity ข่าว</text></svg>`;
}
function tickerHTML(){
  const items = CLAIMS.map(c => { const r = scoreClaim(c), k = r.cls === 'c-good' ? 'ok' : r.cls === 'c-crit' ? 'bad' : 'no'; return `<span>${esc(c.text)} <span class="${k}">● ${r.verdict}</span></span>`; }).join('');
  return `<div class="ticker" aria-hidden="true"><span class="tag0">ข่าวตรวจแล้ว</span><div class="run">${items}${items}</div></div>`;
}

/* ---------- voice (device text-to-speech, Thai) ---------- */
const voice = {supported:'speechSynthesis' in window, unlocked:false, muted:false, th:null, listed:false, male:false};
function pickVoice(){
  if (!voice.supported) return;
  const v = speechSynthesis.getVoices();
  if (v.length) voice.listed = true;
  const thai = v.filter(x => /^th/i.test(x.lang));
  const male = thai.find(x => /niwat|pattara|male|man\b|ชาย/i.test(x.name));
  voice.th = male || thai[0] || null;
  voice.male = !!male;
}
if (voice.supported){ pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
const canSpeakThai = () => voice.supported && !voice.muted && (voice.th || !voice.listed);
function lineChip(line){
  if (line.claim){ const c = CLAIMS.find(x => x.id === line.claim), r = scoreClaim(c); return {label:r.verdict, cls:r.cls, sub:`ตรวจข่าว: ${c.text} (ตรงกัน ${r.pct}% จาก ${r.n} แหล่ง)`}; }
  return line.chip || null;
}
function anchorEl(i){ return reelEl(i); }
function anchorShow(i, k, ms){
  const el = anchorEl(i), r = REELS[i], line = r.lines[k]; if (!el || !line) return;
  const wrap = el.querySelector('.owlwrap');
  wrap.className = 'owlwrap mood-' + (line.mood || 'neutral');
  el.querySelector('.subtitle').textContent = line.text;
  const ch = lineChip(line), low = el.querySelector('.lower');
  const tapOn = !el.querySelector('.tapstart').hidden;
  if (ch && !tapOn){ low.hidden = false; low.innerHTML = `<span class="chip ${ch.cls}">${esc(ch.label)}</span><span class="lbl">${esc(ch.sub)}</span>`; } else { low.hidden = true; low.innerHTML = ''; }
  /* keep the chip row just above the subtitle, however many lines the subtitle wraps to */
  const sub = el.querySelector('.subtitle'); low.style.bottom = (parseFloat(getComputedStyle(sub).bottom) + sub.offsetHeight + 10) + 'px';
  el.querySelector('.tapstart').style.bottom = (parseFloat(low.style.bottom) + 6) + 'px';
  el.querySelectorAll('.progress i').forEach((b, n) => {
    b.style.transition = 'none';
    b.style.width = n < k ? '100%' : '0%';
    if (n === k){ void b.offsetWidth; b.style.transition = `width ${ms}ms linear`; b.style.width = '100%'; }
  });
}
function talking(i, on){ const w = anchorEl(i) && anchorEl(i).querySelector('.owlwrap'); if (w) w.classList.toggle('talking', on); }
/* ---------- speech engine: Gemini Thai voice (via your Worker) -> device Thai voice -> subtitles ---------- */
const tts = {el:null, failUntil:0, cache:new Map()};
const TTS_URL = () => AI_ENDPOINT ? AI_ENDPOINT.replace(/\/+$/, '') + '/tts' : '';
const ttsOK = () => !!TTS_URL() && !voice.muted && Date.now() > tts.failUntil;
const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
function unlockAudio(){ if (!TTS_URL()) return; try { tts.el = tts.el || new Audio(); tts.el.src = SILENT_WAV; const p = tts.el.play(); if (p && p.catch) p.catch(() => {}); } catch(e){} }
function ttsFetch(text){
  if (!tts.cache.has(text)){
    tts.cache.set(text, fetch(TTS_URL(), {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text})})
      .then(r => { if (!r.ok) throw new Error('tts ' + r.status); return r.blob(); })
      .then(blob => URL.createObjectURL(blob))
      .catch(e => { tts.cache.delete(text); throw e; }));
  }
  return tts.cache.get(text);
}
function stopSpeech(){
  if (tts.el){ tts.el.onended = tts.el.onerror = null; try { tts.el.pause(); } catch(e){} }
  if (voice.supported) speechSynthesis.cancel();
}
/* speak one line. alive() says whether this line is still wanted; cb = {start, end, mode(name)} */
function speakLine(text, est, alive, cb){
  let ended = false;
  const end = () => { if (ended || !alive()) return; ended = true; cb.end(); };
  const timed = () => { cb.start(); setTimeout(end, est); };
  const device = () => {
    if (!alive()) return;
    if (canSpeakThai()){
      cb.mode('device'); speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'th-TH'; if (voice.th) u.voice = voice.th; u.rate = 0.98; u.pitch = voice.male ? 0.95 : 0.7;
      let started = false;
      u.onstart = () => { started = true; cb.start(); };
      u.onend = end;
      u.onerror = () => { if (alive() && !ended) timed(); };
      speechSynthesis.speak(u);
      setTimeout(() => { if (alive() && !started && !ended) timed(); }, 1500);
    } else { cb.mode(voice.muted ? 'muted' : 'nothai'); timed(); }
  };
  if (ttsOK()){
    ttsFetch(text).then(url => {
      if (!alive()) return;
      const a = tts.el = tts.el || new Audio();
      a.onended = a.onerror = null; a.src = url;
      a.onended = end;
      a.onerror = () => { tts.failUntil = Date.now() + 60000; device(); };
      a.play().then(() => { if (!alive()){ a.pause(); return; } cb.mode('gemini'); cb.start(); })
        .catch(() => { tts.failUntil = Date.now() + 60000; device(); });
    }).catch(() => { tts.failUntil = Date.now() + 60000; device(); });
  } else device();
}
const MODE_NOTE = {gemini:'', device:'', muted:'ปิดเสียงอยู่ แสดงซับแทน', nothai:'เครื่องนี้ไม่มีเสียงภาษาไทย แสดงซับแทน'};
function anchorPlay(i, k){
  const r = REELS[i]; if (!r || k >= r.lines.length){ player.running = false; talking(i, false); const el = anchorEl(i); if (el){ el.querySelector('.tapstart').hidden = false; el.querySelector('.lower').hidden = true; el.querySelector('.tapstart span').textContent = 'ฟังอีกครั้ง'; } return; }
  anaStop();
  const token = ++player.token; player.line = k; player.running = true;
  const text = r.lines[k].text, est = Math.max(2200, text.length * 85);
  anchorShow(i, k, est);
  const el = anchorEl(i), note = el.querySelector('.voicenote');
  if (r.lines[k + 1] && ttsOK()) ttsFetch(r.lines[k + 1].text).catch(() => {});
  speakLine(text, est, () => token === player.token, {
    start: () => talking(i, true),
    end: () => { talking(i, false); setTimeout(() => { if (token === player.token) anchorPlay(i, k + 1); }, 380); },
    mode: m => { const t = MODE_NOTE[m]; note.hidden = !t; note.textContent = t || ''; }
  });
}
function anchorStop(){ player.token++; player.running = false; stopSpeech(); talking(player.reel, false); }
function anchorReset(i){
  const el = anchorEl(i); if (!el) return;
  anchorShow(i, 0, 0);
  el.querySelectorAll('.progress i').forEach(b => { b.style.transition = 'none'; b.style.width = '0%'; });
  const tap = el.querySelector('.tapstart');
  if (voice.unlocked){ tap.hidden = true; anchorPlay(i, 0); }
  else { tap.hidden = false; el.querySelector('.lower').hidden = true; tap.querySelector('span').textContent = 'แตะเพื่อฟังน้องฮูก'; }
}
async function rewriteWithAI(i, btn){
  const r = REELS[i], ipo = IPOS[r.ipo];
  const sample = await getSampler();
  const el = anchorEl(i), note = el.querySelector('.voicenote');
  if (!sample){ note.hidden = false; note.textContent = 'ยังไม่ได้เชื่อม AI ใส่ AI_ENDPOINT ในโค้ด หรือเปิดหน้านี้บน claude.ai'; return; }
  btn.disabled = true; note.hidden = false; note.textContent = 'AI กำลังเขียนบทจากการ์ดและผลตรวจข่าว...';
  const claims = CLAIMS.filter(c => c.stock === r.ipo).map(c => ({id:c.id, ข่าว:c.text, ผลตรวจ:scoreClaim(c).verdict}));
  try {
    const v = await sample.json('คุณคือ "น้องฮูก" นกฮูกผู้ช่วยอ่านข่าวของแอป Trinity 2.0 น้ำเสียงเป็นกันเองแต่น่าเชื่อถือ ใช้ครับ เขียนบทคลิปสั้นภาษาไทย 5 ถึง 6 บรรทัด แต่ละบรรทัดไม่เกิน 110 ตัวอักษร พูดเป็นภาษาพูดที่อ่านออกเสียงได้ ใช้เฉพาะข้อมูลที่ให้มา ห้ามแนะนำให้ซื้อ ขาย หรือจอง ห้ามคาดการณ์ราคา ข่าวที่ผลตรวจไม่ใช่ "น่าเชื่อถือ" ต้องพูดชัดว่ายังยืนยันไม่ได้หรือข้อมูลยังขัดกัน บรรทัดสุดท้ายชวนให้เปิดการ์ดอ่านก่อนตัดสินใจ ตอบเป็น JSON เท่านั้น รูปแบบ {"lines":[{"text":"...","mood":"neutral|concerned|happy","claim":"id ของข่าวที่พูดถึง หรือ null"}]}\n\nข้อมูลการ์ด: ' + context(ipo) + '\n\nผลตรวจข่าว: ' + JSON.stringify(claims), {modelTier:'default', cache:false});
    const ok = v && Array.isArray(v.lines) && v.lines.length >= 3 && v.lines.length <= 8 && v.lines.every(l => typeof l.text === 'string' && l.text.length > 0 && l.text.length <= 160);
    if (!ok) throw new Error('bad');
    r.lines = v.lines.map(l => ({text:l.text, mood:['neutral','concerned','happy'].includes(l.mood) ? l.mood : 'neutral', claim:CLAIMS.some(c => c.id === l.claim) ? l.claim : undefined}));
    voice.unlocked = true; state.reel = i; rerender();
  } catch(e){
    note.textContent = e && e.code === 'rate_limited' ? 'ขอบทใหม่ถี่เกินไป รอสักครู่แล้วลองใหม่' : 'AI เขียนบทไม่สำเร็จ ใช้บทเดิมไปก่อน';
    btn.disabled = false;
  }
}

function sceneHTML(reel, sc){
  const ipo = reel.ipo ? IPOS[reel.ipo] : null;
  switch (sc.type){
    case 'hook': return `${sc.img ? `<img class="reel-art" src="${sc.img}" alt="${esc(sc.alt || '')}">` : ''}<h2>${esc(sc.h)}</h2><p class="sub">${esc(sc.sub)}</p>`;
    case 'dots': return `<div class="big red num" style="font-size:60px" data-count="${sc.hit}" data-suffix=" จาก ${sc.total}">${esc(sc.big)}</div><p class="sub">${esc(sc.label)}</p><div class="dots" aria-hidden="true">${Array.from({length:sc.total}, (_, i) => `<i class="${i < sc.hit ? 'hit' : ''}" style="transition-delay:${0.3 + i * 0.08}s"></i>`).join('')}</div><p class="src">${esc(sc.src)}</p>`;
    case 'split': return `<div class="big red num" data-count="${parseInt(sc.big)}" data-suffix="%">${esc(sc.big)}</div><p class="sub">${esc(sc.label)}</p><div class="split" style="--w:${sc.w}%"><i></i></div><div class="splitlab"><span>${esc(sc.left)}</span><span>${esc(sc.right)}</span></div><p class="src">${esc(sc.src)}</p>`;
    case 'compare': return `<p class="sub" style="font-size:18px;color:#F2F6FA;font-weight:600">${esc(sc.label)}</p><div class="cmp2 num"><span class="from">${esc(sc.from)}<small>${esc(sc.fromNote)}</small></span><span aria-hidden="true" style="font-size:32px;color:#8FA1B5">→</span><span class="to">${esc(sc.to)}<small>${esc(sc.toNote)}</small></span></div><p class="src">${esc(sc.src)}</p>`;
    case 'ring': return `<div>${ring(ipo, 150)}</div><h2 style="font-size:28px">${esc(sc.h)}</h2><p class="sub">${esc(sc.sub)}</p>`;
    case 'checks': return `<h2 style="font-size:24px">6 เรื่องที่ Trinity 2.0 ตรวจ</h2><ul class="reelchecks">${CHECKS.map((k, i) => `<li style="transition-delay:${0.2 + i * 0.35}s"><i></i>${k.label}</li>`).join('')}</ul>`;
    case 'ask': return `<h2 style="font-size:26px">ก่อนตัดสินใจ ถามเรื่องนี้</h2><ol class="reelqs">${ipo.questions.map(q => `<li>${esc(q)}</li>`).join('')}</ol><button class="cta" type="button" data-opencard="${ipo.id}">เปิดการ์ดเต็ม</button>`;
  }
  return '';
}
function anchorHTML(r, i){
  return `<section class="reel anchor" data-reel="${i}" aria-label="คลิป ${esc(r.title)}">
      <div class="progress" aria-hidden="true">${r.lines.map(() => '<span><i></i></span>').join('')}</div>
      ${studioSVG()}
      ${tickerHTML()}
      <div class="ai-label">บทและเสียงสร้างโดย AI</div>
      <div class="anchor-stage"><div class="owlbox"><div class="owlwrap mood-neutral">${owlSVG()}</div><div class="desk">${deskSVG()}</div></div><div class="anchor-name">น้องฮูก ผู้ช่วยอ่านข่าวของ Trinity 2.0</div></div>
      <div class="lower" hidden></div>
      <div class="voicenote" hidden></div>
      <div class="subtitle" aria-live="polite">${esc(r.lines[0].text)}</div>
      <button class="tapstart" type="button" data-tapstart="${i}"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2v12l11-6z" fill="currentColor"/></svg><span>แตะเพื่อฟังน้องฮูก</span></button>
      <div class="reel-meta"><b>${esc(r.title)}</b><small>${r.ipo ? 'เล่าจากการ์ดและผลตรวจข่าว ' : ''}ไม่ใช่คำแนะนำการลงทุน</small></div>
      <div class="reel-side">
        <button type="button" data-mute aria-pressed="${voice.muted}" aria-label="เปิดหรือปิดเสียง">${voice.muted ? '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 8h3l4-3v10l-4-3H3z" fill="currentColor"/><path d="M13 7l5 6M18 7l-5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' : '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 8h3l4-3v10l-4-3H3z" fill="currentColor"/><path d="M13 7.5a3.5 3.5 0 010 5M15 5.5a6.5 6.5 0 010 9" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>'}</button><span>เสียง</span>
        ${r.ipo ? `<button type="button" data-rewrite="${i}" aria-label="ให้ AI เขียนบทใหม่"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2l1.8 4.2L16 8l-4.2 1.8L10 14l-1.8-4.2L4 8l4.2-1.8z" fill="currentColor"/><path d="M15.5 13l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z" fill="currentColor"/></svg></button><span>บทใหม่</span>
        <button type="button" class="buy" data-buy="${r.ipo}" data-from="${i}" aria-label="ซื้อหุ้น ${IPOS[r.ipo].ticker} แบบจำลอง"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M2.5 3.5h2.2l1.9 9h8.6l1.6-6.3H6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="16" r="1.4" fill="currentColor"/><circle cx="14.2" cy="16" r="1.4" fill="currentColor"/></svg></button><span>ซื้อ</span><button type="button" data-opencard="${r.ipo}" aria-label="เปิดการ์ดเต็มของ ${IPOS[r.ipo].ticker}"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6.5 8h7M6.5 11h7M6.5 14h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button><span>การ์ด</span>` : ''}
      </div>
    </section>`;
}
