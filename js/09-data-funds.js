/* ================= funds =================
   Index membership read from SET's own index pages on 10 Nov 2569 (H2 2569 review, valid 1 Jul - 31 Dec 2569).
   An index fund buys the stocks in its index, weighted by company size, so membership = "this fund holds this stock". */
const INDEXES = {
  SET50:  {name:'SET50', plain:'50 บริษัทใหญ่ที่สุดและซื้อขายคล่องที่สุดในตลาด', url:'https://www.set.or.th/th/market/index/set50/overview',
           stocks:['advanc','com7','cpall','crc','kbank','mint','or','osp','true']},
  SET100: {name:'SET100', plain:'100 บริษัทใหญ่ที่สุดในตลาด กว้างกว่า SET50 อีก 50 บริษัท', url:'https://www.set.or.th/th/market/index/set100/overview',
           stocks:['advanc','cbg','com7','cpall','crc','kbank','m','mint','or','osp','true']},
  SETHD:  {name:'SETHD', plain:'30 บริษัทใหญ่ที่จ่ายปันผลสูงและสม่ำเสมอ', url:'https://www.set.or.th/th/market/index/sethd/overview',
           stocks:['kbank','m']},
};
const INDEX_ASOF = 'รายชื่อหุ้นในดัชนี ณ 10 พ.ย. 2569 (รอบครึ่งหลังปี 2569)';
const FUNDS = {
  'k-set50':  {code:'K-SET50', name:'กองทุนเปิดเค เซ็ท 50', amc:'บลจ.กสิกรไทย', index:'SET50', kind:'กองทุนดัชนี', how:'ซื้อผ่านแอปธนาคารหรือแอปซื้อขายกองทุน',
               src:'https://www.wealthmagik.com/Document/FundProfile/K-SET50_FACT_t.pdf', srcName:'Factsheet K-SET50'},
  'scbset50': {code:'SCBSET50', name:'กองทุนเปิดไทยพาณิชย์ SET 50 INDEX', amc:'บลจ.ไทยพาณิชย์', index:'SET50', kind:'กองทุนดัชนี', how:'ซื้อผ่านแอปธนาคารหรือแอปซื้อขายกองทุน',
               src:'https://www.finnomena.com/fund/SCBSET50', srcName:'ข้อมูลกองทุน SCBSET50'},
  'kt-set50': {code:'KT-SET50-A', name:'กองทุนเปิดเคแทม SET50 ชนิดสะสมมูลค่า', amc:'บลจ.กรุงไทย', index:'SET50', kind:'กองทุนดัชนี', how:'ซื้อผ่านแอปธนาคารหรือแอปซื้อขายกองทุน',
               src:'https://www.innovestx.co.th/cafeinvest/th/articles/passive-funds', srcName:'InnovestX Café Invest'},
  'kfs100':   {code:'KFS100-A', name:'กองทุนเปิดกรุงศรี SET100 ชนิดสะสมมูลค่า', amc:'บลจ.กรุงศรี', index:'SET100', kind:'กองทุนดัชนี', how:'ซื้อผ่านแอปธนาคารหรือแอปซื้อขายกองทุน',
               src:'https://www.finnomena.com/fund/KFS100-A', srcName:'ข้อมูลกองทุน KFS100-A'},
  'bset100':  {code:'BSET100', name:'กองทุนเปิด BCAP SET100 ETF', amc:'บลจ.บางกอกแคปปิตอล', index:'SET100', kind:'ETF', how:'ซื้อขายในตลาดหุ้นเหมือนหุ้น 1 ตัว',
               src:'https://www.bangkokbank.com/-/media/files/personal/save-and-invest/mutual-funds/fact-sheet/bset100_factsheet_th.pdf', srcName:'Factsheet BSET100'},
  '1div':     {code:'1DIV', name:'กองทุนเปิดไทยเด็กซ์ SET High Dividend ETF', amc:'บลจ.วรรณ', index:'SETHD', kind:'ETF', how:'ซื้อขายในตลาดหุ้นเหมือนหุ้น 1 ตัว',
               src:'https://www.set.or.th/en/market/product/etf/quote/1div/factsheet', srcName:'SET Factsheet 1DIV'},
};
function fundsHolding(id){ return Object.entries(FUNDS).filter(([, f]) => f.index && INDEXES[f.index].stocks.includes(id)).map(([k]) => k); }

