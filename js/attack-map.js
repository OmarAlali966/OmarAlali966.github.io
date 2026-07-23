// js/attack-map.js
// Global Attack Map — homepage widget.
// Plots REAL disclosed ransomware incidents (by victim country) using the
// same live threat-intel API that powers threat-intel.html. Every marker,
// title, date, and source link shown here is real feed data. The animated
// "detection sweep" lines and the blue monitoring-node markers are a
// stylized illustration of live monitoring -- they are NOT geolocated
// attacker origins, and are labeled as illustrative in the UI. If the live
// feed is unavailable, no markers or numbers are invented -- a clear
// "feed unavailable" message is shown instead.
(function () {
  'use strict';

  var API_BASE = 'https://omar-alali966-github-io.vercel.app';
  var ENDPOINTS = {
    attacks: API_BASE + '/api/threat-intel/ransomware-attacks',
    groups: API_BASE + '/api/threat-intel/ransomware-groups',
    kev: API_BASE + '/api/threat-intel/kev'
  };

  var COUNTRY = {
    US:[39.8,-98.6,'United States'], CA:[56.1,-106.3,'Canada'], MX:[23.6,-102.6,'Mexico'],
    BR:[-14.2,-51.9,'Brazil'], AR:[-38.4,-63.6,'Argentina'], CL:[-35.7,-71.5,'Chile'],
    CO:[4.6,-74.3,'Colombia'], PE:[-9.2,-75.0,'Peru'], VE:[6.4,-66.6,'Venezuela'],
    PA:[8.5,-80.8,'Panama'], EC:[-1.8,-78.2,'Ecuador'], UY:[-32.5,-55.8,'Uruguay'],
    BO:[-16.3,-63.6,'Bolivia'], PY:[-23.4,-58.4,'Paraguay'], CR:[9.7,-83.8,'Costa Rica'],
    GB:[55.4,-3.4,'United Kingdom'], UK:[55.4,-3.4,'United Kingdom'], IE:[53.4,-8.2,'Ireland'],
    FR:[46.6,2.2,'France'], DE:[51.2,10.4,'Germany'], ES:[40.5,-3.7,'Spain'],
    PT:[39.4,-8.2,'Portugal'], IT:[41.9,12.6,'Italy'], NL:[52.1,5.3,'Netherlands'],
    BE:[50.5,4.5,'Belgium'], CH:[46.8,8.2,'Switzerland'], AT:[47.5,14.6,'Austria'],
    SE:[60.1,18.6,'Sweden'], NO:[60.5,8.5,'Norway'], DK:[56.3,9.5,'Denmark'],
    FI:[61.9,25.7,'Finland'], PL:[51.9,19.1,'Poland'], CZ:[49.8,15.5,'Czechia'],
    RO:[45.9,25.0,'Romania'], HU:[47.2,19.5,'Hungary'], GR:[39.1,21.8,'Greece'],
    UA:[48.4,31.2,'Ukraine'], RU:[61.5,105.3,'Russia'], TR:[38.9,35.2,'Turkey'],
    IL:[31.0,34.8,'Israel'], SA:[23.9,45.1,'Saudi Arabia'], AE:[23.4,53.8,'United Arab Emirates'],
    EG:[26.8,30.8,'Egypt'], ZA:[-30.6,22.9,'South Africa'], NG:[9.1,8.7,'Nigeria'],
    KE:[-0.0,37.9,'Kenya'], IN:[20.6,79.0,'India'], PK:[30.4,69.3,'Pakistan'],
    BD:[23.7,90.4,'Bangladesh'], CN:[35.9,104.2,'China'], JP:[36.2,138.3,'Japan'],
    KR:[35.9,127.8,'South Korea'], TW:[23.7,121.0,'Taiwan'], HK:[22.3,114.2,'Hong Kong'],
    SG:[1.35,103.8,'Singapore'], MY:[4.2,101.9,'Malaysia'], TH:[15.9,101.0,'Thailand'],
    VN:[14.1,108.3,'Vietnam'], PH:[12.9,121.8,'Philippines'], ID:[-0.8,113.9,'Indonesia'],
    MM:[21.9,95.9,'Myanmar'], AU:[-25.3,133.8,'Australia'], NZ:[-40.9,174.9,'New Zealand'],
    SN:[14.5,-14.5,'Senegal'], MA:[31.8,-7.1,'Morocco'], KZ:[48.0,66.9,'Kazakhstan']
  };

  var els = {};
  var attacksByCountry = {};
  var countryMarkers = [];
  var shieldNodes = [
    { name: 'Americas Monitoring Node', lat: 25, lon: -90 },
    { name: 'EMEA Monitoring Node', lat: 40, lon: 20 },
    { name: 'APAC Monitoring Node', lat: 15, lon: 110 },
    { name: 'Oceania Monitoring Node', lat: -30, lon: 150 },
    { name: 'Africa Monitoring Node', lat: 2, lon: 20 }
  ];
  var paused = false;
  var reducedMotion = false;
  var sweepTimer = null;
  var feedReady = false;   // true only while real feed data is displayed
  var loadGeneration = 0;  // guards against out-of-order/overlapping loads
  var particles = { ctx: null, w: 0, h: 0, points: [] };

  function $(id) { return document.getElementById(id); }

  function project(lat, lon) {
    return { x: (lon + 180) / 360 * 100, y: (90 - lat) / 180 * 100 };
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function fetchJSON(url, timeoutMs) {
    var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var t = ctrl ? setTimeout(function () { ctrl.abort(); }, timeoutMs || 9000) : null;
    return fetch(url, { cache: 'no-store', signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) {
        if (t) clearTimeout(t);
        if (!r.ok) throw new Error('status ' + r.status);
        return r.json();
      })
      .then(function (data) {
        return Array.isArray(data) ? data : ((data && (data.items || data.data)) || []);
      })
      .catch(function () { return null; });
  }

  function animateCount(el, target, token) {
    if (reducedMotion) { el.textContent = target.toLocaleString(); return; }
    var start = null, duration = 1200;
    function step(ts) {
      if (el._statToken !== token) return; // a newer setStat superseded this run
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (p < 1) el._statRaf = requestAnimationFrame(step);
    }
    el._statRaf = requestAnimationFrame(step);
  }

  // Sets a stat counter. Passing null renders an em dash. Every call cancels
  // any in-flight animation or observer for that element, so a stale value
  // from a previous (successful) load can never overwrite a cleared state.
  function setStat(el, value) {
    if (!el) return;
    var token = (el._statToken || 0) + 1;
    el._statToken = token;
    if (el._statRaf) { cancelAnimationFrame(el._statRaf); el._statRaf = null; }
    if (el._statIo) { el._statIo.disconnect(); el._statIo = null; }
    if (value == null) { el.textContent = '—'; return; }
    if (!('IntersectionObserver' in window)) { el.textContent = value.toLocaleString(); return; }
    var io = new IntersectionObserver(function (entries) {
      if (el._statToken !== token) { io.disconnect(); return; }
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { io.disconnect(); el._statIo = null; animateCount(el, value, token); }
      });
    }, { threshold: 0.25 });
    el._statIo = io;
    io.observe(el);
  }

  function buildMarkers(items) {
    attacksByCountry = {};
    items.forEach(function (item) {
      var code = (item.country || '').toUpperCase();
      if (!COUNTRY[code]) return;
      if (!attacksByCountry[code]) attacksByCountry[code] = [];
      attacksByCountry[code].push(item);
    });
    countryMarkers = Object.keys(attacksByCountry).map(function (code) {
      var geo = COUNTRY[code];
      var pos = project(geo[0], geo[1]);
      return { code: code, name: geo[2], x: pos.x, y: pos.y, items: attacksByCountry[code] };
    });
  }

  function renderMarkers() {
    els.markers.innerHTML = '';
    countryMarkers.forEach(function (m) {
      var el = document.createElement('div');
      el.className = 'am-marker threat';
      el.style.left = m.x + '%';
      el.style.top = m.y + '%';
      var label = m.name + ' — ' + m.items.length + ' disclosed incident' + (m.items.length > 1 ? 's' : '');
      el.title = label;
      el.tabIndex = 0;
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', label);
      el.addEventListener('click', function () { showPanel(m); });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showPanel(m); } });
      els.markers.appendChild(el);
      m._el = el;
    });
    shieldNodes.forEach(function (s) {
      var pos = project(s.lat, s.lon);
      s._x = pos.x; s._y = pos.y;
      var el = document.createElement('div');
      el.className = 'am-marker shield';
      el.style.left = pos.x + '%';
      el.style.top = pos.y + '%';
      el.title = s.name + ' (illustrative monitoring node -- not a real facility)';
      el.setAttribute('aria-hidden', 'true');
      els.markers.appendChild(el);
    });
  }

  function showPanel(marker) {
    els.panel.hidden = false;
    var rows = marker.items.slice(0, 6).map(function (it) {
      return '<div class="am-panel-row">' +
        '<span class="am-panel-date">' + esc(it.date || '') + '</span>' +
        '<span class="am-panel-title">' + esc(it.title || 'Undisclosed organization') + '</span>' +
        (it.link ? '<a class="am-panel-link" href="' + esc(it.link) + '" target="_blank" rel="noopener">View Source ↗</a>' : '') +
        '</div>';
    }).join('');
    els.panel.innerHTML = '<button type="button" class="am-panel-close" aria-label="Close">✕</button>' +
      '<h3>' + esc(marker.name) + ' — ' + marker.items.length + ' disclosed incident' + (marker.items.length > 1 ? 's' : '') + '</h3>' +
      '<p class="am-panel-note">Real, publicly disclosed ransomware activity reported for this country. Source: Ransomware.live.</p>' + rows;
    els.panel.querySelector('.am-panel-close').addEventListener('click', function () { els.panel.hidden = true; });
    if (!reducedMotion) els.panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function spawnToast(text, link) {
    if (!feedReady) return; // never show a disclosure toast while the feed is down
    var el = document.createElement('div');
    el.className = 'am-toast';
    el.innerHTML = '<strong>New disclosure detected</strong><div>' + esc(text) + '</div>' +
      (link ? '<a href="' + esc(link) + '" target="_blank" rel="noopener">View Source ↗</a>' : '');
    els.toasts.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.remove(); }, 5200);
    while (els.toasts.children.length > 3) els.toasts.removeChild(els.toasts.firstChild);
  }

  function drawLine(x1, y1, x2, y2) {
    var ns = 'http://www.w3.org/2000/svg';
    var line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', x1 * 10); line.setAttribute('y1', y1 * 5);
    line.setAttribute('x2', x2 * 10); line.setAttribute('y2', y2 * 5);
    line.setAttribute('class', 'am-line active');
    els.lines.appendChild(line);
    setTimeout(function () { if (line.parentNode) line.remove(); }, 1500);
  }

  function nearestShield(x, y) {
    var best = shieldNodes[0], bestD = Infinity;
    shieldNodes.forEach(function (s) {
      var d = Math.hypot(s._x - x, s._y - y);
      if (d < bestD) { bestD = d; best = s; }
    });
    return best;
  }

  function triggerRandomAttack() {
    if (!feedReady || !countryMarkers.length) return;
    var m = countryMarkers[Math.floor(Math.random() * countryMarkers.length)];
    var s = nearestShield(m.x, m.y);
    drawLine(s._x, s._y, m.x, m.y);
    if (m._el) {
      m._el.classList.add('impact');
      setTimeout(function () { if (m._el) m._el.classList.remove('impact'); }, 700);
    }
    var latest = m.items[0];
    spawnToast(m.name + ': ' + (latest.title || 'incident'), latest.link);
  }

  function scheduleSweep() {
    clearTimeout(sweepTimer);
    if (!feedReady || paused || reducedMotion) return;
    var delay = 2600 + Math.random() * 2200;
    sweepTimer = setTimeout(function () { triggerRandomAttack(); scheduleSweep(); }, delay);
  }

  function setupParticles() {
    var canvas = els.particles;
    var ctx = canvas.getContext('2d');
    particles.ctx = ctx;
    function resize() {
      var rect = els.map.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles.w = rect.width; particles.h = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);
    var count = window.innerWidth < 700 ? 16 : 38;
    particles.points = [];
    for (var i = 0; i < count; i++) {
      particles.points.push({
        x: Math.random() * particles.w,
        y: Math.random() * particles.h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.3 + 0.4
      });
    }
    function tick() {
      requestAnimationFrame(tick);
      if (paused || reducedMotion || document.visibilityState !== 'visible') return;
      ctx.clearRect(0, 0, particles.w, particles.h);
      ctx.fillStyle = 'rgba(100,210,255,0.55)';
      particles.points.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = particles.w; if (p.x > particles.w) p.x = 0;
        if (p.y < 0) p.y = particles.h; if (p.y > particles.h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    tick();
  }

  function updatePauseUI() {
    els.section.classList.toggle('am-paused', paused);
    els.pauseBtn.setAttribute('aria-pressed', String(paused));
    els.pauseBtn.textContent = paused ? '▶ Resume Animation' : '⏸ Pause Animation';
  }

  function togglePause() {
    paused = !paused;
    updatePauseUI();
    if (!paused) scheduleSweep(); else clearTimeout(sweepTimer);
  }

  function showEmptyState(show) {
    els.empty.hidden = !show;
  }

  // Wipe every piece of live UI so a failed feed never shows stale/misleading
  // data: markers, disclosure toasts, sweep lines, sweep timer, detail panel
  // and all four stat counters.
  // Authoritatively wipes every piece of live UI so a failed feed can never
  // show stale/misleading data. Marks the feed as NOT ready, which also stops
  // the sweep animation from spawning any markers or disclosure toasts.
  function clearAll() {
    feedReady = false;
    clearTimeout(sweepTimer);
    sweepTimer = null;
    attacksByCountry = {};
    countryMarkers = [];
    renderMarkers();
    if (els.markers) {
      var stale = els.markers.querySelectorAll('.am-marker.threat');
      for (var i = 0; i < stale.length; i++) stale[i].parentNode.removeChild(stale[i]);
    }
    if (els.toasts) els.toasts.innerHTML = '';
    if (els.lines) els.lines.innerHTML = '';
    if (els.panel) { els.panel.hidden = true; els.panel.innerHTML = ''; }
    setStat(els.statAttacks, null);
    setStat(els.statCountries, null);
    setStat(els.statGroups, null);
    setStat(els.statKev, null);
  }

  function showUnavailable(reason) {
    clearAll();
    showEmptyState(true);
    if (els.updated) els.updated.textContent = 'Live feed unavailable' + (reason ? ' — ' + reason : '');
  }

  // Loads the whole widget from the live feed. The map is driven by the
  // ransomware-attacks feed, so if that feed is missing/empty the entire
  // widget is treated as unavailable and everything is cleared. Group and
  // KEV stats are refreshed together so they can never contradict the map.
  // Loads the whole widget from the live feed. Uses a generation token so a
  // slow/overlapping request (e.g. a cold start plus a Retry click) can never
  // render results out of order or after a failure has cleared the map. The
  // map is driven by the ransomware-attacks feed: if it is missing or empty
  // the entire widget is treated as unavailable and fully cleared.
  function loadData() {
    var gen = ++loadGeneration;
    feedReady = false;
    clearTimeout(sweepTimer);
    if (els.retryBtn) els.retryBtn.disabled = true;
    showEmptyState(false);
    if (els.updated) els.updated.textContent = 'Loading live data…';

    return Promise.all([
      fetchJSON(ENDPOINTS.attacks),
      fetchJSON(ENDPOINTS.groups),
      fetchJSON(ENDPOINTS.kev)
    ]).then(function (res) {
      if (gen !== loadGeneration) return; // a newer load superseded this one
      var attacks = res[0];
      var groups = res[1];
      var kev = res[2];

      if (!Array.isArray(attacks) || !attacks.length) {
        showUnavailable('please retry');
        return;
      }

      buildMarkers(attacks);
      feedReady = true;
      renderMarkers();
      showEmptyState(false);
      setStat(els.statAttacks, attacks.length);
      setStat(els.statCountries, Object.keys(attacksByCountry).length);
      setStat(els.statGroups, Array.isArray(groups) ? groups.length : null);
      setStat(els.statKev, Array.isArray(kev) ? kev.length : null);
      if (els.updated) {
        els.updated.textContent = 'Live — updated ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      clearTimeout(sweepTimer);
      if (!paused && !reducedMotion) scheduleSweep();
    }).catch(function (e) {
      if (gen !== loadGeneration) return;
      showUnavailable(String((e && e.message) || 'network error'));
    }).then(function () {
      if (gen === loadGeneration && els.retryBtn) els.retryBtn.disabled = false;
    });
  }

  function init() {
    els.section = document.getElementById('attack-map');
    if (!els.section) return;
    els.map = $('amMap');
    els.markers = $('amMarkers');
    els.lines = $('amLines');
    els.toasts = $('amToasts');
    els.empty = $('amEmpty');
    els.panel = $('amPanel');
    els.particles = $('amParticles');
    els.pauseBtn = $('amPauseBtn');
    els.retryBtn = $('amRetryBtn');
    els.experienceBtn = $('amExperienceBtn');
    els.updated = $('amUpdated');
    els.statAttacks = $('amStatAttacks');
    els.statGroups = $('amStatGroups');
    els.statKev = $('amStatKev');
    els.statCountries = $('amStatCountries');

    reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setupParticles();
    renderMarkers();
    loadData();

    els.pauseBtn.addEventListener('click', togglePause);
    els.retryBtn.addEventListener('click', function () { loadData(); });
    els.experienceBtn.addEventListener('click', function () {
      if (!countryMarkers.length) { spawnToast('Live feed unavailable right now -- please try again shortly.', null); return; }
      triggerRandomAttack();
    });

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && !paused && !reducedMotion) scheduleSweep();
      else clearTimeout(sweepTimer);
    });

    if (reducedMotion) { paused = true; updatePauseUI(); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
