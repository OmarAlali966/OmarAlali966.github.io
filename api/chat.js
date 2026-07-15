// api/chat.js
//
// Vercel serverless function that proxies chat requests to Google Gemini so
// the real API key never has to live in the public GitHub Pages repository.
//
// SETUP (do this once, in the Vercel dashboard -- never in this file):
// 1. Import this repository as a Project on vercel.com (if not already done).
// 2. In Project Settings > Environment Variables, add:
//      GEMINI_API_KEY            (required)  Your Google AI Studio API key.
//      DAILY_MESSAGE_LIMIT       (optional)  Messages per visitor per day. Default 25.
//      MONTHLY_BUDGET_USD        (optional)  Soft monthly spend cap in USD. Default 5.
//      EST_COST_PER_MESSAGE_USD  (optional)  Rough cost estimate per message. Default 0.004.
//      UPSTASH_REDIS_REST_URL    (optional, recommended) Free Redis REST URL.
//      UPSTASH_REDIS_REST_TOKEN  (optional, recommended) Free Redis REST token.
//    Upstash Redis (upstash.com, free tier) is what makes the daily/monthly
//    limits actually persist across requests. Without it the chat still
//    works, it just is not protected against abuse. In Vercel you can also
//    add Upstash via Storage > Marketplace Database Integrations, which
//    fills in these two variables for you automatically.
// 3. Redeploy. This function will then be live at:
//      https://<your-project>.vercel.app/api/chat
// 4. Confirm js/data/config.js -> SITE_CONFIG.osr.apiEndpoint points at that URL.
//
// COST CONTROL NOTES
// - Uses gemini-2.0-flash by default: Google's fastest/cheapest general model.
// - Trims conversation history to the last 10 messages (2,000 chars each)
//   before sending, and caps model output at 800 tokens, so every request
//   stays small and predictable.
// - The client cannot override the model, so cost stays predictable even if
//   someone tampers with the request from the browser.

const SYSTEM_PROMPT = "You are OSR, a friendly and knowledgeable AI assistant built into Omar Alali's cybersecurity portfolio website. Answer questions about Omar's background, projects, certifications, and general cybersecurity/cloud security topics clearly and concisely. If you don't know something specific about Omar, say so honestly instead of guessing.";

const MODEL = 'gemini-2.0-flash';
const DAILY_LIMIT = parseInt(process.env.DAILY_MESSAGE_LIMIT || '25', 10);
const MONTHLY_BUDGET_USD = parseFloat(process.env.MONTHLY_BUDGET_USD || '5');
const EST_COST_PER_MESSAGE = parseFloat(process.env.EST_COST_PER_MESSAGE_USD || '0.004');
const MONTHLY_MESSAGE_CAP = Math.max(1, Math.floor(MONTHLY_BUDGET_USD / EST_COST_PER_MESSAGE));

const KV_URL = process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function getClientId(req) {
    const fwd = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    const ip = fwd || (req.socket && req.socket.remoteAddress) || 'unknown';
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
        hash = (hash * 31 + ip.charCodeAt(i)) >>> 0;
    }
    return 'h' + hash.toString(36);
}

