const CATS = [['all','ทั้งหมด'],['food','กินดื่ม'],['shop','ช้อป'],['tech','มือถือ เน็ต'],['life','ไลฟ์สไตล์']];
function tileHTML(ipo){
  const n = foundCount(ipo), crit = Object.values(ipo.checks).includes('crit');
  const tone = n === 0 ? 'ok' : crit ? 'crit' : 'warn';
  return `<button class="tile" type="button" data-open="${ipo.id}" data-cat="${ipo.cat}" data-find="${esc((ipo.brand + ' ' + ipo.ticker + ' ' + ipo.name).toLowerCase())}">
    <span class="tile-top">${ring(ipo, 40)}<span class="tick">${ipo.ticker}</span></span>
    <b>${esc(ipo.brand)}</b>
    <span class="tile-what">${esc(ipo.sector)}</span>
    <span class="tile-flag ${tone}"><i></i>${n ? 'ควรรู้ ' + n + ' เรื่อง' : 'ไม่พบเรื่องต้องระวัง'}</span>
  </button>`;
}
function home(){
  const ids = Object.keys(IPOS), pick = ['cpall','advanc','or','cbg'];
  return `
    <div class="topband">
    ${appbar()}
    <section class="hero" aria-label="ค้นหาหุ้นจากแบรนด์">
      <h1>หุ้นของแบรนด์ที่คุณใช้<span class="hl">ทุกวัน</span></h1>
      <div class="search"><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><circle cx="8" cy="8" r="5.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12.3 12.3L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><input id="find" type="search" aria-label="ค้นหาด้วยชื่อแบรนด์หรือชื่อหุ้น" placeholder="ลองพิมพ์ เซเว่น, AIS, คาเฟ่อเมซอน" autocomplete="off" aria-controls="findres"></div><div class="findres" id="findres" aria-live="polite" hidden></div>
      <div class="brands">${pick.map(id => `<button type="button" data-open="${id}">${esc(IPOS[id].brand.split(' · ')[0])}<b>${IPOS[id].ticker}</b></button>`).join('')}</div>
      <img class="hero-owl" src="${OWL}" alt="" width="120" height="120">
    </section>
    </div>
    <button class="promo" type="button" data-reelof="news-intro"><img src="${OWL}" alt="" width="56" height="56"><span><b>น้องฮูกสรุปบทวิเคราะห์ PTT</b><span>คลิปสั้นมีเสียง จากบทวิเคราะห์ บล.ทรีนีตี้</span></span><span class="play" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M4 2.5l7.5 4.5L4 11.5z" fill="currentColor"/></svg></span></button>
    <div class="sec-title"><h2>หุ้นยอดนิยมวันนี้</h2><button class="textbtn" type="button" data-mkt-rec>ดูทั้งหมด</button></div>
    <div class="slist">${popularOwly().slice(0, 3).map(popRow).join('')}</div>
    <div class="sec-title"><h2>หุ้นของแบรนด์ดัง</h2><em>${ids.length} ตัว · งบจริงปี 2568</em></div>
    <div class="cats" role="group" aria-label="กรองตามหมวด">${CATS.map(([k, l], i) => `<button type="button" data-cat-btn="${k}" aria-pressed="${i === 0}">${l}</button>`).join('')}</div>
    <p class="asof">ราคา ณ ${LIVE.asof} · สแนปช็อตจาก SET ไม่ใช่เรียลไทม์</p>
    <div class="slist" id="stocklist">${ids.map(stockRow).join('')}</div>
    <div class="noresult" id="noresult" hidden>ยังไม่มีหุ้นนี้ในเดโม ลองพิมพ์ชื่อแบรนด์อื่น</div>
    <div class="sec-title"><h2>ศัพท์หุ้นใน 10 วิ</h2><em>แตะเพื่ออ่าน</em></div>
    <div class="group gloss">${GLOSS.map(([t, hint, body]) => `<details><summary>${esc(t)} <span>${esc(hint)}</span></summary><p>${esc(body)}</p></details>`).join('')}</div>
    <p class="disclaimer">วงแหวน 6 ช่องคือ 6 เรื่องที่ Trinity 2.0 ตรวจจากงบและข่าวที่เผยแพร่ การ์ดเป็นข้อมูลประกอบการตัดสินใจ ไม่ใช่คำแนะนำการลงทุน</p>`;
}


