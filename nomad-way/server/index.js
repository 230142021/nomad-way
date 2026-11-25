'use strict';
require('dotenv').config();

const path = require('path');
const express = require('express');
const store = require('./storage');
const auth = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '200kb' }));

// Basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use('/api', require('./routes/public'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '1h' }));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Make sure an administrator account exists (from .env) for the JSON-file fallback.
async function ensureAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD;
  const existing = await store.findAdmin(username);
  if (!existing && password) {
    await store.upsertAdmin(username, auth.hashPassword(password));
    console.log(`Created admin user "${username}" from .env`);
  } else if (!existing) {
    console.warn('No admin user found. Set ADMIN_PASSWORD in .env and restart, or run: npm run db:seed');
  }
}

store.ping()
  .then(ensureAdmin)
  .then(() => app.listen(PORT, () => console.log(`Nomad Way running on http://localhost:${PORT}  (storage: ${store.kind})`)))
  .catch(err => {
    console.error('Failed to start:', err.message);
    process.exit(1);
  });
