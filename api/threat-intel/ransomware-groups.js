const { fetchWithTimeout, setCors, sendOk, sendFail } = require('../_lib/util');

const SOURCE = 'Ransomware.live';
const SOURCE_URL = 'https://www.ransomware.live/groups';

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  try {
    const upstream = await fetchWithTimeout('https://api.ransomware.live/v2/groups', {}, 8500);
    if (!upstream.ok) throw new Error('Upstream status ' + upstream.status);
    const data = await upstream.json();
    const list = Array.isArray(data) ? data : (Array.isArray(data.groups) ? data.groups : []);
    const items = list.slice(0, 40).map(function (g, idx) {
      const name = g.name || g.group || ('Group ' + (idx + 1));
      return {
        id: name,
        title: name,
        description: String(g.description || g.about || g.meta || '').slice(0, 220),
        severity: 'high',
        severityLabel: 'Active Group',
        date: g.updated || g.lastseen || g.locationdate || null,
        link: g.url || g.website || ('https://www.ransomware.live/group/' + encodeURIComponent(name))
      };
    });
    sendOk(res, {
      source: SOURCE,
      sourceUrl: SOURCE_URL,
      updated: new Date().toISOString(),
      total: list.length,
      items: items
    }, 600);
  } catch (err) {
    sendFail(res, SOURCE, SOURCE_URL, err);
  }
};
