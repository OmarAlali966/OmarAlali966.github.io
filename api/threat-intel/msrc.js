const { fetchWithTimeout, setCors, sendOk, sendFail } = require('../_lib/util');

const SOURCE = 'Microsoft Security Response Center (MSRC)';
const SOURCE_URL = 'https://msrc.microsoft.com/update-guide';

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  try {
    const upstream = await fetchWithTimeout(
      'https://api.msrc.microsoft.com/cvrf/v3.0/updates',
      { headers: { Accept: 'application/json' } },
      8500
    );
    if (!upstream.ok) throw new Error('Upstream status ' + upstream.status);
    const data = await upstream.json();
    const list = Array.isArray(data.value) ? data.value.slice() : [];
    list.sort(function (a, b) {
      return String(b.CurrentReleaseDate || b.InitialReleaseDate || '')
        .localeCompare(String(a.CurrentReleaseDate || a.InitialReleaseDate || ''));
    });
    const items = list.slice(0, 12).map(function (u) {
      const id = u.ID || u.Alias || '';
      return {
        id: id,
        title: u.DocumentTitle || u.Alias || 'Security Update',
        date: u.CurrentReleaseDate || u.InitialReleaseDate || '',
        severity: 'medium',
        severityLabel: 'Security Update',
        link: 'https://msrc.microsoft.com/update-guide/releaseNote/' + encodeURIComponent(id)
      };
    });
    sendOk(res, {
      source: SOURCE,
      sourceUrl: SOURCE_URL,
      updated: (items[0] && items[0].date) || null,
      items: items
    }, 1800);
  } catch (err) {
    sendFail(res, SOURCE, SOURCE_URL, err);
  }
};
