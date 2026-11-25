/*
 * Nomad Way — procedural landscape illustrations (SVG).
 * Used as default artwork when a destination has no photo URLs.
 */
(function (root) {
  'use strict';

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    var s = seed || 1;
    return function () { s = (Math.imul(s ^ (s >>> 15), 2246822507) + 0x6D2B79F5) >>> 0; s ^= s >>> 13; return (s >>> 0) / 4294967296; };
  }

  var PALETTES = [
    { sky: ['#8cc8e6', '#e6f2f2'], sun: '#fff6d8', far: '#9bb7c9', mid: '#5f8a8f', near: '#2f6152', front: '#184E3B', water: ['#3282A6', '#7fbcd2'], rock: ['#c9714a', '#a8522f', '#e3a26f'], snow: '#ffffff', glow: 0 },
    { sky: ['#f5b97a', '#fde9c8'], sun: '#fff1c1', far: '#c99a8a', mid: '#8a6f6c', near: '#4b5048', front: '#2b3a31', water: ['#d98e5e', '#f7cf9b'], rock: ['#d8784a', '#b0532e', '#f0b07a'], snow: '#fff3e6', glow: 1 },
    { sky: ['#3d4e7a', '#d98f86'], sun: '#ffd4a8', far: '#6b6687', mid: '#4b4d6b', near: '#2e3550', front: '#1d2338', water: ['#5d5f8a', '#c48a8a'], rock: ['#9a5a54', '#6d3d3d', '#c07a66'], snow: '#f1e4ef', glow: 1 },
    { sky: ['#b9d6df', '#f2f1ea'], sun: '#ffffff', far: '#c4d4d6', mid: '#93aeb0', near: '#5c7f78', front: '#3b5d52', water: ['#7aa9b8', '#cfe3e6'], rock: ['#c28c6e', '#a26a50', '#ddb08f'], snow: '#ffffff', glow: 0 }
  ];

  function ridge(r, y, amp, rough, w, h, jag) {
    var n = 64, pts = [], i;
    var base = [];
    for (i = 0; i <= n; i++) base.push(0);
    var step = n, scale = amp;
    base[0] = (r() - .5) * amp; base[n] = (r() - .5) * amp;
    while (step > 1) {
      var half = step / 2;
      for (i = half; i < n; i += step) base[i] = (base[i - half] + base[i + half]) / 2 + (r() - .5) * scale;
      step = half; scale *= rough;
    }
    for (i = 0; i <= n; i++) {
      var x = (i / n) * w;
      var yy = y + base[i] * (jag ? 1.25 : 1);
      pts.push(x.toFixed(1) + ',' + yy.toFixed(1));
    }
    return { d: 'M0,' + h + ' L' + pts.join(' L') + ' L' + w + ',' + h + ' Z', base: base, y: y };
  }

  function snowcaps(rd, w, color, threshold) {
    // Draw caps over the highest points of a ridge.
    var out = '', n = rd.base.length - 1;
    for (var i = 1; i < n; i++) {
      var v = rd.base[i];
      if (v < rd.base[i - 1] && v < rd.base[i + 1] && v < threshold) {
        var x = (i / n) * w, y = rd.y + v;
        var x1 = ((i - 1.6) / n) * w, x2 = ((i + 1.6) / n) * w;
        var yl = rd.y + rd.base[i - 1] + 10, yr = rd.y + rd.base[i + 1] + 10;
        out += '<path d="M' + x1.toFixed(1) + ',' + ((y + yl) / 2 + 8).toFixed(1) + ' L' + x.toFixed(1) + ',' + y.toFixed(1) + ' L' + x2.toFixed(1) + ',' + ((y + yr) / 2 + 8).toFixed(1) +
          ' L' + (x + 8).toFixed(1) + ',' + (y + 22).toFixed(1) + ' L' + (x - 4).toFixed(1) + ',' + (y + 14).toFixed(1) + ' Z" fill="' + color + '" opacity=".92"/>';
      }
    }
    return out;
  }

  function pine(x, y, s, c) {
    return '<path d="M' + x + ',' + (y - s * 3) + ' L' + (x + s) + ',' + (y - s * 1.2) + ' L' + (x + s * .6) + ',' + (y - s * 1.2) + ' L' + (x + s * 1.3) + ',' + y + ' L' + (x - s * 1.3) + ',' + y + ' L' + (x - s * .6) + ',' + (y - s * 1.2) + ' L' + (x - s) + ',' + (y - s * 1.2) + ' Z" fill="' + c + '"/>';
  }
  function roundTree(x, y, s, c) {
    return '<rect x="' + (x - s * .12) + '" y="' + (y - s * .8) + '" width="' + (s * .24) + '" height="' + (s * .8) + '" fill="' + c + '"/><circle cx="' + x + '" cy="' + (y - s * 1.2) + '" r="' + (s * .75) + '" fill="' + c + '"/>';
  }
  function yurt(x, y, s, wall, roof) {
    return '<g><path d="M' + (x - s) + ',' + y + ' L' + (x - s) + ',' + (y - s * .7) + ' Q' + x + ',' + (y - s * 1.55) + ' ' + (x + s) + ',' + (y - s * .7) + ' L' + (x + s) + ',' + y + ' Z" fill="' + wall + '"/>' +
      '<path d="M' + (x - s * 1.05) + ',' + (y - s * .68) + ' Q' + x + ',' + (y - s * 1.6) + ' ' + (x + s * 1.05) + ',' + (y - s * .68) + ' Q' + x + ',' + (y - s * 1.1) + ' ' + (x - s * 1.05) + ',' + (y - s * .68) + ' Z" fill="' + roof + '"/>' +
      '<rect x="' + (x - s * .22) + '" y="' + (y - s * .5) + '" width="' + (s * .44) + '" height="' + (s * .5) + '" fill="' + roof + '"/>' +
      '<path d="M' + (x - s * .8) + ',' + (y - s * .45) + ' H' + (x + s * .8) + '" stroke="' + roof + '" stroke-width="' + (s * .08) + '" stroke-dasharray="' + (s * .2) + ' ' + (s * .12) + '"/></g>';
  }

  function scene(seedStr, type, variant, opts) {
    opts = opts || {};
    var W = 800, H = 500;
    var r = rng(hash(seedStr + ':' + (variant || 0)));
    var p = PALETTES[(variant || 0) % PALETTES.length];
    var id = 's' + hash(seedStr + type + variant + (opts.uid || '')).toString(36);
    var g = '';
    g += '<defs><linearGradient id="' + id + 'k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + p.sky[0] + '"/><stop offset="1" stop-color="' + p.sky[1] + '"/></linearGradient>' +
      '<linearGradient id="' + id + 'w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + p.water[1] + '"/><stop offset="1" stop-color="' + p.water[0] + '"/></linearGradient>' +
      '<radialGradient id="' + id + 'g"><stop offset="0" stop-color="' + p.sun + '" stop-opacity=".9"/><stop offset="1" stop-color="' + p.sun + '" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + id + 'f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/></linearGradient></defs>';
    g += '<rect width="' + W + '" height="' + H + '" fill="url(#' + id + 'k)"/>';
    var sx = 120 + r() * 560, sy = 70 + r() * 90;
    g += '<circle cx="' + sx + '" cy="' + sy + '" r="140" fill="url(#' + id + 'g)"/><circle cx="' + sx + '" cy="' + sy + '" r="' + (variant === 2 ? 30 : 26) + '" fill="' + p.sun + '"/>';
    // clouds
    for (var c = 0; c < 3; c++) {
      var cx = r() * W, cy = 40 + r() * 120, cw = 60 + r() * 90;
      g += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + cw + '" ry="' + (cw * .18) + '" fill="#fff" opacity="' + (.25 + r() * .3) + '"/>';
    }

    var horizon = type === 'lake' ? 300 : type === 'city' || type === 'historic' ? 330 : 320;
    var jag = type === 'snow' || type === 'mountain';
    var amp = type === 'snow' ? 260 : type === 'canyon' ? 90 : type === 'forest' ? 110 : 200;

    // Far range with snow
    var far = ridge(r, horizon - 110 - (type === 'snow' ? 40 : 0), amp, .55, W, H, jag);
    g += '<path d="' + far.d + '" fill="' + p.far + '"/>';
    if (type !== 'canyon') g += snowcaps(far, W, p.snow, type === 'snow' ? 10 : -amp * .18);
    g += '<rect y="' + (horizon - 160) + '" width="' + W + '" height="160" fill="url(#' + id + 'f)"/>';

    if (type === 'canyon') {
      // Layered red rock mesas
      for (var L = 0; L < 3; L++) {
        var baseY = horizon - 40 + L * 55, col = p.rock[L % 3];
        var d = 'M0,' + H + ' L0,' + baseY;
        var x = 0;
        while (x < W) {
          var wseg = 30 + r() * 90, hseg = 20 + r() * (90 - L * 20);
          d += ' L' + x.toFixed(0) + ',' + (baseY - hseg).toFixed(0) + ' L' + (x + wseg * .15).toFixed(0) + ',' + (baseY - hseg - 6 - r() * 10).toFixed(0) +
            ' L' + (x + wseg * .85).toFixed(0) + ',' + (baseY - hseg - 4).toFixed(0) + ' L' + (x + wseg).toFixed(0) + ',' + (baseY - r() * 15).toFixed(0);
          x += wseg;
        }
        d += ' L' + W + ',' + H + ' Z';
        g += '<path d="' + d + '" fill="' + col + '"/>';
        for (var s = 0; s < 5; s++) g += '<path d="M0,' + (baseY + 10 + s * 9) + ' H' + W + '" stroke="#000" stroke-opacity=".06" stroke-width="3"/>';
      }
      if (seedStr.indexOf('kel-suu') !== -1) g += '<path d="M260,' + H + ' C330,420 300,400 380,380 C430,368 470,372 520,' + H + ' Z" fill="url(#' + id + 'w)"/>';
    } else {
      var mid = ridge(r, horizon - 30, amp * .55, .5, W, H, jag);
      g += '<path d="' + mid.d + '" fill="' + p.mid + '"/>';
      if (type === 'snow') g += snowcaps(mid, W, p.snow, 0);
      var near = ridge(r, horizon + 30, amp * .35, .45, W, H, false);
      g += '<path d="' + near.d + '" fill="' + p.near + '"/>';
    }

    if (type === 'lake') {
      g += '<rect y="' + (horizon + 40) + '" width="' + W + '" height="' + (H - horizon - 40) + '" fill="url(#' + id + 'w)"/>';
      for (var k = 0; k < 14; k++) {
        var ly = horizon + 55 + r() * (H - horizon - 70), lx = r() * W;
        g += '<path d="M' + lx + ',' + ly + ' h' + (20 + r() * 60) + '" stroke="#fff" stroke-opacity="' + (.2 + r() * .3) + '" stroke-width="2" stroke-linecap="round"/>';
      }
      g += '<ellipse cx="' + sx + '" cy="' + (horizon + 90) + '" rx="40" ry="6" fill="' + p.sun + '" opacity=".5"/>';
      // shore
      g += '<path d="M0,' + H + ' L0,' + (H - 50) + ' Q' + (W * .25) + ',' + (H - 80) + ' ' + (W * .45) + ',' + (H - 40) + ' L' + (W * .45) + ',' + H + ' Z" fill="' + p.front + '"/>';
      if (opts.yurts !== false) { g += yurt(140, H - 58, 26, '#f7f1e3', '#a0552d'); g += yurt(205, H - 52, 20, '#f7f1e3', '#a0552d'); }
    }

    if (type === 'mountain' || type === 'snow') {
      var front = ridge(r, H - 60, 50, .5, W, H, false);
      g += '<path d="' + front.d + '" fill="' + p.front + '"/>';
      for (var t = 0; t < 26; t++) { var tx = r() * W; g += pine(tx.toFixed(0), (H - 40 + r() * 30).toFixed(0), 10 + r() * 10, p.front); }
      if (type === 'snow') g += '<path d="M0,' + H + ' L0,' + (H - 25) + ' Q' + W / 2 + ',' + (H - 55) + ' ' + W + ',' + (H - 20) + ' L' + W + ',' + H + ' Z" fill="' + p.snow + '" opacity=".9"/>';
    }

    if (type === 'forest') {
      g += '<path d="M' + (W * .35) + ',' + (horizon + 70) + ' Q' + (W * .55) + ',' + (horizon + 40) + ' ' + (W * .75) + ',' + (horizon + 70) + ' Q' + (W * .55) + ',' + (horizon + 100) + ' ' + (W * .35) + ',' + (horizon + 70) + ' Z" fill="url(#' + id + 'w)"/>';
      var fr = ridge(r, H - 70, 60, .5, W, H, false);
      g += '<path d="' + fr.d + '" fill="' + p.front + '"/>';
      for (var f = 0; f < 40; f++) {
        var fx = r() * W, fy = H - 30 - r() * 70, fs = 10 + r() * 14;
        g += r() > .5 ? pine(fx.toFixed(0), fy.toFixed(0), fs, p.front) : roundTree(fx.toFixed(0), fy.toFixed(0), fs, r() > .5 ? p.near : p.front);
      }
    }

    if (type === 'city') {
      var bx = 0;
      g += '<g fill="' + p.front + '">';
      while (bx < W) {
        var bw = 30 + r() * 60, bh = 40 + r() * 110;
        g += '<rect x="' + bx.toFixed(0) + '" y="' + (H - bh).toFixed(0) + '" width="' + (bw - 4).toFixed(0) + '" height="' + bh.toFixed(0) + '"/>';
        if (r() > .75) g += '<path d="M' + (bx + bw / 2 - 14).toFixed(0) + ',' + (H - bh).toFixed(0) + ' Q' + (bx + bw / 2).toFixed(0) + ',' + (H - bh - 34).toFixed(0) + ' ' + (bx + bw / 2 + 14).toFixed(0) + ',' + (H - bh).toFixed(0) + ' Z"/>';
        bx += bw;
      }
      g += '</g>';
      for (var wi = 0; wi < 60; wi++) g += '<rect x="' + (r() * W).toFixed(0) + '" y="' + (H - 20 - r() * 100).toFixed(0) + '" width="4" height="6" fill="' + p.sun + '" opacity="' + (variant === 2 ? .8 : .25) + '"/>';
      for (var tr = 0; tr < 16; tr++) g += roundTree((r() * W).toFixed(0), H - 2, 14 + r() * 8, p.near);
    }

    if (type === 'historic') {
      g += '<path d="M0,' + H + ' L0,' + (H - 70) + ' Q' + W / 2 + ',' + (H - 100) + ' ' + W + ',' + (H - 70) + ' L' + W + ',' + H + ' Z" fill="' + p.near + '"/>';
      var tx0 = 300 + r() * 200, base = H - 82;
      if (seedStr.indexOf('tash') !== -1 || seedStr.indexOf('manas') !== -1) {
        // caravanserai / mausoleum with dome
        g += '<rect x="' + (tx0 - 110) + '" y="' + (base - 60) + '" width="220" height="62" fill="' + p.rock[2] + '"/><rect x="' + (tx0 - 110) + '" y="' + (base - 60) + '" width="220" height="62" fill="#000" opacity=".12"/>' +
          '<path d="M' + (tx0 - 46) + ',' + (base - 60) + ' Q' + tx0 + ',' + (base - 150) + ' ' + (tx0 + 46) + ',' + (base - 60) + ' Z" fill="' + p.rock[2] + '"/><path d="M' + (tx0 - 18) + ',' + (base + 2) + ' V' + (base - 28) + ' Q' + tx0 + ',' + (base - 48) + ' ' + (tx0 + 18) + ',' + (base - 28) + ' V' + (base + 2) + ' Z" fill="' + p.front + '"/>';
      } else if (seedStr.indexOf('sulaiman') !== -1 || seedStr.indexOf('petroglyph') !== -1) {
        // rock with carved ibex
        g += '<path d="M' + (tx0 - 160) + ',' + (base + 4) + ' Q' + (tx0 - 120) + ',' + (base - 120) + ' ' + tx0 + ',' + (base - 140) + ' Q' + (tx0 + 140) + ',' + (base - 110) + ' ' + (tx0 + 170) + ',' + (base + 4) + ' Z" fill="' + p.rock[1] + '"/>' +
          '<g stroke="' + p.sun + '" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"><path d="M' + (tx0 - 30) + ',' + (base - 50) + ' h40 M' + (tx0 - 26) + ',' + (base - 50) + ' v18 M' + (tx0 + 6) + ',' + (base - 50) + ' v18 M' + (tx0 + 10) + ',' + (base - 50) + ' l10 -14 M' + (tx0 + 20) + ',' + (base - 64) + ' q-20 -30 -40 -14"/></g>';
      } else {
        // Burana-like tower
        g += '<path d="M' + (tx0 - 26) + ',' + base + ' L' + (tx0 - 18) + ',' + (base - 170) + ' L' + (tx0 + 18) + ',' + (base - 170) + ' L' + (tx0 + 26) + ',' + base + ' Z" fill="' + p.rock[2] + '"/>' +
          '<path d="M' + (tx0 - 26) + ',' + base + ' L' + (tx0 - 18) + ',' + (base - 170) + ' L' + tx0 + ',' + (base - 170) + ' L' + tx0 + ',' + base + ' Z" fill="#000" opacity=".1"/>';
        for (var b = 1; b < 7; b++) g += '<path d="M' + (tx0 - 25 + b) + ',' + (base - b * 24) + ' H' + (tx0 + 25 - b) + '" stroke="#000" stroke-opacity=".15" stroke-width="3"/>';
        g += '<rect x="' + (tx0 - 34) + '" y="' + (base - 2) + '" width="68" height="14" fill="' + p.rock[1] + '"/>';
      }
      // balbal stones
      for (var bb = 0; bb < 5; bb++) { var bxx = 80 + bb * 40 + r() * 10; g += '<rect x="' + bxx + '" y="' + (H - 60) + '" width="12" height="' + (24 + r() * 10) + '" rx="5" fill="' + p.front + '"/>'; }
      g += '<path d="M0,' + H + ' L0,' + (H - 30) + ' Q' + W / 2 + ',' + (H - 46) + ' ' + W + ',' + (H - 30) + ' L' + W + ',' + H + ' Z" fill="' + p.front + '"/>';
    }

    if (opts.yurts && type !== 'lake') { g += yurt(W - 160, H - 50, 26, '#f7f1e3', '#a0552d'); g += yurt(W - 100, H - 46, 18, '#f7f1e3', '#a0552d'); }

    // birds
    for (var bi = 0; bi < 3; bi++) {
      var bdx = r() * W * .8 + 60, bdy = 60 + r() * 100;
      g += '<path d="M' + bdx + ',' + bdy + ' q6 -6 12 0 q6 -6 12 0" stroke="' + p.front + '" stroke-width="2" fill="none" opacity=".6"/>';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">' + g + '</svg>';
  }

  root.NomadScenes = { scene: scene };
})(typeof self !== 'undefined' ? self : this);
