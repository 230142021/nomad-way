'use strict';
// Builds a single self-contained HTML file (dist/nomad-way-demo.html) that runs without the server.
// Data and translations are inlined; admin edits, favorites and messages are stored in the browser.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pub = p => fs.readFileSync(path.join(root, 'public', p), 'utf8');

let html = pub('index.html');
const noLeaflet = process.argv.includes('--no-leaflet');
if (noLeaflet) html = html.replace(/\s*<link rel="stylesheet" href="https:\/\/unpkg\.com\/leaflet[^>]*>/, '').replace(/\s*<script src="https:\/\/unpkg\.com\/leaflet[^>]*><\/script>/, '');
const css = pub('css/style.css');
const data = { destinations: JSON.parse(pub('data/destinations.json')), routes: JSON.parse(pub('data/routes.json')) };
const i18n = { en: JSON.parse(pub('i18n/en.json')), ru: JSON.parse(pub('i18n/ru.json')) };
const safe = s => s.replace(/<\/script/gi, '<\\/script');

html = html.replace('<link rel="stylesheet" href="css/style.css">', '<style>\n' + css + '\n</style>');
const inline = ['js/scenes.js', 'js/planner.js', 'js/api.js', 'js/app.js']
  .map(f => '<script>\n' + safe(pub(f)) + '\n</script>').join('\n');
const boot = '<script>window.__STATIC__=true;window.__DATA__=' + safe(JSON.stringify(data)) + ';window.__I18N__=' + safe(JSON.stringify(i18n)) + ';</script>';
html = html.replace(/<script src="js\/scenes\.js"><\/script>[\s\S]*<script src="js\/app\.js"><\/script>/, () => boot + '\n' + inline);

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const out = path.join(root, 'dist', noLeaflet ? 'nomad-way-demo-offline.html' : 'nomad-way-demo.html');
fs.writeFileSync(out, html);
console.log('Built', out, (fs.statSync(out).size / 1024).toFixed(0) + ' KB');
