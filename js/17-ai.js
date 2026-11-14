const SUGGEST = {
  cpall:['เซเว่นหาเงินจากไหนบ้าง','ปันผล 1.65 บาท ถือ 100 หุ้นได้เท่าไร','สรุปให้เพื่อนฟังใน 3 บรรทัด'],
  advanc:['ทำไมปันผลปีนี้สูงผิดปกติ','สรุปให้เพื่อนฟังใน 3 บรรทัด'],
  cbg:['ขายได้มากขึ้น ทำไมกำไรลด','ราคาเหวี่ยงแรงหมายความว่าอะไร','สรุปให้เพื่อนฟังใน 3 บรรทัด']
};
const SUGGEST_DEFAULT = ['บริษัทนี้หาเงินจากไหน','สรุปให้เพื่อนฟังใน 3 บรรทัด'];
const CANNED = {
  'เซเว่นหาเงินจากไหนบ้าง':'CPALL หาเงินจาก 3 ส่วน: ร้าน 7-Eleven ราว 15,900 สาขา ค้าส่งค้าปลีกผ่านแม็คโครและโลตัส (CPAXT ที่ถือ 60%) และธุรกิจอื่นในเครือ\nที่มา: ฐานเศรษฐกิจ, InnovestX',
  'ปันผล 1.65 บาท ถือ 100 หุ้นได้เท่าไร':'100 × 1.65 = 165 บาท ก่อนหักภาษี 10% เหลือ 148.50 บาท และต้องถือหุ้นก่อนวัน XD 30 เม.ย. 2569\nที่มา: Share2Trade',
  'ทำไมปันผลปีนี้สูงผิดปกติ':'ปันผลปี 2568 รวม 34.30 บาท มาจากปันผลปกติ 15.30 บาท บวกปันผลพิเศษ 19 บาท ส่วนพิเศษอาจไม่เกิดซ้ำทุกปี\nที่มา: กรุงเทพธุรกิจ',
  'ขายได้มากขึ้น ทำไมกำไรลด':'ยอดขายปี 2568 โต 5% แต่กำไรลด 18.4% เพราะไตรมาส 4 บันทึกขาดทุนจากด้อยค่าเงินลงทุนต่างประเทศ และยอดขายแบรนด์ตัวเองลดลง 3% จากส่งออกที่ลดลง\nที่มา: InnovestX, หุ้นวิชั่น',
  'ราคาเหวี่ยงแรงหมายความว่าอะไร':'ในรอบ 1 ปีถึง ส.ค. 2568 ราคา CBG สูงสุด 82 บาท ต่ำสุด 46.50 บาท ถ้าซื้อตอนสูงสุดแล้วราคาลงไปจุดต่ำสุด จะติดลบราว 43%\nที่มา: บทวิเคราะห์ บล.ทรีนีตี้',
  'สรุปให้เพื่อนฟังใน 3 บรรทัด':'1. ดูว่าบริษัททำอะไรและหาเงินจากไหน\n2. ดูวงแหวน 6 เรื่อง สีแดงและส้มคือเรื่องที่ต้องระวัง\n3. ถามคำถามท้ายการ์ดก่อนตัดสินใจ น้องฮูกไม่แนะนำซื้อหรือขาย'
};

