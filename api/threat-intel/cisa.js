const { fetchWithTimeout, setCors, sendOk, sendFail, parseRssItems } = require('../_lib/util');

const SOURCE = 'CISA Cybersecurity Advisories';
const SOURCE_URL = 'https://www.cisa.gov/news-events/cybersecurity-advisories';

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  try {
    const upstream = await fetchWithTimeout('https://www.cisa.gov/cybersecurity-advisories/all.xml', {}, 8500);
    if (!upstream.ok) throw new Error('Upstream status ' + upstream.status);
    const xml = await upstream.text();
    const parsed = parseRssItems(xml).slice(0, 25);
    const items = parsed.map(function (it, idx) {
      const isIcs = /ics-advisories/.test(it.link);
      return {
        id: 'cisa-' + idx,
        title: it.title,
        description: it.description,
        category: isIcs ? 'ICS Advisory' : 'Advisory',
        severity: isIcs ? 'high' : 'informational',
        severityLabel: isIcs ? 'ICS Advisory' : 'Advisory',
        date: it.pubDate,
        link: it.link
      };
    });
    sendOk(res, {
      source: SOURCE,
      sourceUrl: SOURCE_URL,
      updated: (items[0] && items[0].date) || null,
      items: items
    }, 900);
  } catch (err) {
    sendFail(res, SOURCE, SOURCE_URL, err);
  }
};