/* Offering windows and fund facts read on 10 Nov 2569 from InfoQuest's list of funds on offer, Finnomena's IPO and Term Fund pages,
   and the AMCs' own announcements. Dates are ISO (CE); the app shows them in Buddhist Era. Fields left null were not stated by the sources. */
Object.entries(FUNDS).forEach(([k, f]) => { f.type = 'general'; f.risk = 6; f.min = null; });
const FINN_TERM = ['https://www.finnomena.com/?p=281579', 'Finnomena: Term Fund ออกใหม่ประจำสัปดาห์ (9 พ.ย. 69)'];
const IPO_LIST = ['https://www.infoquest.co.th/?p=675092', 'InfoQuest: กองทุนเปิดใหม่ที่เสนอขายอยู่'];
Object.assign(FUNDS, {
  'lhset100rmf': {code:'LHSET100RMF', name:'กองทุนเปิด แอล เอช SET100 เพื่อการเลี้ยงชีพ', amc:'บลจ.แลนด์ แอนด์ เฮ้าส์', index:'SET100', kind:'IPO', type:'ipo', risk:6, min:1000, from:'2026-10-28', to:'2026-11-13',
    tag:'หุ้นไทย SET100 แบบล้อดัชนี · RMF', what:'ลงทุนในหุ้นดัชนี SET100 ไม่น้อยกว่า 80% ของมูลค่ากอง บริหารแบบล้อตามดัชนี (Passive) เป็นกองทุนเพื่อการเลี้ยงชีพ (RMF) ไว้ถือยาวเพื่อเกษียณ',
    how:'ซื้อผ่านแอปของ บลจ. ธนาคาร หรือนายหน้าขายกองทุน', srcs:[['https://www.finnomena.com/fund/LHSET100RMF','Finnomena: LHSET100RMF'],['https://www.infoquest.co.th/?p=669532','InfoQuest: LHSET100RMF']]},
  'lhairmf': {code:'LHAIRMF', name:'กองทุนเปิด แอล เอช เอไอ แอนด์ เทคโนโลยี เพื่อการเลี้ยงชีพ', amc:'บลจ.แลนด์ แอนด์ เฮ้าส์', index:null, kind:'IPO', type:'ipo', risk:6, min:1000, from:'2026-10-28', to:'2026-11-13',
    tag:'หุ้นโลกธีม AI และเทคโนโลยี · RMF', what:'กองทุนหุ้นแบบ Feeder Fund ธีม AI และเทคโนโลยี คือเอาเงินไปลงในกองทุนหลักต่างประเทศอีกทอด เป็นกองทุนเพื่อการเลี้ยงชีพ (RMF)',
    noStocks:'กองนี้ลงทุนต่างประเทศผ่านกองทุนหลัก จึงไม่ได้ถือหุ้นแบรนด์ไทยในแอป Trinity 2.0', how:'ซื้อผ่านแอปของ บลจ. ธนาคาร หรือนายหน้าขายกองทุน',
    srcs:[['https://www.infoquest.co.th/?p=669530','InfoQuest: LHAIRMF'],['https://www.finnomena.com/fund/LHAIRMF','Finnomena: LHAIRMF']]},
  'abraw-a': {code:'ABRAW-A', name:'กองทุนเปิด อเบอร์ดีน ฟิวเจอร์ รอว์ แมททีเรียลส์ ฟันด์ ชนิดสะสมมูลค่า', amc:'บลจ.อเบอร์ดีน', index:null, kind:'IPO', type:'ipo', risk:6, min:null, from:'2026-11-02', to:'2026-11-12',
    tag:'หุ้นโลกกลุ่มแร่เชิงยุทธศาสตร์', what:'ลงทุนในหุ้นบริษัททั่วโลกที่สกัดหรือแปรรูปแร่เชิงยุทธศาสตร์ ซึ่งเป็นวัตถุดิบของพลังงานสะอาดและเทคโนโลยี ความเสี่ยงระดับ 6 (เสี่ยงสูง)',
    noStocks:'กองนี้ลงทุนต่างประเทศ จึงไม่ได้ถือหุ้นแบรนด์ไทยในแอป Trinity 2.0', how:'ซื้อผ่านแอปของ บลจ. ธนาคาร หรือนายหน้าขายกองทุน',
    srcs:[['https://www.wealthythai.com/th/updates/news-highlight/53454','Wealthy Thai: ABRAW-A']]},
  'daol-spy': {code:'DAOL-SPY', name:'กองทุนเปิด ดาโอ ยูเอส 500', amc:'บลจ.ดาโอ', index:null, kind:'IPO', type:'ipo', risk:null, min:500, from:'2026-11-05', to:'2026-11-12',
    tag:'หุ้นสหรัฐฯ 500 บริษัท · Feeder Fund', what:'กองทุนหุ้นแบบ Feeder Fund ธีมหุ้นสหรัฐฯ 500 บริษัทตามชื่อกอง ระดับความเสี่ยงและนโยบายละเอียดดูในหนังสือชี้ชวน',
    noStocks:'กองนี้ลงทุนต่างประเทศ จึงไม่ได้ถือหุ้นแบรนด์ไทยในแอป Trinity 2.0', how:'ซื้อผ่านแอปของ บลจ. ธนาคาร หรือนายหน้าขายกองทุน', srcs:[IPO_LIST]},
  'daol-boat': {code:'DAOL-BOAT', name:'กองทุนเปิด ดาโอ โกลบอล ชิปปิ้ง', amc:'บลจ.ดาโอ', index:null, kind:'IPO', type:'ipo', risk:null, min:500, from:'2026-11-09', to:'2026-11-17',
    tag:'หุ้นโลกธุรกิจขนส่งทางเรือ · Feeder Fund', what:'กองทุนหุ้นแบบ Feeder Fund ธีมธุรกิจขนส่งทางเรือทั่วโลกตามชื่อกอง ระดับความเสี่ยงและนโยบายละเอียดดูในหนังสือชี้ชวน',
    noStocks:'กองนี้ลงทุนต่างประเทศ จึงไม่ได้ถือหุ้นแบรนด์ไทยในแอป Trinity 2.0', how:'ซื้อผ่านแอปของ บลจ. ธนาคาร หรือนายหน้าขายกองทุน', srcs:[IPO_LIST]},
  'b-gdi': {code:'B-GDI', name:'กองทุนเปิดบัวหลวง Global Diversified Income', amc:'บลจ.บัวหลวง', index:null, kind:'IPO', type:'ipo', risk:5, min:500, from:'2026-11-03', to:'2026-11-10',
    tag:'ผสมหลายสินทรัพย์ทั่วโลก', what:'ลงทุนในกองทุนต่างประเทศหรือ ETF ตั้งแต่ 2 กองขึ้นไป ครอบคลุมหุ้น ตราสารหนี้ และสินทรัพย์ทางเลือก บริหารแบบ Active และไม่ป้องกันความเสี่ยงอัตราแลกเปลี่ยน',
    noStocks:'กองผสมต่างประเทศ จึงไม่ได้ถือหุ้นแบรนด์ไทยในแอป Trinity 2.0', how:'ซื้อผ่านแอปของ บลจ. ธนาคาร หรือนายหน้าขายกองทุน', srcs:[['https://www.finnomena.com/fund/B-GDI','Finnomena: B-GDI']]},
  'kfgdc': {code:'KFGDC', name:'กองทุนเปิดกรุงศรีโกลบอลไดนามิคคอนเซอเวทีฟอโลเคชั่นเอสอาร์ไอ', amc:'บลจ.กรุงศรี', index:null, kind:'IPO', type:'ipo', risk:null, min:500, from:'2026-11-03', to:'2026-11-10',
    tag:'กองผสมทั่วโลก คำนึงถึงความยั่งยืน', what:'กองทุนผสม กระจายลงทุนในสินทรัพย์หลายประเภททั่วโลกด้วยการจัดสรรสินทรัพย์แบบยืดหยุ่น และคำนึงถึงปัจจัยด้านความยั่งยืน (SRI)',
    noStocks:'กองผสมทั่วโลก ดูสัดส่วนหุ้นไทยได้ในหนังสือชี้ชวน', how:'ซื้อผ่านแอปของ บลจ. ธนาคาร หรือนายหน้าขายกองทุน', srcs:[['https://www.infoquest.co.th/?p=672402','InfoQuest: KFGDC และ KF-GDCRMF']]},
  'scbca-moderate': {code:'SCBCA-MODERATE', name:'กองทุนเปิดไทยพาณิชย์ Core Moderate Allocation', amc:'บลจ.ไทยพาณิชย์', index:null, kind:'IPO', type:'ipo', risk:5, min:1, from:'2026-10-28', to:'2026-11-16',
    tag:'กองผสม Fund of Funds', what:'กองทุนผสมแบบ Fund of Funds คือเอาเงินไปลงในกองทุนอื่นหลายสินทรัพย์ ความเสี่ยงระดับ 5',
    noStocks:'กองผสมที่ลงทุนผ่านกองทุนอื่น ดูสัดส่วนหุ้นไทยได้ในหนังสือชี้ชวน', how:'ซื้อผ่านแอปของ บลจ. ธนาคาร หรือนายหน้าขายกองทุน', srcs:[['https://www.infoquest.co.th/?p=669052','InfoQuest: SCBCA-MODERATE']]},
  'scbsb3m123': {code:'SCBSB3M123', name:'กองทุนเปิดไทยพาณิชย์ตราสารภาครัฐ 3 เดือน 123', amc:'บลจ.ไทยพาณิชย์', index:null, kind:'Term Fund', type:'term', risk:3, min:1000, term:'3 เดือน', from:'2026-11-10', to:'2026-11-16',
    tag:'ตราสารภาครัฐไทย ถือครบ 3 เดือน', what:'กองทุนซีรีส์ตราสารภาครัฐของ บลจ.ไทยพาณิชย์ เน้นลงทุนตราสารหนี้ภาครัฐไทยเป็นหลัก บริหารแบบถือจนครบกำหนด (Buy-and-Hold) ผู้ลงทุนขายคืนไม่ได้ในช่วง 3 เดือน',
    noStocks:'กองนี้ลงทุนในตราสารหนี้ภาครัฐ ไม่ได้ถือหุ้น', how:'ซื้อได้เฉพาะช่วงเสนอขาย แล้วถือจนครบกำหนด', srcs:[FINN_TERM, ['https://www.finnomena.com/fund/SCBSB3M121','Finnomena: กองรุ่นก่อนหน้า SCBSB3M121']]},
  'k-gb6mdq': {code:'K-GB6MDQ', name:'กองทุนเปิดเค พันธบัตร 6 เดือน DQ', amc:'บลจ.กสิกรไทย', index:null, kind:'Term Fund', type:'term', risk:3, min:500, term:'6 เดือน', from:'2026-11-05', to:'2026-11-11',
    tag:'พันธบัตร ถือครบ 6 เดือน', what:'กองทุนตราสารหนี้อายุ 6 เดือน บริหารแบบถือจนครบกำหนด (Buy-and-Hold) การขายคืนก่อนครบกำหนดอาจทำไม่ได้หรือได้เงินไม่เต็ม',
    noStocks:'กองนี้ลงทุนในตราสารหนี้ ไม่ได้ถือหุ้น', how:'ซื้อได้เฉพาะช่วงเสนอขาย แล้วถือจนครบกำหนด', srcs:[FINN_TERM, IPO_LIST]},
  'kftgb6m73': {code:'KFTGB6M73', name:'กองทุนเปิดกรุงศรีพันธบัตรไทย 6M73', amc:'บลจ.กรุงศรี', index:null, kind:'Term Fund', type:'term', risk:3, min:10000, term:'6 เดือน', from:'2026-11-02', to:'2026-11-13',
    tag:'พันธบัตรไทย ถือครบ 6 เดือน', what:'กองทุนพันธบัตรไทยอายุประมาณ 6 เดือนตามชื่อกอง บริหารแบบถือจนครบกำหนด (Buy-and-Hold) การขายคืนก่อนครบกำหนดอาจทำไม่ได้หรือได้เงินไม่เต็ม',
    noStocks:'กองนี้ลงทุนในพันธบัตร ไม่ได้ถือหุ้น', how:'ซื้อได้เฉพาะช่วงเสนอขาย แล้วถือจนครบกำหนด', srcs:[FINN_TERM]},
});
Object.entries(FUNDS).forEach(([k, f]) => { f.id = k; f.srcs = f.srcs || [[f.src, f.srcName]]; });