function cannedFor(ipo, q){
  if (q === 'บริษัทนี้หาเงินจากไหน') return ipo.ticker + ' หาเงินจาก ' + ipo.how.length + ' ส่วน:\n' + ipo.how.map(([a, b], i) => (i + 1) + '. ' + a + ': ' + b).join('\n');
  if (q === 'สรุปให้เพื่อนฟังใน 3 บรรทัด') return '1. ' + ipo.what + '\n2. ' + ipo.summary + '\n3. ก่อนตัดสินใจ ลองถาม: ' + ipo.questions[0];
  return CANNED[q];
}
function ai(ipo){
  const log = chats[ipo.id] || [];
  return `
    <div class="aihead"><img src="${OWL}" alt="" width="34" height="34"><span>น้องฮูก (AI) ตอบจากข้อมูลในการ์ดนี้เท่านั้น บอกที่มาทุกครั้ง และไม่แนะนำให้ซื้อหรือขาย<br><small class="muted">คำถามจะส่งไปให้บริการ AI ภายนอก อย่าพิมพ์ข้อมูลส่วนตัว</small></span></div>
    <div class="chat" id="chatlog">${log.map(m => `<div class="bubble ${m.role === 'user' ? 'me' : 'ai'}">${esc(m.content)}</div>`).join('')}</div>
    <div class="suggest">${(SUGGEST[ipo.id] || SUGGEST_DEFAULT).map(q => `<button type="button" data-ask="${esc(q)}">${esc(q)}</button>`).join('')}</div>
    <form class="composer" id="askform"><input id="askinput" aria-label="พิมพ์คำถาม" placeholder="ถามเรื่อง ${esc(ipo.brand)} ได้เลย" autocomplete="off"><button class="btn" type="submit" aria-label="ส่งคำถาม"><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 14.5V3.5M4 8.5l5-5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></form>
    <div class="offline" id="aistatus"></div>`;
}

/* ================= AI =================
   On claude.ai the page uses Claude through claude.use('sample').
   Anywhere else (GitHub Pages, your laptop) it calls AI_ENDPOINT: your own Cloudflare Worker,
   which holds the free Gemini API key. Never put an API key in this file: the repo is public. */
const AI_ENDPOINT = ''; // เช่น 'https://trinity-ai.<ชื่อของคุณ>.workers.dev'

function workerSampler(endpoint){
  const call = async (input, opts = {}) => {
    const messages = typeof input === 'string' ? [{role:'user', content:input}] : input;
    const res = await fetch(endpoint, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({messages, json:!!opts.json}), signal:opts.signal});
    if (res.status === 429) throw {code:'rate_limited', message:'rate limited'};
    if (!res.ok) throw {code:'error', message:'HTTP ' + res.status};
    const data = await res.json();
    const text = data.text || '';
    if (opts.onText) opts.onText({text, delta:text});
    return {text, truncated:false};
  };
  const fn = (input, opts) => call(input, opts);
  fn.json = async (input, opts = {}) => {
    const r = await call(input, {...opts, json:true});
    const t = r.text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
    return JSON.parse(t);
  };
  return fn;
}
/* Free AI with no key and no sign-up: Pollinations.ai (OpenAI-compatible endpoint).
   Used when the page is not on claude.ai and no AI_ENDPOINT is set. The free tier is rate limited,
   so calls are spaced out and a 429 shows a "wait a moment" message. Only the card data and the
   user's question are sent: the AI tab tells users not to type personal information. */
