// "how it works" demo captures: launch form filled, coin page + buy typed, agent thoughts, desk deposit typed. usage: PORT=x node _studio/shots2.cjs
'use strict';
const { open, sleep } = require('./cdp.cjs'); const path = require('path'); const fs = require('fs'); const crypto = require('crypto');
const B = 'http://localhost:' + (process.env.PORT || 8246); const OUT = path.join(__dirname, 'shots2'); fs.mkdirSync(OUT, { recursive: true });
const A58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'; const b58 = (buf) => { let n = BigInt('0x' + Buffer.from(buf).toString('hex')), s = ''; while (n > 0n) { s = A58[Number(n % 58n)] + s; n /= 58n; } for (const x of buf) { if (x === 0) s = '1' + s; else break; } return s; };
const KP = crypto.generateKeyPairSync('ed25519'); const W = b58(KP.publicKey.export({ format: 'der', type: 'spki' }).subarray(12)); let AUTH;
const post = async (u, b) => { if (!AUTH) { const m = await (await fetch(B + '/api/session?wallet=' + W)).json(); AUTH = { exp: m.exp, sig: b58(crypto.sign(null, Buffer.from(m.message), KP.privateKey)) }; } return fetch(B + u, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ wallet: W, auth: AUTH, ...b }) }).then((r) => r.json()); };
(async () => {
  for (let i = 0; i < 30; i++) { const s = await (await fetch(B + '/api/state')).json(); if (s.tape.filter((t) => t.fresh).length >= 4) break; await sleep(1000); }
  await post('/api/dev/faucet', { amount: 30 });
  for (const [n, t, b] of [['Brainy', 'BRN', 'MOMENTUM'], ['Hedgehog', 'HDG', 'HEDGE'], ['Trendy', 'TRND', 'TREND']]) await post('/api/launch', { name: n, ticker: t, brain: b, seed: 3 });
  await sleep(7000); const st = await (await fetch(B + '/api/state')).json(); const id = st.coins[0].id;
  const c = await open(B + '/', 1440, 860, 9781); await sleep(2500);
  await c.ev(`localStorage.setItem('synapse_w','${W}');localStorage.setItem('synapse_auth_${W}',JSON.stringify(${JSON.stringify(AUTH)}));1`);
  const go = async (u) => { await c.send('Page.navigate', { url: 'about:blank' }); await sleep(300); await c.send('Page.navigate', { url: B + u }); await sleep(3800); };
  const S = async (n) => { await sleep(900); await c.shot(path.join(OUT, n + '.png')); console.log(n); };
  const set = (i, v) => c.ev(`(()=>{const e=document.getElementById('${i}');e.value='${v}';e.dispatchEvent(new Event('input'))})()`);
  await go('/'); await S('01-home');
  await go('/#desk'); await set('d-in', '1'); await S('02-deposit');
  await go('/#launch'); await set('l-name', 'Neurocat'); await set('l-tk', 'NCAT'); await set('l-seed', '2'); await c.ev(`(document.querySelector('.brain[data-b=REVERSION]')||{click(){}}).click()`); await S('03-launch');
  await c.ev(`document.getElementById('l-go').click()`); await sleep(6500);
  const st2 = await (await fetch(B + '/api/state')).json(); const nid = (st2.coins.find((x) => x.ticker === 'NCAT') || st2.coins[0]).id;
  await go('/c/' + nid); await S('04-coin');
  await set('c-in', '0.5'); await c.ev(`document.getElementById('c-in').scrollIntoView({block:'center'})`); await S('05-buy');
  await c.ev(`document.getElementById('c-act').click()`); await sleep(1500); await c.ev(`(document.getElementById('c-thoughts')||document.body).scrollIntoView({block:'center'})`); await S('06-thoughts');
  await go('/'); await c.ev(`window.scrollTo(0,640)`); await S('07-ward');
  c.close();
})().catch((e) => { console.error(e); process.exit(1); });
