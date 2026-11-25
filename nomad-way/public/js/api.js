/*
 * Nomad Way — data layer.
 * "server" mode: talks to the Node.js/Express REST API (PostgreSQL behind it).
 * "local" mode: runs fully in the browser (demo / static hosting) using bundled JSON + localStorage.
 */
(function (root) {
  'use strict';

  var LS = {
    get: function (k, def) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { /* noop */ } }
  };
  var mem = {};

  function fetchJSON(url, opts, timeout) {
    opts = opts || {};
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    if (ctrl) opts.signal = ctrl.signal;
    var timer = ctrl && timeout ? setTimeout(function () { ctrl.abort(); }, timeout) : null;
    return fetch(url, opts).then(function (res) {
      if (timer) clearTimeout(timer);
      return res.json().catch(function () { return {}; }).then(function (body) {
        if (!res.ok) { var err = new Error(body.error || ('HTTP ' + res.status)); err.status = res.status; throw err; }
        return body;
      });
    });
  }

  var API = {
    mode: 'local',
    token: LS.get('nw_admin_token', null),

    init: function () {
      if (root.__STATIC__) { API.mode = 'local'; return Promise.resolve('local'); }
      return fetchJSON('/api/health', {}, 1500)
        .then(function (r) { API.mode = r && r.ok ? 'server' : 'local'; return API.mode; })
        .catch(function () { API.mode = 'local'; return 'local'; });
    },

    i18n: function (lang) {
      if (root.__I18N__ && root.__I18N__[lang]) return Promise.resolve(root.__I18N__[lang]);
      return fetchJSON('i18n/' + lang + '.json');
    },

    // ----- bundled data (local mode) -----
    _bundled: function (name) {
      if (mem[name]) return Promise.resolve(mem[name]);
      if (root.__DATA__ && root.__DATA__[name]) { mem[name] = root.__DATA__[name]; return Promise.resolve(mem[name]); }
      return fetchJSON('data/' + name + '.json').then(function (d) { mem[name] = d; return d; });
    },
    _localDestinations: function () {
      var saved = LS.get('nw_local_destinations', null);
      return saved ? Promise.resolve(saved) : API._bundled('destinations');
    },
    _localRoutes: function () {
      var saved = LS.get('nw_local_routes', null);
      return saved ? Promise.resolve(saved) : API._bundled('routes');
    },

    // ----- public -----
    destinations: function () {
      if (API.mode === 'server') return fetchJSON('/api/destinations');
      return API._localDestinations();
    },
    destination: function (slug) {
      if (API.mode === 'server') return fetchJSON('/api/destinations/' + encodeURIComponent(slug));
      return API._localDestinations().then(function (list) {
        var d = list.filter(function (x) { return x.slug === slug; })[0];
        if (!d) { var e = new Error('Not found'); e.status = 404; throw e; }
        return d;
      });
    },
    routes: function () {
      if (API.mode === 'server') return fetchJSON('/api/routes');
      return API._localRoutes();
    },
    planner: function (input) {
      if (API.mode === 'server') {
        return fetchJSON('/api/planner', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
      }
      return Promise.all([API._localDestinations(), API._localRoutes()]).then(function (r) {
        return root.NomadPlanner.generate(input, r[0], r[1]);
      });
    },
    contact: function (msg) {
      if (API.mode === 'server') {
        return fetchJSON('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(msg) });
      }
      var list = LS.get('nw_local_messages', []);
      list.unshift(Object.assign({ id: Date.now(), created_at: new Date().toISOString() }, msg));
      LS.set('nw_local_messages', list);
      return new Promise(function (res) { setTimeout(function () { res({ ok: true }); }, 500); });
    },

    // ----- admin -----
    admin: {
      isLoggedIn: function () { return !!API.token; },
      _auth: function () { return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + API.token }; },
      login: function (username, password) {
        if (API.mode === 'server') {
          return fetchJSON('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username, password: password }) })
            .then(function (r) { API.token = r.token; LS.set('nw_admin_token', r.token); return r; });
        }
        if (username === 'admin' && password === 'admin123') {
          API.token = 'local-demo'; LS.set('nw_admin_token', API.token); return Promise.resolve({ token: API.token });
        }
        var e = new Error('Invalid credentials'); e.status = 401; return Promise.reject(e);
      },
      logout: function () { API.token = null; LS.del('nw_admin_token'); },
      saveDestination: function (d, isNew) {
        if (API.mode === 'server') {
          var url = isNew ? '/api/admin/destinations' : '/api/admin/destinations/' + encodeURIComponent(d._originalSlug || d.slug);
          return fetchJSON(url, { method: isNew ? 'POST' : 'PUT', headers: API.admin._auth(), body: JSON.stringify(d) });
        }
        return API._localDestinations().then(function (list) {
          list = list.slice();
          var orig = d._originalSlug || d.slug;
          var clean = Object.assign({}, d); delete clean._originalSlug;
          if (isNew) {
            if (list.some(function (x) { return x.slug === clean.slug; })) throw new Error('Slug already exists');
            list.push(clean);
          } else {
            var i = list.findIndex(function (x) { return x.slug === orig; });
            if (i === -1) throw new Error('Not found');
            list[i] = clean;
          }
          LS.set('nw_local_destinations', list);
          return clean;
        });
      },
      deleteDestination: function (slug) {
        if (API.mode === 'server') {
          return fetchJSON('/api/admin/destinations/' + encodeURIComponent(slug), { method: 'DELETE', headers: API.admin._auth() });
        }
        return API._localDestinations().then(function (list) {
          LS.set('nw_local_destinations', list.filter(function (x) { return x.slug !== slug; }));
          return { ok: true };
        });
      },
      messages: function () {
        if (API.mode === 'server') return fetchJSON('/api/admin/messages', { headers: API.admin._auth() });
        return Promise.resolve(LS.get('nw_local_messages', []));
      },
      saveRoutes: function (routes) {
        if (API.mode === 'server') {
          return fetchJSON('/api/admin/routes', { method: 'PUT', headers: API.admin._auth(), body: JSON.stringify(routes) });
        }
        LS.set('nw_local_routes', routes);
        return Promise.resolve({ ok: true });
      },
      resetDemo: function () {
        LS.del('nw_local_destinations'); LS.del('nw_local_routes'); LS.del('nw_local_messages');
      }
    },

    // ----- browser storage for visitors -----
    store: LS
  };

  root.NomadAPI = API;
})(typeof self !== 'undefined' ? self : this);
