/* ================= state ================= */
const state = {screen:'home', ipo:null, tab:'summary', reel:0};
const chats = {};
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt = n => n.toLocaleString('th-TH', {maximumFractionDigits:2});
const STEPS = [
  {label:'หน้าแรก', go:{screen:'home'}},
  {label:'การ์ดของ CBG', go:{screen:'ipo', ipo:'cbg', tab:'summary'}},
  {label:'ตัวเลขงบ', go:{screen:'ipo', ipo:'cbg', tab:'fin'}},
  {label:'ตรวจข่าว', go:{screen:'ipo', ipo:'advanc', tab:'news'}},
  {label:'ถาม AI', go:{screen:'ipo', ipo:'cbg', tab:'ai'}},
  {label:'น้องฮูกเล่าข่าว', go:{screen:'reels', reel:1}},
  {label:'ปัดคลิปไปซื้อจำลอง', go:{screen:'buy', ipo:'cbg', from:'reels', reel:2, qty:17, done:false, ack:false}}
];
const NOTES = [
  {title:'ปัญหาที่ต้องแก้', tags:['Problem Clarity','Invest Like Gen Z'], points:['คนไทยอายุ 18–28 ปีมีราว 9.2 ล้านคน (สถิติประชากรปี 2568) รู้จักแบรนด์ดี แต่ไม่รู้ว่าเป็นหุ้นตัวไหน','เดโมมี 12 แบรนด์ที่ใช้ทุกวัน ตั้งแต่ 7-Eleven, Café Amazon, MK ไปจนถึง K PLUS กรองตามหมวดได้','งบการเงินเต็มไปด้วยศัพท์ คนรุ่นใหม่เลยซื้อตามคลิปหรือตามเพื่อน','Trinity 2.0 เริ่มจากแบรนด์ที่ใช้ทุกวัน แล้วแปลงงบเป็นภาษาคน']},
  {title:'การ์ดหน้าเดียว จากงบจริง', tags:['Innovation','Responsible AI'], points:['CBG ขายได้มากขึ้น 5% แต่กำไรลด 18.4% การ์ดบอกว่ามาจากรายการด้อยค่าและส่งออกที่ลดลง','วงแหวน 6 ช่องบอกว่าเรื่องไหนพบ เรื่องไหนไม่พบ และเรื่องไหนยังไม่มีข้อมูล','ไม่บอกว่าควรซื้อหรือขาย บอกคำถามที่ควรถามก่อนตัดสินใจ']},
  {title:'ตัวเลขงบ 3 ปี อ่านง่าย', tags:['Technical Feasibility','Innovation'], points:['กราฟกำไร 3 ปีจากงบที่ประกาศ ปีที่คำนวณย้อนจากอัตราการเติบโตแสดงเป็นแท่งลาย','ทุกตัวเลขมีที่มา กดเปิดดูได้','ของจริงจะดึงงบอัตโนมัติจากข้อมูลที่บริษัทแจ้งตลาดหลักทรัพย์ฯ']},
  {title:'ตรวจข่าวว่าน่าเชื่อถือแค่ไหน', tags:['Responsible AI','AI for Insight'], points:['ปันผล ADVANC สื่อรายงาน 34.30 กับ 27.41 บาท Trinity 2.0 ขึ้นว่าข้อมูลยังขัดกัน และอธิบายว่านับคนละงวด','นับเฉพาะแหล่งที่เป็นอิสระ ตรงกัน 80% จาก 2 แหล่งขึ้นไปจึงขึ้นว่าน่าเชื่อถือ']},
  {title:'ถาม AI ได้ แต่ AI ตอบจากการ์ดเท่านั้น', tags:['Responsible AI','Business Value'], points:['AI ตอบจากข้อมูลในการ์ดและบอกที่มาทุกครั้ง','ถ้าไม่มีข้อมูล AI จะบอกว่าไม่รู้ ไม่เดาเอง','ไม่แนะนำให้ซื้อหรือขาย']},
  {title:'น้องฮูกเล่าหุ้นเป็นคลิปสั้น', tags:['Invest Like Gen Z','Responsible AI'], points:['คลิป 30 วินาที ภาษาเพื่อน แบบที่ Gen Z ดูทุกวัน','น้องฮูกพูดตามผลตรวจข่าว ข่าวที่ขัดกันจะบอกตรงๆ','มีป้าย "บทและเสียงสร้างโดย AI" ตลอดคลิป']},
  {title:'ดูคลิปจบ ปัดไปซื้อได้ทันที (ไอเดีย)', tags:['Invest Like Gen Z','Business Value','Responsible AI'], points:['ปัดคลิปหุ้นไปด้านข้าง เปิดหน้าซื้อหุ้นตัวนั้นทันที เหมือนช้อปจากคลิป','ก่อนกดซื้อต้องเห็นวงแหวน 6 เรื่อง และติ๊กว่าอ่านแล้ว เป็นจังหวะให้คิดก่อน','ซื้อเป็นหุ้นเศษได้ตั้งแต่ 1 หุ้น มีงบต่อเดือนเตือนเมื่อเกิน','ทุกอย่างเป็นการจำลอง ในของจริงจะต่อกับบัญชีหุ้นของโบรกเกอร์']}
];
function stepIndex(){
  if (state.screen === 'home') return 0;
  if (state.screen === 'reels') return 5;
  if (state.screen === 'buy') return 6;
  if (['funds', 'fund', 'market', 'profile'].includes(state.screen)) return 0;
  return {summary:1, fin:2, news:3, ai:4}[state.tab] ?? 1;
}


