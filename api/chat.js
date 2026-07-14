// api/chat.js
//
// Vercel serverless function that proxies chat requests to OpenAI so the
// real API key never has to live in the public GitHub Pages repository.
//
// SETUP (do this once, in the Vercel dashboard — never in this file):
// 1. Import this repository as a new Project on vercel.com.
// 2. In Project Settings > Environment Variables, add a variable named
//    OPENAI_API_KEY with your real OpenAI API key as the value.
// 3. Redeploy. This function will then be live at:
//    https://<your-project>.vercel.app/api/chat
// 4. Put that URL into js/data/config.js under SITE_CONFIG.osr.apiEndpoint.

const SYSTEM_PROMPT = "You are OSR, a friendly and knowledgeable AI assistant built into Omar Alali's cybersecurity portfolio website. Answer questions about Omar's background, projects, certifications, and general cybersecurity/cloud security topics clearly and concisely. If you don't know something specific about Omar, say so honestly instead of guessing.";

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
          res.status(200).end();
          return;
    }

    if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
          res.status(500).json({ error: 'OPENAI_API_KEY is not configured on the server yet.' });
          return;
    }

    let body = req.body;
    if (typeof body === 'string') {
          try {
                  body = JSON.parse(body);
          } catch (e) {
                  body = {};
          }
    }
    const incomingMessages = Array.isArray(body && body.messages) ? body.messages : [];

    const messages = [{ role: 'system', content: SYSTEM_PROMPT }].concat(
          incomingMessages.slice(-20).map(function (m) {
                  return {
                            role: m.role === 'user' ? 'user' : 'assistant',
                            content: String(m.content || '').slice(0, 4000)
                  };
          })
        );

    try {
          const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + apiKey
                  },
                  body: JSON.stringify({
                            model: (body && body.model) || 'gpt-4o-mini',
                            messages: messages,
                            stream: true,
                            temperature: 0.6
                  })
          });

      if (!upstream.ok || !upstream.body) {
              const errText = await upstream.text();
              res.status(upstream.status || 500).json({ error: 'Upstream error', detail: errText });
              return;
      }

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache, no-transform');

      const reader = upstream.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

      while (true) {
              const chunk = await reader.read();
              if (chunk.done) break;
              buffer += decoder.decode(chunk.value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop();
              for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed.startsWith('data:')) continue;
                        const data = trimmed.slice(5).trim();
                        if (data === '[DONE]') continue;
                        try {
                                    const parsed = JSON.parse(data);
                                    const delta = parsed.choices && parsed.choices[0] && parsed.choices[0].delta;
                                    const piece = delta && delta.content;
                                    if (piece) res.write(piece);
                        } catch (e) {
                                    // ignore malformed chunk
                        }
              }
      }
          res.end();
    } catch (err) {
          res.status(500).json({ error: 'Server error', detail: String((err && err.message) || err) });
    }
};
