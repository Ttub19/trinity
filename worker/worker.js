// IPO Lens AI proxy: a Cloudflare Worker that keeps the Gemini API key off the public web page.
// Secrets and settings (set in the Cloudflare dashboard or with wrangler):
//   GEMINI_API_KEY   (secret)  free key from https://aistudio.google.com/apikey
//   GEMINI_MODEL     (var)     optional, default "gemini-flash-latest"
//   ALLOWED_ORIGINS  (var)     comma-separated, e.g. "https://ttub19.github.io,http://localhost:5500"

const MAX_MESSAGES = 20;
const MAX_CHARS = 24000;

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

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' } });
}
