// ============================================================
// Casos: o jogo tem duas histórias que dividem o mesmo motor e o mesmo Setor 4.
// applyCase troca o conteúdo das tabelas globais (EVIDENCE, DEDUCTIONS, ACTS, ENDINGS,
// SUSPECTS, EV_KEYS) e ajusta a cidade: no caso 2 o hotel fica lacrado e aparece o aerotrem.
// ============================================================

const CASES = {
  alvorada: {
    title: 'O Silêncio do Hotel Alvorada', tag: 'Setor 4 · Caso Pendelton',
    EVIDENCE: { ...EVIDENCE }, DEDUCTIONS: [...DEDUCTIONS], ACTS: { ...ACTS }, ENDINGS: { ...ENDINGS }, SUSPECTS: [...SUSPECTS],
    ACCUSE_Q: ['Quem desferiu o golpe fatal em Arthur Pendelton?', 'Alguém mais deve ser indiciado, por tentativa de homicídio?'],
  },
  eco: { title: 'O Eco dos Dados Mortos', tag: 'Neo-Sampa · Caso Kaelen Voss', ...ECO },
};
const CASE_IDS = Object.keys(CASES);

function refill(obj, src) { for (const k of Object.keys(obj)) delete obj[k]; Object.assign(obj, src); }
function refillArr(arr, src) { arr.length = 0; arr.push(...src); }

// objetos da cidade que só existem no caso 2 (criados na primeira vez)
let ecoCityObjs = null;
function ecoCityObjects() {
  if (ecoCityObjs) return ecoCityObjs;
  const at = (x, y) => CITY.map(x, y);
  const [tx, ty] = at(15, 17), [sx, sy] = at(18, 17);
  ecoCityObjs = [
    { kind: 'tape', x: Math.floor(tx), y: Math.floor(ty), w: 2, d: 1, axis: 'x' },
    { kind: 'tram_stop', x: Math.floor(sx), y: Math.floor(sy), solid: true, key: 'estacao_aerotrem', name: 'Estação do aerotrem — Linha Neo-Sampa' },
  ];
  return ecoCityObjs;
}

function applyCase(id) {
  const C = CASES[id] || CASES.alvorada;
  refill(EVIDENCE, C.EVIDENCE);
  refillArr(DEDUCTIONS, C.DEDUCTIONS);
  refill(ACTS, C.ACTS);
  refill(ENDINGS, C.ENDINGS);
  refillArr(SUSPECTS, C.SUSPECTS);
  refillArr(EV_KEYS, Object.keys(C.EVIDENCE));
  Object.assign(OBJ_EVIDENCE, ECO.OBJ_EVIDENCE);
  // cidade: hotel lacrado (com as viaturas na frente) e estação do aerotrem no caso 2
  const eco = id === 'eco', objs = ROOMS.city.objects;
  for (const o of objs) if (o.kind === 'exit' && (o.to === 'lobby' || o.key === 'hotel_fechado')) { o.key = eco ? 'hotel_fechado' : 'exit'; }
  for (const o of ecoCityObjects()) {
    const i = objs.indexOf(o);
    if (eco && i < 0) objs.push(o);
    if (!eco && i >= 0) objs.splice(i, 1);
  }
  invalidateGrid(ROOMS.city);
}

// ---------- progresso de cada caso (mostrado na tela de título) ----------
function caseSaveKey(id) { return id === 'eco' ? 'eco_save_v1' : 'alvorada_save_v1'; }
function caseProgress(id) { try { return Math.min(100, +(localStorage.getItem('vance_progress_' + id) || 0)); } catch (e) { return 0; } }
function setCaseProgress(id, pct) {
  if (pct <= caseProgress(id)) return;
  try { localStorage.setItem('vance_progress_' + id, String(Math.round(pct))); } catch (e) {}
}
// evidências e deduções contam até 95%; o final perfeito fecha os 100%
function trackProgress() {
  if (!game) return;
  const total = EV_KEYS.length + DEDUCTIONS.length;
  setCaseProgress(game.caseId, Math.min(95, 95 * (game.evidence.length + game.deductions.length) / total));
}
