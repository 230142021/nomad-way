'use strict';
// JSON-file storage — fallback for quick local demos when DATABASE_URL is not set.
// Production should use PostgreSQL (see storage/postgres.js).
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', '..', 'data', 'db.json');
const PUBLIC_DATA = path.join(__dirname, '..', '..', 'public', 'data');

function load() {
  if (!fs.existsSync(FILE)) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    const seed = {
      destinations: JSON.parse(fs.readFileSync(path.join(PUBLIC_DATA, 'destinations.json'), 'utf8')),
      routes: JSON.parse(fs.readFileSync(path.join(PUBLIC_DATA, 'routes.json'), 'utf8')),
      messages: [],
      admins: []
    };
    fs.writeFileSync(FILE, JSON.stringify(seed, null, 2));
  }
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}
function save(db) {
  const tmp = FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, FILE);
}

module.exports = {
  kind: 'jsonfile',
  async ping() { load(); },

  async listDestinations() {
    return load().destinations.slice().sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  },
  async getDestination(slug) { return load().destinations.find(d => d.slug === slug) || null; },
  async createDestination(d) {
    const db = load();
    if (db.destinations.some(x => x.slug === d.slug)) { const e = new Error('Slug already exists'); e.code = '23505'; throw e; }
    db.destinations.push(d); save(db); return d;
  },
  async updateDestination(slug, d) {
    const db = load();
    const i = db.destinations.findIndex(x => x.slug === slug);
    if (i === -1) return null;
    if (d.slug !== slug && db.destinations.some(x => x.slug === d.slug)) { const e = new Error('Slug already exists'); e.code = '23505'; throw e; }
    db.destinations[i] = d; save(db); return d;
  },
  async deleteDestination(slug) {
    const db = load();
    const before = db.destinations.length;
    db.destinations = db.destinations.filter(x => x.slug !== slug);
    save(db);
    return db.destinations.length < before;
  },

  async listRoutes() { return load().routes; },
  async replaceRoutes(routes) { const db = load(); db.routes = routes; save(db); },

  async addMessage(m) {
    const db = load();
    const row = { id: Date.now(), name: m.name, email: m.email, subject: m.subject || '', message: m.message, created_at: new Date().toISOString() };
    db.messages.unshift(row); save(db); return row;
  },
  async listMessages() { return load().messages; },

  async findAdmin(username) { return load().admins.find(a => a.username === username) || null; },
  async upsertAdmin(username, passwordHash) {
    const db = load();
    const a = db.admins.find(x => x.username === username);
    if (a) a.password_hash = passwordHash; else db.admins.push({ username, password_hash: passwordHash });
    save(db);
  }
};
