'use strict';
const express = require('express');
const store = require('../storage');
const validate = require('../validate');
const auth = require('../auth');

const router = express.Router();
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Simple in-memory brute-force protection for the login endpoint.
const attempts = new Map();
function tooMany(ip) {
  const now = Date.now();
  const a = (attempts.get(ip) || []).filter(t => now - t < 15 * 60 * 1000);
  attempts.set(ip, a);
  return a.length >= 10;
}

// POST /api/admin/login { username, password } -> { token }
router.post('/login', wrap(async (req, res) => {
  const ip = req.ip;
  if (tooMany(ip)) return res.status(429).json({ error: 'Too many attempts, try again later' });
  const { username, password } = req.body || {};
  const admin = username ? await store.findAdmin(String(username)) : null;
  if (!admin || !auth.verifyPassword(password || '', admin.password_hash)) {
    attempts.get(ip).push(Date.now());
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  attempts.delete(ip);
  res.json({ token: auth.signToken(admin.username), username: admin.username });
}));

router.use(auth.requireAdmin);

// POST /api/admin/destinations
router.post('/destinations', wrap(async (req, res) => {
  const { value, errors } = validate.destination(req.body || {});
  if (errors.length) return res.status(400).json({ error: 'Invalid fields: ' + errors.join(', ') });
  try {
    res.status(201).json(await store.createDestination(value));
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Slug already exists' });
    throw e;
  }
}));

// PUT /api/admin/destinations/:slug
router.put('/destinations/:slug', wrap(async (req, res) => {
  const { value, errors } = validate.destination(req.body || {});
  if (errors.length) return res.status(400).json({ error: 'Invalid fields: ' + errors.join(', ') });
  try {
    const updated = await store.updateDestination(req.params.slug, value);
    if (!updated) return res.status(404).json({ error: 'Destination not found' });
    res.json(updated);
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Slug already exists' });
    throw e;
  }
}));

// DELETE /api/admin/destinations/:slug
router.delete('/destinations/:slug', wrap(async (req, res) => {
  const ok = await store.deleteDestination(req.params.slug);
  if (!ok) return res.status(404).json({ error: 'Destination not found' });
  res.json({ ok: true });
}));

// PUT /api/admin/routes  (replace all route templates)
router.put('/routes', wrap(async (req, res) => {
  const { value, errors } = validate.routes(req.body);
  if (errors.length) return res.status(400).json({ error: 'Invalid fields: ' + errors.join(', ') });
  await store.replaceRoutes(value);
  res.json({ ok: true, count: value.length });
}));

// GET /api/admin/messages
router.get('/messages', wrap(async (req, res) => {
  res.json(await store.listMessages());
}));

module.exports = router;
