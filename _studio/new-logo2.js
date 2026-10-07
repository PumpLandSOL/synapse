// one-shot: refine the SYNAPSE mark (v2): solid green + magenta neurons, two curved dendrites each, three signal dots across the cleft.
'use strict';
const fs = require('fs'); const path = require('path'); const ROOT = path.join(__dirname, '..');
const V1 = '<g stroke="url(#lg)" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M10.5 20L3 11M10.5 20L2 21M10.5 20L5 31M10 14.5L6 6"/><path d="M29.5 20L37 9M29.5 20L38 20.5M29.5 20L35.5 31M30 25.5L34 34"/></g><circle cx="11" cy="20" r="6" fill="url(#lg)"/><circle cx="29" cy="20" r="6" fill="url(#lg)"/><g fill="#f1eefa"><circle cx="20" cy="14.2" r="1.7"/><circle cx="20" cy="20" r="1.9"/><circle cx="20" cy="25.8" r="1.7"/></g>';
const V2 = '<g fill="none" stroke-width="2.8" stroke-linecap="round"><path d="M6.6 15.6Q2.6 12.6 3.4 7.4M6.6 24.4Q2.6 27.4 3.4 32.6" stroke="#14f195"/><path d="M33.4 15.6Q37.4 12.6 36.6 7.4M33.4 24.4Q37.4 27.4 36.6 32.6" stroke="#dc1fff"/></g><circle cx="11.2" cy="20" r="6.6" fill="#14f195"/><circle cx="28.8" cy="20" r="6.6" fill="#dc1fff"/><g fill="#f1eefa"><circle cx="20" cy="14.6" r="1.5"/><circle cx="20" cy="20" r="1.9"/><circle cx="20" cy="25.4" r="1.5"/></g>';
function walk(d, out = []) { for (const n of fs.readdirSync(d)) { const p = path.join(d, n); if (n === '.git' || n === 'node_modules') continue; if (fs.statSync(p).isDirectory()) walk(p, out); else if (/\.(js|html)$/.test(n)) out.push(p); } return out; }
let n = 0;
for (const f of walk(ROOT)) {
  if (/new-logo/.test(f)) continue; let s = fs.readFileSync(f, 'utf8'); const b = s;
  for (const id of ['lg', 'lgh', 'lgd']) s = s.split(V1.split('url(#lg)').join('url(#' + id + ')')).join(V2);
  s = s.replace(/<link rel="icon" href="data:image\/svg\+xml,[^"]*">/, () => '<link rel="icon" href="data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#0c0a14"/>${V2}</svg>`) + '">');
  if (s !== b) { fs.writeFileSync(f, s); n++; }
}
console.log('mark v2 in', n, 'files');
