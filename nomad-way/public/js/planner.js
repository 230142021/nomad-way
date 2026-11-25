/*
 * Nomad Way — Trip Planner engine.
 * Shared by the browser (window.NomadPlanner) and the Node.js server (require).
 * Builds a day-by-day route from predefined route templates.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NomadPlanner = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var TOTAL_DAYS = { '1-3': 3, '4-7': 7, '8-14': 12, '14+': 18 };
  var INTEREST_MATCH = {
    nature: function (d) { return has(d.categories, 'nature') || has(d.categories, 'relaxation'); },
    mountains: function (d) { return d.scene === 'mountain' || d.scene === 'snow' || has(d.categories, 'hiking'); },
    culture: function (d) { return has(d.categories, 'culture'); },
    adventure: function (d) { return has(d.categories, 'adventure'); }
  };

  function rotate(arr, k) {
    if (!arr.length) return arr;
    k = k % arr.length;
    return arr.slice(k).concat(arr.slice(0, k));
  }

  function has(arr, v) { return Array.isArray(arr) && arr.indexOf(v) !== -1; }

  function haversineKm(a, b) {
    var R = 6371, toRad = Math.PI / 180;
    var dLat = (b.lat - a.lat) * toRad, dLng = (b.lng - a.lng) * toRad;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a.lat * toRad) * Math.cos(b.lat * toRad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function interestScore(d, interests) {
    var s = 0;
    interests.forEach(function (i) { if (INTEREST_MATCH[i] && INTEREST_MATCH[i](d)) s += 1; });
    return s;
  }

  function stopDays(d, style, index) {
    var base = d.difficulty === 'hard' ? 2 : 1;
    if (style === 'relaxed') return base + 1;
    if (style === 'balanced') return base + (d.difficulty !== 'easy' && index % 2 === 0 ? 1 : 0);
    return base; // active
  }

  /**
   * @param {object} input  { duration, interests[], season, style }
   * @param {Array} destinations
   * @param {Array} templates
   */
  function generate(input, destinations, templates) {
    input = input || {};
    var duration = TOTAL_DAYS[input.duration] ? input.duration : '4-7';
    var interests = (Array.isArray(input.interests) && input.interests.length ? input.interests : ['nature'])
      .filter(function (i) { return INTEREST_MATCH[i]; });
    if (!interests.length) interests = ['nature'];
    var season = ['spring', 'summer', 'autumn', 'winter'].indexOf(input.season) !== -1 ? input.season : 'summer';
    var style = ['relaxed', 'balanced', 'active'].indexOf(input.style) !== -1 ? input.style : 'balanced';
    var totalDays = TOTAL_DAYS[duration];

    var bySlug = {};
    destinations.forEach(function (d) { bySlug[d.slug] = d; });

    // 1. Pick the best template for this duration.
    var candidates = templates.filter(function (t) { return t.duration === duration; });
    if (!candidates.length) candidates = templates.slice();
    var best = null, bestScore = -Infinity;
    candidates.forEach(function (t) {
      var stops = t.stops.map(function (s) { return bySlug[s]; }).filter(Boolean);
      var inSeason = stops.filter(function (d) { return has(d.seasons, season); });
      var overlap = interests.filter(function (i) { return has(t.interests, i); }).length;
      var interestHits = inSeason.reduce(function (acc, d) { return acc + interestScore(d, interests); }, 0);
      var score = overlap * 4 + interestHits + (inSeason.length / Math.max(stops.length, 1)) * 3;
      if (score > bestScore) { bestScore = score; best = t; }
    });

    // 2. Rank in-season stops and fill days.
    var pool = best.stops.map(function (s, idx) { return { d: bySlug[s], order: idx }; })
      .filter(function (x) { return x.d && has(x.d.seasons, season); });
    var start = pool.filter(function (x) { return x.d.slug === best.start; })[0];
    var rest = pool.filter(function (x) { return x !== start; });
    rest.sort(function (a, b) {
      var sa = interestScore(a.d, interests) * 3 + (a.d.featured ? 1 : 0);
      var sb = interestScore(b.d, interests) * 3 + (b.d.featured ? 1 : 0);
      if (style === 'relaxed') { sa += a.d.difficulty === 'hard' ? -2 : 0; sb += b.d.difficulty === 'hard' ? -2 : 0; }
      if (style === 'active') { sa += a.d.difficulty === 'hard' ? 1 : 0; sb += b.d.difficulty === 'hard' ? 1 : 0; }
      return sb - sa || a.order - b.order;
    });

    var chosen = [], used = 0;
    var ordered = start ? [start].concat(rest) : rest;
    ordered.forEach(function (x, i) {
      var days = stopDays(x.d, style, i);
      if (used + days <= totalDays) { chosen.push({ d: x.d, order: x.order, days: days }); used += days; }
      else if (used < totalDays && chosen.length === 0) { chosen.push({ d: x.d, order: x.order, days: totalDays }); used = totalDays; }
    });
    chosen.sort(function (a, b) { return a.order - b.order; });

    // Leftover days become free/rest days at the most relaxing stop.
    var leftover = totalDays - used;
    if (leftover > 0 && chosen.length) {
      // Spread free days, preferring relaxing places and towns.
      var prefs = chosen.slice().sort(function (a, b) {
        var ra = (has(a.d.categories, 'relaxation') ? 2 : 0) + (a.d.scene === 'city' ? 1 : 0);
        var rb = (has(b.d.categories, 'relaxation') ? 2 : 0) + (b.d.scene === 'city' ? 1 : 0);
        return rb - ra;
      });
      for (var k = 0; k < leftover; k++) {
        var c0 = prefs[k % prefs.length];
        c0.days += 1;
        c0.extra = (c0.extra || 0) + 1;
      }
    }

    // 3. Build the day-by-day plan.
    var plan = [], day = 1, prev = null, totalKm = 0;
    chosen.forEach(function (c) {
      var travel = null;
      if (prev) {
        var km = Math.round(haversineKm(prev.d, c.d) * 1.35); // road factor
        totalKm += km;
        travel = { from: prev.d.slug, km: km, hours: Math.max(0.5, Math.round(km / 55 * 2) / 2) };
      }
      for (var i = 0; i < c.days; i++) {
        var isExtra = c.extra && i >= c.days - c.extra;
        plan.push({
          day: day++,
          slug: c.d.slug,
          kind: i === 0 ? (prev ? 'arrive' : 'start') : (isExtra ? 'free' : 'explore'),
          travel: i === 0 ? travel : null,
          activities: isExtra ? [] : rotate(c.d.activities || [], i * 2).slice(0, 3)
        });
      }
      prev = c;
    });

    return {
      input: { duration: duration, interests: interests, season: season, style: style },
      template: { id: best.id, title: best.title, summary: best.summary },
      totalDays: totalDays,
      totalKm: totalKm,
      stops: chosen.map(function (c) { return { slug: c.d.slug, days: c.days, lat: c.d.lat, lng: c.d.lng }; }),
      days: plan,
      createdAt: new Date().toISOString()
    };
  }

  return { generate: generate, haversineKm: haversineKm, TOTAL_DAYS: TOTAL_DAYS };
});
