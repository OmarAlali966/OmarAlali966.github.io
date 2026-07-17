const { fetchWithTimeout, setCors, sendOk, sendFail } = require('../_lib/util');

const SOURCE = 'Ransomware.live';
const SOURCE_URL = 'https://www.ransomware.live/cyberattacks';

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  try {
    const upstream = await fetchWithTimeout('https://api.ransomware.live/v2/recentcyberattacks', {}, 8500);
    if (!upstream.ok) throw new Error('Upstream status ' + upstream.status);
    const data = await upstream.json();
    const list = Array.isArray(data) ? data : [];
    const items = list.slice(0, 30).map(function (a, idx) {
      return {
        id: 'atk-' + idx,
        title: a.victim || a.title || 'Unnamed target',
        description: String(a.summary || a.description || a.sector || '').slice(0, 200),
        group: a.group || a.gang || null,
        country: a.country || null,
        severity: 'high',
        severityLabel: 'Active Attack',
        date: a.attackdate || a.date || a.published || null,
        link: a.link || a.url || SOURCE_URL
      };
    });
    sendOk(res, {
      source: SOURCE,
      sourceUrl: SOURCE_URL,
      updated: new Date().toISOString(),
      items: items
    }, 300);
  } catch (err) {
    sendFail(res, SOURCE, SOURCE_URL, err);
  }
};
