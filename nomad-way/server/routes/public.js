'use strict';
const express = require('express');
const store = require('../storage');
const validate = require('../validate');
const planner = require('../../public/js/planner');

const router = express.Router();
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/health', wrap(async (req, res) => {
  await store.ping();
  res.json({ ok: true, storage: store.kind });
}));

// GET /api/destinations?q=&region=&category=&season=&difficulty=
router.get('/destinations', wrap(async (req, res) => {
  let list = await store.listDestinations();
  const { q, region, category, season, difficulty } = req.query;
  if (q) {
    const s = String(q).toLowerCase();
    list = list.filter(d => (d.name.en + ' ' + d.name.ru).toLowerCase().includes(s));
  }
  if (region) list = list.filter(d => d.region === region);
  if (category) list = list.filter(d => d.categories.includes(category));
  if (season) list = list.filter(d => d.seasons.includes(season));
  if (difficulty) list = list.filter(d => d.difficulty === difficulty);
  res.json(list);
}));

router.get('/destinations/:slug', wrap(async (req, res) => {
  const d = await store.getDestination(req.params.slug);
  if (!d) return res.status(404).json({ error: 'Destination not found' });
  res.json(d);
}));

router.get('/routes', wrap(async (req, res) => {
  res.json(await store.listRoutes());
}));

// POST /api/planner { duration, interests[], season, style }
router.post('/planner', wrap(async (req, res) => {
  const [destinations, templates] = await Promise.all([store.listDestinations(), store.listRoutes()]);
  if (!templates.length) return res.status(503).json({ error: 'No route templates configured' });
  res.json(planner.generate(req.body || {}, destinations, templates));
}));

// POST /api/contact { name, email, subject, message }
router.post('/contact', wrap(async (req, res) => {
  const { value, errors } = validate.contact(req.body || {});
  if (errors.length) return res.status(400).json({ error: 'Invalid fields: ' + errors.join(', ') });
  await store.addMessage(value);
  res.status(201).json({ ok: true });
}));

module.exports = router;
