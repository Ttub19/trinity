# IPO Lens

เดโมสำหรับ Future Finance Innovation Hackathon 2026 โจทย์ AI for Insight

IPO Lens อ่านหุ้น IPO ย้อนไปถึงงบก่อนเข้าตลาด ตรวจ 6 สัญญาณที่มักซ่อนอยู่ แล้วสรุปเป็นการ์ดหน้าเดียว มีตัวตรวจข่าว (ผ่านเมื่อตรงกันอย่างน้อย 80% จาก 2 แหล่งอิสระขึ้นไป) ถาม AI ได้ และมีน้องฮูกเล่าข่าวเป็นคลิปสั้นพร้อมเสียง

PHAT ใช้ข้อมูลจริงจากข่าวที่เผยแพร่ บริษัทอื่นเป็นข้อมูลสมมติ ไม่ใช่คำแนะนำการลงทุน

## ไฟล์

| ไฟล์ | หน้าที่ |
| --- | --- |
| `index.html` | หน้าเว็บทั้งหมด (HTML, CSS, JavaScript) |
| `worker/worker.js` | ตัวกลางบน Cloudflare Workers ที่เก็บ API key ของ Gemini |

## เชื่อม AI ฟรี (Gemini ผ่าน Cloudflare Worker)

ห้ามใส่ API key ลงใน `index.html` เพราะ repo นี้เป็น public ใครเปิดหน้าเว็บก็เห็น key ได้

1. ขอ API key ฟรีที่ https://aistudio.google.com/apikey (ใช้บัญชี Google ไม่ต้องผูกบัตร)
2. สมัคร Cloudflare ฟรีที่ https://dash.cloudflare.com แล้วไปที่ Workers & Pages → Create → Worker ตั้งชื่อ `ipo-lens-ai`
3. กด Edit code แล้ววางโค้ดจาก `worker/worker.js` ทับทั้งหมด กด Deploy
4. ไปที่ Settings → Variables and Secrets ของ Worker แล้วเพิ่ม
   - `GEMINI_API_KEY` แบบ Secret ใส่ key จากข้อ 1
   - `ALLOWED_ORIGINS` แบบ Text ใส่ `https://ttub19.github.io` (ถ้าทดสอบในเครื่องเพิ่ม `,http://localhost:5500`)
   - `GEMINI_MODEL` ไม่ต้องใส่ก็ได้ ค่าเริ่มต้นคือ `gemini-flash-latest` ถ้าใช้ไม่ได้ ให้ดูชื่อโมเดลที่ฟรีในหน้า AI Studio
5. ก๊อป URL ของ Worker เช่น `https://ipo-lens-ai.xxxx.workers.dev` ไปใส่ใน `index.html` ที่บรรทัด

   ```js
   const AI_ENDPOINT = 'https://ipo-lens-ai.xxxx.workers.dev';
   ```

6. commit และ push แล้วเปิดเว็บบน GitHub Pages ลองถาม AI ในแท็บ "ถาม AI"

ทดสอบ Worker จากเทอร์มินัลได้ด้วย

```bash
curl -X POST https://ipo-lens-ai.xxxx.workers.dev \
  -H "Content-Type: application/json" \
  -H "Origin: https://ttub19.github.io" \
  -d '{"messages":[{"role":"user","content":"ทักทายสั้นๆ"}]}'
```

ข้อควรรู้
- free tier ของ Gemini มีจำกัดจำนวนครั้งต่อนาทีและต่อวัน ถ้าเกินจะได้ error 429 หน้าเว็บจะสลับไปใช้คำตอบที่เตรียมไว้
- ข้อมูลที่ส่งผ่าน free tier ทาง Google อาจนำไปปรับปรุงโมเดล อย่าส่งข้อมูลลูกค้าจริงผ่านช่องทางนี้
- เมื่อเปิดผ่านลิงก์บน claude.ai หน้าเว็บจะใช้ Claude แทน ไม่ต้องตั้งค่าอะไร

## เสียงของน้องฮูก

ใช้ระบบอ่านออกเสียงที่ติดมากับเครื่อง (Web Speech API) iPhone, iPad และ Android มีเสียงไทย ถ้าเครื่องไหนไม่มี จะแสดงซับแทน ต้องแตะปุ่ม "แตะเพื่อฟังน้องฮูก" ก่อนเสมอ เพราะเบราว์เซอร์ไม่อนุญาตให้เปิดเสียงเอง