const FREE_AI = 'https://text.pollinations.ai/openai';
function freeSampler(){
  let last = 0;
  const call = async (input, opts = {}) => {
    const messages = typeof input === 'string' ? [{role:'user', content:input}] : input;
    const wait = Math.max(0, last + 5000 - Date.now());
    if (wait) await new Promise(r => setTimeout(r, wait));
    last = Date.now();
    const ac = new AbortController(), timer = setTimeout(() => ac.abort(), 45000);
    let res;
    try {
      res = await fetch(FREE_AI, {method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'openai', messages}), signal:ac.signal});
    } catch(e){ throw {code:'error', message:String(e)}; }
    finally { clearTimeout(timer); }
    if (res.status === 429) throw {code:'rate_limited', message:'rate limited'};
    if (!res.ok) throw {code:'error', message:'HTTP ' + res.status};
    const data = await res.json();
    const text = String((data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '').trim();
    if (!text) throw {code:'error', message:'empty reply'};
    if (opts.onText) opts.onText({text, delta:text});
    return {text, truncated:false};
  };
  const fn = (input, opts) => call(input, opts);
  fn.json = async (input, opts = {}) => {
    const r = await call(input, {...opts, json:true});
    const m = r.text.replace(/```(?:json)?/gi, '').match(/\{[\s\S]*\}/);
    return JSON.parse(m ? m[0] : r.text);
  };
  fn.provider = 'Pollinations.ai';
  return fn;
}
let samplerP = null;
function getSampler(){
  if (!samplerP){
    const viaClaude = (window.claude && claude.use) ? claude.use('sample').catch(() => null) : Promise.resolve(null);
    samplerP = viaClaude.then(s => s || (AI_ENDPOINT ? workerSampler(AI_ENDPOINT) : freeSampler()));
  }
  return samplerP;
}
function context(ipo){
  return JSON.stringify({
    ชื่อ:ipo.name, แบรนด์:ipo.brand, ตัวย่อ:ipo.ticker, ตลาด:ipo.market, ธุรกิจ:ipo.what,
    หาเงินจาก:ipo.how.map(([a, b]) => a + ': ' + b),
    ตัวเลขหลัก:ipo.kv.map(([l, v, u]) => l + ' ' + v + ' ' + u),
    สรุป:ipo.summary,
    การตรวจ6เรื่อง:CHECKS.map(k => ({เรื่อง:k.label, ผล:{crit:'พบ รุนแรง', warn:'พบ', ok:'ไม่พบ', na:'ไม่มีข้อมูล'}[ipo.checks[k.key]]})),
    เรื่องที่ต้องระวัง:ipo.signals.map(s => ({หัวข้อ:s.title, รายละเอียด:s.text, ที่มา:s.src})),
    จุดแข็ง:ipo.strengths, คำถามก่อนตัดสินใจ:ipo.questions,
    ตัวเลขงบ:ipo.fin.metrics, ที่มาของตัวเลขงบ:ipo.fin.src, ผลตรวจข่าว:CLAIMS.filter(c => c.stock === ipo.id).map(c => ({ข่าว:c.text, ผล:scoreClaim(c).verdict, ที่มา:c.agree.map(id => SRC[id].outlet)}))
  });
}
async function ask(ipo, q){
  const log = chats[ipo.id] = chats[ipo.id] || [];
  log.push({role:'user', content:q});
  rerender();
  const chatEl = document.getElementById('chatlog');
  const bubble = document.createElement('div'); bubble.className = 'bubble ai'; bubble.textContent = 'น้องฮูกกำลังอ่านการ์ด...';
  chatEl.appendChild(bubble); scrollBottom();
  const status = document.getElementById('aistatus');
  const sample = await getSampler();
  if (!sample){
    const a = cannedFor(ipo, q) || 'โหมดออฟไลน์ตอบได้เฉพาะคำถามแนะนำด้านบน เชื่อม AI ผ่าน AI_ENDPOINT หรือเปิดหน้านี้ใน claude.ai เพื่อถามคำถามอื่น';
    bubble.textContent = a; log.push({role:'assistant', content:a});
    status.textContent = 'คำตอบตัวอย่าง (โหมดออฟไลน์)'; return;
  }
  const sys = 'คุณคือผู้ช่วยในแอป Trinity 2.0 ตอบเป็นภาษาไทย สั้น ไม่เกิน 5 บรรทัด ใช้เฉพาะข้อมูลการ์ดด้านล่าง ห้ามเดาหรือใช้ความรู้ภายนอก ถ้าข้อมูลไม่มีให้บอกตรงๆ ว่าการ์ดไม่มีข้อมูลนี้ และแนะนำให้ถามบริษัทหรือผู้แนะนำการลงทุน ห้ามแนะนำให้ซื้อหรือขาย ห้ามคาดการณ์ราคา ปิดท้ายด้วยบรรทัด "ที่มา:" ตามด้วยชื่อสื่อหรือบทวิเคราะห์ที่อยู่ในช่อง "ที่มา" ของข้อมูล เช่น มิติหุ้น InnovestX บล.ทรีนีตี้ ถ้าไม่มีชื่อสื่อให้เขียนว่า "การ์ดของ Trinity 2.0" ห้ามเขียนคำว่า JSON ถ้าเป็นข้อมูลสมมติให้บอกว่าเป็นข้อมูลสมมติ ห้ามใช้ markdown\n\nข้อมูลการ์ด:\n' + context(ipo);
  const msgs = [{role:'user', content:sys + '\n\nคำถามแรก: ' + log[0].content}];
  for (let i = 1; i < log.length; i++) msgs.push({role:log[i].role, content:log[i].content});
  try {
    const res = await sample(msgs, {cache:false, modelTier:'quick', onText:({text}) => { bubble.textContent = text; scrollBottom(); }});
    bubble.textContent = res.text; log.push({role:'assistant', content:res.text}); status.textContent = sample.provider ? 'ตอบโดย AI ฟรีจาก ' + sample.provider + ' ไม่ต้องใช้คีย์' : '';
  } catch(e){
    const a = cannedFor(ipo, q);
    if (a){ bubble.textContent = a; log.push({role:'assistant', content:a}); }
    else { bubble.textContent = 'ตอนนี้ AI ตอบไม่ได้ ลองกดคำถามแนะนำด้านบน'; log.pop(); }
    status.textContent = e && e.code === 'rate_limited' ? 'AI ฟรีจำกัดจำนวนครั้ง รอราว 15 วินาทีแล้วลองใหม่' : e && e.code === 'not_granted' ? 'ยังไม่ได้อนุญาตให้หน้านี้ใช้ AI จึงแสดงคำตอบตัวอย่าง' : 'แสดงคำตอบตัวอย่างแทน';
  }
}
async function checkPasted(){
  const text = document.getElementById('pasted').value.trim();
  const out = document.getElementById('newsresult'), st = document.getElementById('newsstatus');
  if (!text){ out.textContent = 'วางข้อความข่าวก่อน แล้วกดตรวจอีกครั้ง'; return; }
  const btn = document.getElementById('checknews'); btn.disabled = true; st.textContent = 'กำลังเทียบกับข่าวที่รวบรวมไว้...';
  const mine = CLAIMS.filter(c => c.stock === state.ipo);
  const claims = mine.map(c => ({id:c.id, ข้อความ:c.text, ผลตรวจ:scoreClaim(c).verdict, หมายเหตุ:c.why || ''}));
  const sample = await getSampler();
  const fallback = () => {
    const t = text.toLowerCase();
    const hit = /ปันผล/.test(t) ? mine.find(c => c.text.includes('ปันผล')) : /กำไร/.test(t) ? mine.find(c => c.text.includes('กำไร')) : /ยอดขาย|รายได้/.test(t) ? mine.find(c => c.text.includes('ยอดขาย') || c.text.includes('รายได้')) : null;
    out.innerHTML = hit ? `เรื่องที่ใกล้เคียง: <b>${esc(hit.text)}</b> ผลตรวจ <span class="chip ${scoreClaim(hit).cls}">${scoreClaim(hit).verdict}</span>` : 'ไม่พบข่าวเรื่องนี้ในแหล่งที่รวบรวมไว้ ยังยืนยันไม่ได้';
    st.textContent = 'ตรวจแบบคำค้น (โหมดออฟไลน์)';
  };
  if (!sample){ fallback(); btn.disabled = false; return; }
  try {
    const v = await sample.json(`เทียบข้อความข่าวที่ผู้ใช้วางมา กับรายการข่าวที่ตรวจแล้วของหุ้น ${IPOS[state.ipo].ticker} ตอบเป็น JSON เท่านั้นในรูปแบบ {"claimId": "id หรือ null", "match": "ตรงกัน|ขัดกัน|ไม่พบ", "reason": "เหตุผลภาษาไทยไม่เกิน 2 ประโยค"} ถ้าข้อความอ้างตัวเลขที่ไม่มีในรายการ ให้ match เป็น "ไม่พบ" และบอกว่ายังยืนยันไม่ได้\n\nรายการข่าวที่ตรวจแล้ว: ` + JSON.stringify(claims) + '\n\nข้อความที่ผู้ใช้วาง: ' + text, {modelTier:'quick', cache:false});
    const c = CLAIMS.find(x => x.id === v.claimId);
    const cls = v.match === 'ตรงกัน' ? 'c-good' : v.match === 'ขัดกัน' ? 'c-crit' : 'c-warn';
    out.innerHTML = `<span class="chip ${cls}">${esc(v.match || 'ไม่พบ')}</span> ${c ? 'เทียบกับ: <b>' + esc(c.text) + '</b> ' : ''}<div style="margin-top:4px">${esc(v.reason || '')}</div>`;
    st.textContent = '';
  } catch(e){ fallback(); }
  btn.disabled = false;
}

