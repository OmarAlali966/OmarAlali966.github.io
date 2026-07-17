// js/threat-intel.js
// Global Threat Intelligence Center: fetches live data from official public
// security feeds. Every section either shows real upstream data (with a
// timestamp and source link) or a clean "feed unavailable" state -- this
// file never fabricates placeholder items.
(function () {
  'use strict';

  function apiBase() {
    try {
      var ep = window.SITE_CONFIG && window.SITE_CONFIG.osr && window.SITE_CONFIG.osr.apiEndpoint;
      if (ep) return ep.replace(/\/api\/chat\/?$/, '');
    } catch (e) {}
    return 'https://omar-alali966-github-io.vercel.app';
  }

  function withTimeout(promise, ms) {
    return new Promise(function (resolve) {
      var done = false;
      var timer = setTimeout(function () {
        if (!done) { done = true; resolve({ ok: false, error: 'Timed out' }); }
      }, ms || 12000);
      promise.then(function (v) {
        if (!done) { done = true; clearTimeout(timer); resolve(v); }
      }).catch(function (e) {
        if (!done) { done = true; clearTimeout(timer); resolve({ ok: false, error: String((e && e.message) || e) }); }
      });
    });
  }

  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function relTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return esc(String(iso).slice(0, 10));
    var diffMs = Date.now() - d.getTime();
    var mins = Math.round(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + 'm ago';
    var hrs = Math.round(mins / 60);
    if (hrs < 48) return hrs + 'h ago';
    var days = Math.round(hrs / 24);
    if (days < 30) return days + 'd ago';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function absTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  var SEV_LABELS = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    informational: 'Info'
  };

  function severityBadge(sev, label) {
    var key = SEV_LABELS[sev] ? sev : 'informational';
    var text = esc(label || SEV_LABELS[key]);
    return '<span class="ti-badge ti-sev-' + key + '">' + text + '</span>';
  }

  function itemCard(item) {
    var titleHtml = esc(item.title || 'Untitled');
    var descHtml = item.description ? '<p class="ti-card-desc">' + esc(item.description) + '</p>' : '';
    var metaBits = [];
    if (item.vendor) metaBits.push(esc(item.vendor));
    if (item.product) metaBits.push(esc(item.product));
    if (item.tactic) metaBits.push(esc(item.tactic));
    if (item.country) metaBits.push(esc(item.country));
    if (item.group) metaBits.push('Group: ' + esc(item.group));
    var metaHtml = metaBits.length ? '<div class="ti-card-meta">' + metaBits.join(' &middot; ') + '</div>' : '';
    var dateHtml = item.date ? '<span class="ti-card-date" title="' + esc(absTime(item.date)) + '">' + esc(relTime(item.date)) + '</span>' : '';
    var linkHtml = item.link ? '<a class="ti-card-link" href="' + esc(item.link) + '" target="_blank" rel="noopener">View Source \u2197</a>' : '';
    return (
      '<div class="ti-card reveal in-view" data-search="' + esc(((item.title || '') + ' ' + (item.description || '') + ' ' + (item.id || '')).toLowerCase()) + '">' +
        '<div class="ti-card-top">' + severityBadge(item.severity, item.severityLabel) + dateHtml + '</div>' +
        '<h3 class="ti-card-title">' + titleHtml + '</h3>' +
        metaHtml + descHtml +
        '<div class="ti-card-foot">' + linkHtml + '</div>' +
      '</div>'
    );
  }

  function unavailableCard(sourceName, errMsg) {
    return (
      '<div class="ti-unavailable">' +
        '<div class="ti-unavailable-icon">&#9888;</div>' +
        '<div><strong>' + esc(sourceName || 'This feed') + '</strong> is temporarily unavailable.</div>' +
        '<div class="ti-unavailable-note">No cached or placeholder data is shown. ' + (errMsg ? esc(errMsg) : '') + '</div>' +
      '</div>'
    );
  }

  function skeletonCards(n) {
    var out = '';
    for (var i = 0; i < n; i++) out += '<div class="ti-card ti-skeleton"></div>';
    return out;
  }

  function renderGrid(gridId, result, sourceLabel) {
    var el = document.getElementById(gridId);
    if (!el) return;
    if (!result || result.ok === false || !Array.isArray(result.items) || result.items.length === 0) {
      el.innerHTML = unavailableCard(sourceLabel, result && result.error);
      return;
    }
    el.innerHTML = result.items.map(itemCard).join('');
  }

  // ---------- NVD CVEs (direct browser fetch, CORS-friendly) ----------
  function fetchCves() {
    var now = new Date();
    var start = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    var url = 'https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=2000&pubStartDate=' +
      encodeURIComponent(start.toISOString()) + '&pubEndDate=' + encodeURIComponent(now.toISOString());
    return withTimeout(fetch(url).then(function (r) {
      if (!r.ok) throw new Error('Upstream status ' + r.status);
      return r.json();
    }).then(function (data) {
      var vulns = Array.isArray(data.vulnerabilities) ? data.vulnerabilities.slice() : [];
      vulns.sort(function (a, b) { return new Date(b.cve.published) - new Date(a.cve.published); });
      var items = vulns.slice(0, 18).map(function (v) {
        var cve = v.cve;
        var desc = (cve.descriptions || []).find(function (d) { return d.lang === 'en'; });
        var metrics = cve.metrics || {};
        var sevSource = (metrics.cvssMetricV31 || metrics.cvssMetricV30 || metrics.cvssMetricV2 || metrics.cvssMetricV40 || [])[0];
        var sevRaw = sevSource && (sevSource.cvssData.baseSeverity || sevSource.baseSeverity);
        var sev = sevRaw ? String(sevRaw).toLowerCase() : 'informational';
        if (sev === 'none') sev = 'informational';
        return {
          id: cve.id,
          title: cve.id,
          description: desc ? desc.value.slice(0, 220) : '',
          severity: sev,
          severityLabel: sevRaw ? String(sevRaw) : 'Unscored',
          date: cve.published,
          link: 'https://nvd.nist.gov/vuln/detail/' + cve.id
        };
      });
      return { ok: true, source: 'NIST National Vulnerability Database', sourceUrl: 'https://nvd.nist.gov/vuln/search', updated: (items[0] && items[0].date) || now.toISOString(), items: items };
    }), 12000);
  }

  // ---------- Proxy-backed feeds ----------
  function fetchProxy(path, label) {
    var url = apiBase() + path;
    return withTimeout(fetch(url).then(function (r) {
      if (!r.ok) throw new Error('Upstream status ' + r.status);
      return r.json();
    }), 12000).then(function (result) {
      if (!result) return { ok: false, error: 'No response', source: label };
      return result;
    });
  }

  var FEEDS = [
    { grid: 'feedAttacks', fetch: function () { return fetchProxy('/api/threat-intel/ransomware-attacks', 'Ransomware.live'); }, label: 'Ransomware.live (recent attacks)' },
    { grid: 'feedCves', fetch: fetchCves, label: 'NIST NVD' },
    { grid: 'feedKev', fetch: function () { return fetchProxy('/api/threat-intel/kev', 'CISA KEV'); }, label: 'CISA KEV Catalog' },
    { grid: 'feedRansomware', fetch: function () { return fetchProxy('/api/threat-intel/ransomware-groups', 'Ransomware.live'); }, label: 'Ransomware.live (groups)' },
    { grid: 'feedAttck', fetch: function () { return fetchProxy('/api/threat-intel/mitre', 'MITRE ATT&CK'); }, label: 'MITRE ATT&CK' },
    { grid: 'feedCisa', fetch: function () { return fetchProxy('/api/threat-intel/cisa', 'CISA Advisories'); }, label: 'CISA Advisories' },
    { grid: 'feedMsrc', fetch: function () { return fetchProxy('/api/threat-intel/msrc', 'Microsoft MSRC'); }, label: 'Microsoft MSRC' }
  ];

  var lastSuccessfulUpdate = null;

  function updateLastUpdatedLabel() {
    var el = document.getElementById('tiLastUpdated');
    if (!el) return;
    var dot = '<span class="ti-live-dot"></span>';
    if (lastSuccessfulUpdate) {
      el.innerHTML = dot + 'Last updated ' + relTime(lastSuccessfulUpdate.toISOString());
    } else {
      el.innerHTML = dot + 'Some feeds unavailable right now';
    }
  }

  function loadAll() {
    FEEDS.forEach(function (f) {
      var el = document.getElementById(f.grid);
      if (el) el.innerHTML = skeletonCards(3);
    });
    var anySucceeded = false;
    var pending = FEEDS.map(function (f) {
      return f.fetch().then(function (result) {
        renderGrid(f.grid, result, f.label);
        if (result && result.ok) anySucceeded = true;
      }).catch(function () {
        renderGrid(f.grid, { ok: false }, f.label);
      });
    });
    Promise.all(pending).then(function () {
      if (anySucceeded) lastSuccessfulUpdate = new Date();
      updateLastUpdatedLabel();
    });
  }

  function initFilters() {
    var chips = document.querySelectorAll('.ti-chip');
    var sections = document.querySelectorAll('.ti-section');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        var filter = chip.getAttribute('data-filter');
        sections.forEach(function (sec) {
          if (filter === 'all' || sec.getAttribute('data-section') === filter) {
            sec.classList.remove('ti-hidden');
          } else {
            sec.classList.add('ti-hidden');
          }
        });
        if (filter !== 'all') {
          var target = document.querySelector('.ti-section[data-section="' + filter + '"]');
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initSearch() {
    var input = document.getElementById('tiSearch');
    if (!input) return;
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      document.querySelectorAll('.ti-card[data-search]').forEach(function (card) {
        var match = !q || card.getAttribute('data-search').indexOf(q) !== -1;
        card.style.display = match ? '' : 'none';
      });
    });
  }

  function initRefresh() {
    var btn = document.getElementById('tiRefreshBtn');
    if (btn) btn.addEventListener('click', function () { loadAll(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initFilters();
    initSearch();
    initRefresh();
    loadAll();
    setInterval(updateLastUpdatedLabel, 30000);
    setInterval(loadAll, 10 * 60 * 1000);
  });
})();
