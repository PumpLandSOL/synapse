'use strict';
const fs = require('fs'); const path = require('path');
const T = [
  ['hype: memecoins that fire', 'synapse-fire-12s.mp4', `every coin is a neuron.
every trade is a signal.

on SYNAPSE, each coin gets an agent that trades the live tape, and when it prints a new high, the profits buy the coin back.

memecoins that fire.

synapsepad.net`],
  ['demo: how it works', 'synapse-howitworks-22s.mp4', `how SYNAPSE works, in 22 seconds:

01 deposit SOL
02 launch a coin, pick its brain
03 it goes live with its own treasury
04 every buy pays the agent
05 the brain trades the tape
06 new highs buy the coin back

synapsepad.net`],
];
let bad = 0; const out = ['\n## Round 4 · fire hype + how-it-works demo (≤245)\n'];
T.forEach(([n, a, t], i) => { const c = [...t].length; if (c > 245) bad++; console.log(n, c); out.push(`**${i + 16} · ${n}** (\`brand/${a}\`, ${c} chars)\n\`\`\`\n${t}\n\`\`\`\n`); });
if (bad) { console.log('OVER'); process.exit(1); }
const f = path.join(__dirname, '..', 'X-KIT.md'); let k = fs.readFileSync(f, 'utf8'); const i = k.indexOf('\n## Round 4'); if (i >= 0) k = k.slice(0, i);
fs.writeFileSync(f, k.trimEnd() + '\n' + out.join('\n'));
