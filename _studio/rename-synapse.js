// one-shot: CEREBRO -> SYNAPSE ($SYN) across the copy. Text files rewritten, file names renamed, old rendered media removed. (run once)
'use strict';
const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..'); const TEXT = /\.(js|cjs|html|json|md|css|txt)$|Procfile$/;
function walk(d, out = []) { for (const n of fs.readdirSync(d)) { const p = path.join(d, n); if (n === 'node_modules' || n === '.git') continue; if (fs.statSync(p).isDirectory()) walk(p, out); else out.push(p); } return out; }
const map = [[/\$CEREBRO/g, '$SYN'], [/CEREBRO_MINT/g, 'SYNAPSE_MINT'], [/CEREBRO/g, 'SYNAPSE'], [/Cerebro/g, 'Synapse'], [/cerebro/g, 'synapse']];
let files = 0, hits = 0, removed = 0;
for (const f of walk(ROOT)) {
  if (f === __filename) continue;
  if (/\.(png|mp4)$/.test(f) && /cerebro|shots/i.test(f)) { fs.unlinkSync(f); removed++; continue; }   // re-rendered under the new name
  if (TEXT.test(f)) { let s = fs.readFileSync(f, 'utf8'); const b = s; for (const [re, to] of map) s = s.replace(re, () => { hits++; return to; }); if (s !== b) { fs.writeFileSync(f, s); files++; } }
  const base = path.basename(f); if (fs.existsSync(f) && /cerebro/i.test(base)) fs.renameSync(f, path.join(path.dirname(f), base.replace(/cerebro/g, 'synapse')));
}
console.log('renamed', hits, 'occurrences in', files, 'files; removed', removed, 'old media files');
