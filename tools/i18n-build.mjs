// Confere e monta as traduções: junta tools/i18n/<lang>*.json (pode vir em partes) e gera www/i18n/<lang>.js.
// Uso: node tools/i18n-build.mjs en          (um idioma)
//      node tools/i18n-build.mjs              (todos)
//      node tools/i18n-build.mjs en --check   (só confere, sem gerar)
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const DIR = join(ROOT, 'tools', 'i18n');
const pt = JSON.parse(readFileSync(join(DIR, 'pt.json'), 'utf8'));
const LANGS = ['en', 'es', 'de', 'fr', 'it', 'ko'];
const FEM = ['pt', ...LANGS];   // versões no feminino (detetive mulher): <lang>.fem*.json, só os ids que mudam
const args = process.argv.slice(2);
const only = args.filter(a => !a.startsWith('--'));
const checkOnly = args.includes('--check');

const count = (s, re) => (s.match(re) || []).length;
const tags = s => (s.match(/<\/?[a-z]+/g) || []).sort().join(',');
const holes = s => (s.match(/\{\d\}/g) || []).sort().join(',');

let failed = false;
for (const lang of only.length ? only : LANGS) {
  const files = existsSync(DIR) ? readdirSync(DIR).filter(f => f === `${lang}.json` || (f.startsWith(lang + '.') && f.endsWith('.json') && !f.startsWith(lang + '.fem'))) : [];
  const tr = {};
  for (const f of files) {
    try { Object.assign(tr, JSON.parse(readFileSync(join(DIR, f), 'utf8'))); }
    catch (e) { console.log(`${lang}: ${f} não é JSON válido: ${e.message}`); failed = true; }
  }
  const problems = [], missing = [];
  for (const id of Object.keys(pt)) {
    const src = pt[id], t = tr[id];
    if (typeof t !== 'string' || !t.trim()) { missing.push(id); continue; }
    if (holes(src) !== holes(t)) problems.push(`${id}: marcadores {n} diferentes`);
    if (count(src, /\n/g) !== count(t, /\n/g)) problems.push(`${id}: quebras de linha diferentes (${count(src, /\n/g)} → ${count(t, /\n/g)})`);
    if (tags(src) !== tags(t)) problems.push(`${id}: tags HTML diferentes`);
  }
  const extra = Object.keys(tr).filter(id => !(id in pt));
  console.log(`${lang}: ${Object.keys(pt).length - missing.length}/${Object.keys(pt).length} traduzidos, ${problems.length} problemas, ${extra.length} ids desconhecidos`);
  if (missing.length) console.log('  faltando: ' + (missing.length > 40 ? missing.slice(0, 40).join(', ') + ` … (+${missing.length - 40})` : missing.join(', ')));
  for (const p of problems.slice(0, 40)) console.log('  ' + p);
  if (problems.length || missing.length) failed = true;
  if (!checkOnly && files.length) {
    const out = {};
    for (const id of Object.keys(pt)) if (typeof tr[id] === 'string' && tr[id].trim()) out[id] = tr[id];
    writeFileSync(join(ROOT, 'www', 'i18n', `${lang}.js`), `// gerado por tools/i18n-build.mjs a partir de tools/i18n/${lang}*.json\nwindow.I18N_DATA = ${JSON.stringify(out)};\n`);
  }
}
// versões no feminino: só conferência de formato (a lista de ids é livre)
for (const lang of only.length ? only : FEM) {
  const files = existsSync(DIR) ? readdirSync(DIR).filter(f => f.startsWith(lang + '.fem') && f.endsWith('.json')) : [];
  if (!files.length) continue;
  const tr = {};
  for (const f of files) {
    try { Object.assign(tr, JSON.parse(readFileSync(join(DIR, f), 'utf8'))); }
    catch (e) { console.log(`${lang}.fem: ${f} não é JSON válido: ${e.message}`); failed = true; }
  }
  const problems = [];
  for (const id of Object.keys(tr)) {
    const src = pt[id], t = tr[id];
    if (src === undefined) { problems.push(`${id}: id desconhecido`); continue; }
    if (holes(src) !== holes(t)) problems.push(`${id}: marcadores {n} diferentes`);
    if (count(src, /\n/g) !== count(t, /\n/g)) problems.push(`${id}: quebras de linha diferentes`);
    if (tags(src) !== tags(t)) problems.push(`${id}: tags HTML diferentes`);
  }
  console.log(`${lang}.fem: ${Object.keys(tr).length} textos no feminino, ${problems.length} problemas`);
  for (const p of problems.slice(0, 40)) console.log('  ' + p);
  if (problems.length) failed = true;
  if (!checkOnly) writeFileSync(join(ROOT, 'www', 'i18n', `${lang}.fem.js`), `// gerado por tools/i18n-build.mjs: textos com a detetive no feminino\nwindow.I18N_FEM = ${JSON.stringify(tr)};\n`);
}
process.exitCode = failed ? 1 : 0;
