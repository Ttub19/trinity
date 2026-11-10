/* ================= market snapshot =================
   Read on 10 Nov 2569 (CE 2026-11-10): Thai stocks and indices from SET's own API (16:14), gold from the Gold Traders Association
   (announcement no. 13, 16:02), the government bond yield curve from ThaiBMA, US stocks from Yahoo Finance (close of 9 Nov, US time).
   This is a snapshot, not a live feed: the app says so on every market page. */
const LIVE = {
  asof:'10 พ.ย. 69 16:14',
  idx:{SET:{l:1495.69,c:22.62,p:1.54,h:1498.09,lo:1484.71,v:62427}, SET50:{l:1014.42,c:11.38,p:1.13,h:1016.66,lo:1007.79,v:45467}, SET100:{l:2188.04,c:27.24,p:1.26,h:2192.23,lo:2172.49,v:55658},
       SETHD:{l:1481.66,c:5.6,p:0.38,h:1485.56,lo:1470.81,v:16060}, SETESG:{l:989.18,c:9.62,p:0.98,h:990.7,lo:981.73,v:45655}, mai:{l:213.18,c:1.54,p:0.73,h:213.62,lo:212.52,v:201}},
  th:{
    ADVANC:{l:338,c:-1,p:-0.29,v:1828,dy:10.12,pe:18.33,sec:'ICT'}, BDMS:{l:19.9,c:-0.2,p:-1,v:1008,dy:4.98,pe:20.85,sec:'HELTH'}, CBG:{l:56.75,c:2,p:3.65,v:250,dy:2.37,pe:26,sec:'FOOD'},
    COM7:{l:32.75,c:0.5,p:1.55,v:187,dy:3.41,pe:16.5,sec:'COMM'}, CPALL:{l:47.25,c:1,p:2.16,v:3233,dy:3.57,pe:13.52,sec:'COMM'}, CRC:{l:31,c:0.5,p:1.64,v:401,dy:5.93,pe:20.99,sec:'COMM'},
    GULF:{l:63.75,c:2.5,p:4.08,v:5047,dy:5.31,pe:15.91,sec:'ENERG'}, KBANK:{l:243,c:2,p:0.83,v:1102,dy:5.82,pe:11.07,sec:'BANK'}, M:{l:19.9,c:0.1,p:0.51,v:6,dy:5.05,pe:25.08,sec:'FOOD'},
    MINT:{l:21.8,c:0.4,p:1.87,v:776,dy:3.28,pe:12.72,sec:'TOURISM'}, OR:{l:12.5,c:0.1,p:0.81,v:318,dy:4.84,pe:18.94,sec:'ENERG'}, OSP:{l:19.7,c:0.6,p:3.14,v:252,dy:4.19,pe:15.73,sec:'FOOD'},
    PTT:{l:37.75,c:-0.75,p:-1.95,v:3957,dy:5.97,pe:8.82,sec:'ENERG'}, SCB:{l:151,c:1,p:0.67,v:1043,dy:7.52,pe:11.61,sec:'BANK'}, TISCO:{l:125,c:0,p:0,v:393,dy:6.2,pe:14.57,sec:'BANK'},
    TRUE:{l:13,c:-0.1,p:-0.76,v:1024,dy:2.37,pe:19.01,sec:'ICT'}, MAJOR:{l:8.3,c:0.2,p:2.47,v:40,dy:3.19,pe:8.84,sec:'MEDIA'}
  },
  names:{SCB:'SCBX · ธนาคารไทยพาณิชย์', TISCO:'ทิสโก้ไฟแนนเชียล', GULF:'กัลฟ์ ดีเวลลอปเมนท์', PTT:'ปตท.', BDMS:'กรุงเทพดุสิตเวชการ', AMATA:'อมตะ คอร์ปอเรชั่น', WHA:'ดับบลิวเอชเอ คอร์ปอเรชั่น', BA:'บางกอกแอร์เวย์ส', WHAUP:'ดับบลิวเอชเอ ยูทิลิตี้ส์', DELTA:'เดลต้า อีเลคโทรนิคส์', RCL:'รีเจียนอล คอนเทนเนอร์ ไลน์ส', TLI:'ไทยประกันชีวิต', QH:'ควอลิตี้เฮ้าส์', PTTEP:'ปตท.สผ.', KCE:'เคซีอี อีเลคโทรนิคส์'},
  gain:[['AMATA',28.25,9.71],['WHA',5.2,7.44],['BA',19.8,7.03],['WHAUP',7.3,6.57],['DELTA',193,6.04]],
  lose:[['RCL',38.5,-4.94],['PTT',37.75,-1.95],['TLI',11.3,-1.74],['QH',1.37,-1.44],['PTTEP',141.5,-1.05]],
  val:[['DELTA',193,6.04,7301],['GULF',63.75,4.08,5047],['PTT',37.75,-1.95,3957],['CPALL',47.25,2.16,3233],['KCE',57.5,2.22,2504]],
  gold:{t:'10 พ.ย. 69 16:02', no:13, barBuy:64650, barSell:64850, barChgDay:-250, barChgLast:-200, ornSell:65650, ornTax:63353.64},
  bondAsof:'10 พ.ย. 69',
  curve:[['3 เดือน',0.877585],['1 ปี',0.944447],['2 ปี',1.171305],['3 ปี',1.308744],['5 ปี',1.56125],['10 ปี',1.994815],['15 ปี',2.433581],['20 ปี',2.904355],['30 ปี',3.17481]],
  bonds:[['T-BILL3M','ตั๋วเงินคลัง 3 เดือน','0.25',0.877585,-0.80],['T-BILL1Y','ตั๋วเงินคลัง 1 ปี','1.0',0.944447,-0.33],['LB28DA','พันธบัตร ธ.ค. 2571','2.1',1.190262,-3.42],['LB303A','พันธบัตร มี.ค. 2573','3.4',1.341134,-3.73],['LB31DA','พันธบัตร ธ.ค. 2574','5.1',1.575658,-4.66],['LB365A','พันธบัตร พ.ค. 2579','9.5',1.908889,-7.28]],
  us:{NVDA:{n:'NVIDIA',p:178.67,prev:186.64}, AAPL:{n:'Apple',p:350.69,prev:342.37}, MSFT:{n:'Microsoft',p:545.18,prev:530.61}, TSLA:{n:'Tesla',p:378.05,prev:358.22}, GOOGL:{n:'Alphabet (Google)',p:288.15,prev:284.78}, AMZN:{n:'Amazon',p:266.93,prev:259.3}, META:{n:'Meta (Facebook · Instagram)',p:641.37,prev:610.15}},
  usIdx:{'S&P 500':{p:7549.94,prev:7376.86}, 'Nasdaq':{p:25253.14,prev:24579.43}, 'Dow Jones':{p:52389.75,prev:51285.73}},
  usAsof:'ปิดวันที่ 9 พ.ย. (เวลาสหรัฐฯ)'
};
Object.values(LIVE.us).concat(Object.values(LIVE.usIdx)).forEach(u => { u.c = u.p - u.prev; u.pc = (u.p / u.prev - 1) * 100; });
/* the simulated buy page now uses the market price from the snapshot (the order itself is still simulated) */
Object.values(IPOS).forEach(s => { const q = LIVE.th[s.ticker]; if (q) s.simPrice = q.l; });
const nf = (n, d = 2) => Number(n).toLocaleString('en-US', {minimumFractionDigits:d, maximumFractionDigits:d});


