// Trinity 2.0 AI proxy: a Cloudflare Worker that keeps the Gemini API key off the public web page.
// Secrets and settings (set in the Cloudflare dashboard or with wrangler):
//   GEMINI_API_KEY   (secret)  free key from https://aistudio.google.com/apikey
//   GEMINI_MODEL     (var)     optional, default "gemini-flash-latest"
//   TTS_MODEL        (var)     optional, default "gemini-2.5-flash-preview-tts"  (Thai voice for the /tts route)
//   TTS_VOICE        (var)     optional, default "Charon"  (other voices: Puck, Orus, Kore, Zephyr ...)
//   ALLOWED_ORIGINS  (var)     comma-separated, e.g. "https://ttub19.github.io,http://localhost:5500"

const MAX_MESSAGES = 20;
const MAX_CHARS = 24000;
const TTS_MAX_CHARS = 400; // one subtitle line at a time keeps each request small and inside the free tier

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const okOrigin = allowed.length === 0 || allowed.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': okOrigin ? origin || '*' : 'null',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405, cors);
    if (!okOrigin) return json({ error: 'origin not allowed' }, 403, cors);
    if (!env.GEMINI_API_KEY) return json({ error: 'GEMINI_API_KEY is not set' }, 500, cors);

    if (new URL(request.url).pathname.replace(/\/+$/, '').endsWith('/tts')) return tts(request, env, cors);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'invalid JSON' }, 400, cors); }
    const messages = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
    if (!messages.length) return json({ error: 'messages required' }, 400, cors);
    const total = messages.reduce((n, m) => n + String(m.content || '').length, 0);
    if (total > MAX_CHARS) return json({ error: 'input too long' }, 413, cors);

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '') }]
    }));
    const generationConfig = { temperature: 0.4, maxOutputTokens: 900 };
    if (body.json) generationConfig.responseMimeType = 'application/json';

    const model = env.GEMINI_MODEL || 'gemini-flash-latest';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
      body: JSON.stringify({ contents, generationConfig })
    });
    if (res.status === 429) return json({ error: 'rate limited' }, 429, cors);
    if (!res.ok) return json({ error: 'upstream ' + res.status, detail: (await res.text()).slice(0, 300) }, 502, cors);

    const data = await res.json();
    const text = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('').trim();
    return json({ text }, 200, cors);
  }
};

// POST /tts  {text}  ->  audio/wav (Gemini speech, Thai). The page falls back to the device voice on any error.
async function tts(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'invalid JSON' }, 400, cors); }
  const text = String(body.text || '').trim();
  if (!text) return json({ error: 'text required' }, 400, cors);
  if (text.length > TTS_MAX_CHARS) return json({ error: 'text too long' }, 413, cors);
  const model = env.TTS_MODEL || 'gemini-2.5-flash-preview-tts';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'Say in Thai, in a calm, friendly, trustworthy tone: ' + text }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: env.TTS_VOICE || 'Charon' } } }
      }
    })
  });
  if (res.status === 429) return json({ error: 'rate limited' }, 429, cors);
  if (!res.ok) return json({ error: 'upstream ' + res.status, detail: (await res.text()).slice(0, 300) }, 502, cors);
  const data = await res.json();
  const b64 = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
  if (!b64) return json({ error: 'no audio returned' }, 502, cors);
  const pcm = Uint8Array.from(atob(b64), c => c.charCodeAt(0)); // 24 kHz, 16-bit, mono
  return new Response(wav(pcm, 24000), { status: 200, headers: { ...cors, 'Content-Type': 'audio/wav', 'Cache-Control': 'public, max-age=86400' } });
}

function wav(pcm, rate) {
  const h = new DataView(new ArrayBuffer(44));
  const w = (o, s) => { for (let i = 0; i < s.length; i++) h.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); h.setUint32(4, 36 + pcm.length, true); w(8, 'WAVE'); w(12, 'fmt ');
  h.setUint32(16, 16, true); h.setUint16(20, 1, true); h.setUint16(22, 1, true);
  h.setUint32(24, rate, true); h.setUint32(28, rate * 2, true); h.setUint16(32, 2, true); h.setUint16(34, 16, true);
  w(36, 'data'); h.setUint32(40, pcm.length, true);
  const out = new Uint8Array(44 + pcm.length); out.set(new Uint8Array(h.buffer), 0); out.set(pcm, 44);
  return out;
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' } });
}
