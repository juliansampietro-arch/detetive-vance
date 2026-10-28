// Exporta os sprites gerados por código como PNG (modelos para editar à mão).
// Uso: npx http-server . -p 8765   e depois   node tools/export-sprites.mjs banhista_f banhista_f2
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const looks = process.argv.slice(2).length ? process.argv.slice(2) : ['banhista_f', 'banhista_f2'];
const POSES = ['stand', 'walk1', 'walk2', 'seated'];
const OUT = join(ROOT, 'www', 'img', 'sprites-modelo');
mkdirSync(OUT, { recursive: true });
const PORT = 9336, sleep = ms => new Promise(r => setTimeout(r, ms));
mkdirSync('D:/Temp/alvorada', { recursive: true });
const profile = mkdtempSync(join('D:/Temp/alvorada', 'alv-spr-'));
process.on('exit', () => { try { rmSync(profile, { recursive: true, force: true, maxRetries: 10 }); } catch (e) {} });
const browser = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'http://localhost:8765/www/index.html'], { stdio: 'ignore' });
try {
  let target;
  for (let k = 0; k < 50 && !target; k++) { await sleep(300); try { target = (await (await fetch(`http://localhost:${PORT}/json`)).json()).find(t => t.type === 'page'); } catch (e) {} }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  await sleep(1500);
  const expr = `JSON.stringify(${JSON.stringify(looks)}.flatMap(l => ${JSON.stringify(POSES)}.map(p => [l + '_' + p, makeSprite(LOOKS[l], p).toDataURL('image/png')])))`;
  const res = await new Promise(r => { ws.addEventListener('message', ev => r(JSON.parse(ev.data))); ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } })); });
  for (const [name, url] of JSON.parse(res.result.result.value)) writeFileSync(join(OUT, name + '.png'), Buffer.from(url.split(',')[1], 'base64'));
  console.log(`exportados ${looks.length * POSES.length} sprites em www/img/sprites-modelo/`);
  ws.close();
} finally { browser.kill(); }
