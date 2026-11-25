'use strict';
// Input validation for destinations, routes and contact messages.

const REGIONS = ['chuy', 'issykkul', 'naryn', 'jalalabad', 'osh', 'talas', 'batken'];
const CATS = ['nature', 'adventure', 'culture', 'hiking', 'relaxation'];
const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
const DIFFS = ['easy', 'moderate', 'hard'];
const SCENES = ['lake', 'mountain', 'snow', 'canyon', 'forest', 'city', 'historic'];
const DURATIONS = ['1-3', '4-7', '8-14', '14+'];

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max || 5000) : '');
const strArr = (v, allowed, max) => (Array.isArray(v) ? v : []).map(x => str(x, max || 500)).filter(x => x && (!allowed || allowed.includes(x)));
const bi = (v, max) => ({ en: str(v && v.en, max), ru: str(v && v.ru, max) });

function destination(body) {
  const errors = [];
  const d = {
    slug: str(body.slug, 80).toLowerCase(),
    name: bi(body.name, 200),
    short: bi(body.short, 600),
    description: bi(body.description, 5000),
    region: str(body.region, 30),
    categories: strArr(body.categories, CATS),
    seasons: strArr(body.seasons, SEASONS),
    difficulty: str(body.difficulty, 20),
    scene: str(body.scene, 20) || 'mountain',
    lat: Number(body.lat),
    lng: Number(body.lng),
    featured: !!body.featured,
    activities: strArr(body.activities, null, 40),
    tips: { en: strArr(body.tips && body.tips.en, null, 500), ru: strArr(body.tips && body.tips.ru, null, 500) },
    images: [],
    credits: []
  };
  // Keep images and their credits aligned; only http(s) URLs are allowed.
  (Array.isArray(body.images) ? body.images : []).forEach((u, i) => {
    const url = str(u, 1000);
    if (/^https?:\/\//i.test(url)) {
      d.images.push(url);
      d.credits.push(str(Array.isArray(body.credits) ? body.credits[i] : '', 200));
    }
  });
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.slug)) errors.push('slug');
  if (!d.name.en || !d.name.ru) errors.push('name');
  if (!REGIONS.includes(d.region)) errors.push('region');
  if (!d.categories.length) errors.push('categories');
  if (!d.seasons.length) errors.push('seasons');
  if (!DIFFS.includes(d.difficulty)) errors.push('difficulty');
  if (!SCENES.includes(d.scene)) errors.push('scene');
  if (!isFinite(d.lat) || d.lat < 39 || d.lat > 44) errors.push('lat');
  if (!isFinite(d.lng) || d.lng < 69 || d.lng > 81) errors.push('lng');
  return { value: d, errors };
}

function routes(body) {
  if (!Array.isArray(body)) return { errors: ['routes must be an array'] };
  const errors = [];
  const ids = new Set();
  const value = body.map((r, i) => {
    const v = {
      id: str(r.id, 80),
      duration: str(r.duration, 10),
      title: bi(r.title, 200),
      summary: bi(r.summary, 600),
      interests: strArr(r.interests, ['nature', 'mountains', 'culture', 'adventure']),
      start: str(r.start, 80),
      stops: strArr(r.stops, null, 80)
    };
    if (!v.id || ids.has(v.id)) errors.push(`routes[${i}].id`);
    ids.add(v.id);
    if (!DURATIONS.includes(v.duration)) errors.push(`routes[${i}].duration`);
    if (!v.stops.length) errors.push(`routes[${i}].stops`);
    return v;
  });
  return { value, errors };
}

function contact(body) {
  const m = { name: str(body.name, 100), email: str(body.email, 150), subject: str(body.subject, 150), message: str(body.message, 3000) };
  const errors = [];
  if (!m.name) errors.push('name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email)) errors.push('email');
  if (!m.message) errors.push('message');
  return { value: m, errors };
}

module.exports = { destination, routes, contact };