const TYPES = [['ipo','กองทุน'],['watch','ที่ติดตาม']];
const TYPE_NAME = {general:'กองทุนทั่วไป', ipo:'IPO (กองทุนเปิดใหม่)', term:'Term Fund'};
const TH_M = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const fmtD = iso => `${+iso.slice(8, 10)} ${TH_M[+iso.slice(5, 7) - 1]} ${(+iso.slice(0, 4) + 543) % 100}`;
function fmtP(f){
  const a = f.from, b = f.to, same = a.slice(0, 7) === b.slice(0, 7);
  return same ? `${+a.slice(8, 10)} – ${fmtD(b)}` : `${+a.slice(8, 10)} ${TH_M[+a.slice(5, 7) - 1]} – ${fmtD(b)}`;
}
const todayISO = () => new Date(Date.now() + 7 * 36e5).toISOString().slice(0, 10);
function fundStatus(f){
  if (!f.to) return null;
  const t = Date.parse(todayISO()), left = Math.round((Date.parse(f.to) - t) / 864e5);
  if (Date.parse(f.from) > t) return {s:'soon', label:'เปิดขาย ' + fmtD(f.from), cls:'c-info', left};
  if (left < 0) return {s:'closed', label:'ปิดขายแล้ว', cls:'c-off', left};
  if (left === 0) return {s:'open', label:'ปิดขายวันนี้', cls:'c-warn', left};
  return {s:'open', label:'ปิดขายอีก ' + left + ' วัน', cls: left <= 2 ? 'c-warn' : 'c-good', left};
}
const RISK_TXT = {3:'ต่ำกว่ากองหุ้น กองตราสารหนี้ราคาขึ้นลงน้อยกว่า แต่ไม่ได้รับประกันผลตอบแทน', 5:'ปานกลางค่อนข้างสูง กองผสมหลายสินทรัพย์ ราคาขึ้นลงได้', 6:'เสี่ยงสูง กองหุ้นราคาขึ้นลงตามตลาดหุ้น อาจขาดทุนได้'};

/* watchlist: kept on this device only */
function loadWatch(){ try { const a = JSON.parse(localStorage.getItem('owly.watch') || '[]'); return Array.isArray(a) ? a.filter(id => FUNDS[id]) : []; } catch(e){ return []; } }
function saveWatch(){ try { localStorage.setItem('owly.watch', JSON.stringify(state.watch)); } catch(e){} }
state.watch = loadWatch(); state.ft = 'ipo'; state.fv = 'all';
function toggleWatch(id){
  const i = state.watch.indexOf(id);
  if (i < 0) state.watch.push(id); else state.watch.splice(i, 1);
  saveWatch(); rerender(true);
  const b = document.querySelector(`[data-watch="${id}"]`); if (b) b.focus();
}

