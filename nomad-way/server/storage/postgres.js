'use strict';
// PostgreSQL storage (used when DATABASE_URL is set).
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false
});

function rowToDestination(r) {
  return {
    slug: r.slug,
    name: { en: r.name_en, ru: r.name_ru },
    short: { en: r.short_en, ru: r.short_ru },
    description: { en: r.description_en, ru: r.description_ru },
    region: r.region,
    categories: r.categories,
    seasons: r.seasons,
    difficulty: r.difficulty,
    scene: r.scene,
    lat: r.lat,
    lng: r.lng,
    featured: r.featured,
    activities: r.activities,
    tips: { en: r.tips_en, ru: r.tips_ru },
    images: r.images,
    credits: r.credits || []
  };
}

function destinationParams(d) {
  return [
    d.slug, d.name.en, d.name.ru, d.short.en || '', d.short.ru || '', d.description.en || '', d.description.ru || '',
    d.region, d.categories, d.seasons, d.difficulty, d.scene || 'mountain', d.lat, d.lng, !!d.featured,
    d.activities || [], (d.tips && d.tips.en) || [], (d.tips && d.tips.ru) || [], d.images || [], d.credits || []
  ];
}

const COLS = 'slug, name_en, name_ru, short_en, short_ru, description_en, description_ru, region, categories, seasons, difficulty, scene, lat, lng, featured, activities, tips_en, tips_ru, images, credits';

module.exports = {
  kind: 'postgres',
  pool,

  async ping() { await pool.query('SELECT 1'); },

  async listDestinations() {
    const { rows } = await pool.query('SELECT * FROM destinations ORDER BY featured DESC, id ASC');
    return rows.map(rowToDestination);
  },
  async getDestination(slug) {
    const { rows } = await pool.query('SELECT * FROM destinations WHERE slug = $1', [slug]);
    return rows[0] ? rowToDestination(rows[0]) : null;
  },
  async createDestination(d) {
    const ph = destinationParams(d).map((_, i) => '$' + (i + 1)).join(', ');
    const { rows } = await pool.query(`INSERT INTO destinations (${COLS}) VALUES (${ph}) RETURNING *`, destinationParams(d));
    return rowToDestination(rows[0]);
  },
  async updateDestination(slug, d) {
    const sets = COLS.split(', ').map((c, i) => `${c} = $${i + 1}`).join(', ');
    const params = destinationParams(d).concat([slug]);
    const { rows } = await pool.query(`UPDATE destinations SET ${sets}, updated_at = NOW() WHERE slug = $${params.length} RETURNING *`, params);
    return rows[0] ? rowToDestination(rows[0]) : null;
  },
  async deleteDestination(slug) {
    const { rowCount } = await pool.query('DELETE FROM destinations WHERE slug = $1', [slug]);
    return rowCount > 0;
  },

  async listRoutes() {
    const { rows } = await pool.query('SELECT id, duration, data FROM route_templates ORDER BY position ASC, id ASC');
    return rows.map(r => Object.assign({ id: r.id, duration: r.duration }, r.data));
  },
  async replaceRoutes(routes) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM route_templates');
      for (let i = 0; i < routes.length; i++) {
        const { id, duration, ...data } = routes[i];
        await client.query('INSERT INTO route_templates (id, position, duration, data) VALUES ($1, $2, $3, $4)', [id, i, duration, data]);
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  async addMessage(m) {
    const { rows } = await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [m.name, m.email, m.subject || '', m.message]
    );
    return rows[0];
  },
  async listMessages() {
    const { rows } = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 500');
    return rows;
  },

  async findAdmin(username) {
    const { rows } = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    return rows[0] || null;
  },
  async upsertAdmin(username, passwordHash) {
    await pool.query(
      'INSERT INTO admins (username, password_hash) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash',
      [username, passwordHash]
    );
  }
};
