const { fetchWithTimeout, setCors, sendOk, sendFail } = require('../_lib/util');

const SOURCE = 'CISA Known Exploited Vulnerabilities (KEV) Catalog';
const SOURCE_URL = 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog';

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  try {
    const upstream = await fetchWithTimeout(
      'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
      {}, 8500
    );
    if (!upstream.ok) throw new Error('Upstream status ' + upstream.status);
    const data = await upstream.json();
    const vulns = Array.isArray(data.vulnerabilities) ? data.vulnerabilities.slice() : [];
    vulns.sort(function (a, b) { return String(b.dateAdded).localeCompare(String(a.dateAdded)); });
    const items = vulns.slice(0, 40).map(function (v) {
      return {
        id: v.cveID,
        title: v.vulnerabilityName || v.cveID,
        description: v.shortDescription || '',
        vendor: v.vendorProject || '',
        product: v.product || '',
        date: v.dateAdded || '',
        dueDate: v.dueDate || '',
        ransomwareUse: v.knownRansomwareCampaignUse || 'Unknown',
        severity: 'critical',
        severityLabel: 'Actively Exploited',
        link: 'https://nvd.nist.gov/vuln/detail/' + encodeURIComponent(v.cveID || '')
      };
    });
    sendOk(res, {
      source: SOURCE,
      sourceUrl: SOURCE_URL,
      updated: data.dateReleased || null,
      total: data.count || vulns.length,
      items: items
    }, 1800);
  } catch (err) {
    sendFail(res, SOURCE, SOURCE_URL, err);
  }
};
