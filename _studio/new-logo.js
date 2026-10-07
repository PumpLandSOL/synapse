// one-shot: replace the CEREBRO ring/crosshair mark with the SYNAPSE mark (two neurons, dendrites, three signal dots across the cleft).
// Updates the kit/video sources, the site header (index + docs) and adds a favicon. (run once, then re-render)
'use strict';
const fs = require('fs'); const path = require('path'); const ROOT = path.join(__dirname, '..');
const OLD = '<circle cx="20" cy="20" r="18" fill="none" stroke="url(#lg)" stroke-width="3"/><circle cx="20" cy="20" r="9" fill="url(#lg)"/><path d="M20 2v6M20 32v6M2 20h6M32 20h6" stroke="#f1eefa" stroke-width="2" stroke-linecap="round"/>';
// gradient #lg already runs green (#14f195) -> magenta (#dc1fff) left to right
const NEW = '<g stroke="url(#lg)" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M10.5 20L3 11M10.5 20L2 21M10.5 20L5 31M10 14.5L6 6"/><path d="M29.5 20L37 9M29.5 20L38 20.5M29.5 20L35.5 31M30 25.5L34 34"/></g><circle cx="11" cy="20" r="6" fill="url(#lg)"/><circle cx="29" cy="20" r="6" fill="url(#lg)"/><g fill="#f1eefa"><circle cx="20" cy="14.2" r="1.7"/><circle cx="20" cy="20" r="1.9"/><circle cx="20" cy="25.8" r="1.7"/></g>';
function walk(d, out = []) { for (const n of fs.readdirSync(d)) { const p = path.join(d, n); if (n === '.git' || n === 'node_modules') continue; if (fs.statSync(p).isDirectory()) walk(p, out); else if (/\.(js|html)$/.test(n)) out.push(p); } return out; }
let n = 0; for (const f of walk(ROOT)) { if (f === __filename) continue; const s = fs.readFileSync(f, 'utf8'); if (s.includes(OLD)) { fs.writeFileSync(f, s.split(OLD).join(NEW)); n++; } }
// site header: swap the CSS ring for the inline SVG mark; add a favicon
const svg = (id) => `<svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#14f195"/><stop offset="1" stop-color="#dc1fff"/></linearGradient></defs>${NEW.split('url(#lg)').join('url(#' + id + ')')}</svg>`;
const fav = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#0c0a14"/><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#14f195"/><stop offset="1" stop-color="#dc1fff"/></linearGradient></defs>${NEW.split('url(#lg)').join('url(#g)')}</svg>`);
for (const [file, from, to] of [['client/index.html', '<div class="logo"><i></i>SYNAPSE</div>', `<div class="logo">${svg('lgh')}SYNAPSE</div>`], ['client/docs.html', '<a class="logo" href="/"><i></i>SYNAPSE</a>', `<a class="logo" href="/">${svg('lgd')}SYNAPSE</a>`]]) {
  const p = path.join(ROOT, file); let s = fs.readFileSync(p, 'utf8'); if (!s.includes(from)) throw new Error('logo markup missing in ' + file);
  s = s.split(from).join(to); s = s.replace(/<link rel="icon"[^>]*>\s*/g, ''); s = s.replace(/(<title>[\s\S]*?<\/title>)/, (m) => m + `<link rel="icon" href="${fav}">`); fs.writeFileSync(p, s); n++;
}
console.log('logo replaced in', n, 'files');
