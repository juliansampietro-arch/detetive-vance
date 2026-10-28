// ============================================================
// Idiomas: o português é o texto-fonte; cada idioma é uma tabela "texto em PT → tradução".
// i18n/keys.js lista os textos (I18N_KEYS[id]) e i18n/<lang>.js traz as traduções (I18N_DATA[id]).
// A escolha fica salva; trocar de idioma recarrega o jogo.
// ============================================================

const LANGS = {
  pt: { name: 'Português (Brasil)', locale: 'pt-BR' },
  en: { name: 'English', locale: 'en-US' },
  es: { name: 'Español', locale: 'es-ES' },
  de: { name: 'Deutsch', locale: 'de-DE' },
  fr: { name: 'Français', locale: 'fr-FR' },
  it: { name: 'Italiano', locale: 'it-IT' },
  ko: { name: '한국어', locale: 'ko-KR' },
};

const I18N = (() => {
  let lang = 'pt', gender = 'm';
  try {
    const l = localStorage.getItem('alvorada_lang'); if (l && LANGS[l]) lang = l;
    localStorage.removeItem('alvorada_gender');   // só Gabriel Vance
  } catch (e) {}
  // carrega as tabelas antes dos outros scripts (o parser executa na ordem);
  // com a detetive mulher, i18n/<lang>.fem.js traz as versões no feminino dos textos sobre ela
  const files = [];
  if (lang !== 'pt' || gender === 'f') files.push('i18n/keys.js');
  if (lang !== 'pt') files.push(`i18n/${lang}.js`);
  if (gender === 'f') files.push(`i18n/${lang}.fem.js`);
  if (files.length) document.write(files.map(f => `<script src="${f}"><\/script>`).join(''));
  let dict = null;
  const table = () => {
    if (dict || !window.I18N_KEYS || (!window.I18N_DATA && !window.I18N_FEM)) return dict;
    dict = new Map();
    for (const src of [window.I18N_DATA, window.I18N_FEM]) if (src) for (const id in src) if (I18N_KEYS[id] !== undefined && src[id]) dict.set(I18N_KEYS[id], src[id]);
    return dict;
  };

  // campos que guardam identificadores, não texto exibido
  const SKIP = new Set(['kind', 'key', 'id', 'look', 'to', 'need', 'water', 'goods', 'axis', 'style', 'livery', 'model', 'flag', 'give',
    'requiresFlag', 'ifFlag', 'ifHas', 'ifSeen', 'requires', 'requiresSeen', 'col', 'color', 'signCol', 'holoCol', 'accent', 'tiles',
    'vendor', 'seat', 'icon', 'a', 'b', 'items', 'food', 'umbrella', 'neon', 'wallN', 'wallW', 'floor', 'wallColor', 'screen', 'lines_key', 'dest']);
  const isText = s => typeof s === 'string' && /[A-Za-zÀ-ÿ]/.test(s) && (s.includes(' ') || /[À-ÿ]/.test(s) || /^[A-ZÀ-Ý]/.test(s));

  // percorre os dados e troca (ou coleta) cada texto exibido
  function walk(obj, fn, seen = new Set()) {
    if (!obj || typeof obj !== 'object' || seen.has(obj)) return;
    seen.add(obj);
    if (obj instanceof HTMLElement || obj instanceof HTMLCanvasElement || obj instanceof CanvasRenderingContext2D) return;
    for (const k of Object.keys(obj)) {
      if (SKIP.has(k) || k.startsWith('_') || k === 'texL' || k === 'texR') continue;
      const v = obj[k];
      if (typeof v === 'string') { if (isText(v)) { const r = fn(v); if (r !== v) obj[k] = r; } }
      else if (Array.isArray(v) && v.length === 2 && (v[0] === 'N' || v[0] === 'V' || v[0] === 'I') && typeof v[1] === 'string') { const r = fn(v[1]); if (r !== v[1]) v[1] = r; }
      else if (typeof v === 'object') walk(v, fn, seen);
    }
  }
  // os dados são const globais (não ficam em window): lidos pelo nome, na hora da chamada
  const dataRoots = () => {
    const get = name => { try { return Function('return typeof ' + name + " !== 'undefined' ? " + name + ' : null')(); } catch (e) { return null; } };
    const city = get('CITY');
    return [get('NPCS'), get('EVIDENCE'), get('DEDUCTIONS'), get('ACTS'), get('ENDINGS'), get('ROOMS'), get('CONSUMABLES'), get('VENDORS'),
      get('EXTRA_LINES'), get('DESTINATIONS'), get('ECO'), get('CASES'), get('OBJ_TEXT'), city && { bld: city.buildings, shp: city.shops, wlk: city.walkers }].filter(Boolean);
  };

  // nós de texto da página (botões e títulos fixos do HTML)
  function textNodes() {
    const out = [], it = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = it.nextNode(); n; n = it.nextNode()) if (n.nodeValue.trim() && !n.parentElement.closest('script')) out.push(n);
    return out;
  }

  return {
    get lang() { return lang; },
    get gender() { return gender; },
    setGender(g) { try { localStorage.setItem('alvorada_gender', g); } catch (e) {} location.reload(); },
    locale: () => LANGS[lang].locale,
    T(s) { const d = table(); return d && typeof s === 'string' ? d.get(s) || s : s; },
    set(l) { try { localStorage.setItem('alvorada_lang', l); } catch (e) {} location.reload(); },
    // aplica a tradução nos dados e no HTML (chamado uma vez, depois que todos os dados existem)
    apply() {
      if (!table()) return;
      for (const r of dataRoots()) walk(r, s => dict.get(s) || s);
      for (const n of textNodes()) { const raw = n.nodeValue.trim(), tr = dict.get(raw); if (tr) n.nodeValue = n.nodeValue.replace(raw, tr); }
      for (const el of document.querySelectorAll('[aria-label]')) { const tr = dict.get(el.getAttribute('aria-label')); if (tr) el.setAttribute('aria-label', tr); }
      document.documentElement.lang = LANGS[lang].locale;
    },
    // lista todos os textos traduzíveis dos dados e do HTML (usado pela ferramenta de extração)
    collect() {
      const out = new Set();
      for (const r of dataRoots()) walk(r, s => { out.add(s); return s; });
      for (const n of textNodes()) { const t = n.nodeValue.trim(); if (isText(t)) out.add(t); }
      for (const el of document.querySelectorAll('[aria-label]')) out.add(el.getAttribute('aria-label'));
      return [...out];
    },
  };
})();

// texto traduzido, com {0}, {1}... substituídos pelos argumentos
function T(s, ...args) {
  let r = I18N.T(s);
  args.forEach((a, i) => { r = r.split('{' + i + '}').join(a); });
  return r;
}
