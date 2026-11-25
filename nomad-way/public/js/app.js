/*
 * Nomad Way — single-page application.
 * Hash routes: #/ #/explore #/destination/:slug #/map #/planner #/guide #/about #/favorites #/contact #/admin
 */
(function () {
  'use strict';

  var API = window.NomadAPI;
  var Scenes = window.NomadScenes;
  var app = document.getElementById('app');

  // ---------- Icons ----------
  var I = {
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    arrowL: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
    arrowR: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>',
    car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 17h14v-5l-2-5H7l-2 5v5z"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg>',
    mountain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m3 20 6-11 4 6 2-3 6 8z"/><path d="m8 11 1.5 1.5L11 11"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 20A7 7 0 0 1 4 13c0-6 7-9 16-9 0 9-3 16-9 16z"/><path d="M4 20c4-4 7-6 11-8"/></svg>',
    yurt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 19v-6c3-5 15-5 18 0v6z"/><path d="M3 13c4-7 14-7 18 0M10 19v-4h4v4"/></svg>',
    compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    flower: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="2.5"/><path d="M12 7.5a2.5 2.5 0 1 1 2.4-3.2A2.5 2.5 0 1 1 15.6 9a2.5 2.5 0 1 1-1.2 4.2 2.5 2.5 0 1 1-4.8 0A2.5 2.5 0 1 1 8.4 9a2.5 2.5 0 1 1 1.2-4.7A2.5 2.5 0 0 1 12 7.5zM12 13v8"/></svg>',
    snow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v20M4 6l16 12M20 6 4 18M9 3l3 3 3-3M9 21l3-3 3 3"/></svg>',
    autumn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 22V12M12 12 5 9l2-2-3-3h5l3-2 3 2h5l-3 3 2 2z"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    walk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="13" cy="4" r="2"/><path d="m9 21 2-6 3 3v3M7 12l3-4 4 1 2 3M10 8l1 7"/></svg>',
    run: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="15" cy="4" r="2"/><path d="m5 20 4-5 3 2 1-6 4 3h3M9 9l4-2 2 4"/></svg>',
    coffee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 2v3M12 2v3"/></svg>',
    bus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M7 18v3M17 18v3"/><circle cx="8" cy="14.5" r="1"/><circle cx="16" cy="14.5" r="1"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h2.5l.5-4h-3V7a1 1 0 0 1 1-1h2z"/></svg>',
    tg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m21 4-18 7 6 2 2 6 3-4 5 4z"/><path d="m9 13 8-6"/></svg>',
    yt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></svg>',
    logo: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#184E3B"/><path d="M6 28 15 15l5 7 4-5 10 11z" fill="#3282A6"/><path d="m15 15 2.5 3.5L15 20l-2-2z M24 17l2 2.5-2 1-1.5-1.5z" fill="#fff"/><circle cx="28" cy="11" r="3" fill="#F2E9D8"/></svg>'
  };
  var CAT_ICON = { nature: I.leaf, adventure: I.compass, culture: I.yurt, hiking: I.walk, relaxation: I.coffee };
  var SEASON_ICON = { spring: I.flower, summer: I.sun, autumn: I.autumn, winter: I.snow };
  var INTEREST_ICON = { nature: I.leaf, mountains: I.mountain, culture: I.yurt, adventure: I.compass };
  var STYLE_ICON = { relaxed: I.coffee, balanced: I.walk, active: I.run };
  var REGIONS = ['chuy', 'issykkul', 'naryn', 'jalalabad', 'osh', 'talas', 'batken'];
  var CATS = ['nature', 'adventure', 'culture', 'hiking', 'relaxation'];
  var SEASONS = ['spring', 'summer', 'autumn', 'winter'];
  var DIFFS = ['easy', 'moderate', 'hard'];
  var SCENES = ['lake', 'mountain', 'snow', 'canyon', 'forest', 'city', 'historic'];

  // ---------- State ----------
  var S = {
    lang: API.store.get('nw_lang', null) || ((navigator.language || 'en').slice(0, 2) === 'ru' ? 'ru' : 'en'),
    dict: {},
    destinations: null,
    routes: null,
    favorites: API.store.get('nw_favorites', []),
    lastPlan: null,
    maps: []
  };

  // ---------- Helpers ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function get(obj, path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj); }
  function t(key, vars) {
    var v = get(S.dict, key);
    if (v == null) return key;
    if (typeof v === 'string' && vars) v = v.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ''; });
    return v;
  }
  function loc(obj) { if (!obj) return ''; if (typeof obj === 'string') return obj; return obj[S.lang] || obj.en || ''; }
  function bySlug(slug) { return (S.destinations || []).filter(function (d) { return d.slug === slug; })[0]; }
  function isFav(slug) { return S.favorites.indexOf(slug) !== -1; }
  function parseHash() {
    var h = location.hash.replace(/^#/, '') || '/';
    var q = {}, parts = h.split('?');
    if (parts[1]) parts[1].split('&').forEach(function (kv) { var p = kv.split('='); if (p[0]) q[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); });
    var segs = parts[0].split('/').filter(Boolean);
    return { path: '/' + (segs[0] || ''), param: segs[1] ? decodeURIComponent(segs[1]) : null, query: q };
  }
  function media(d, variant, uid) {
    variant = variant || 0;
    if (d.images && d.images.length && d.images[variant % d.images.length]) {
      return '<img src="' + esc(d.images[variant % d.images.length]) + '" alt="' + esc(loc(d.name)) + '" loading="lazy">';
    }
    return Scenes.scene(d.slug, d.scene || 'mountain', variant, { uid: uid || '' });
  }
  function toast(msg) {
    var el = document.getElementById('toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }
  function seasonText(d) { return d.seasons.length >= 4 ? esc(t('common.allYear')) : d.seasons.map(function (s) { return esc(t('seasons.' + s)); }).join(' · '); }
  function askConfirm(text) {
    return new Promise(function (resolve) {
      var el = document.getElementById('lightbox');
      el.innerHTML = '<div class="confirm-box" role="alertdialog"><p>' + esc(text) + '</p><div style="display:flex;gap:10px;justify-content:flex-end">' +
        '<button class="btn btn--ghost btn--sm" data-ans="0">' + esc(t('admin.cancel')) + '</button><button class="btn btn--danger btn--sm" data-ans="1">OK</button></div></div>';
      el.classList.add('open');
      el.onclick = function (e) {
        var b = e.target.closest('[data-ans]');
        if (b || e.target === el) { el.classList.remove('open'); el.onclick = null; resolve(!!(b && b.dataset.ans === '1')); }
      };
    });
  }
  function diffBadge(d) { return '<span class="diff diff--' + d + '"><i></i>' + esc(t('difficulty.' + d)) + '</span>'; }
  function toggleFav(slug) {
    var i = S.favorites.indexOf(slug);
    if (i === -1) { S.favorites.push(slug); toast(t('common.toastFav')); } else { S.favorites.splice(i, 1); toast(t('common.toastUnfav')); }
    API.store.set('nw_favorites', S.favorites);
    updateFavBadge();
    document.querySelectorAll('[data-fav="' + slug + '"]').forEach(function (b) {
      b.classList.toggle('on', isFav(slug));
      if (b.dataset.label) b.querySelector('span').textContent = isFav(slug) ? t('dest.saved') : t('dest.save');
    });
    if (parseHash().path === '/favorites') render();
  }
  function updateFavBadge() {
    var b = document.getElementById('favBadge');
    if (b) { b.textContent = S.favorites.length; b.style.display = S.favorites.length ? 'grid' : 'none'; }
  }
  function destroyMaps() { S.maps.forEach(function (m) { try { m.remove(); } catch (e) { /* noop */ } }); S.maps = []; }
  function hasLeaflet() { return typeof window.L !== 'undefined'; }
  function makeMap(el, center, zoom) {
    var map = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    S.maps.push(map);
    return map;
  }
  // Offline fallback: schematic SVG map of Kyrgyzstan (used when Leaflet/tiles are unavailable).
  var KG_BORDER = [[71.0, 42.8], [72.4, 42.75], [73.5, 43.0], [74.5, 42.9], [76.0, 43.0], [77.2, 42.95], [78.5, 42.9], [79.2, 42.8], [80.2, 42.2], [79.5, 41.6], [78.5, 41.0], [77.0, 40.9], [76.0, 40.4], [75.0, 40.3], [74.0, 39.6], [73.6, 39.4], [72.0, 39.3], [70.5, 39.6], [69.3, 39.9], [69.5, 40.1], [70.5, 40.0], [71.5, 40.2], [72.4, 40.4], [72.6, 40.85], [72.2, 41.0], [71.6, 41.1], [71.0, 41.0], [70.2, 41.5], [71.0, 42.2]];
  function schematicMap(el, items, opts) {
    opts = opts || {};
    var W = 1000, H = 560, minLng = 69.0, maxLng = 80.6, minLat = 39.0, maxLat = 43.3;
    var kx = Math.cos(41.2 * Math.PI / 180);
    var sx = W / ((maxLng - minLng) * kx), sy = H / (maxLat - minLat), s = Math.min(sx, sy);
    var ox = (W - (maxLng - minLng) * kx * s) / 2, oy = (H - (maxLat - minLat) * s) / 2;
    function P(lng, lat) { return [ox + (lng - minLng) * kx * s, oy + (maxLat - lat) * s]; }
    var border = KG_BORDER.map(function (p) { var q = P(p[0], p[1]); return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ');
    var ik = P(77.25, 42.42), sk = P(75.12, 41.83);
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="schematic" role="img" aria-label="Kyrgyzstan">' +
      '<rect width="' + W + '" height="' + H + '" fill="#e8efe9"/>' +
      '<polygon points="' + border + '" fill="#F2E9D8" stroke="#184E3B" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<ellipse cx="' + ik[0] + '" cy="' + ik[1] + '" rx="' + (0.95 * kx * s) + '" ry="' + (0.27 * s) + '" transform="rotate(-6 ' + ik[0] + ' ' + ik[1] + ')" fill="#9cc9dd" stroke="#3282A6"/>' +
      '<ellipse cx="' + sk[0] + '" cy="' + sk[1] + '" rx="' + (0.14 * kx * s) + '" ry="' + (0.06 * s) + '" fill="#9cc9dd" stroke="#3282A6"/>';
    if (opts.route && items.length > 1) {
      svg += '<polyline points="' + items.map(function (d) { var q = P(d.lng, d.lat); return q[0] + ',' + q[1]; }).join(' ') + '" fill="none" stroke="#3282A6" stroke-width="4" stroke-dasharray="10 8" stroke-linecap="round"/>';
    }
    items.forEach(function (d, i) {
      var q = P(d.lng, d.lat), cls = opts.route ? 'num' : (d.categories ? d.categories[0] : '');
      var col = { culture: '#a0552d', adventure: '#3282A6', relaxation: '#2e8a8a', num: '#3282A6' }[cls] || '#184E3B';
      svg += '<g class="sm-pt" data-pt="' + esc(d.slug) + '" tabindex="0" style="cursor:pointer"><circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + (opts.route ? 15 : 11) + '" fill="' + col + '" stroke="#fff" stroke-width="3"/>' +
        (opts.route ? '<text x="' + q[0] + '" y="' + (q[1] + 5) + '" text-anchor="middle" font-size="14" font-weight="700" fill="#fff" font-family="Inter,sans-serif">' + (i + 1) + '</text>' : '') + '</g>';
    });
    svg += '<text x="' + (W - 16) + '" y="' + (H - 14) + '" text-anchor="end" font-size="13" fill="#5d6b6c" font-family="Inter,sans-serif">' + esc(t('map.schematic')) + '</text></svg>';
    el.innerHTML = '<div class="schematic-wrap">' + svg + '<div class="sm-pop" hidden></div></div>';
    var pop = el.querySelector('.sm-pop');
    function show(slug) {
      var d = bySlug(slug); if (!d) return;
      var q = P(d.lng, d.lat);
      pop.innerHTML = '<button class="sm-close" aria-label="' + esc(t('common.close')) + '">×</button>' + popupHTML(d);
      pop.hidden = false;
      var rect = el.getBoundingClientRect(), px = q[0] / W * rect.width, py = q[1] / H * rect.height;
      pop.style.left = Math.min(Math.max(px - 122, 8), rect.width - 252) + 'px';
      pop.style.top = (py > rect.height / 2 ? Math.max(py - 300, 8) : py + 18) + 'px';
      pop.querySelector('.sm-close').onclick = function () { pop.hidden = true; };
    }
    el.querySelectorAll('[data-pt]').forEach(function (g) {
      g.addEventListener('click', function () { show(g.dataset.pt); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter') show(g.dataset.pt); });
    });
    return { focus: show };
  }
  function markerIcon(cls, label) {
    return L.divIcon({ className: '', html: '<div class="nw-marker ' + (cls || '') + '"><span>' + (label || '') + '</span></div>', iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -32] });
  }
  function popupHTML(d) {
    return '<div class="popup"><div class="thumb">' + media(d, 0, 'pop') + '</div><b>' + esc(loc(d.name)) + '</b><p>' + esc(loc(d.short)) + '</p>' +
      '<a class="btn btn--primary btn--sm" href="#/destination/' + esc(d.slug) + '">' + esc(t('map.open')) + '</a></div>';
  }
  function observeReveal() {
    if (!('IntersectionObserver' in window)) { document.querySelectorAll('.reveal').forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(function (e) { io.observe(e); });
  }

  // ---------- Layout ----------
  var NAV = [['/', 'home'], ['/explore', 'explore'], ['/map', 'map'], ['/planner', 'planner'], ['/guide', 'guide'], ['/about', 'about'], ['/contact', 'contact']];
  function renderHeader() {
    var path = parseHash().path;
    if (path === '/destination') path = '/explore';
    document.getElementById('header').innerHTML =
      '<div class="container header__inner">' +
      '<a class="logo" href="#/">' + I.logo + '<div>Nomad Way<small>' + esc(t('meta.tagline')) + '</small></div></a>' +
      '<nav class="nav" id="nav">' + NAV.map(function (n) { return '<a href="#' + n[0] + '" class="' + (path === n[0] ? 'active' : '') + '">' + esc(t('nav.' + n[1])) + '</a>'; }).join('') + '</nav>' +
      '<div class="header__actions">' +
      '<div class="lang-switch" role="group" aria-label="' + esc(t('common.language')) + '"><button data-lang="en" class="' + (S.lang === 'en' ? 'active' : '') + '">EN</button><button data-lang="ru" class="' + (S.lang === 'ru' ? 'active' : '') + '">RU</button></div>' +
      '<a class="fav-link" href="#/favorites" aria-label="' + esc(t('nav.favorites')) + '">' + I.heart + '<span class="badge" id="favBadge"></span></a>' +
      '<button class="burger" id="burger" aria-label="' + esc(t('nav.menu')) + '">' + I.menu + '</button>' +
      '</div></div>';
    updateFavBadge();
  }
  function renderFooter() {
    document.getElementById('footer').innerHTML =
      '<div class="container"><div class="footer__grid">' +
      '<div><a class="logo" href="#/">' + I.logo + '<div>Nomad Way<small>' + esc(t('meta.tagline')) + '</small></div></a><p>' + esc(t('footer.text')) + '</p>' +
      '<div class="socials"><a href="#/contact" aria-label="Instagram">' + I.ig + '</a><a href="#/contact" aria-label="Facebook">' + I.fb + '</a><a href="#/contact" aria-label="Telegram">' + I.tg + '</a><a href="#/contact" aria-label="YouTube">' + I.yt + '</a></div></div>' +
      '<div><h4>' + esc(t('footer.explore')) + '</h4><ul><li><a href="#/explore">' + esc(t('nav.explore')) + '</a></li><li><a href="#/map">' + esc(t('nav.map')) + '</a></li><li><a href="#/planner">' + esc(t('nav.planner')) + '</a></li><li><a href="#/favorites">' + esc(t('nav.favorites')) + '</a></li></ul></div>' +
      '<div><h4>' + esc(t('footer.info')) + '</h4><ul><li><a href="#/guide">' + esc(t('nav.guide')) + '</a></li><li><a href="#/about">' + esc(t('nav.about')) + '</a></li><li><a href="#/contact">' + esc(t('nav.contact')) + '</a></li><li><a href="#/admin">' + esc(t('nav.admin')) + '</a></li></ul></div>' +
      '<div><h4>' + esc(t('nav.explore')) + '</h4><ul>' + CATS.map(function (c) { return '<li><a href="#/explore?category=' + c + '">' + esc(t('categories.' + c)) + '</a></li>'; }).join('') + '</ul></div>' +
      '</div><div class="footer__bottom"><span>© ' + new Date().getFullYear() + ' Nomad Way. ' + esc(t('footer.rights')) + '</span><span>' + esc(t('meta.tagline')) + '</span></div></div>';
  }
  function pageHero(title, text, seed, scene, variant, extra) {
    return '<section class="page-hero"><div class="page-hero__bg">' + Scenes.scene(seed, scene, variant || 0, { uid: 'ph' }) + '</div>' +
      '<div class="container">' + (extra || '') + '<h1>' + esc(title) + '</h1><p>' + esc(text) + '</p></div></section>';
  }
  function card(d) {
    return '<a class="card reveal" href="#/destination/' + esc(d.slug) + '">' +
      '<div class="card__media">' + media(d, 0, 'c') + '<span class="card__region">' + esc(t('regions.' + d.region)) + '</span></div>' +
      '<button class="heart ' + (isFav(d.slug) ? 'on' : '') + '" data-fav="' + esc(d.slug) + '" aria-label="' + esc(t('dest.save')) + '">' + I.heart + '</button>' +
      '<div class="card__body"><div class="chips">' + d.categories.slice(0, 3).map(function (c) { return '<span class="chip">' + esc(t('categories.' + c)) + '</span>'; }).join('') + '</div>' +
      '<h3>' + esc(loc(d.name)) + '</h3><p>' + esc(loc(d.short)) + '</p>' +
      '<div class="card__meta">' + diffBadge(d.difficulty) + '<span>' + seasonText(d) + '</span></div></div></a>';
  }

  // ---------- Pages ----------
  function pageHome() {
    var featured = S.destinations.filter(function (d) { return d.featured; }).slice(0, 8);
    if (featured.length < 4) featured = S.destinations.slice(0, 8);
    var lakes = S.destinations.filter(function (d) { return d.scene === 'lake'; }).length;
    var routes = (S.routes || []).filter(function (r, i, arr) { return arr.findIndex(function (x) { return x.duration === r.duration; }) === i; }).slice(0, 4);
    var catScene = { nature: ['cat-nature', 'lake', 0], adventure: ['cat-adv', 'snow', 3], culture: ['cat-cult', 'historic', 1], hiking: ['cat-hike', 'mountain', 0], relaxation: ['cat-relax', 'lake', 1] };
    return '<div class="page">' +
      '<section class="hero"><div class="hero__bg">' + Scenes.scene('nomad-way-hero', 'lake', 1, { yurts: true, uid: 'hero' }) + '</div>' +
      '<div class="container"><div class="hero__content"><span class="eyebrow">' + esc(t('hero.eyebrow')) + '</span><h1>' + esc(t('hero.title')) + '</h1><p>' + esc(t('hero.text')) + '</p>' +
      '<form class="hero-search" id="heroSearch"><input name="q" type="search" placeholder="' + esc(t('hero.searchPlaceholder')) + '" aria-label="' + esc(t('hero.searchBtn')) + '"><button class="btn btn--primary" type="submit">' + I.search.replace('<svg', '<svg width="18" height="18"') + esc(t('hero.searchBtn')) + '</button></form>' +
      '<div class="hero__ctas"><a class="btn btn--light" href="#/planner">' + esc(t('hero.ctaPlan')) + ' ' + I.arrowR + '</a><a class="btn btn--outline-light" href="#/explore">' + esc(t('hero.ctaExplore')) + '</a></div>' +
      '<div class="hero__stats"><div><b>' + S.destinations.length + '+</b><span>' + esc(t('hero.stat1')) + '</span></div><div><b>90%</b><span>' + esc(t('hero.stat2')) + '</span></div><div><b>1900+</b><span>' + esc(t('hero.stat3')) + '</span></div></div>' +
      '</div></div></section>' +

      '<section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">' + esc(t('nav.explore')) + '</span><h2>' + esc(t('home.popular')) + '</h2><p>' + esc(t('home.popularText')) + '</p></div>' +
      '<a class="btn btn--ghost" href="#/explore">' + esc(t('home.seeAll')) + ' ' + I.arrowR + '</a></div>' +
      '<div class="grid grid--cards">' + featured.map(card).join('') + '</div></div></section>' +

      '<section class="section section--sand"><div class="container"><div class="section-head"><div><span class="eyebrow">' + esc(t('explore.category')) + '</span><h2>' + esc(t('home.categories')) + '</h2></div></div>' +
      '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">' + CATS.map(function (c) {
        var cs = catScene[c];
        return '<a class="cat-tile reveal" href="#/explore?category=' + c + '"><div class="cat-tile__bg">' + Scenes.scene(cs[0], cs[1], cs[2], { uid: 'cat' }) + '</div><div><h3>' + esc(t('categories.' + c)) + '</h3><p>' + esc(t('categoryText.' + c)) + '</p></div></a>';
      }).join('') + '</div></div></section>' +

      '<section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">' + esc(t('nav.planner')) + '</span><h2>' + esc(t('home.routes')) + '</h2><p>' + esc(t('home.routesText')) + '</p></div></div>' +
      '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(250px,1fr))">' + routes.map(function (r) {
        var names = r.stops.slice(0, 6).map(function (s) { var d = bySlug(s); return d ? '<span>' + esc(loc(d.name)) + '</span>' : ''; }).join('');
        return '<div class="route-card reveal"><div class="route-days">' + esc(t('planner.durations.' + r.duration)) + '</div><h3>' + esc(loc(r.title)) + '</h3><p style="color:var(--muted);margin:0">' + esc(loc(r.summary)) + '</p>' +
          '<div class="route-stops">' + names + '</div><a class="btn btn--ghost btn--sm" style="margin-top:auto;align-self:flex-start" href="#/planner?duration=' + encodeURIComponent(r.duration) + '&interests=' + encodeURIComponent(r.interests.join(',')) + '">' + esc(t('home.openPlanner')) + '</a></div>';
      }).join('') + '</div></div></section>' +

      '<section class="section section--sand"><div class="container"><div class="section-head"><h2>' + esc(t('home.whyTitle')) + '</h2></div><div class="why">' +
      t('home.why').map(function (w, i) { return '<div class="why__item reveal"><div class="why__icon">' + [I.mountain, I.yurt, I.compass][i] + '</div><h3>' + esc(w.title) + '</h3><p style="color:var(--muted);margin:0">' + esc(w.text) + '</p></div>'; }).join('') +
      '</div></div></section>' +

      '<section class="section"><div class="container"><div class="cta-band"><div class="cta-band__bg">' + Scenes.scene('cta-band', 'mountain', 2, { uid: 'cta' }) + '</div>' +
      '<div><h2>' + esc(t('home.ctaTitle')) + '</h2><p style="margin:0;opacity:.9">' + esc(t('home.ctaText')) + '</p></div>' +
      '<div><a class="btn btn--light" href="#/planner">' + esc(t('hero.ctaPlan')) + ' ' + I.arrowR + '</a></div></div></div></section>' +
      '</div>';
  }
  function bindHome() {
    var f = document.getElementById('heroSearch');
    f.addEventListener('submit', function (e) { e.preventDefault(); location.hash = '#/explore?q=' + encodeURIComponent(f.q.value.trim()); });
  }

  function pageExplore(q) {
    function sel(name, list, prefix) {
      return '<div class="field"><label for="f-' + name + '">' + esc(t('explore.' + name)) + '</label><select class="input" id="f-' + name + '" data-filter="' + name + '"><option value="">' + esc(t('explore.all')) + '</option>' +
        list.map(function (v) { return '<option value="' + v + '"' + (q[name] === v ? ' selected' : '') + '>' + esc(t(prefix + '.' + v)) + '</option>'; }).join('') + '</select></div>';
    }
    return '<div class="page">' + pageHero(t('explore.title'), t('explore.text'), 'explore-hero', 'mountain', 0) +
      '<div class="container"><div class="filters">' +
      '<div class="field"><label for="f-q">' + esc(t('hero.searchBtn')) + '</label><div class="input-icon">' + I.search + '<input class="input" id="f-q" type="search" data-filter="q" value="' + esc(q.q || '') + '" placeholder="' + esc(t('explore.search')) + '"></div></div>' +
      sel('region', REGIONS, 'regions') + sel('category', CATS, 'categories') + sel('season', SEASONS, 'seasons') + sel('difficulty', DIFFS, 'difficulty') +
      '</div><div class="results-bar"><span id="resCount"></span><div class="right"><select class="input" id="f-sort" style="width:auto"><option value="featured">' + esc(t('explore.sortFeatured')) + '</option><option value="name"' + (q.sort === 'name' ? ' selected' : '') + '>' + esc(t('explore.sortName')) + '</option></select>' +
      '<button class="btn btn--ghost btn--sm" id="resetFilters">' + esc(t('explore.reset')) + '</button></div></div>' +
      '<div class="grid grid--cards" id="results"></div><div style="height:80px"></div></div></div>';
  }
  function filterDestinations(f) {
    var q = (f.q || '').toLowerCase().trim();
    var list = S.destinations.filter(function (d) {
      if (q) {
        var hay = [d.name.en, d.name.ru, d.short && d.short.en, d.short && d.short.ru, t('regions.' + d.region)].join(' ').toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      if (f.region && d.region !== f.region) return false;
      if (f.category && d.categories.indexOf(f.category) === -1) return false;
      if (f.season && d.seasons.indexOf(f.season) === -1) return false;
      if (f.difficulty && d.difficulty !== f.difficulty) return false;
      return true;
    });
    if (f.sort === 'name') list.sort(function (a, b) { return loc(a.name).localeCompare(loc(b.name), S.lang); });
    else list.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
    return list;
  }
  function bindExplore() {
    function current() {
      var f = {};
      document.querySelectorAll('[data-filter]').forEach(function (el) { if (el.value) f[el.dataset.filter] = el.value; });
      var s = document.getElementById('f-sort').value; if (s !== 'featured') f.sort = s;
      return f;
    }
    function update() {
      var f = current();
      var list = filterDestinations(f);
      document.getElementById('resCount').textContent = t('explore.results', { n: list.length });
      document.getElementById('results').innerHTML = list.length ? list.map(card).join('') :
        '<div class="empty" style="grid-column:1/-1">' + I.search + '<p>' + esc(t('explore.noResults')) + '</p></div>';
      observeReveal();
      var qs = Object.keys(f).map(function (k) { return k + '=' + encodeURIComponent(f[k]); }).join('&');
      history.replaceState(null, '', '#/explore' + (qs ? '?' + qs : ''));
    }
    document.querySelectorAll('[data-filter], #f-sort').forEach(function (el) { el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', update); });
    document.getElementById('resetFilters').addEventListener('click', function () {
      document.querySelectorAll('[data-filter]').forEach(function (el) { el.value = ''; });
      document.getElementById('f-sort').value = 'featured';
      update();
    });
    update();
  }

  function pageDestination(slug) {
    var d = bySlug(slug);
    if (!d) return '<div class="page container section empty"><h2>' + esc(t('dest.notFound')) + '</h2><a class="btn btn--primary" href="#/explore">' + esc(t('dest.back')) + '</a></div>';
    var similar = S.destinations.filter(function (x) {
      return x.slug !== d.slug && (x.region === d.region || x.categories.some(function (c) { return d.categories.indexOf(c) !== -1; }));
    }).sort(function (a, b) { return (b.region === d.region) - (a.region === d.region); }).slice(0, 4);
    var nImg = Math.max(5, (d.images || []).length);
    var gallery = [];
    for (var i = 0; i < Math.min(nImg, 5); i++) gallery.push(i);
    var tips = (d.tips && (d.tips[S.lang] || d.tips.en)) || [];
    return '<div class="page">' +
      '<section class="detail-hero"><div class="detail-hero__bg">' + media(d, 0, 'dh') + '</div><div class="container">' +
      '<a class="crumb" href="#/explore">' + I.arrowL + esc(t('dest.back')) + '</a>' +
      '<div class="chips" style="margin-bottom:14px"><span class="chip">' + esc(t('regions.' + d.region)) + '</span>' + d.categories.map(function (c) { return '<span class="chip">' + esc(t('categories.' + c)) + '</span>'; }).join('') + '</div>' +
      '<h1>' + esc(loc(d.name)) + '</h1><p style="max-width:640px;font-size:1.1rem;opacity:.92;margin-bottom:20px">' + esc(loc(d.short)) + '</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn--light ' + (isFav(d.slug) ? 'on' : '') + '" data-fav="' + esc(d.slug) + '" data-label="1">' + I.heart.replace('<svg', '<svg width="18" height="18"') + '<span>' + esc(isFav(d.slug) ? t('dest.saved') : t('dest.save')) + '</span></button>' +
      '<a class="btn btn--outline-light" href="#/map?focus=' + esc(d.slug) + '">' + I.pin.replace('<svg', '<svg width="18" height="18"') + esc(t('dest.openMap')) + '</a></div>' +
      '</div></section>' +
      '<section class="section"><div class="container detail-layout"><div class="detail-main">' +
      '<h2>' + esc(t('dest.gallery')) + '</h2><div class="gallery">' + gallery.slice(0, 5).map(function (v) { return '<button data-gal="' + v + '" aria-label="' + esc(t('dest.gallery')) + ' ' + (v + 1) + '">' + media(d, v, 'g' + v) + '</button>'; }).join('') + '</div>' +
      '<h2>' + esc(t('dest.about')) + '</h2><p class="lead">' + esc(loc(d.description)) + '</p>' +
      '<h2 style="margin-top:32px">' + esc(t('dest.activities')) + '</h2><ul class="activity-list">' + (d.activities || []).map(function (a) { return '<li>' + I.check + esc(t('activities.' + a)) + '</li>'; }).join('') + '</ul>' +
      (tips.length ? '<h2>' + esc(t('dest.tips')) + '</h2><ul class="tips">' + tips.map(function (x) { return '<li>' + I.bulb + '<span>' + esc(x) + '</span></li>'; }).join('') + '</ul>' : '') +
      '</div><aside class="side-card"><h3 style="margin:0">' + esc(t('dest.facts')) + '</h3>' +
      '<div class="fact"><span>' + esc(t('explore.region')) + '</span><b>' + esc(t('regions.' + d.region)) + '</b></div>' +
      '<div class="fact"><span>' + esc(t('explore.difficulty')) + '</span><b>' + diffBadge(d.difficulty) + '</b></div>' +
      '<div class="fact"><span>' + esc(t('dest.bestSeason')) + '</span><b>' + d.seasons.map(function (s) { return esc(t('seasons.' + s)); }).join(', ') + '</b></div>' +
      '<div class="fact"><span>' + esc(t('dest.coords')) + '</span><b>' + Number(d.lat).toFixed(3) + ', ' + Number(d.lng).toFixed(3) + '</b></div>' +
      '<h3 style="margin:6px 0 0">' + esc(t('dest.location')) + '</h3><div class="mini-map" id="miniMap"></div>' +
      '<a class="btn btn--primary" href="#/planner?interests=' + (d.categories.indexOf('culture') !== -1 ? 'culture' : d.categories.indexOf('adventure') !== -1 ? 'adventure' : 'nature') + '&season=' + d.seasons[0] + '">' + esc(t('dest.addPlanner')) + '</a>' +
      '</aside></div></section>' +
      (similar.length ? '<section class="section section--sand"><div class="container"><h2>' + esc(t('dest.similar')) + '</h2><div class="grid grid--cards">' + similar.map(card).join('') + '</div></div></section>' : '') +
      '</div>';
  }
  function bindDestination(slug) {
    var d = bySlug(slug); if (!d) return;
    document.title = loc(d.name) + ' — Nomad Way';
    var el = document.getElementById('miniMap');
    if (hasLeaflet()) {
      var m = makeMap(el, [d.lat, d.lng], 9);
      L.marker([d.lat, d.lng], { icon: markerIcon(d.categories[0]) }).addTo(m);
    } else {
      schematicMap(el, [d]);
    }
    document.querySelectorAll('[data-gal]').forEach(function (b) { b.addEventListener('click', function () { openLightbox(d, +b.dataset.gal); }); });
  }

  // Lightbox
  var LB = { d: null, i: 0 };
  function openLightbox(d, i) {
    LB.d = d; LB.i = i;
    var el = document.getElementById('lightbox');
    el.innerHTML = '<button class="lb-close" aria-label="' + esc(t('common.close')) + '">×</button><button class="lb-prev" aria-label="prev">‹</button><div class="lightbox__img" id="lbImg"></div><button class="lb-next" aria-label="next">›</button>';
    el.classList.add('open');
    drawLb();
    el.querySelector('.lb-close').onclick = closeLightbox;
    el.querySelector('.lb-prev').onclick = function () { LB.i = (LB.i + 4) % 5; drawLb(); };
    el.querySelector('.lb-next').onclick = function () { LB.i = (LB.i + 1) % 5; drawLb(); };
    el.onclick = function (e) { if (e.target === el) closeLightbox(); };
  }
  function drawLb() { var box = document.getElementById('lbImg'); if (!box) return; box.innerHTML = media(LB.d, LB.i, 'lb' + LB.i); }
  function closeLightbox() { document.getElementById('lightbox').classList.remove('open'); }

  function pageMap() {
    return '<div class="page map-wrap"><aside class="map-side"><div class="map-side__head"><h1>' + esc(t('map.title')) + '</h1><p>' + esc(t('map.text')) + '</p>' +
      '<select class="input" id="mapCat"><option value="">' + esc(t('map.filterAll')) + '</option>' + CATS.map(function (c) { return '<option value="' + c + '">' + esc(t('categories.' + c)) + '</option>'; }).join('') + '</select></div>' +
      '<ul class="map-list" id="mapList"></ul></aside><div id="bigMap"></div></div>';
  }
  function bindMap(q) {
    var mapEl = document.getElementById('bigMap');
    var markers = {}, map = null;
    if (hasLeaflet()) {
      map = makeMap(mapEl, [41.4, 74.8], 7);
      map.scrollWheelZoom.enable();
    }
    var schem = null;
    function draw() {
      var cat = document.getElementById('mapCat').value;
      var list = S.destinations.filter(function (d) { return !cat || d.categories.indexOf(cat) !== -1; });
      if (map) {
        Object.keys(markers).forEach(function (k) { map.removeLayer(markers[k]); });
        markers = {};
        list.forEach(function (d) {
          markers[d.slug] = L.marker([d.lat, d.lng], { icon: markerIcon(d.categories[0]), title: loc(d.name) }).addTo(map).bindPopup(popupHTML(d));
        });
      } else {
        schem = schematicMap(mapEl, list);
      }
      document.getElementById('mapList').innerHTML = list.map(function (d) {
        return '<li><button data-focus="' + esc(d.slug) + '"><div class="thumb">' + media(d, 0, 'ml') + '</div><div><b>' + esc(loc(d.name)) + '</b><small>' + esc(t('regions.' + d.region)) + ' · ' + esc(t('difficulty.' + d.difficulty)) + '</small></div></button></li>';
      }).join('');
      document.querySelectorAll('[data-focus]').forEach(function (b) {
        b.addEventListener('click', function () {
          var slug = b.dataset.focus;
          if (map && markers[slug]) { map.setView(markers[slug].getLatLng(), 10, { animate: true }); markers[slug].openPopup(); }
          else if (schem) schem.focus(slug);
          else location.hash = '#/destination/' + slug;
          document.querySelectorAll('[data-focus]').forEach(function (x) { x.classList.toggle('active', x === b); });
          if (window.innerWidth < 980) mapEl.scrollIntoView({ behavior: 'smooth' });
        });
      });
    }
    document.getElementById('mapCat').addEventListener('change', draw);
    draw();
    if (q.focus && map && markers[q.focus]) setTimeout(function () { map.setView(markers[q.focus].getLatLng(), 10); markers[q.focus].openPopup(); }, 300);
    else if (q.focus && schem) setTimeout(function () { schem.focus(q.focus); }, 100);
  }

  function pagePlanner(q) {
    var pre = {
      duration: q.duration || '4-7',
      interests: q.interests ? q.interests.split(',') : ['nature'],
      season: q.season || 'summer',
      style: q.style || 'balanced'
    };
    function opts(name, values, labelPrefix, icons, type, sub) {
      return values.map(function (v) {
        var checked = type === 'checkbox' ? pre[name].indexOf(v) !== -1 : pre[name] === v;
        return '<div class="opt"><input type="' + type + '" name="' + name + '" id="o-' + name + v + '" value="' + v + '"' + (checked ? ' checked' : '') + '>' +
          '<label for="o-' + name + v + '">' + (icons ? icons[v] : I.calendar) + esc(t(labelPrefix + '.' + v)) + (sub ? '<small>' + esc(t(sub + '.' + v)) + '</small>' : '') + '</label></div>';
      }).join('');
    }
    return '<div class="page">' + pageHero(t('planner.title'), t('planner.text'), 'planner-hero', 'lake', 0) +
      '<div class="container"><form class="planner-form" id="plannerForm">' +
      '<div class="q"><h3><span class="num">1</span>' + esc(t('planner.step1')) + '</h3><div class="options">' + opts('duration', ['1-3', '4-7', '8-14', '14+'], 'planner.durations', null, 'radio') + '</div></div>' +
      '<div class="q"><h3><span class="num">2</span>' + esc(t('planner.step2')) + '</h3><p class="hint">' + esc(t('planner.step2hint')) + '</p><div class="options">' + opts('interests', ['nature', 'mountains', 'culture', 'adventure'], 'planner.interests', INTEREST_ICON, 'checkbox') + '</div></div>' +
      '<div class="q"><h3><span class="num">3</span>' + esc(t('planner.step3')) + '</h3><div class="options">' + opts('season', SEASONS, 'seasons', SEASON_ICON, 'radio') + '</div></div>' +
      '<div class="q"><h3><span class="num">4</span>' + esc(t('planner.step4')) + '</h3><div class="options options--3">' + opts('style', ['relaxed', 'balanced', 'active'], 'planner.styles', STYLE_ICON, 'radio', 'planner.styleText') + '</div></div>' +
      '<button class="btn btn--primary" type="submit" style="width:100%;padding:16px">' + esc(t('planner.generate')) + ' ' + I.arrowR + '</button></form>' +
      '<div id="planOut" style="margin-top:40px"></div>' +
      '<div class="saved-block" style="margin:40px 0 80px"><h2>' + esc(t('planner.savedRoutes')) + '</h2><div class="saved-routes" id="savedRoutes"></div></div>' +
      '</div></div>';
  }
  function renderPlan(plan) {
    S.lastPlan = plan;
    var out = document.getElementById('planOut');
    var timeline = plan.days.map(function (day) {
      var d = bySlug(day.slug); if (!d) return '';
      var head = day.kind === 'start' ? t('planner.start') : day.kind === 'arrive' ? t('planner.arrive') : day.kind === 'free' ? t('planner.free') : t('planner.explore');
      var from = day.travel ? bySlug(day.travel.from) : null;
      var drive = day.travel ? '<div class="drive">' + I.car + esc(t('planner.drive', { km: day.travel.km, h: day.travel.hours, from: from ? loc(from.name) : '' })) + '</div>' : '';
      var body = day.kind === 'free' ? '<p>' + esc(t('planner.freeText')) + '</p>' :
        '<div class="chips" style="margin-top:6px">' + day.activities.map(function (a) { return '<span class="chip chip--blue">' + esc(t('activities.' + a)) + '</span>'; }).join('') + '</div>' +
        (day.kind !== 'explore' ? '<p>' + esc(loc(d.short)) + '</p>' : '');
      return '<li class="' + day.kind + '"><span class="dot">' + day.day + '</span><div class="day-card">' + drive +
        '<h4>' + esc(t('planner.day', { n: day.day })) + ' — ' + esc(head) + ' <a href="#/destination/' + esc(d.slug) + '">' + esc(loc(d.name)) + '</a></h4>' + body + '</div></li>';
    }).join('');
    out.innerHTML = '<div class="plan-result">' +
      '<div class="print-only"><h1>Nomad Way</h1></div>' +
      '<div class="plan-summary"><div><span class="eyebrow" style="color:#a9dcf0">' + esc(t('planner.result')) + '</span><h2>' + esc(loc(plan.template.title)) + '</h2><p style="margin:0;opacity:.9">' + esc(loc(plan.template.summary)) + '</p>' +
      '<div class="stats"><span>' + esc(t('planner.days', { n: plan.totalDays })) + '</span><span>' + esc(t('planner.stops', { n: plan.stops.length })) + '</span><span>' + esc(t('planner.km', { n: plan.totalKm })) + '</span><span>' + esc(t('seasons.' + plan.input.season)) + '</span><span>' + esc(t('planner.styles.' + plan.input.style)) + '</span></div>' +
      '<p style="margin:12px 0 0;font-size:.85rem;opacity:.8">' + esc(t('planner.seasonNote', { season: t('seasons.' + plan.input.season).toLowerCase() })) + '</p></div>' +
      '<div class="actions"><button class="btn btn--light" id="saveRoute">' + esc(t('planner.saveRoute')) + '</button><button class="btn btn--outline-light" id="exportPdf">' + esc(t('planner.exportPdf')) + '</button></div></div>' +
      '<ol class="timeline">' + timeline + '</ol><div class="plan-map" id="planMap"></div></div>';
    destroyMaps();
    var mapEl = document.getElementById('planMap');
    if (hasLeaflet()) {
      var m = makeMap(mapEl, [41.5, 75], 7);
      var pts = plan.stops.map(function (s) { return [s.lat, s.lng]; });
      plan.stops.forEach(function (s, i) {
        var d = bySlug(s.slug); if (!d) return;
        L.marker([s.lat, s.lng], { icon: markerIcon('num', i + 1) }).addTo(m).bindPopup(popupHTML(d));
      });
      if (pts.length > 1) { L.polyline(pts, { color: '#3282A6', weight: 4, opacity: .85, dashArray: '8 8' }).addTo(m); m.fitBounds(pts, { padding: [40, 40] }); }
      else if (pts.length) m.setView(pts[0], 9);
    } else {
      schematicMap(mapEl, plan.stops.map(function (s) { return { slug: s.slug, lat: s.lat, lng: s.lng }; }), { route: true });
    }
    document.getElementById('saveRoute').onclick = function () {
      var saved = API.store.get('nw_saved_routes', []);
      saved.unshift({ id: Date.now(), plan: plan });
      API.store.set('nw_saved_routes', saved.slice(0, 20));
      toast(t('planner.routeSaved'));
      renderSaved();
    };
    document.getElementById('exportPdf').onclick = function () { window.print(); };
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function renderSaved() {
    var el = document.getElementById('savedRoutes'); if (!el) return;
    var saved = API.store.get('nw_saved_routes', []);
    el.innerHTML = saved.length ? saved.map(function (s) {
      var p = s.plan;
      return '<div class="saved-route"><div><b>' + esc(loc(p.template.title)) + '</b><small>' + esc(t('planner.days', { n: p.totalDays })) + ' · ' + esc(t('seasons.' + p.input.season)) + ' · ' + esc(t('planner.styles.' + p.input.style)) + ' · ' + new Date(p.createdAt).toLocaleDateString(S.lang) + '</small></div>' +
        '<div style="display:flex;gap:8px"><button class="btn btn--ghost btn--sm" data-open-route="' + s.id + '">' + esc(t('planner.open')) + '</button><button class="btn btn--sm" style="background:var(--sand)" data-del-route="' + s.id + '">' + esc(t('planner.delete')) + '</button></div></div>';
    }).join('') : '<p style="color:var(--muted)">' + esc(t('planner.noSaved')) + '</p>';
    el.querySelectorAll('[data-open-route]').forEach(function (b) {
      b.onclick = function () { var s = saved.filter(function (x) { return String(x.id) === b.dataset.openRoute; })[0]; if (s) renderPlan(s.plan); };
    });
    el.querySelectorAll('[data-del-route]').forEach(function (b) {
      b.onclick = function () { API.store.set('nw_saved_routes', saved.filter(function (x) { return String(x.id) !== b.dataset.delRoute; })); renderSaved(); };
    });
  }
  function bindPlanner() {
    var f = document.getElementById('plannerForm');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var interests = Array.prototype.map.call(f.querySelectorAll('input[name=interests]:checked'), function (x) { return x.value; });
      var input = { duration: f.duration.value, interests: interests, season: f.season.value, style: f.style.value };
      var btn = f.querySelector('button[type=submit]'); btn.disabled = true;
      API.planner(input).then(renderPlan).catch(function () { toast(t('contact.error')); }).then(function () { btn.disabled = false; });
    });
    renderSaved();
    if (S.lastPlan) renderPlan(S.lastPlan);
  }

  function pageGuide() {
    var secs = t('guide.sections');
    var icons = { bus: I.bus, sun: I.sun, yurt: I.yurt, info: I.info };
    return '<div class="page">' + pageHero(t('guide.title'), t('guide.text'), 'guide-hero', 'forest', 0) +
      '<section class="section"><div class="container"><div class="guide-nav">' + secs.map(function (s) { return '<a class="btn btn--ghost btn--sm" href="javascript:void(0)" data-jump="' + s.id + '">' + esc(s.title) + '</a>'; }).join('') + '</div>' +
      secs.map(function (s) {
        return '<div class="guide-section" id="g-' + s.id + '"><h2><span class="icon">' + icons[s.icon] + '</span>' + esc(s.title) + '</h2><div class="info-grid">' +
          s.items.map(function (it) { return '<div class="info-card reveal"><h3>' + esc(it.title) + '</h3><p>' + esc(it.text) + '</p></div>'; }).join('') + '</div></div>';
      }).join('') + '</div></section></div>';
  }
  function bindGuide() {
    document.querySelectorAll('[data-jump]').forEach(function (a) { a.addEventListener('click', function () { document.getElementById('g-' + a.dataset.jump).scrollIntoView({ behavior: 'smooth' }); }); });
  }

  function pageAbout() {
    var art = [['about-1', 'snow', 0], ['about-2', 'historic', 1], ['about-3', 'lake', 3], ['manas-about', 'historic', 2], ['about-5', 'city', 1]];
    return '<div class="page">' + pageHero(t('about.title'), t('about.text'), 'about-hero', 'snow', 1) +
      '<section class="section"><div class="container"><h2>' + esc(t('about.factsTitle')) + '</h2><div class="facts-grid">' +
      t('about.facts').map(function (f) { return '<div class="fact-tile reveal"><span>' + esc(f.label) + '</span><b>' + esc(f.value) + '</b></div>'; }).join('') + '</div>' +
      t('about.sections').map(function (s, i) {
        var a = art[i % art.length];
        return '<div class="about-row reveal"><div class="about-row__media">' + Scenes.scene(a[0], a[1], a[2], { yurts: i === 2, uid: 'ab' + i }) + '</div><div><h2>' + esc(s.title) + '</h2><p>' + esc(s.text) + '</p></div></div>';
      }).join('') + '</div></section></div>';
  }

  function pageFavorites() {
    var list = S.favorites.map(bySlug).filter(Boolean);
    return '<div class="page">' + pageHero(t('favorites.title'), t('favorites.text'), 'fav-hero', 'lake', 2) +
      '<section class="section"><div class="container">' +
      (list.length ? '<div class="results-bar"><span>' + esc(t('explore.results', { n: list.length })) + '</span><button class="btn btn--ghost btn--sm" id="clearFav">' + esc(t('favorites.clear')) + '</button></div><div class="grid grid--cards">' + list.map(card).join('') + '</div>' :
        '<div class="empty">' + I.heart + '<p>' + esc(t('favorites.empty')) + '</p><a class="btn btn--primary" href="#/explore">' + esc(t('favorites.browse')) + '</a></div>') +
      '</div></section></div>';
  }
  function bindFavorites() {
    var c = document.getElementById('clearFav');
    if (c) c.onclick = function () { askConfirm(t('favorites.confirmClear')).then(function (ok) { if (ok) { S.favorites = []; API.store.set('nw_favorites', []); updateFavBadge(); render(); } }); };
  }

  function pageContact() {
    return '<div class="page">' + pageHero(t('contact.title'), t('contact.text'), 'contact-hero', 'mountain', 1) +
      '<div class="container"><div class="contact-layout"><form class="form-card" id="contactForm" novalidate><div id="formMsg"></div>' +
      '<div class="form-row"><div class="field"><label for="c-name">' + esc(t('contact.name')) + ' *</label><input class="input" id="c-name" name="name" maxlength="100" required></div>' +
      '<div class="field"><label for="c-email">' + esc(t('contact.email')) + ' *</label><input class="input" id="c-email" name="email" type="email" maxlength="150" required></div></div>' +
      '<div class="field"><label for="c-subject">' + esc(t('contact.subject')) + '</label><input class="input" id="c-subject" name="subject" maxlength="150"></div>' +
      '<div class="field"><label for="c-message">' + esc(t('contact.message')) + ' *</label><textarea class="input" id="c-message" name="message" maxlength="3000" required></textarea></div>' +
      '<button class="btn btn--primary" type="submit">' + esc(t('contact.send')) + ' ' + I.arrowR + '</button></form>' +
      '<aside class="info-side"><h3>' + esc(t('contact.info')) + '</h3>' +
      '<div class="info-line">' + I.pin + '<span>' + esc(t('contact.address')) + '</span></div>' +
      '<div class="info-line">' + I.mail + '<span>hello@nomadway.kg</span></div>' +
      '<div class="info-line">' + I.phone + '<span>+996 (555) 00-00-00</span></div>' +
      '<h3 style="margin-top:10px">' + esc(t('contact.follow')) + '</h3><div class="socials"><a href="#/contact" aria-label="Instagram">' + I.ig + '</a><a href="#/contact" aria-label="Facebook">' + I.fb + '</a><a href="#/contact" aria-label="Telegram">' + I.tg + '</a><a href="#/contact" aria-label="YouTube">' + I.yt + '</a></div>' +
      '</aside></div><div style="height:80px"></div></div></div>';
  }
  function bindContact() {
    var f = document.getElementById('contactForm'), msg = document.getElementById('formMsg');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = { name: f.name.value.trim(), email: f.email.value.trim(), subject: f.subject.value.trim(), message: f.message.value.trim() };
      if (!data.name || !data.email || !data.message) { msg.innerHTML = '<div class="alert alert--err">' + esc(t('contact.required')) + '</div>'; return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { msg.innerHTML = '<div class="alert alert--err">' + esc(t('contact.invalidEmail')) + '</div>'; return; }
      var btn = f.querySelector('button'); btn.disabled = true; btn.textContent = t('contact.sending');
      API.contact(data).then(function () { msg.innerHTML = '<div class="alert alert--ok">' + esc(t('contact.success')) + '</div>'; f.reset(); })
        .catch(function () { msg.innerHTML = '<div class="alert alert--err">' + esc(t('contact.error')) + '</div>'; })
        .then(function () { btn.disabled = false; btn.innerHTML = esc(t('contact.send')) + ' ' + I.arrowR; });
    });
  }

  // ---------- Admin ----------
  var ADM = { tab: 'dashboard', editing: null };
  function pageAdmin() {
    if (!API.admin.isLoggedIn()) {
      return '<div class="page admin-wrap"><div class="container"><form class="login-card" id="loginForm"><h2>' + esc(t('admin.title')) + '</h2><div id="loginMsg"></div>' +
        '<div class="field"><label for="a-user">' + esc(t('admin.username')) + '</label><input class="input" id="a-user" name="username" autocomplete="username" required></div>' +
        '<div class="field"><label for="a-pass">' + esc(t('admin.password')) + '</label><input class="input" id="a-pass" name="password" type="password" autocomplete="current-password" required></div>' +
        '<button class="btn btn--primary" style="width:100%" type="submit">' + esc(t('admin.login')) + '</button>' +
        (API.mode === 'local' ? '<p style="font-size:.82rem;color:var(--muted);margin:14px 0 0">' + esc(t('admin.demoHint')) + '</p>' : '') +
        '</form></div></div>';
    }
    return '<div class="page admin-wrap"><div class="container"><div class="admin-top"><h1 style="font-size:2rem;margin:0">' + esc(t('admin.title')) + '</h1>' +
      '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="mode-pill">' + esc(t('admin.mode')) + ': ' + esc(API.mode === 'server' ? t('admin.modeServer') : t('admin.modeLocal')) + '</span>' +
      (API.mode === 'local' ? '<button class="btn btn--sm" style="background:#fff" id="resetDemo">' + esc(t('admin.resetDemo')) + '</button>' : '') +
      '<button class="btn btn--ghost btn--sm" id="logout">' + esc(t('admin.logout')) + '</button></div></div>' +
      '<div class="tabs">' + ['dashboard', 'destinations', 'routes', 'messages'].map(function (k) { return '<button data-tab="' + k + '" class="' + (ADM.tab === k ? 'active' : '') + '">' + esc(t('admin.' + k)) + '</button>'; }).join('') + '</div>' +
      '<div id="adminBody"><p>' + esc(t('common.loading')) + '</p></div></div></div>';
  }
  function bindAdmin() {
    var lf = document.getElementById('loginForm');
    if (lf) {
      lf.addEventListener('submit', function (e) {
        e.preventDefault();
        API.admin.login(lf.username.value.trim(), lf.password.value).then(function () { render(); })
          .catch(function () { document.getElementById('loginMsg').innerHTML = '<div class="alert alert--err">' + esc(t('admin.loginError')) + '</div>'; });
      });
      return;
    }
    document.getElementById('logout').onclick = function () { API.admin.logout(); render(); };
    var rd = document.getElementById('resetDemo');
    if (rd) rd.onclick = function () { API.admin.resetDemo(); reloadData().then(render); };
    document.querySelectorAll('[data-tab]').forEach(function (b) { b.onclick = function () { ADM.tab = b.dataset.tab; ADM.editing = null; render(); }; });
    renderAdminTab();
  }
  function adminFail(err) {
    if (err && err.status === 401) { API.admin.logout(); render(); return; }
    toast((err && err.message) || t('contact.error'));
  }
  function renderAdminTab() {
    var body = document.getElementById('adminBody');
    if (ADM.tab === 'dashboard') {
      API.admin.messages().then(function (msgs) {
        body.innerHTML = '<div class="stat-cards">' +
          '<div class="stat-card"><b>' + S.destinations.length + '</b><span>' + esc(t('admin.total')) + '</span></div>' +
          '<div class="stat-card"><b>' + S.destinations.filter(function (d) { return d.featured; }).length + '</b><span>' + esc(t('admin.featuredCount')) + '</span></div>' +
          '<div class="stat-card"><b>' + (S.routes || []).length + '</b><span>' + esc(t('admin.routesCount')) + '</span></div>' +
          '<div class="stat-card"><b>' + msgs.length + '</b><span>' + esc(t('admin.messagesCount')) + '</span></div></div>' +
          '<div class="panel"><h3>' + esc(t('admin.messages')) + '</h3>' + messagesTable(msgs.slice(0, 5)) + '</div>';
      }).catch(adminFail);
    } else if (ADM.tab === 'messages') {
      API.admin.messages().then(function (msgs) { body.innerHTML = '<div class="panel">' + messagesTable(msgs) + '</div>'; }).catch(adminFail);
    } else if (ADM.tab === 'routes') {
      body.innerHTML = '<div class="panel"><div class="field"><label for="routesJson">' + esc(t('admin.routesJson')) + '</label><textarea class="input code" id="routesJson">' + esc(JSON.stringify(S.routes, null, 2)) + '</textarea></div>' +
        '<button class="btn btn--primary" style="margin-top:14px" id="saveRoutes">' + esc(t('admin.save')) + '</button></div>';
      document.getElementById('saveRoutes').onclick = function () {
        var val;
        try { val = JSON.parse(document.getElementById('routesJson').value); if (!Array.isArray(val)) throw new Error(); } catch (e) { toast(t('admin.invalidJson')); return; }
        API.admin.saveRoutes(val).then(function () { toast(t('admin.saved')); return reloadData(); }).catch(adminFail);
      };
    } else if (ADM.tab === 'destinations') {
      if (ADM.editing) { body.innerHTML = destForm(ADM.editing); bindDestForm(); return; }
      body.innerHTML = '<div class="panel"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3 style="margin:0">' + esc(t('admin.destinations')) + ' (' + S.destinations.length + ')</h3>' +
        '<button class="btn btn--primary btn--sm" id="addDest">+ ' + esc(t('admin.add')) + '</button></div><table class="table"><thead><tr><th></th><th>' + esc(t('admin.nameEn')) + '</th><th>' + esc(t('explore.region')) + '</th><th>' + esc(t('explore.category')) + '</th><th></th></tr></thead><tbody>' +
        S.destinations.map(function (d) {
          return '<tr><td><div class="thumb">' + media(d, 0, 'adm') + '</div></td><td><b>' + esc(loc(d.name)) + '</b><br><small style="color:var(--muted)">/' + esc(d.slug) + (d.featured ? ' · ★' : '') + '</small></td><td>' + esc(t('regions.' + d.region)) + '</td><td>' + d.categories.map(function (c) { return esc(t('categories.' + c)); }).join(', ') + '</td>' +
            '<td><div class="actions"><button class="btn btn--ghost btn--sm" data-edit="' + esc(d.slug) + '">' + esc(t('admin.edit')) + '</button><button class="btn btn--danger btn--sm" data-del="' + esc(d.slug) + '">' + esc(t('admin.delete')) + '</button></div></td></tr>';
        }).join('') + '</tbody></table></div>';
      document.getElementById('addDest').onclick = function () { ADM.editing = { isNew: true, d: { slug: '', name: { en: '', ru: '' }, short: { en: '', ru: '' }, description: { en: '', ru: '' }, region: 'chuy', categories: ['nature'], seasons: ['summer'], difficulty: 'easy', scene: 'mountain', lat: 41.5, lng: 74.5, featured: false, activities: ['hiking'], tips: { en: [], ru: [] }, images: [] } }; renderAdminTab(); };
      body.querySelectorAll('[data-edit]').forEach(function (b) { b.onclick = function () { ADM.editing = { isNew: false, d: JSON.parse(JSON.stringify(bySlug(b.dataset.edit))) }; renderAdminTab(); }; });
      body.querySelectorAll('[data-del]').forEach(function (b) {
        b.onclick = function () {
          askConfirm(t('admin.confirmDelete')).then(function (ok) {
            if (!ok) return;
            return API.admin.deleteDestination(b.dataset.del).then(function () {
              S.favorites = S.favorites.filter(function (s) { return s !== b.dataset.del; }); API.store.set('nw_favorites', S.favorites);
              return reloadData();
            }).then(function () { toast(t('admin.saved')); renderAdminTab(); });
          }).catch(adminFail);
        };
      });
    }
  }
  function messagesTable(msgs) {
    if (!msgs.length) return '<p style="color:var(--muted)">' + esc(t('admin.noMessages')) + '</p>';
    return '<table class="table"><thead><tr><th>' + esc(t('admin.date')) + '</th><th>' + esc(t('admin.from')) + '</th><th>' + esc(t('contact.subject')) + '</th><th>' + esc(t('contact.message')) + '</th></tr></thead><tbody>' +
      msgs.map(function (m) { return '<tr><td style="white-space:nowrap">' + esc(new Date(m.created_at).toLocaleString(S.lang)) + '</td><td><b>' + esc(m.name) + '</b><br><small>' + esc(m.email) + '</small></td><td>' + esc(m.subject || '—') + '</td><td>' + esc(m.message) + '</td></tr>'; }).join('') + '</tbody></table>';
  }
  function destForm(ed) {
    var d = ed.d;
    function inp(id, label, val, type) { return '<div class="field"><label for="' + id + '">' + esc(label) + '</label><input class="input" id="' + id + '" value="' + esc(val) + '"' + (type ? ' type="' + type + '" step="any"' : '') + '></div>'; }
    function ta(id, label, val, full) { return '<div class="field' + (full ? ' full' : '') + '"><label for="' + id + '">' + esc(label) + '</label><textarea class="input" id="' + id + '" style="min-height:90px">' + esc(val) + '</textarea></div>'; }
    function sel(id, label, list, prefix, val) { return '<div class="field"><label for="' + id + '">' + esc(label) + '</label><select class="input" id="' + id + '">' + list.map(function (v) { return '<option value="' + v + '"' + (v === val ? ' selected' : '') + '>' + esc(prefix ? t(prefix + '.' + v) : v) + '</option>'; }).join('') + '</select></div>'; }
    function checks(name, label, list, prefix, vals) { return '<div class="field"><label>' + esc(label) + '</label><div class="checks">' + list.map(function (v) { return '<label><input type="checkbox" name="' + name + '" value="' + v + '"' + (vals.indexOf(v) !== -1 ? ' checked' : '') + '>' + esc(t(prefix + '.' + v)) + '</label>'; }).join('') + '</div></div>'; }
    return '<div class="panel"><h3>' + esc(ed.isNew ? t('admin.add') : t('admin.edit') + ': ' + loc(d.name)) + '</h3><form id="destForm" class="edit-form">' +
      inp('e-slug', t('admin.slug'), d.slug) + sel('e-region', t('explore.region'), REGIONS, 'regions', d.region) +
      inp('e-name-en', t('admin.nameEn'), d.name.en) + inp('e-name-ru', t('admin.nameRu'), d.name.ru) +
      ta('e-short-en', t('admin.shortEn'), d.short.en) + ta('e-short-ru', t('admin.shortRu'), d.short.ru) +
      ta('e-desc-en', t('admin.descEn'), d.description.en) + ta('e-desc-ru', t('admin.descRu'), d.description.ru) +
      checks('cat', t('explore.category'), CATS, 'categories', d.categories) + checks('season', t('explore.season'), SEASONS, 'seasons', d.seasons) +
      sel('e-diff', t('explore.difficulty'), DIFFS, 'difficulty', d.difficulty) + sel('e-scene', t('admin.scene'), SCENES, null, d.scene) +
      inp('e-lat', t('admin.lat'), d.lat, 'number') + inp('e-lng', t('admin.lng'), d.lng, 'number') +
      '<div class="field full"><label for="e-acts">' + esc(t('admin.activitiesLbl')) + '</label><input class="input" id="e-acts" value="' + esc((d.activities || []).join(', ')) + '"><small style="color:var(--muted)">' + esc(Object.keys(t('activities')).join(', ')) + '</small></div>' +
      ta('e-tips-en', t('admin.tipsEn'), ((d.tips && d.tips.en) || []).join('\n')) + ta('e-tips-ru', t('admin.tipsRu'), ((d.tips && d.tips.ru) || []).join('\n')) +
      ta('e-images', t('admin.images'), (d.images || []).join('\n'), true) +
      '<div class="field full"><label class="checks"><label><input type="checkbox" id="e-featured"' + (d.featured ? ' checked' : '') + '> ' + esc(t('admin.featured')) + '</label></label></div>' +
      '<div class="full" style="display:flex;gap:10px"><button class="btn btn--primary" type="submit">' + esc(t('admin.save')) + '</button><button class="btn btn--ghost" type="button" id="cancelEdit">' + esc(t('admin.cancel')) + '</button></div>' +
      '</form></div>';
  }
  function bindDestForm() {
    var f = document.getElementById('destForm');
    document.getElementById('cancelEdit').onclick = function () { ADM.editing = null; renderAdminTab(); };
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      function v(id) { return document.getElementById(id).value.trim(); }
      function lines(id) { return v(id).split('\n').map(function (s) { return s.trim(); }).filter(Boolean); }
      function checked(name) { return Array.prototype.map.call(f.querySelectorAll('input[name=' + name + ']:checked'), function (x) { return x.value; }); }
      var d = {
        slug: v('e-slug').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, ''),
        name: { en: v('e-name-en'), ru: v('e-name-ru') },
        short: { en: v('e-short-en'), ru: v('e-short-ru') },
        description: { en: v('e-desc-en'), ru: v('e-desc-ru') },
        region: v('e-region'), categories: checked('cat'), seasons: checked('season'), difficulty: v('e-diff'), scene: v('e-scene'),
        lat: parseFloat(v('e-lat')), lng: parseFloat(v('e-lng')),
        activities: v('e-acts').split(',').map(function (s) { return s.trim(); }).filter(Boolean),
        tips: { en: lines('e-tips-en'), ru: lines('e-tips-ru') },
        images: lines('e-images'),
        featured: document.getElementById('e-featured').checked
      };
      if (!d.slug || !d.name.en || !d.name.ru || !d.categories.length || !d.seasons.length || isNaN(d.lat) || isNaN(d.lng)) { toast(t('contact.required')); return; }
      if (!ADM.editing.isNew) d._originalSlug = ADM.editing.d.slug;
      API.admin.saveDestination(d, ADM.editing.isNew).then(function () { return reloadData(); })
        .then(function () { ADM.editing = null; toast(t('admin.saved')); renderAdminTab(); }).catch(adminFail);
    });
  }

  // ---------- Router ----------
  var ROUTES = {
    '/': [pageHome, bindHome, 'home'],
    '/explore': [pageExplore, bindExplore, 'explore'],
    '/destination': [pageDestination, bindDestination, 'explore'],
    '/map': [pageMap, bindMap, 'map'],
    '/planner': [pagePlanner, bindPlanner, 'planner'],
    '/guide': [pageGuide, bindGuide, 'guide'],
    '/about': [pageAbout, null, 'about'],
    '/favorites': [pageFavorites, bindFavorites, 'favorites'],
    '/contact': [pageContact, bindContact, 'contact'],
    '/admin': [pageAdmin, bindAdmin, 'admin']
  };
  var lastPath = null;
  function render() {
    var h = parseHash();
    var r = ROUTES[h.path] || ROUTES['/'];
    destroyMaps();
    renderHeader();
    var arg = h.path === '/destination' ? h.param : h.query;
    app.innerHTML = r[0](arg);
    document.title = (h.path === '/' ? t('meta.title') : t('nav.' + r[2]) + ' — Nomad Way');
    if (r[1]) r[1](arg);
    observeReveal();
    var key = h.path + (h.param || '');
    if (key !== lastPath) window.scrollTo(0, 0);
    lastPath = key;
  }

  function reloadData() {
    return Promise.all([API.destinations(), API.routes()]).then(function (r) { S.destinations = r[0]; S.routes = r[1]; });
  }
  function setLang(lang) {
    return API.i18n(lang).then(function (dict) {
      S.lang = lang; S.dict = dict;
      API.store.set('nw_lang', lang);
      document.documentElement.lang = lang;
    });
  }

  // ---------- Global events ----------
  document.addEventListener('click', function (e) {
    var fav = e.target.closest('[data-fav]');
    if (fav) { e.preventDefault(); e.stopPropagation(); toggleFav(fav.dataset.fav); return; }
    var lb = e.target.closest('[data-lang]');
    if (lb) { setLang(lb.dataset.lang).then(function () { renderFooter(); render(); }); return; }
    if (e.target.closest('#burger')) { document.getElementById('nav').classList.toggle('open'); return; }
    if (e.target.closest('#nav a')) document.getElementById('nav').classList.remove('open');
  });
  document.addEventListener('keydown', function (e) {
    var lb = document.getElementById('lightbox');
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') { LB.i = (LB.i + 1) % 5; drawLb(); }
    if (e.key === 'ArrowLeft') { LB.i = (LB.i + 4) % 5; drawLb(); }
  });
  window.addEventListener('hashchange', render);

  // ---------- Boot ----------
  API.init()
    .then(function () { return Promise.all([setLang(S.lang), reloadData()]); })
    .then(function () { renderFooter(); render(); })
    .catch(function (err) {
      console.error(err);
      app.innerHTML = '<div class="container section empty"><h2>Error</h2><p>' + esc(err.message) + '</p></div>';
    });
})();
