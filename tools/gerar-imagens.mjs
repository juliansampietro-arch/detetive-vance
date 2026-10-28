// Gera os retratos e as cenas da introdução com a API do Gemini, a partir de IMAGENS-REALISTAS.md.
//   set GEMINI_API_KEY=sua-chave
//   node tools/gerar-imagens.mjs            (gera só as que ainda não existem)
//   node tools/gerar-imagens.mjs sue.jpg    (gera/refaz só os arquivos citados)
// Modelo: GEMINI_IMAGE_MODEL (padrão gemini-2.5-flash-image)
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
if (!KEY) { console.error('Falta a chave: rode antes  set GEMINI_API_KEY=sua-chave'); process.exit(1); }

// lê as tabelas do .md: cada seção tem um "estilo comum" e linhas | `arquivo` | nome | prompt |
const md = readFileSync(join(ROOT, 'IMAGENS-REALISTAS.md'), 'utf8');
const jobs = [];
let section = null, style = '';
for (const line of md.split(/\r?\n/)) {
  if (line.startsWith('## Retratos')) section = 'portraits';
  else if (line.startsWith('## Introdução')) section = 'intro';
  else if (line.startsWith('## ')) section = null;
  const st = line.match(/^`(.+)`$/);
  if (section && st) style = st[1];
  const row = line.match(/^\| `([\w.]+\.jpg)` \| (.+?) \| (.+) \|$/);
  if (section && row) jobs.push({ file: join(ROOT, 'www', 'img', section, row[1]), name: row[1], prompt: `${style} ${row[3]}`, ratio: section === 'intro' ? '16:9' : '1:1' });
}

const only = process.argv.slice(2);
const todo = jobs.filter(j => only.length ? only.includes(j.name) : !existsSync(j.file));
console.log(`${jobs.length} imagens no roteiro, ${todo.length} para gerar (modelo ${MODEL}).`);

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function generate(j) {
  for (let tent = 1; tent <= 4; tent++) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: j.prompt }] }],
        generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: j.ratio } },
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 429 && /limit: 0|billing|free_tier/i.test(data.error?.message || '')) throw new Error(`429: sua conta não tem cota para imagens (precisa ativar o faturamento).\n  Resposta do Google: ${data.error.message}`);
    if (res.status === 429 || res.status >= 500) { console.log(`  erro ${res.status}: ${(data.error?.message || '').split('\n')[0]}\n  esperando 30 s...`); await sleep(30000); continue; }
    if (!res.ok) throw new Error(`${res.status}: ${data.error?.message || 'erro desconhecido'}`);
    const part = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (!part) throw new Error('a resposta não trouxe imagem (talvez o prompt tenha sido recusado): ' + (data.candidates?.[0]?.finishReason || data.promptFeedback?.blockReason || '?'));
    mkdirSync(dirname(j.file), { recursive: true });
    writeFileSync(j.file, Buffer.from(part.inlineData.data, 'base64'));
    return;
  }
  throw new Error('muitas tentativas');
}

let ok = 0;
for (const j of todo) {
  process.stdout.write(`${j.name} ... `);
  try { await generate(j); ok++; console.log('ok'); }
  catch (e) { console.log('FALHOU: ' + e.message); }
  await sleep(4000);
}
console.log(`\nPronto: ${ok}/${todo.length} geradas. Rode de novo para tentar as que falharam.`);
