// Roda tests/playthrough.html num Edge/Chrome headless via CDP e imprime o resultado.
// Uso: npx http-server . -p 8765   (na raiz)   e depois   node tests/run.mjs
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, rmSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const URL = process.argv[2] || 'http://localhost:8765/tests/playthrough.html';
const PORT = 9333;
const candidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
];
const exe = candidates.find(existsSync);
if (!exe) { console.error('Navegador não encontrado'); process.exit(2); }

const TMP = 'D:/Temp/alvorada';
mkdirSync(TMP, { recursive: true });
// perfis de execuções anteriores (o Edge às vezes ainda segura o atual no exit)
for (const d of readdirSync(TMP)) { try { rmSync(join(TMP, d), { recursive: true, force: true }); } catch (e) {} }
const profile = mkdtempSync(join(TMP, 'alvorada-test-'));
process.on('exit', () => { try { rmSync(profile, { recursive: true, force: true, maxRetries: 10 }); } catch (e) {} });
const browser = spawn(exe, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--window-size=1000,900', '--autoplay-policy=no-user-gesture-required', URL], { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws, id = 0;
const pending = new Map();
const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });

try {
  let target;
  for (let k = 0; k < 50 && !target; k++) {
    await sleep(300);
    try { target = (await (await fetch(`http://localhost:${PORT}/json`)).json()).find(t => t.type === 'page' && t.url.includes('playthrough')); } catch (e) {}
  }
  if (!target) throw new Error('página de teste não abriu');
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
  const evaluate = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;
  let done = false;
  for (let k = 0; k < 240 && !done; k++) { await sleep(500); done = await evaluate("document.title === 'done'"); }
  const out = await evaluate("document.getElementById('out').textContent");
  const lines = out.split(/\n| \|\| /);
  const fails = lines.filter(l => /^(FAIL|EXCEPTION)/.test(l));
  for (const l of lines) if (!/fim do tópico/.test(l)) console.log(l);
  console.log(`\n${done ? '' : '[tempo esgotado] '}OK: ${lines.filter(l => l.startsWith('OK')).length}  FALHAS: ${fails.length}`);
  process.exitCode = fails.length || !done ? 1 : 0;
  try { await send('Browser.close'); } catch (e) {}
} catch (e) {
  console.error(e.message); process.exitCode = 2;
} finally {
  // espera o Edge soltar o perfil antes de apagá-lo no exit
  browser.once('exit', () => setTimeout(() => process.exit(), 300));
  setTimeout(() => { try { browser.kill(); } catch (e) {} }, 500);
  setTimeout(() => process.exit(), 5000);
}
