'use strict';
// Seeds PostgreSQL with destinations, route templates and the admin account.
// Usage: npm run db:seed   (requires DATABASE_URL in .env)
//        npm run db:seed -- --force   (overwrite destinations and routes with the bundled data)
require('dotenv').config();
const fs = require('fs');
const path = require('path');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const store = require('../server/storage/postgres');
const auth = require('../server/auth');

(async () => {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await store.pool.query(schema);

  const destinations = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'data', 'destinations.json'), 'utf8'));
  const routes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'data', 'routes.json'), 'utf8'));

  // By default the seed is safe to run on every start: it only adds what is missing,
  // so edits made in the admin panel are kept. Use `npm run db:seed -- --force` to reset content.
  const force = process.argv.includes('--force');
  let created = 0, updated = 0;
  for (const d of destinations) {
    const exists = await store.getDestination(d.slug);
    if (!exists) { await store.createDestination(d); created++; }
    else if (force) { await store.updateDestination(d.slug, d); updated++; }
    else if ((!exists.images || !exists.images.length) && d.images && d.images.length) {
      // Migration: add photos to destinations created before photos existed (keeps other admin edits)
      await store.updateDestination(d.slug, Object.assign({}, exists, { images: d.images, credits: d.credits || [] }));
      updated++;
    }
  }
  const existingRoutes = await store.listRoutes();
  const routesSeeded = force || existingRoutes.length === 0;
  if (routesSeeded) await store.replaceRoutes(routes);

  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD;
  if (password) await store.upsertAdmin(username, auth.hashPassword(password));

  console.log(`Destinations: ${created} created, ${updated} updated. Route templates: ${routesSeeded ? routes.length + ' seeded' : 'kept'}. Admin: ${password ? username : '(skipped — set ADMIN_PASSWORD)'}`);
  await store.pool.end();
})().catch(async err => {
  console.error(err);
  try { await store.pool.end(); } catch (e) { /* noop */ }
  process.exit(1);
});
