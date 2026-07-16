// api/_lib/util.js
// Shared helpers for the Global Threat Intelligence Center serverless proxies.
// These endpoints exist purely to work around browser CORS restrictions on a
// handful of official security feeds; they always return real upstream data
// (or a clean ok:false error envelope) and never invent placeholder content.

async function fetchWithTimeout(url, opts, ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(function () { ctrl.abort(); }, ms || 8500);
  try {
    const resp = await fetch(url, Object.assign({}, opts, { signal: ctrl.signal }));
    return resp;
  } finally {
    clearTimeout(timer);
  }
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendOk(res, payload, cacheSeconds) {
  const secs = cacheSeconds || 600;
  setCors(res);
  res.setHeader('Cache-Control', 'public, s-maxage=' + secs + ', stale-while-revalidate=' + (secs * 4));
  res.status(200).json(Object.assign({ ok: true, fetchedAt: new Date().toISOString() }, payload));
}

function sendFail(res, source, sourceUrl, err) {
  setCors(res);
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120');
  res.status(200).json({
    ok: false,
    source: source,
    sourceUrl: sourceUrl || null,
    error: String((err && err.message) || err || 'Unknown error'),
    fetchedAt: new Date().toISOString()
  });
}

function decodeEntities(str) {
  return String(str || '')
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&amp;/g, '&');
}

function stripTags(str) {
  return decodeEntities(String(str || '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function parseRssItems(xml) {
  const items = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/g) || [];
  for (const block of blocks) {
    const title = (block.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1];
    const link = (block.match(/<link>([\s\S]*?)<\/link>/) || [, ''])[1];
    const pubDate = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [, ''])[1];
    const description = (block.match(/<description>([\s\S]*?)<\/description>/) || [, ''])[1];
    items.push({
      title: decodeEntities(title).trim(),
      link: decodeEntities(link).trim(),
      pubDate: (pubDate || '').trim(),
      description: stripTags(description).slice(0, 240)
    });
  }
  return items;
}

module.exports = {
  fetchWithTimeout: fetchWithTimeout,
  setCors: setCors,
  sendOk: sendOk,
  sendFail: sendFail,
  decodeEntities: decodeEntities,
  stripTags: stripTags,
  parseRssItems: parseRssItems
};
