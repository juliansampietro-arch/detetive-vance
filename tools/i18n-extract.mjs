// Extrai todos os textos traduzíveis do jogo para tools/i18n/pt.json e www/i18n/keys.js.
// Os ids já existentes são mantidos (textos novos entram no fim), para as traduções não se desalinharem.
// Uso: npx http-server . -p 8765   (na raiz)   e depois   node tools/i18n-extract.mjs
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const PORT = 9335;
const exe = ['C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', '/usr/bin/google-chrome'].find(existsSync);
const sleep = ms => new Promise(r => setTimeout(r, ms));

// 1) textos dos dados, coletados com o jogo rodando em português
async function runtimeStrings() {
  mkdirSync('D:/Temp/alvorada', { recursive: true });
  const prof = mkdtempSync(join('D:/Temp/alvorada', 'alv-i18n-'));
  process.on('exit', () => { try { rmSync(prof, { recursive: true, force: true, maxRetries: 10 }); } catch (e) {} });
  const browser = spawn(exe, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, `--user-data-dir=${prof}`, 'http://localhost:8765/www/index.html'], { stdio: 'ignore' });
  try {
    let target;
    for (let k = 0; k < 50 && !target; k++) { await sleep(300); try { target = (await (await fetch(`http://localhost:${PORT}/json`)).json()).find(t => t.type === 'page'); } catch (e) {} }
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));
    await sleep(2000);
    // espera o jogo carregar (I18N definido) antes de coletar
    let res;
    for (let k = 1; k <= 30; k++) {
      res = await new Promise(r => { const h = ev => { const m = JSON.parse(ev.data); if (m.id === k) { ws.removeEventListener('message', h); r(m); } }; ws.addEventListener('message', h); ws.send(JSON.stringify({ id: k, method: 'Runtime.evaluate', params: { expression: "typeof I18N === 'undefined' ? undefined : JSON.stringify(I18N.collect())", returnByValue: true } })); });
      if (res.result && res.result.result.value !== undefined) break;
      await sleep(500);
    }
    ws.close();
    if (!res.result || res.result.result.value === undefined) throw new Error('I18N.collect falhou: ' + JSON.stringify(res).slice(0, 600));
    return JSON.parse(res.result.result.value);
  } finally { browser.kill(); }
}

// 2) literais de texto do código (mensagens, botões, avisos)
// palavras soltas em minúsculas que aparecem na tela (tipos de evidência, necessidades, níveis)
const LOWER_WORDS = new Set(['GABRIEL VANCE', 'digital', 'depoimento', 'preocupante', 'fome', 'sede', 'dedução']);
const isText = s => LOWER_WORDS.has(s) || /[a-zà-ÿ]/.test(s) && (s.includes(' ') || /[À-ÿ]/.test(s) || /^[A-ZÀ-Ý][a-zà-ÿ]+$/.test(s)) && !/sans-serif|rgba\(|px |Chakra|^#|\.js$|\.png$|^\s|https?:|\$\{|^[a-z_]+(\.[a-z_]+)+$/.test(s);
function sourceStrings() {
  const out = [];
  const dir = join(ROOT, 'www', 'js');
  for (const f of readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'i18n.js')) {
    const src = readFileSync(join(dir, f), 'utf8');
    for (const m of src.matchAll(/'((?:\\.|[^'\\\n])*)'/g)) {
      const s = m[1].replace(/\\n/g, '\n').replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      if (isText(s)) out.push(s);
    }
  }
  return out;
}

const found = [...new Set([...(await runtimeStrings()), ...sourceStrings()])];
const keysPath = join(ROOT, 'tools', 'i18n', 'keys.json');
mkdirSync(join(ROOT, 'tools', 'i18n'), { recursive: true });
const keys = existsSync(keysPath) ? JSON.parse(readFileSync(keysPath, 'utf8')) : [];
const known = new Set(keys);
let added = 0;
for (const s of found) if (!known.has(s)) { keys.push(s); known.add(s); added++; }
writeFileSync(keysPath, JSON.stringify(keys, null, 1));
const pt = Object.fromEntries(keys.map((s, i) => [i, s]));
writeFileSync(join(ROOT, 'tools', 'i18n', 'pt.json'), JSON.stringify(pt, null, 1));
mkdirSync(join(ROOT, 'www', 'i18n'), { recursive: true });
writeFileSync(join(ROOT, 'www', 'i18n', 'keys.js'), '// gerado por tools/i18n-extract.mjs: textos-fonte em português (o índice é o id)\nwindow.I18N_KEYS = ' + JSON.stringify(keys) + ';\n');
const words = keys.reduce((a, s) => a + s.split(/\s+/).length, 0);
console.log(`${keys.length} textos (${added} novos), ~${words} palavras`);
