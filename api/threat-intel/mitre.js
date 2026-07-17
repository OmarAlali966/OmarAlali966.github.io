const { fetchWithTimeout, setCors, sendOk, sendFail } = require('../_lib/util');

const SOURCE = 'MITRE ATT&CK';
const SOURCE_URL = 'https://attack.mitre.org/techniques/enterprise/';

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  try {
    const upstream = await fetchWithTimeout(
      'https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/enterprise-attack/enterprise-attack.json',
      {}, 9000
    );
    if (!upstream.ok) throw new Error('Upstream status ' + upstream.status);
    const data = await upstream.json();
    const objs = Array.isArray(data.objects) ? data.objects : [];
    const techniques = objs.filter(function (o) {
      return o.type === 'attack-pattern' && !o.revoked && !o.x_mitre_deprecated;
    });
    techniques.sort(function (a, b) { return String(b.modified).localeCompare(String(a.modified)); });
    const items = techniques.slice(0, 40).map(function (t) {
      const extRef = (t.external_references || []).find(function (r) { return r.source_name === 'mitre-attack'; });
      const tactics = (t.kill_chain_phases || [])
        .filter(function (k) { return k.kill_chain_name === 'mitre-attack'; })
        .map(function (k) { return String(k.phase_name || '').replace(/-/g, ' '); });
      return {
        id: (extRef && extRef.external_id) || t.id,
        title: t.name,
        description: (t.description || '').split('\n')[0].slice(0, 220),
        tactic: tactics.join(', ') || 'Uncategorized',
        severity: 'informational',
        severityLabel: tactics[0] || 'Technique',
        date: t.modified,
        link: (extRef && extRef.url) || SOURCE_URL
      };
    });
    sendOk(res, {
      source: SOURCE,
      sourceUrl: SOURCE_URL,
      updated: (items[0] && items[0].date) || null,
      items: items
    }, 21600);
  } catch (err) {
    sendFail(res, SOURCE, SOURCE_URL, err);
  }
};