// Atomically increments a counter key and makes sure it has an expiry, using
// Upstash's REST pipeline endpoint. Returns null (meaning "skip the check")
// if Upstash isn't configured or the call fails for any reason.
async function incrWithExpire(key, ttlSeconds) {
    if (!KV_URL || !KV_TOKEN) return null;
    try {
        const resp = await fetch(KV_URL + '/pipeline', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + KV_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([
                ['INCR', key],
                ['EXPIRE', key, String(ttlSeconds)]
            ])
        });
        const data = await resp.json();
        const count = data && data[0] && data[0].result;
        return typeof count === 'number' ? count : null;
    } catch (e) {
        return null;
    }
}

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server yet.' });
        return;
    }

    // --- Budget guard + per-visitor rate limit (best-effort, needs Upstash) ---
    const now = new Date();
    const isoDate = now.toISOString().slice(0, 10);
    const isoMonth = now.toISOString().slice(0, 7);
    const clientId = getClientId(req);

    const monthCount = await incrWithExpire('osr:month:' + isoMonth, 60 * 60 * 24 * 40);
    if (monthCount !== null && monthCount > MONTHLY_MESSAGE_CAP) {
        res.status(429).json({
            error: 'Monthly usage limit reached',
            friendlyMessage: "OSR has reached its usage limit for this month and will be back next month. Thanks for your patience -- feel free to reach out through the Contact page in the meantime."
        });
        return;
    }

    const dayCount = await incrWithExpire('osr:day:' + isoDate + ':' + clientId, 60 * 60 * 26);
    if (dayCount !== null && dayCount > DAILY_LIMIT) {
        res.status(429).json({
            error: 'Daily message limit reached',
            friendlyMessage: "You've reached today's OSR message limit. Please try again tomorrow, or reach out through the Contact page in the meantime."
        });
        return;
    }
    // --- end budget guard ---

    let body = req.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (e) {
            body = {};
        }
    }
    const incomingMessages = Array.isArray(body && body.messages) ? body.messages : [];

    const contents = incomingMessages.slice(-10).map(function (m) {
        return {
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: String(m.content || '').slice(0, 2000) }]
        };
    });

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL +
        ':streamGenerateContent?alt=sse&key=' + apiKey;

    try {
        const requestBody = JSON.stringify({
            contents: contents,
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: { temperature: 0.6, maxOutputTokens: 800 }
        });

        // Call Gemini, with a small amount of automatic retry for short-lived
        // rate limits (e.g. per-minute quota). Daily/free-tier quota
        // exhaustion is NOT retried -- retrying will not help until the
        // quota resets, so we surface a friendly message instead.
        let upstream = null;
        let errText = '';
        const maxAttempts = 2;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            upstream = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: requestBody
            });
            if (upstream.ok && upstream.body) break;

            errText = await upstream.text();
            let retryDelayMs = null;
            try {
                const parsedErr = JSON.parse(errText);
                const details = (parsedErr && parsedErr.error && parsedErr.error.details) || [];
                const retryInfo = details.find(function (d) {
                    return d['@type'] && d['@type'].indexOf('RetryInfo') !== -1;
                });
                if (retryInfo && retryInfo.retryDelay) {
                    const secs = parseFloat(retryInfo.retryDelay);
                    if (!isNaN(secs)) retryDelayMs = secs * 1000;
                }
            } catch (e) { /* not JSON, can't inspect */ }

            const isRetryable = (upstream.status === 429 || upstream.status === 503) &&
                retryDelayMs !== null && retryDelayMs <= 4000;
            if (isRetryable && attempt < maxAttempts) {
                await new Promise(function (r) { setTimeout(r, retryDelayMs); });
                continue;
            }
            break;
        }

        if (!upstream || !upstream.ok || !upstream.body) {
            const status = (upstream && upstream.status) || 500;
            let reason = '';
            try {
                const parsedErr = JSON.parse(errText);
                reason = (parsedErr && parsedErr.error && parsedErr.error.message) || '';
            } catch (e) { /* not JSON */ }

            let friendlyMessage;
            if (status === 429) {
                const looksDaily = /day/i.test(reason) || /day/i.test(errText);
                friendlyMessage = looksDaily
                    ? "OSR's AI backend (Google Gemini) has hit its free-tier daily quota. Please check back later once the quota resets, or reach out through the Contact page in the meantime."
                    : "OSR's AI backend is getting a lot of requests right now and hit a temporary rate limit. Please wait a moment and try again.";
            } else if (status >= 500) {
                friendlyMessage = "OSR's AI backend is temporarily unavailable. Please try again in a moment.";
            } else {
                friendlyMessage = "OSR ran into a problem talking to its AI backend. Please try again shortly.";
            }

            res.status(status).json({ error: 'Upstream error', friendlyMessage: friendlyMessage, detail: errText });
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
                if (!data || data === '[DONE]') continue;
                try {
                    const parsed = JSON.parse(data);
                    const candidate = parsed.candidates && parsed.candidates[0];
                    const parts = candidate && candidate.content && candidate.content.parts;
                    const piece = parts && parts[0] && parts[0].text;
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
