// ============================================================
// Motor isométrico em alta resolução
// O mundo é desenhado em "unidades de jogo" (VW x VH) e ampliado por RS
// no canvas real: cenário em vetor nítido, sprites com o dobro de detalhe.
// ============================================================

let VW = 480, VH = 270;        // visão em unidades de jogo (muda com o zoom e a proporção da tela)
let RS = 3;                    // pixels reais por unidade
const TW2 = 16, TH2 = 8;       // meia largura / meia altura do tile
const WH = 46;                 // altura das paredes
const CITY_SV = 2.2;           // escala vertical da cidade: Vance (24) ≈ 1,75 m, porta ≈ 2,1 m, andar ≈ 2,3 m
const ZOOM_MIN = 150, ZOOM_MAX = 300;

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const lightCanvas = document.createElement('canvas');
const lctx = lightCanvas.getContext('2d');
// brilho colorido das luzes, em baixa resolução (somado à tela num único drawImage)
const glowCanvas = document.createElement('canvas');
const gctx = glowCanvas.getContext('2d');

let OX = 240, OY = 60;
const cam = { x: 0, y: 0 };

function resizeView(viewH) {
  const host = canvas.parentElement;
  const hw = Math.max(1, host.clientWidth), hh = Math.max(1, host.clientHeight);
  VH = Math.round(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, viewH)));
  VW = Math.round(VH * Math.max(1, hw / hh));
  const dpr = window.devicePixelRatio || 1;
  RS = Math.min(4, Math.max(2, Math.round(hh * dpr / VH)));
  if (canvas.width !== VW * RS || canvas.height !== VH * RS) {
    canvas.width = VW * RS; canvas.height = VH * RS;
    lightCanvas.width = VW; lightCanvas.height = VH;
    glowCanvas.width = VW; glowCanvas.height = VH;
  }
}

function beginFrame() {
  ctx.setTransform(RS, 0, 0, RS, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}

// câmera segue o foco (coordenadas de tile) e respeita os limites da sala
function updateCamera(room, fx, fy, dt, snap) {
  const tx = (fx - fy) * TW2, ty = (fx + fy) * TH2 - 14;
  const top = VH * 0.16;
  const axis = (target, min, max, view, cur) => {
    if (max - min <= view) return (min + max) / 2;
    const v = Math.min(max - view / 2, Math.max(min + view / 2, target));
    return snap ? v : cur + (v - cur) * Math.min(1, dt * 5);
  };
  cam.x = axis(tx, -room.h * TW2 - 12, room.w * TW2 + 12, VW, cam.x);
  cam.y = axis(ty, -WH - 10 - top, (room.w + room.h) * TH2 + 14, VH, cam.y);
  OX = Math.round((VW / 2 - cam.x) * 2) / 2;
  OY = Math.round((VH / 2 - cam.y) * 2) / 2;
}

function iso(x, y, z = 0) {
  return [OX + (x - y) * TW2, OY + (x + y) * TH2 - z];
}

// ---------- primitivas ----------
function poly(c, pts, fill) {
  c.fillStyle = fill;
  c.beginPath();
  c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
  c.closePath();
  c.fill();
}

function line(pts, color, w = 0.5) {
  ctx.strokeStyle = color; ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();
}

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.min(255, Math.round(r * f)); g = Math.min(255, Math.round(g * f)); b = Math.min(255, Math.round(b * f));
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

function rgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

// caixa isométrica: base (x,y) até (x+w, y+d), elevada em z, altura h
function box(x, y, w, d, h, color, z = 0, topColor) {
  const a = iso(x, y, z + h), b = iso(x + w, y, z + h), c = iso(x + w, y + d, z + h), e = iso(x, y + d, z + h);
  const b0 = iso(x + w, y, z), c0 = iso(x + w, y + d, z), e0 = iso(x, y + d, z);
  poly(ctx, [e0, c0, c, e], shade(color, 0.62));
  poly(ctx, [c0, b0, b, c], shade(color, 0.8));
  poly(ctx, [a, b, c, e], topColor || color);
  // arestas de luz: dão acabamento às formas em alta resolução
  line([e, c, b], 'rgba(255,255,255,0.13)', 0.4);
  line([c, c0], 'rgba(255,255,255,0.07)', 0.4);
  return { top: [a, b, c, e] };
}

// máquina de comida (NUTRIMAT) ou bebida (HYDROPOP): tudo desenhado no plano da frente, com perspectiva
function drawVending(o, t) {
  const food = o.kind === 'vending_food', col = food ? '#ff8a3d' : '#38c8ff', body = food ? '#2a1e24' : '#1a2230';
  const x0 = o.x + 0.12, W = 0.76, yF = o.y + 0.82, H = 27;
  // brilho da vitrine no chão
  const [gx, gy] = iso(o.x + 0.5, o.y + 1.15, 0);
  ctx.fillStyle = rgba(col, 0.13 + 0.03 * Math.sin(t * 2 + o.x));
  ctx.beginPath(); ctx.ellipse(gx, gy, 14, 5, 0, 0, Math.PI * 2); ctx.fill();
  box(x0, o.y + 0.12, W, 0.7, H, body, 0, shade(body, 1.4));
  // faixa da marca na lateral
  panel(x0 + W, o.y + 0.2, x0 + W, o.y + 0.75, 4, H - 3, rgba(col, 0.35));
  panel(x0 + W, o.y + 0.2, x0 + W, o.y + 0.75, H - 6, H - 4.5, rgba(col, 0.9));
  // plano da frente: u ao longo da largura (0..1), v para cima (unidades de altura)
  const T0 = ctx.getTransform(), [ox, oy] = iso(x0, yF, 0);
  ctx.transform(TW2 * W, TH2 * W, 0, -1, ox, oy);
  const R = (u0, v0, u1, v1, c) => { ctx.fillStyle = c; ctx.fillRect(u0, v0, u1 - u0, v1 - v0); };
  R(0, 0, 1, H, shade(body, 1.1));
  // vitrine iluminada com prateleiras
  const g = ctx.createLinearGradient(0, H - 4, 0, 6);
  g.addColorStop(0, rgba(col, 0.55)); g.addColorStop(1, rgba(col, 0.2));
  R(0.06, 6, 0.66, H - 4, '#06080e'); R(0.06, 6, 0.66, H - 4, g);
  const PROD = food ? ['#ffd23f', '#ff4f6a', '#7dff6b', '#ff8a3d', '#e8e0d0'] : ['#38f6ff', '#ff4fd8', '#7dff6b', '#ffd23f', '#e8f0ff'];
  for (let r = 0; r < 4; r++) {
    const v = 7.5 + r * 4.4;
    R(0.06, v - 0.5, 0.66, v - 0.2, 'rgba(220,230,255,0.35)');            // prateleira
    for (let k = 0; k < 4; k++) {
      const u = 0.1 + k * 0.14, c = PROD[(r * 2 + k + (o.x | 0)) % PROD.length];
      if (food) { R(u, v, u + 0.1, v + 2.6, c); R(u, v + 2.1, u + 0.1, v + 2.6, 'rgba(255,255,255,0.35)'); }
      else { R(u + 0.02, v, u + 0.08, v + 2.8, c); R(u + 0.035, v + 2.8, u + 0.065, v + 3.4, c); R(u + 0.03, v + 0.6, u + 0.05, v + 2.2, 'rgba(255,255,255,0.45)'); }
    }
  }
  // reflexo no vidro e moldura
  ctx.globalAlpha = 0.12; R(0.08, 6, 0.2, H - 4, '#ffffff'); ctx.globalAlpha = 1;
  R(0.04, 5.6, 0.68, 6, '#0a0a10'); R(0.04, H - 4, 0.68, H - 3.6, '#0a0a10');
  // painel: telinha, teclado, leitor de implante
  R(0.72, H - 9, 0.95, H - 5, '#05060a');
  R(0.74, H - 8.6, 0.93, H - 5.4, rgba(col, 0.55 + 0.25 * Math.sin(t * 4 + o.y)));
  for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) R(0.745 + k * 0.065, H - 15 + r * 1.8, 0.79 + k * 0.065, H - 14 + r * 1.8, 'rgba(200,210,230,0.55)');
  R(0.76, 9, 0.91, 11, '#05060a'); R(0.78, 9.6, 0.89, 10.4, Math.sin(t * 5) > 0 ? '#7dff6b' : '#1a3a1a');
  // gaveta de retirada
  R(0.08, 1.6, 0.66, 4.8, '#05060a'); R(0.1, 4.2, 0.64, 4.6, 'rgba(255,255,255,0.12)');
  // letreiro iluminado no topo
  R(0, H - 3.2, 1, H, '#0a0a10');
  R(0.02, H - 2.9, 0.98, H - 0.3, rgba(col, 0.25 + 0.05 * Math.sin(t * 3)));
  ctx.save(); ctx.translate(0.5, H - 1.6); ctx.scale(1 / (TW2 * W), -1);
  ctx.font = '700 2.6px "Chakra Petch", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = Math.random() < 0.01 ? rgba(col, 0.3) : '#ffffff'; ctx.fillText(food ? 'NUTRIMAT' : 'HYDROPOP', 0, 0.2);
  ctx.restore();
  ctx.setTransform(T0);
}

function diamond(x, y, w, d, z, color) {
  poly(ctx, [iso(x, y, z), iso(x + w, y, z), iso(x + w, y + d, z), iso(x, y + d, z)], color);
}

function px(x, y, w, h, color, c = ctx) {
  c.fillStyle = color;
  c.fillRect(Math.round(x * 2) / 2, Math.round(y * 2) / 2, w, h);
}

// desenha no plano de uma parede: u ao longo da parede (tiles), v = altura
function onWall(edge, fn) {
  ctx.save();
  if (edge === 'N') ctx.transform(TW2, TH2, 0, -1, OX, OY);
  else ctx.transform(-TW2, TH2, 0, -1, OX, OY);
  fn();
  ctx.restore();
}
function wallRect(u0, v0, u1, v1, color) { ctx.fillStyle = color; ctx.fillRect(u0, v0, u1 - u0, v1 - v0); }

// ---------- chão ----------
// room.floor = piso padrão; room.zones = [{ x0, y0, x1, y1, floor }] troca o piso por áreas (inclusive)
function floorAt(room, x, y) {
  if (room.zones) for (const z of room.zones) if (x >= z.x0 && x <= z.x1 && y >= z.y0 && y <= z.y1) return z.floor;
  return room.floor;
}

function drawFloor(room, t) {
  for (let y = 0; y < room.h; y++) {
    for (let x = 0; x < room.w; x++) {
      const odd = (x + y) % 2;
      const n = (x * 7 + y * 13) % 5;
      const f = floorAt(room, x, y);
      let col;
      switch (f) {
        case 'wood': col = odd ? '#3a2618' : '#342214'; break;
        case 'darkwood': col = odd ? '#2a1c14' : '#241810'; break;
        case 'office': col = odd ? '#1c2230' : '#192030'; break;
        case 'bathtile': col = odd ? '#c8d8e0' : '#b8c8d4'; break;
        case 'carpet': col = odd ? '#2b1838' : '#26142f'; break;
        case 'tiles': col = odd ? '#1a2131' : '#161c29'; break;
        case 'marble': col = odd ? '#1d2c36' : '#111b22'; break;
        case 'kitchen': col = odd ? '#d8d4c8' : '#2a2a30'; break;
        case 'smalltile': col = odd ? '#9ab0bc' : '#8aa2ae'; break;
        case 'stone': col = n === 0 ? '#3a3e40' : odd ? '#34383a' : '#303436'; break;
        case 'slats': col = odd ? '#6a4a2a' : '#5e4226'; break;
        case 'tatami': col = odd ? '#7a7448' : '#706a40'; break;
        case 'lab': col = odd ? '#dfe6ea' : '#d2dade'; break;
        case 'cell': col = odd ? '#26282a' : '#222426'; break;
        default: col = n === 0 ? '#23251f' : '#1c1e1a';
      }
      diamond(x, y, 1, 1, 0, col);
      if (f === 'wood' || f === 'darkwood') line([iso(x, y + 0.5), iso(x + 1, y + 0.5)], 'rgba(0,0,0,0.25)', 0.4);
      else if (f === 'slats') for (let k = 1; k < 4; k++) line([iso(x + k / 4, y), iso(x + k / 4, y + 1)], 'rgba(0,0,0,0.3)', 0.35);
      else if (f === 'tatami') { line([iso(x, y + 0.04), iso(x + 1, y + 0.04)], '#2a3a20', 0.6); line([iso(x + 0.04, y), iso(x + 0.04, y + 1)], '#2a3a20', 0.6); }
      else if (f === 'smalltile') { line([iso(x + 0.5, y), iso(x + 0.5, y + 1)], 'rgba(255,255,255,0.25)', 0.3); line([iso(x, y + 0.5), iso(x + 1, y + 0.5)], 'rgba(255,255,255,0.25)', 0.3); }
      else if (f === 'stone') { if (n === 2) diamond(x + 0.2, y + 0.3, 0.35, 0.3, 0, 'rgba(160,210,255,0.08)'); }
      if (f === 'carpet') {
        diamond(x + 0.08, y + 0.08, 0.84, 0.84, 0, odd ? '#2e1a3c' : '#281532');
        if (room.floor === 'carpet' && (x === 2 || x === 7)) diamond(x + 0.44, y, 0.12, 1, 0, '#4a2462');
      } else if (f === 'marble') {
        if (odd) diamond(x + 0.12, y + 0.12, 0.76, 0.76, 0, '#20343f');
        line([iso(x + 0.1, y + 0.3 + n * 0.08), iso(x + 0.5, y + 0.45), iso(x + 0.9, y + 0.2 + n * 0.1)], 'rgba(160,220,255,0.06)', 0.35);
      } else if (f === 'tiles') {
        if (y === 1) diamond(x, y + 0.45, 1, 0.1, 0, rgba('#38a0ff', 0.25 + 0.1 * Math.sin(t * 2 + x)));
      } else if (n === 0 && !['kitchen', 'lab', 'smalltile', 'bathtile', 'tatami', 'slats'].includes(f)) {
        diamond(x + 0.3, y + 0.2, 0.4, 0.5, 0, 'rgba(0,0,0,0.25)');
      }
    }
  }
  // rejunte fino
  ctx.strokeStyle = room.floor === 'carpet' ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 0.4;
  ctx.beginPath();
  for (let x = 0; x <= room.w; x++) { const a = iso(x, 0), b = iso(x, room.h); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
  for (let y = 0; y <= room.h; y++) { const a = iso(0, y), b = iso(room.w, y); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
  ctx.stroke();
  // reflexo especular suave do chão
  if (room.floor !== 'carpet' && room.floor !== 'wood') {
    const a = iso(0, 0), c = iso(room.w, room.h);
    const g = ctx.createLinearGradient(a[0], a[1], c[0], c[1]);
    g.addColorStop(0, 'rgba(120,160,255,0.05)'); g.addColorStop(0.5, 'rgba(120,160,255,0)'); g.addColorStop(1, 'rgba(255,80,220,0.04)');
    poly(ctx, [iso(0, 0), iso(room.w, 0), iso(room.w, room.h), iso(0, room.h)], g);
  }
}

// ---------- paredes ----------
function drawWalls(room, t, flash) {
  const [cn, cw] = room.wallColor;
  if (room.glass) drawGlassWall(room, t, flash);
  else if (room.wallW) for (let i = 0; i < room.h; i++) drawWallTile('W', i, room.wallW[i], cw, room, t);
  for (let i = 0; i < room.w; i++) drawWallTile('N', i, room.wallN[i], cn, room, t);
  // quina
  line([iso(0, 0, 0), iso(0, 0, WH)], shade(cn, 0.45), 1);
}

// ---------- parede de vidro com a cidade lá fora ----------
// a cidade atrás do vidro é desenhada uma vez numa imagem (espaço da parede: u, v)
const skylines = {};
const SKY_U = 24, SKY_V = 3;     // pixels por unidade da imagem
function skyline(room) {
  if (skylines[room.name]) return skylines[room.name];
  let seed = room.w * 31 + room.h * 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const L = room.h;
  const img = document.createElement('canvas');
  img.width = Math.ceil(L * SKY_U); img.height = WH * SKY_V;
  const g = img.getContext('2d');
  g.setTransform(SKY_U, 0, 0, -SKY_V, 0, WH * SKY_V);   // y para cima, como na parede
  const rect = (u0, v0, u1, v1, col) => { g.fillStyle = col; g.fillRect(u0, v0, u1 - u0, v1 - v0); };
  const antennas = [];
  [[0.35, 14, 30, '#0d0f24'], [0.6, 8, 24, '#121531'], [1, 2, 18, '#181a3a']].forEach(([depth, minH, maxH, col], li) => {
    let u = -0.2;
    while (u < L + 0.2) {
      const w = 0.25 + rnd() * (0.5 + li * 0.2);
      const top = WH - minH - rnd() * (maxH - minH);
      rect(u, 0, u + w, top, col);
      const cols = Math.max(1, Math.floor(w / 0.09)), rows = Math.floor(top / 2.4);
      for (let r = 1; r < rows; r++) for (let c = 0; c < cols; c++) {
        const v = rnd();
        if (v > 0.55) continue;
        g.globalAlpha = 0.35 + depth * 0.5;
        rect(u + 0.03 + c * 0.09, top - r * 2.4, u + 0.07 + c * 0.09, top - r * 2.4 + 1.1, v < 0.07 ? '#ffd8a0' : v < 0.12 ? '#7fd8ff' : '#e8c070');
      }
      g.globalAlpha = 1;
      if (li === 2 && rnd() < 0.25) {
        const sc = ['#ff4fd8', '#38f6ff', '#ffd23f', '#7dff6b'][Math.floor(rnd() * 4)];
        g.globalAlpha = 0.3; rect(u + 0.02, top - 10, u + 0.15, top - 1, sc);
        g.globalAlpha = 0.95; rect(u + 0.05, top - 9, u + 0.12, top - 2, sc); g.globalAlpha = 1;
      }
      if (rnd() < 0.3) { rect(u + w / 2 - 0.01, top, u + w / 2 + 0.01, top + 3, col); antennas.push([u + w / 2, top + 3]); }
      u += w + 0.03 + rnd() * 0.12;
    }
  });
  const drops = Array.from({ length: Math.round(L * 10) }, () => [rnd() * L, rnd() * WH, 0.6 + rnd()]);
  return (skylines[room.name] = { img, antennas, drops });
}

function drawGlassWall(room, t, flash) {
  if (room.streetView) return drawStreetWall(room, t, flash);
  const sky = skyline(room), L = room.h;
  onWall('W', () => {
    ctx.beginPath(); ctx.rect(0, 0, L, WH); ctx.clip();
    // céu noturno
    const g = ctx.createLinearGradient(0, WH, 0, 0);
    g.addColorStop(0, flash > 0 ? '#5a5aa0' : '#120a2a');
    g.addColorStop(0.55, flash > 0 ? '#7a6ab8' : '#1e0f3a');
    g.addColorStop(1, flash > 0 ? '#9a7ac8' : '#3a1240');
    wallRect(0, 0, L, WH, g);
    const h = ctx.createLinearGradient(0, 0, 0, 18);
    h.addColorStop(0, 'rgba(255,79,216,0.28)'); h.addColorStop(1, 'rgba(255,79,216,0)');
    wallRect(0, 0, L, 18, h);
    // prédios (imagem pronta, desenhada de cabeça para cima no plano da parede)
    ctx.save(); ctx.translate(0, WH); ctx.scale(1, -1);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(sky.img, 0, 0, L, WH);
    ctx.imageSmoothingEnabled = false;
    ctx.restore();
    // luzes de antena piscando
    if (Math.sin(t * 3) > 0) for (const [u, v] of sky.antennas) wallRect(u - 0.02, v, u + 0.02, v + 0.6, '#ff3355');
    // carros voadores
    for (let k = 0; k < 3; k++) {
      const u = ((t * (0.35 + k * 0.17) + k * 3.1) % (L + 2)) - 1, v = 26 + k * 5;
      wallRect(u, v, u + 0.12, v + 0.5, k % 2 ? '#ff3355' : '#ffffff');
      ctx.globalAlpha = 0.25; wallRect(u - 0.5, v + 0.1, u, v + 0.3, k % 2 ? '#ff3355' : '#fff'); ctx.globalAlpha = 1;
    }
    // chuva escorrendo no vidro
    ctx.fillStyle = 'rgba(170,200,255,0.45)';
    for (const d of sky.drops) ctx.fillRect(d[0], WH - ((t * 14 * d[2] + d[1]) % WH), 0.02, 2.2);
    // reflexos diagonais
    ctx.globalAlpha = 0.07; ctx.fillStyle = '#ffffff';
    for (let k = 0; k < L; k += 2.5) { ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k + 0.6, 0); ctx.lineTo(k + 1.6, WH); ctx.lineTo(k + 1.0, WH); ctx.fill(); }
    ctx.globalAlpha = 1;
    // caixilhos
    const frame = '#0a0712', edge = rgba(room.neon, 0.7);
    for (let i = 0; i <= L; i++) wallRect(i - 0.025, 0, i + 0.025, WH, frame);
    wallRect(0, 0, L, 1.6, frame);
    wallRect(0, WH - 1.6, L, WH, frame);
    wallRect(0, 30, L, 30.6, frame);
    wallRect(0, 1.6, L, 1.9, edge);
    wallRect(0, WH - 1.9, L, WH - 1.6, edge);
  });
}

// térreo: a fachada de vidro mostra a calçada, as viaturas piscando e a chuva; no meio, a porta dupla de entrada
const STREET_CARS = [[1.2, 0], [3.6, 1], [9.4, 0]];   // [posição, viatura com giroflex invertido]
function drawStreetWall(room, t, flash) {
  const sky = skyline(room), L = room.h;
  const door0 = room.door0 || 4.6, door1 = room.door1 || 7.4;
  onWall('W', () => {
    ctx.beginPath(); ctx.rect(0, 0, L, WH); ctx.clip();
    const g = ctx.createLinearGradient(0, WH, 0, 0);
    g.addColorStop(0, flash > 0 ? '#6a6ab0' : '#160c30'); g.addColorStop(1, flash > 0 ? '#9a7ac8' : '#3a1240');
    wallRect(0, 0, L, WH, g);
    // prédios do outro lado da rua (a imagem da cidade, mais baixa)
    ctx.save(); ctx.translate(0, WH + 6); ctx.scale(1, -0.9);
    ctx.imageSmoothingEnabled = true; ctx.drawImage(sky.img, 0, 0, L, WH); ctx.imageSmoothingEnabled = false;
    ctx.restore();
    // rua molhada e calçada
    wallRect(0, 0, L, 12, '#0c0a16');
    const wet = ctx.createLinearGradient(0, 12, 0, 4);
    wet.addColorStop(0, 'rgba(56,246,255,0.10)'); wet.addColorStop(1, 'rgba(255,79,216,0.06)');
    wallRect(0, 4, L, 12, wet);
    wallRect(0, 0, L, 4, '#1a1622'); wallRect(0, 4, L, 4.4, '#3a3446');
    for (let u = 0.3; u < L; u += 1.6) wallRect(u, 8, u + 0.5, 8.3, 'rgba(255,210,63,0.35)');
    // viaturas com giroflex
    for (const [u, inv] of STREET_CARS) {
      if (u > L - 1) continue;
      const on = (Math.sin(t * 9 + u * 2) > 0) !== !!inv;
      ctx.globalAlpha = 0.3 + 0.12 * Math.sin(t * 9 + u);
      wallRect(u - 1, 3, u + 3, 26, on ? '#ff2a4a' : '#2a4aff');
      wallRect(u - 0.3, 0, u + 2.4, 4.2, on ? '#ff2a4a' : '#2a4aff');   // reflexo na poça
      ctx.globalAlpha = 1;
      wallRect(u, 5, u + 2.1, 12, '#262c44');
      wallRect(u + 0.35, 12, u + 1.7, 16.5, '#2e3654');
      wallRect(u + 0.45, 12.4, u + 1.6, 16, '#4a7aa8');
      wallRect(u + 1.02, 12.4, u + 1.06, 16, '#2e3654');
      wallRect(u, 8, u + 2.1, 9.4, '#f0f2f8');
      wallRect(u + 0.2, 4.2, u + 0.6, 6.6, '#050508'); wallRect(u + 1.5, 4.2, u + 1.9, 6.6, '#050508');
      wallRect(u + 0.55, 16.5, u + 1.02, 18, on ? '#ff3a5a' : '#5a1020');
      wallRect(u + 1.02, 16.5, u + 1.5, 18, on ? '#3a5aff' : '#ff3a5a');
      wallRect(u + 1.95, 9.6, u + 2.1, 11, '#fff4c0');
      wallRect(u, 9.6, u + 0.12, 11, '#ff2a2a');
    }
    // marquise do hotel e chuva forte lá fora
    wallRect(0, 38, L, 40, '#0a0712');
    ctx.fillStyle = 'rgba(180,205,255,0.5)';
    for (let k = 0; k < L * 26; k++) {
      const u = (k * 0.3819 * L + Math.sin(k) * 0.3) % L, v = WH - ((t * (22 + (k % 7) * 3) + k * 13.7) % (WH + 4));
      ctx.fillRect(u, v, 0.018, 2.6);
    }
    // gotas escorrendo no vidro
    ctx.fillStyle = 'rgba(170,200,255,0.4)';
    for (const dr of sky.drops) ctx.fillRect(dr[0], WH - ((t * 10 * dr[2] + dr[1]) % WH), 0.025, 1.6);
    ctx.globalAlpha = 0.06; ctx.fillStyle = '#ffffff';
    for (let k = 0; k < L; k += 2.5) { ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k + 0.6, 0); ctx.lineTo(k + 1.6, WH); ctx.lineTo(k + 1.0, WH); ctx.fill(); }
    ctx.globalAlpha = 1;
    // caixilhos
    const frame = '#0a0712', edge = rgba(room.neon, 0.7), gold = '#c8a050';
    for (let i = 0; i <= L; i++) if (i < door0 || i > door1) wallRect(i - 0.025, 0, i + 0.025, WH, frame);
    wallRect(0, 0, L, 1.6, frame); wallRect(0, WH - 1.6, L, WH, frame);
    wallRect(0, 1.6, L, 1.9, edge); wallRect(0, WH - 1.9, L, WH - 1.6, edge);
    // porta dupla: moldura dourada, divisão central, puxadores e letreiro iluminado em cima
    const mid = (door0 + door1) / 2;
    wallRect(door0 - 0.12, 0, door0 + 0.04, 34, gold); wallRect(door1 - 0.04, 0, door1 + 0.12, 34, gold);
    wallRect(door0 - 0.12, 32.5, door1 + 0.12, 34.5, gold);
    wallRect(mid - 0.04, 0, mid + 0.04, 32.5, gold);
    wallRect(mid - 0.3, 13, mid - 0.12, 20, gold); wallRect(mid + 0.12, 13, mid + 0.3, 20, gold);
    wallRect(door0 - 0.12, 34.5, door1 + 0.12, 38, '#120818');
    for (let k = 0; k < 8; k++) wallRect(door0 + 0.1 + k * (door1 - door0 - 0.2) / 8, 35.2, door0 + 0.25 + k * (door1 - door0 - 0.2) / 8, 37.3, rgba(room.neon, 0.6 + 0.4 * Math.sin(t * 2 + k)));
  });
}

function drawWallTile(edge, i, f, base, room, t) {
  const neon = room.neon;
  onWall(edge, () => {
    const u0 = i, u1 = i + 1;
    wallRect(u0, 0, u1, WH, base);
    // painéis e rodapé
    wallRect(u0 + 0.08, 6, u1 - 0.08, WH - 8, shade(base, 1.08));
    wallRect(u0 + 0.1, 6.4, u1 - 0.1, WH - 8.4, base);
    wallRect(u0, 0, u1, 3, shade(base, 0.55));
    wallRect(u0, 3, u1, 3.4, shade(base, 1.4));
    wallRect(u0, 0, u0 + 0.02, WH, shade(base, 0.7));
    switch (f) {
      case 'D':
        wallRect(u0 + 0.18, 0, u1 - 0.18, 32, '#0d0a14');
        wallRect(u0 + 0.22, 3, u1 - 0.22, 29, '#161020');
        wallRect(u0 + 0.14, 0, u0 + 0.18, 34, neon); wallRect(u1 - 0.18, 0, u1 - 0.14, 34, neon);
        wallRect(u0 + 0.14, 32, u1 - 0.14, 34, neon);
        wallRect(u1 - 0.3, 15, u1 - 0.26, 18, '#ffd23f');
        break;
      case 'E':
        wallRect(u0 + 0.1, 0, u1 - 0.1, 38, '#22283a');
        wallRect(u0 + 0.14, 0, u1 - 0.14, 35, '#46506a');
        wallRect(u0 + 0.495, 0, u0 + 0.505, 35, '#14182a');
        wallRect(u0 + 0.38, 39, u0 + 0.62, 41, game && game.act >= 2 ? '#7dff6b' : '#ff3355');
        break;
      case 'S':
        wallRect(u0 + 0.22, 0, u1 - 0.22, 30, game && game.act >= 3 ? '#050505' : '#3b3326');
        wallRect(u0 + 0.22, 26, u1 - 0.22, 30, '#ffb347');
        for (let k = 0; k < 5; k++) wallRect(u0 + 0.26 + k * 0.1, 26, u0 + 0.3 + k * 0.1, 30, '#1a1408');
        wallRect(u0 + 0.24, 13, u1 - 0.24, 14, '#2a2418');
        break;
      case 'N': {
        wallRect(u0 + 0.05, 22, u1 - 0.05, 35, '#120818');
        if (Math.sin(t * 3) > -0.8) for (let k = 0; k < 5; k++) wallRect(u0 + 0.1 + k * 0.17, 25, u0 + 0.2 + k * 0.17, 32, k % 2 ? neon : '#38f6ff');
        break;
      }
      case 'H':
        wallRect(u0 + 0.2, 14, u1 - 0.2, 36, rgba('#38f6ff', 0.2 + 0.1 * Math.sin(t * 4 + i)));
        wallRect(u0 + 0.28, 22, u1 - 0.28, 30, rgba('#ff4fd8', 0.55));
        wallRect(u0 + 0.28, 17, u0 + 0.6, 18.5, rgba('#38f6ff', 0.8));
        wallRect(u0 + 0.28, 32, u0 + 0.7, 33, rgba('#38f6ff', 0.6));
        break;
      case 'V':
        wallRect(u0 + 0.1, 4, u1 - 0.1, 22, '#1c1c24');
        for (let k = 0; k < 7; k++) wallRect(u0 + 0.12, 5.5 + k * 2.3, u1 - 0.12, 6.5 + k * 2.3, '#4a4a58');
        break;
      case 'B':
        for (let s = 0; s < 3; s++) {
          wallRect(u0, 12 + s * 9, u1, 12.8 + s * 9, '#4a3458');
          for (let k = 0; k < 5; k++) {
            const cols = ['#7dff6b', '#ff4fd8', '#38f6ff', '#ffd23f', '#ff8a3d'];
            wallRect(u0 + 0.08 + k * 0.18, 12.8 + s * 9, u0 + 0.16 + k * 0.18, 17 + s * 9 + (k % 2), cols[(k + s + i) % 5]);
          }
        }
        break;
      case 'F':   // fachada com janelas acesas
        for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) {
          const lit = ((i * 7 + r * 3 + k * 5) % 4) !== 0;
          wallRect(u0 + 0.12 + k * 0.28, 8 + r * 9, u0 + 0.3 + k * 0.28, 13 + r * 9, lit ? 'rgba(255,200,130,0.55)' : '#0e0a14');
        }
        break;
      case 'G':   // vitrine iluminada
        wallRect(u0 + 0.08, 2, u1 - 0.08, 26, '#3a2a40');
        wallRect(u0 + 0.12, 3, u1 - 0.12, 25, rgba(neon, 0.28 + 0.05 * Math.sin(t * 2 + i)));
        wallRect(u0 + 0.2, 6, u0 + 0.45, 16, 'rgba(255,255,255,0.18)');
        wallRect(u0 + 0.55, 4, u0 + 0.8, 12, 'rgba(255,220,180,0.2)');
        wallRect(u0 + 0.08, 26, u1 - 0.08, 28, neon);
        break;
      case 'K': { // letreiro vertical em kanji
        const on = Math.sin(t * 2.3 + i * 1.7) > -0.85;
        wallRect(u0 + 0.35, 10, u0 + 0.65, 40, '#1a0808');
        if (on) for (let k = 0; k < 4; k++) { wallRect(u0 + 0.4, 12 + k * 7, u0 + 0.6, 13 + k * 7, '#ff3355'); wallRect(u0 + 0.48, 11 + k * 7, u0 + 0.52, 17 + k * 7, '#ff6a7a'); }
        wallRect(u0 + 0.1, 33, u0 + 0.25, 37, '#ff3355'); wallRect(u1 - 0.25, 33, u1 - 0.1, 37, '#ffd23f');
        break;
      }
      case 'M':   // quadro de menu
        wallRect(u0 + 0.1, 16, u1 - 0.1, 36, '#141018');
        for (let k = 0; k < 5; k++) wallRect(u0 + 0.18, 19 + k * 3.4, u0 + 0.5 + ((k * 3) % 4) * 0.1, 20 + k * 3.4, k % 2 ? '#ff8ad8' : '#f0e0d0');
        break;
      case 'Q':   // quadro de investigação
        wallRect(u0 + 0.06, 12, u1 - 0.06, 38, '#5a4028');
        for (let k = 0; k < 6; k++) wallRect(u0 + 0.12 + (k % 3) * 0.27, 16 + Math.floor(k / 3) * 10, u0 + 0.32 + (k % 3) * 0.27, 23 + Math.floor(k / 3) * 10, '#e8e0cc');
        ctx.strokeStyle = '#ff3355'; ctx.lineWidth = 0.02;
        ctx.beginPath(); ctx.moveTo(u0 + 0.2, 20); ctx.lineTo(u0 + 0.75, 30); ctx.moveTo(u0 + 0.5, 20); ctx.lineTo(u0 + 0.25, 30); ctx.stroke();
        break;
      case 'X':   // grades da cela
        wallRect(u0, 0, u1, 36, '#0c0e14');
        for (let k = 0; k < 6; k++) wallRect(u0 + 0.05 + k * 0.17, 0, u0 + 0.09 + k * 0.17, 36, '#5a6070');
        wallRect(u0, 34, u1, 36, '#5a6070');
        break;
      case 'P':
        wallRect(u0, 30, u1, 34, '#5a4a3a'); wallRect(u0, 33, u1, 33.6, '#7a6a52');
        wallRect(u0, 36, u1, 38, '#4a3a2e');
        wallRect(u0 + 0.6, 0, u0 + 0.7, 30, '#5a4a3a');
        break;
      case 'L':
        wallRect(u0 + 0.25, 0, u0 + 0.3, WH, '#8a7a5a'); wallRect(u0 + 0.7, 0, u0 + 0.75, WH, '#8a7a5a');
        for (let k = 0; k < 7; k++) wallRect(u0 + 0.25, 4 + k * 6, u0 + 0.75, 5 + k * 6, '#8a7a5a');
        break;
      case 'C':   // armários de cozinha suspensos e azulejo
        for (let k = 0; k < 5; k++) wallRect(u0, 12 + k * 2, u1, 12.3 + k * 2, 'rgba(255,255,255,0.08)');
        wallRect(u0 + 0.04, 24, u1 - 0.04, 38, '#3a3440'); wallRect(u0 + 0.06, 25, u0 + 0.47, 37, '#4a4250'); wallRect(u0 + 0.53, 25, u1 - 0.06, 37, '#4a4250');
        wallRect(u0 + 0.4, 26, u0 + 0.44, 29, '#c8ccd4'); wallRect(u0 + 0.56, 26, u0 + 0.6, 29, '#c8ccd4');
        wallRect(u0, 23, u1, 24, rgba('#ffd8a0', 0.6));
        break;
      case 'T':   // azulejo de banheiro
        wallRect(u0, 3.4, u1, WH - 4, '#a8bcc8');
        for (let k = 0; k < 9; k++) wallRect(u0, 6 + k * 4, u1, 6.25 + k * 4, 'rgba(255,255,255,0.35)');
        for (let k = 1; k < 4; k++) wallRect(u0 + k / 4 - 0.01, 3.4, u0 + k / 4 + 0.01, WH - 4, 'rgba(255,255,255,0.35)');
        break;
      case 'W': { // janela pequena com chuva
        wallRect(u0 + 0.15, 16, u1 - 0.15, 36, '#0a0712');
        const g = ctx.createLinearGradient(0, 17, 0, 35);
        g.addColorStop(0, game && game.flash > 0 ? '#6a6ab0' : '#1e0f3a'); g.addColorStop(1, game && game.flash > 0 ? '#9a7ac8' : '#3a1240');
        wallRect(u0 + 0.2, 17, u1 - 0.2, 35, g);
        for (let k = 0; k < 4; k++) wallRect(u0 + 0.25 + k * 0.14, 17, u0 + 0.33 + k * 0.14, 20 + ((i * 7 + k * 3) % 9), (k + i) % 3 ? '#e8b870' : '#7fd8ff');
        ctx.fillStyle = 'rgba(170,200,255,0.5)';
        for (let k = 0; k < 5; k++) ctx.fillRect(u0 + 0.22 + k * 0.12, 35 - ((t * 9 + k * 7) % 18), 0.015, 1.6);
        wallRect(u0 + 0.49, 17, u0 + 0.51, 35, '#0a0712'); wallRect(u0 + 0.2, 25.8, u1 - 0.2, 26.2, '#0a0712');
        break;
      }
      case 'm':   // espelho
        wallRect(u0 + 0.2, 18, u1 - 0.2, 36, '#5a6070');
        wallRect(u0 + 0.24, 19, u1 - 0.24, 35, '#9ab8c8');
        ctx.globalAlpha = 0.35; wallRect(u0 + 0.3, 22, u0 + 0.38, 33, '#ffffff'); wallRect(u0 + 0.45, 27, u0 + 0.5, 33, '#ffffff'); ctx.globalAlpha = 1;
        break;
      case 'w':   // posto de lavagem do onsen: espelho, chuveirinho e torneira
        wallRect(u0 + 0.15, 20, u1 - 0.35, 32, '#7a8a94'); wallRect(u0 + 0.18, 21, u1 - 0.38, 31, '#a8c0cc');
        ctx.globalAlpha = 0.35; wallRect(u0 + 0.24, 23, u0 + 0.3, 30, '#ffffff'); ctx.globalAlpha = 1;
        wallRect(u1 - 0.3, 26, u1 - 0.12, 30, '#c8ccd4'); wallRect(u1 - 0.28, 27, u1 - 0.14, 29, '#e8ecf0');   // chuveirinho no suporte
        wallRect(u0 + 0.15, 14, u1 - 0.15, 15, '#5a4a3a');                                                   // prateleira
        for (let k = 0; k < 3; k++) wallRect(u0 + 0.22 + k * 0.18, 15, u0 + 0.3 + k * 0.18, 18 + (k % 2), ['#ff8ad8', '#7dff6b', '#ffd23f'][k]);
        break;
      case 'Y':   // painel shoji: papel de arroz com treliça de madeira escura e rodapé de madeira
      case 'U': { // porta shoji de correr (passagem)
        wallRect(u0, 3.4, u1, WH - 2, '#3a2414');
        wallRect(u0 + 0.06, 9, u1 - 0.06, WH - 5, f === 'U' ? '#e8dcc0' : '#f0e6cc');
        for (let k = 1; k < 4; k++) wallRect(u0 + k * 0.25 - 0.012, 9, u0 + k * 0.25 + 0.012, WH - 5, '#4a3018');
        for (let k = 0; k < 6; k++) wallRect(u0 + 0.06, 9 + k * 5.3, u1 - 0.06, 9.35 + k * 5.3, '#4a3018');
        wallRect(u0 + 0.06, 3.4, u1 - 0.06, 9, '#4a2e18');                        // painel de madeira embaixo
        ctx.globalAlpha = 0.18; wallRect(u0 + 0.06, 9, u1 - 0.06, WH - 5, '#ffcf80'); ctx.globalAlpha = 1;   // luz quente atrás do papel
        if (f === 'U') { wallRect(u0 + 0.47, 0, u0 + 0.53, WH - 2, '#2a1a0c'); wallRect(u0 + 0.38, 20, u0 + 0.42, 24, '#1a1008'); wallRect(u0 + 0.58, 20, u0 + 0.62, 24, '#1a1008'); }
        break;
      }
      case 'Z': { // tokonoma: nicho com pergaminho de caligrafia e um arranjo de ikebana
        wallRect(u0 + 0.06, 3.4, u1 - 0.06, WH - 4, '#2a1a10');
        wallRect(u0 + 0.1, 3.4, u1 - 0.1, WH - 6, '#d8c8a8');
        wallRect(u0 + 0.06, WH - 6, u1 - 0.06, WH - 4, '#4a2e18');                // viga do nicho
        wallRect(u0 + 0.06, 3.4, u1 - 0.06, 5, '#5a3820');                        // tablado
        wallRect(u0 + 0.32, 14, u0 + 0.68, 36, '#f4ecd8'); wallRect(u0 + 0.3, 36, u0 + 0.7, 37, '#3a2414'); wallRect(u0 + 0.3, 13, u0 + 0.7, 14, '#3a2414');
        ctx.fillStyle = '#1a1410';   // caligrafia: 茉 莉 花 em traços simples
        for (const [a0, b0, a1, b1] of [[0.4, 17, 0.6, 17.6], [0.49, 16, 0.51, 22], [0.42, 19, 0.58, 19.6], [0.4, 24, 0.6, 24.6], [0.45, 25, 0.47, 29], [0.53, 25, 0.55, 29], [0.42, 31, 0.58, 31.6], [0.49, 30, 0.51, 34.5]]) wallRect(u0 + a0, b0, u0 + a1, b1, '#1a1410');
        wallRect(u0 + 0.62, 33.5, u0 + 0.66, 35, '#c8202a');                       // selo vermelho
        wallRect(u0 + 0.15, 5, u0 + 0.3, 8, '#3a3a40');                           // vaso
        wallRect(u0 + 0.2, 8, u0 + 0.22, 13, '#3a6a30'); wallRect(u0 + 0.24, 8, u0 + 0.26, 11, '#3a6a30');
        wallRect(u0 + 0.17, 12, u0 + 0.21, 13.5, '#f8f4ec'); wallRect(u0 + 0.23, 10.5, u0 + 0.27, 12, '#f8f4ec'); wallRect(u0 + 0.19, 13.5, u0 + 0.23, 15, '#f8f4ec');
        break;
      }
      case 'h': { // parede de monitores do hacker: telas de código, gráficos e uma câmera de segurança
        wallRect(u0, 3.4, u1, WH - 2, '#0c0e12');
        const k0 = (i * 7 + (edge === 'N' ? 0 : 3)) % 4;
        for (const [a0, a1, b0, b1, kk] of [[0.06, 0.48, 10, 22, 0], [0.52, 0.94, 10, 22, 1], [0.06, 0.94, 25, 38, 2]]) {
          const kind = (k0 + kk) % 4, col = ['#7dff6b', '#38f6ff', '#ff4fd8', '#ffd23f'][kind];
          wallRect(u0 + a0, b0, u0 + a1, b1, '#1a1e24'); wallRect(u0 + a0 + 0.02, b0 + 0.6, u0 + a1 - 0.02, b1 - 0.6, '#06120a');
          ctx.globalAlpha = 0.85;
          for (let r = 0; r < (b1 - b0 - 2) / 1.6; r++) {
            const len = ((Math.sin(r * 3.7 + i + kk + Math.floor(t * 2)) + 1) / 2) * (a1 - a0 - 0.08);
            wallRect(u0 + a0 + 0.04, b1 - 1.6 - r * 1.6, u0 + a0 + 0.04 + len, b1 - 1.1 - r * 1.6, col);
          }
          ctx.globalAlpha = 1;
        }
        break;
      }
      case 'g': { // portão aberto do ferro-velho: a rua molhada lá fora e as folhas do portão abertas para os lados
        wallRect(u0, 0, u1, WH, '#07080c');
        wallRect(u0, 0, u1, 5, '#14161c'); wallRect(u0, 5, u1, 5.4, '#2a2c34');                  // calçada
        for (let k = 0; k < 4; k++) wallRect(u0 + k * 0.25 + 0.05, 1.5, u0 + k * 0.25 + 0.2, 2, 'rgba(255,210,63,0.25)');
        wallRect(u0, 6, u1, 26, '#0c0e16');                                                       // prédios do outro lado
        for (let k = 0; k < 3; k++) wallRect(u0 + 0.1 + k * 0.3, 12 + (k + i) % 3 * 4, u0 + 0.22 + k * 0.3, 14 + (k + i) % 3 * 4, (k + i) % 2 ? 'rgba(255,180,90,0.5)' : 'rgba(56,246,255,0.35)');
        for (let k = 0; k < 5; k++) { const y = (t * 40 + k * 9 + i * 5) % WH; wallRect(u0 + k * 0.2 + 0.05, WH - y, u0 + k * 0.2 + 0.06, WH - y + 2, 'rgba(160,190,255,0.35)'); }
        const g0 = room.wallW.indexOf('g') === i || room.wallN.indexOf('g') === i, g1 = (edge === 'W' ? room.wallW : room.wallN)[i + 1] !== 'g';
        if (g0) { wallRect(u0, 0, u0 + 0.1, 38, '#5a5a62'); wallRect(u0 + 0.1, 0, u0 + 0.35, 34, 'rgba(110,110,120,0.5)'); }   // folha aberta
        if (g1) { wallRect(u1 - 0.1, 0, u1, 38, '#5a5a62'); wallRect(u1 - 0.35, 0, u1 - 0.1, 34, 'rgba(110,110,120,0.5)'); }
        wallRect(u0, 36, u1, 38, '#3a3a40');                                                      // trave do portão
        break;
      }
      case 'f': { // cerca de arame do ferro-velho, com postes e arame farpado
        wallRect(u0, 0, u1, WH, 'rgba(0,0,0,0)');
        wallRect(u0, 0, u0 + 0.06, 34, '#4a4a50'); wallRect(u1 - 0.06, 0, u1, 34, '#4a4a50');
        ctx.globalAlpha = 0.55;
        for (let k = 0; k < 6; k++) wallRect(u0, 3 + k * 5, u1, 3.3 + k * 5, '#6a6a70');
        for (let k = 0; k < 6; k++) wallRect(u0 + k / 6, 3, u0 + k / 6 + 0.02, 30, '#6a6a70');
        ctx.globalAlpha = 1;
        for (let k = 0; k < 8; k++) wallRect(u0 + k / 8, 32 + (k % 2), u0 + k / 8 + 0.06, 33.5 + (k % 2), '#8a8a90');
        break;
      }
      case 'J':   // ripas de madeira (sauna / casa de banho)
        wallRect(u0, 3.4, u1, WH - 4, '#6a4a2a');
        for (let k = 0; k < 8; k++) wallRect(u0, 5 + k * 5, u1, 5.4 + k * 5, '#4a3018');
        break;
      case 'O':   // porta aberta para a área do onsen, com cortina noren
        wallRect(u0 + 0.12, 0, u1 - 0.12, 34, '#0d0a14');
        wallRect(u0 + 0.14, 18, u1 - 0.14, 33, '#1a2a5a');
        for (let k = 1; k < 3; k++) wallRect(u0 + 0.14 + k * 0.24, 18, u0 + 0.16 + k * 0.24, 33, '#0d0a14');
        break;
      case 'r':   // cortina vermelha (女湯, ala feminina)
        wallRect(u0 + 0.12, 0, u1 - 0.12, 34, '#0d0a14');
        wallRect(u0 + 0.14, 18, u1 - 0.14, 33, '#a81a2a');
        for (let k = 1; k < 3; k++) wallRect(u0 + 0.14 + k * 0.24, 18, u0 + 0.16 + k * 0.24, 33, '#0d0a14');
        break;
      case 'R':   // persianas da delegacia
        wallRect(u0 + 0.1, 14, u1 - 0.1, 36, '#2a3446');
        for (let k = 0; k < 10; k++) wallRect(u0 + 0.12, 15 + k * 2.1, u1 - 0.12, 15.8 + k * 2.1, '#9aa8bc');
        break;
      case 'A':   // bandeira / brasão da polícia
        wallRect(u0 + 0.2, 16, u1 - 0.2, 38, '#1a2a5a');
        wallRect(u0 + 0.38, 22, u1 - 0.38, 32, '#ffd23f'); wallRect(u0 + 0.44, 24, u1 - 0.44, 30, '#1a2a5a');
        break;
    }
    wallRect(u0, WH - 4, u1, WH - 3, rgba(neon, 0.85));
  });
}

// ---------- personagens (sprites gerados com o dobro de detalhe) ----------
const SPR_W = 20, SPR_H = 48;
const spriteCache = {};

// sprites desenhados à mão (opcional): img/sprites/<look>_<pose>.png ou img/sprites/<look>.png,
// 20x48 pixels, substituem o desenho por código. Só são pedidos os nomes desta lista (sem 404 à toa):
// ao pôr um PNG na pasta, acrescente o nome aqui, ex.: 'banhista_f', 'banhista_f_walk1'
const CUSTOM_SPRITE_FILES = new Set([]);
const customSprites = {};
function customSprite(file) {
  if (!CUSTOM_SPRITE_FILES.has(file)) return null;
  if (!(file in customSprites)) {
    customSprites[file] = null;
    const im = new Image();
    im.onload = () => { customSprites[file] = im; for (const k in spriteCache) delete spriteCache[k]; };
    im.src = 'img/sprites/' + file + '.png';
  }
  return customSprites[file];
}

function getSprite(lookKey, pose) {
  const key = lookKey + ':' + pose;
  if (!spriteCache[key]) spriteCache[key] = customSprite(lookKey + '_' + pose) || customSprite(lookKey) || makeSprite(LOOKS[lookKey], pose);
  return spriteCache[key];
}

// robôs: 'heavy' = chassi de máquina (pernas de pistão, garras, visor e antena);
// 'android' = corpo esguio, mas com emendas, juntas à mostra, cabeça lisa e olhos de LED
function robotBody(L, pose, p) {
  const base = pose.startsWith('u') && pose !== 'u' ? (pose === 'ustand' ? 'stand' : pose.slice(1)) : pose;
  const heavy = L.robot === 'heavy';
  const plate = L.coat, plateL = shade(L.coat, 1.3), plateD = L.coatDark, metal = L.skin, metalD = shade(L.skin, 0.7), glow = L.implant, visor = L.goggles || L.implant;
  const seated = base === 'seated' || base === 'slumped' || base === 'kneel' || base === 'seiza';
  const oy = seated ? 6 : 0, a = base === 'walk1' ? -1 : base === 'walk2' ? 1 : 0;
  // pernas: pistões com joelho e pés em bloco
  if (seated) {
    p(5, 40, 4, 5, metal); p(11, 40, 4, 5, metal); p(4, 45, 6, 2, plateD); p(10, 45, 6, 2, plateD);
  } else if (heavy) {
    for (const [x, s] of [[5 + a, -1], [11 - a, 1]]) {
      p(x, 32, 4, 6, plate); p(x, 32, 1, 6, plateL); p(x + 3, 32, 1, 6, plateD);
      p(x + 1, 38, 2, 2, glow);                                    // junta do joelho
      p(x + 1, 40, 2, 5, metal); p(x + 1, 40, 1, 5, shade(metal, 1.25));   // pistão
      p(x - 1, 45 + (s * a < 0 ? -1 : 0), 6, 2, plateD); p(x - 1, 45 + (s * a < 0 ? -1 : 0), 6, 1, plate);
    }
  } else {
    for (const [x, s] of [[6 + a, -1], [11 - a, 1]]) {
      p(x, 33, 3, 6, plate); p(x, 33, 1, 6, plateL);
      p(x, 39, 3, 1, metalD); p(x + 1, 39, 1, 1, glow);           // joelho com luz
      p(x, 40, 3, 5, plate); p(x + 2, 40, 1, 5, plateD);
      p(x - 1, 45 + (s * a < 0 ? -1 : 0), 4, 2, metalD);
    }
  }
  // tronco: chassi com painéis, núcleo luminoso no peito e cintura articulada
  const tx = heavy ? 3 : 5, tw = heavy ? 14 : 10, ty = (heavy ? 18 : 20) + oy, tb = (heavy ? 32 : 33) + oy - (seated ? 2 : 0);
  p(tx, ty, tw, tb - ty, plate);
  p(tx, ty, 2, tb - ty, plateL); p(tx + tw - 2, ty, 2, tb - ty, plateD);
  p(tx + 2, ty + 5, tw - 4, 1, plateD); p(10, ty, 1, tb - ty, plateD);                 // emendas
  p(tx + 3, ty + 2, 4, 2, metalD); p(tx + tw - 7, ty + 2, 4, 2, metalD);             // grades de ventilação
  p(9, ty + 7, 3, 3, metalD); p(10, ty + 8, 1, 1, glow); p(9, ty + 8, 1, 1, shade(glow, 0.7)); p(11, ty + 8, 1, 1, shade(glow, 0.7));
  if (heavy) { p(tx + 1, ty + 11, tw - 2, 2, '#ffd23f'); for (let k = tx + 1; k < tx + tw - 1; k += 2) p(k, ty + 11, 1, 2, '#1a1a1a'); }   // faixa de advertência
  p(7, tb, 7, 1, metalD); p(8, tb - 1, 5, 1, metal);                                  // cintura
  // braços: ombro em esfera, segmentos e garra
  const shoulderY = ty + 1, armTop = ty + 3, armLen = heavy ? 12 : 10;
  for (const [x, s] of [[tx - (heavy ? 3 : 2), 1], [tx + tw, -1]]) {
    const sw = a * s;
    p(x, shoulderY, heavy ? 3 : 2, 3, plate); p(x, shoulderY, 1, 3, plateL);
    p(x + (heavy ? 1 : 0), armTop + 1 + sw, 2, armLen / 2, metal);
    p(x + (heavy ? 1 : 0), armTop + 1 + sw + armLen / 2 - 1, 2, 1, glow);              // cotovelo
    p(x + (heavy ? 1 : 0), armTop + sw + armLen / 2 + 1, 2, armLen / 2 - 1, plate);
    const hy2 = armTop + sw + armLen;
    if (heavy) { p(x, hy2, 1, 2, metalD); p(x + 2, hy2, 1, 2, metalD); p(x + 1, hy2, 1, 1, metal); }   // garra
    else p(x, hy2, 2, 2, metal);
  }
  // pescoço e cabeça
  const hx2 = base === 'slumped' ? 2 : 0, hy = (base === 'slumped' ? 3 : 0) + oy;
  p(9 + hx2, ty - 2 + hy, 2, 2, metalD); p(9 + hx2, ty - 2 + hy, 1, 2, metal);
  if (heavy) {
    const X = 5 + hx2, Y = ty - 9 + hy;
    p(X, Y, 10, 7, plate); p(X, Y, 10, 1, plateL); p(X, Y, 1, 7, plateL); p(X + 9, Y, 1, 7, plateD);
    p(X + 1, Y + 3, 8, 2, '#0a0a0e'); p(X + 2, Y + 3, 6, 1, visor);                     // visor
    p(X + 3, Y + 4, 2, 1, shade(visor, 0.6));
    p(X + 1, Y + 6, 8, 1, plateD); p(X + 3, Y + 6, 1, 1, metal); p(X + 6, Y + 6, 1, 1, metal);   // grade da "boca"
    p(X + 8, Y - 3, 1, 3, metalD); p(X + 8, Y - 4, 1, 1, glow);                          // antena
    p(X - 1, Y + 2, 1, 3, metalD); p(X + 10, Y + 2, 1, 3, metalD);                      // parafusos laterais
  } else {
    const X = 6 + hx2, Y = ty - 10 + hy;
    p(X + 1, Y, 6, 1, plate); p(X, Y + 1, 8, 7, plate); p(X + 1, Y + 8, 6, 1, plate);    // cabeça lisa, sem cabelo
    p(X, Y + 1, 1, 7, plateL); p(X + 7, Y + 1, 1, 7, plateD);
    p(X + 1, Y + 1, 6, 1, plateL);
    p(X + 4, Y, 1, 4, plateD);                                                         // emenda do crânio
    p(X + 2, Y + 4, 1, 1, visor); p(X + 5, Y + 4, 1, 1, visor);                        // olhos de LED
    p(X + 1, Y + 4, 1, 1, shade(visor, 0.5)); p(X + 6, Y + 4, 1, 1, shade(visor, 0.5));
    p(X + 3, Y + 6, 2, 1, metalD);                                                     // boca: alto-falante
    p(X - 1, Y + 3, 1, 3, metal); p(X + 8, Y + 3, 1, 3, metal);                        // receptores laterais
    if (L.veil) { p(X - 1, Y - 1, 10, 3, L.veil); p(X - 1, Y + 2, 2, 7, L.veil); p(X + 7, Y + 2, 2, 7, L.veil); }   // touca (Irmã-7)
  }
}

function makeSprite(L, pose) {
  const cv = document.createElement('canvas');
  cv.width = SPR_W; cv.height = SPR_H;
  const c = cv.getContext('2d');
  const p = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  if (L.cat) {   // gato-robô: corpo baixo, orelhas, cauda e olhos de LED
    const a = pose === 'walk1' ? 1 : 0;
    p(4, 40, 11, 5, L.coat); p(4, 44, 2, 3, L.legs); p(12, 44, 2, 3, L.legs); p(7, 44 + a, 2, 3 - a, L.legs);
    p(13, 34, 6, 6, L.coat); p(13, 32, 2, 2, L.coat); p(17, 32, 2, 2, L.coat);
    p(14, 36, 1, 1, L.implant); p(17, 36, 1, 1, L.implant);
    p(1, 37, 3, 1, L.coat); p(1, 34, 1, 4, L.coat);
    p(4, 40, 11, 1, shade(L.coat, 1.3));
    return outlineSprite(c, cv, L);
  }
  if (L.robot) { robotBody(L, pose, p); return outlineSprite(c, cv, L); }
  // poses: stand / walk1 / walk2 / seated / slumped / kneel / sleep; com prefixo 'u' = segurando guarda-chuva
  const umb = pose[0] === 'u';
  const base = umb ? (pose === 'ustand' ? 'stand' : pose.slice(1)) : pose;
  const towel = !!L.towel || !!L.bare;
  const coatL = shade(L.coat, 1.22), coatD = L.coatDark, skinD = shade(L.skin, 0.78), legsD = shade(L.legs, 0.7);
  const seiza = base === 'seiza';
  const seated = base === 'seated' || base === 'slumped' || base === 'kneel' || seiza;
  const oy = seiza ? 12 : seated ? 6 : 0;      // tronco desce quando sentado (e mais ainda de joelhos)
  const hx = base === 'slumped' ? 2 : 0, hy = base === 'slumped' ? 3 : 0;
  const wide = L.wide ? 1 : 0;
  const shoe = towel ? shade(L.skin, 0.85) : '#141018', shoeL = towel ? L.skin : '#2a2430';

  // pernas e sapatos
  if (seiza) {
    // nada de canelas: estão dobradas embaixo do corpo
  } else if (seated) {
    const shin = towel ? L.skin : L.legs, shinD = towel ? skinD : legsD;
    p(5, 40, 3, 5, shin); p(12, 40, 3, 5, shin); p(7, 40, 1, 5, shinD); p(14, 40, 1, 5, shinD);
    p(4, 45, 5, 2, shoe); p(11, 45, 5, 2, shoe); p(5, 45, 3, 1, shoeL); p(12, 45, 3, 1, shoeL);
  } else {
    const a = base === 'walk1' ? -1 : base === 'walk2' ? 1 : 0;
    p(6 + a, 33, 3, 12 + (a < 0 ? -1 : 0), L.legs); p(8 + a, 33, 1, 12, legsD);
    p(11 - a, 33, 3, 12 + (a > 0 ? -1 : 0), L.legs); p(11 - a, 33, 1, 12, legsD);
    p(5 + a, 45 + (a < 0 ? -1 : 0), 4, 2, shoe); p(11 - a, 45 + (a > 0 ? -1 : 0), 4, 2, shoe);
    p(5 + a, 45 + (a < 0 ? -1 : 0), 4, 1, shoeL); p(11 - a, 45 + (a > 0 ? -1 : 0), 4, 1, shoeL);
  }
  // tronco
  const tx = 5 - wide, tw = 10 + wide * 2, ty = 20 + oy;
  const tb = L.long && !seated && !towel ? 40 : seiza ? 44 : seated ? 36 : 34;
  if (towel) {
    // tronco nu e toalha enrolada (na cintura, ou do peito para baixo)
    p(tx, ty, tw, tb - ty, L.skin);
    p(tx, ty, 2, tb - ty, shade(L.skin, 1.1)); p(tx + tw - 2, ty, 2, tb - ty, skinD);
    p(tx + 3, ty + 4, 4, 1, skinD); p(10, ty + 7, 1, 2, skinD);
    const t0 = L.towelHigh ? ty + 2 : ty + 9, t1 = 41;
    if (L.bare) p(tx + 1, ty + 9, tw - 2, 1, skinD);
    else {
    p(tx - 1, t0, tw + 2, t1 - t0, L.towel); p(tx - 1, t0, tw + 2, 1, shade(L.towel, 1.1));
    p(tx + tw - 2, t0, 2, t1 - t0, shade(L.towel, 0.8)); p(tx + 3, t0 + 1, 1, t1 - t0 - 1, shade(L.towel, 0.88));
    }
  } else {
    p(tx, ty, tw, tb - ty, L.coat);
    if (L.long && !seated) { p(tx - 1, 36, tw + 2, 4, L.coat); p(tx - 1, 39, tw + 2, 1, coatD); p(9, 34, 2, 6, coatD); }
    p(tx, ty, 2, tb - ty, coatL);                  // luz à esquerda
    p(tx + tw - 2, ty, 2, tb - ty, coatD);         // sombra à direita
    p(8, ty, 4, 2, L.shirt || shade(L.coat, 0.5)); // gola / camisa
    p(9, ty + 2, 2, 3, L.shirt || shade(L.coat, 0.5));
    p(7, ty, 1, 5, coatL); p(12, ty, 1, 5, coatD);  // lapelas
    if (L.tie) p(9, ty + 1, 2, 7, L.tie);
    if (L.jacket) {   // jaqueta aberta: camisa clara por baixo, gola e bainha marcadas
      p(8, ty, 4, 10, L.shirt); p(8, ty, 1, 2, L.collar || '#ffffff'); p(11, ty, 1, 2, L.collar || '#ffffff');
      p(7, ty + 1, 1, 9, coatL); p(12, ty + 1, 1, 9, coatL);
      p(9, ty + 4, 1, 1, shade(L.shirt, 0.8)); p(9, ty + 7, 1, 1, shade(L.shirt, 0.8));
      p(tx, tb - 1, tw, 1, coatL);
    }
    if (L.vest) {     // colete tático / de perícia com faixa refletiva
      p(tx, ty + 1, tw, 10, L.vest); p(tx, ty + 1, 1, 10, shade(L.vest, 1.3));
      p(tx, ty + 6, tw, 1, L.vestStripe || '#d8ff60');
      p(tx + 2, ty + 2, 2, 2, '#ffd23f');
    }
    p(tx, ty + 10, tw, 1, coatD);                  // cinto
    p(10, ty + 10, 1, 1, L.implant);
    p(10, ty + 6, 1, 1, coatD); p(10, ty + 13, 1, 1, coatD);
  }
  // sentado: colo e joelhos à frente da barriga
  if (seiza) {
    // coxas dobradas vistas de frente, apoiadas no chão, e as pontas dos pés atrás
    const lap = L.towel || (L.long ? L.coat : L.legs), lapL = shade(lap, 1.28), lapD = shade(lap, 0.7);
    p(3, 43, 14, 5, lap); p(3, 43, 14, 1, lapL); p(9, 44, 2, 4, lapD);
    p(3, 47, 14, 1, lapD); p(4, 45, 4, 1, shade(lap, 1.12)); p(12, 45, 4, 1, shade(lap, 1.12));
  } else if (seated) {
    const lap = L.towel || (L.long ? L.coat : L.legs), lapL = shade(lap, 1.28), lapD = shade(lap, 0.7);
    p(4, 35, 12, 4, lap);                                  // as duas coxas, vistas de frente e encurtadas
    p(4, 35, 12, 1, lapL);                                 // luz no alto das coxas
    p(9, 36, 2, 3, lapD); p(10, 35, 1, 1, lapD);           // vão entre as pernas
    p(4, 37, 5, 2, shade(lap, 1.12)); p(11, 37, 5, 2, shade(lap, 1.12));   // joelhos
    p(5, 37, 2, 1, lapL); p(12, 37, 2, 1, lapL);
    p(4, 39, 5, 1, lapD); p(11, 39, 5, 1, lapD);           // sombra sob os joelhos
  }
  // braços
  const al = base === 'walk1' ? -1 : base === 'walk2' ? 1 : 0;
  const armL = towel ? L.skin : L.armL || coatL, armR = towel ? skinD : coatD;
  if (seated && (base === 'seated' || seiza) && !umb) {
    p(tx - 2, ty + 1, 2, 8, armL); p(tx - 1, ty + 8, 2, 2, armL);          // braço e antebraço dobrado
    p(tx + tw, ty + 1, 2, 8, armR); p(tx + tw - 1, ty + 8, 2, 2, armR);
    p(tx - 1, ty + 10, 3, 2, L.skin); p(tx + tw - 2, ty + 10, 3, 2, skinD);  // mãos sobre os joelhos
  } else {
  p(tx - 2, ty + 1 + al, 2, 12, armL);
  if (L.armL && !towel) { p(tx - 2, ty + 5 + al, 2, 1, '#3a4050'); p(tx - 2, ty + 9 + al, 2, 1, '#3a4050'); p(tx - 2, ty + 7 + al, 1, 1, '#ffd23f'); p(tx - 2, ty + 13 + al, 2, 2, '#6a7386'); }
  else p(tx - 2, ty + 13 + al, 2, 2, L.skin);
  if (umb) {
    // braço da frente dobrado para cima, a mão segurando o cabo na altura do queixo
    p(tx + tw, ty + 1, 2, 6, armR);
    p(tx + tw + 1, ty - 5, 2, 9, armR); p(tx + tw + 2, ty - 5, 1, 9, shade(armR, 0.8));
    p(tx + tw + 1, ty - 7, 2, 2, L.skin);
  } else {
    p(tx + tw, ty + 1 - al, 2, 12, armR);
    if (base === 'slumped') p(tx + tw, ty + 13, 2, 5, L.skin);
    else p(tx + tw, ty + 13 - al, 2, 2, skinD);
  }
  }
  // pescoço e cabeça
  const X = 6 + hx, Y = 8 + oy + hy;
  p(9 + (hx >> 1), 18 + oy + (hy >> 1), 2, 2, skinD);
  p(X, Y + 1, 8, 8, L.skin); p(X + 1, Y, 6, 10, L.skin);
  p(X + 7, Y + 1, 1, 8, skinD); p(X + 1, Y + 9, 6, 1, skinD);
  p(X - 1, Y + 4, 1, 2, L.skin); p(X + 8, Y + 4, 1, 2, skinD);   // orelhas
  // rosto (de frente, levemente virado para a direita)
  if (base === 'slumped' || base === 'dead') { p(X + 2, Y + 4, 2, 1, '#3a2020'); p(X + 5, Y + 4, 2, 1, '#3a2020'); }
  else if (base === 'sleep') { p(X + 2, Y + 5, 2, 1, shade(L.skin, 0.55)); p(X + 5, Y + 5, 2, 1, shade(L.skin, 0.55)); }
  else {
    p(X + 2, Y + 4, 1, 1, '#f0f0f8'); p(X + 3, Y + 4, 1, 1, '#141018');
    p(X + 5, Y + 4, 1, 1, '#f0f0f8'); p(X + 6, Y + 4, 1, 1, '#141018');
  }
  p(X + 2, Y + 3, 2, 1, shade(L.hair, 0.9)); p(X + 5, Y + 3, 2, 1, shade(L.hair, 0.9));   // sobrancelhas
  p(X + 5, Y + 6, 1, 1, skinD);                                                         // nariz
  p(X + 3, Y + 8, 3, 1, shade(L.skin, 0.62));                                           // boca
  if (L.beard) { p(X, Y + 7, 8, 3, rgba(L.hair, 0.55)); p(X + 3, Y + 8, 3, 1, shade(L.skin, 0.55)); }
  // cabelo
  const hl = shade(L.hair, 1.35);
  switch (L.hairStyle) {
    case 'long':
      p(X - 1, Y - 1, 10, 4, L.hair); p(X - 1, Y + 2, 2, 12, L.hair); p(X + 7, Y + 2, 2, 12, L.hair);
      p(X + 1, Y - 1, 4, 1, hl); p(X - 1, Y + 3, 1, 9, hl);
      break;
    case 'bun':
      p(X, Y - 1, 8, 3, L.hair); p(X + 2, Y - 4, 4, 3, L.hair); p(X + 3, Y - 4, 2, 1, hl); p(X, Y + 2, 1, 3, L.hair);
      break;
    case 'slick':
      p(X, Y - 1, 8, 3, L.hair); p(X - 1, Y + 1, 1, 4, L.hair); p(X + 1, Y - 1, 5, 1, hl); p(X + 2, Y, 3, 1, hl);
      break;
    case 'bald':
      p(X - 1, Y + 2, 1, 4, L.hair); p(X + 8, Y + 2, 1, 4, L.hair); p(X + 1, Y, 4, 1, shade(L.skin, 1.15));
      break;
    case 'bob':
      p(X - 1, Y - 1, 10, 3, L.hair); p(X - 1, Y + 2, 2, 7, L.hair); p(X + 7, Y + 2, 2, 7, L.hair); p(X + 1, Y - 1, 4, 1, hl);
      break;
    case 'hood':     // capuz: cobre a cabeça, rosto na sombra, só o implante brilha
      p(X - 2, Y - 3, 12, 13, L.hair); p(X - 2, Y + 9, 12, 3, L.hair);
      p(X - 2, Y - 3, 2, 13, shade(L.hair, 1.35)); p(X + 8, Y - 2, 2, 12, shade(L.hair, 0.7));
      p(X + 1, Y + 1, 6, 8, '#050508'); p(X + 2, Y + 8, 4, 1, '#0c0b12');
      p(X + 5, Y + 4, 1, 1, L.implant);
      break;
    case 'modern':   // corte curto com topete, laterais baixas
      p(X, Y - 2, 8, 4, L.hair); p(X + 4, Y - 3, 4, 1, L.hair); p(X - 1, Y, 1, 3, L.hair); p(X, Y + 2, 1, 2, L.hair);
      p(X + 1, Y - 2, 4, 1, hl); p(X + 5, Y - 3, 2, 1, hl);
      break;
    default:
      p(X, Y - 1, 8, 3, L.hair); p(X, Y + 2, 1, 3, L.hair); p(X + 1, Y - 1, 3, 1, hl);
  }
  // implante neural (brilha)
  if (L.hairStyle !== 'hood') p(X, Y + 3, 1, 2, L.implant);
  if (L.goggles) { p(X - 1, Y + 3, 10, 3, '#1a2430'); p(X, Y + 3, 8, 2, L.goggles); p(X + 1, Y + 3, 2, 1, '#e8ffff'); }
  if (L.hat) {
    p(X - 3, Y, 14, 2, L.hat); p(X - 3, Y + 1, 14, 1, shade(L.hat, 0.7));
    p(X, Y - 4, 8, 4, L.hat); p(X + 1, Y - 4, 6, 1, shade(L.hat, 1.5)); p(X, Y - 1, 8, 1, '#6a2638');
    p(X + 3, Y - 4, 2, 1, shade(L.hat, 0.6));
  }
  if (L.cap) {      // quepe policial com aba e distintivo
    p(X - 1, Y - 3, 10, 4, L.cap); p(X, Y - 3, 8, 1, shade(L.cap, 1.4));
    p(X - 1, Y + 1, 10, 1, '#0a0a10'); p(X + 3, Y - 2, 2, 2, '#ffd23f');
  }

  return outlineSprite(c, cv, L);
}

// luz de borda neon + contorno escuro
function outlineSprite(c, cv, L) {
  const img = c.getImageData(0, 0, SPR_W, SPR_H), d = img.data;
  const A = (x, y) => (x < 0 || y < 0 || x >= SPR_W || y >= SPR_H) ? 0 : d[(y * SPR_W + x) * 4 + 3];
  const rim = L.rim || [56, 246, 255];
  const out = new Uint8ClampedArray(d);
  for (let y = 0; y < SPR_H; y++) for (let x = 0; x < SPR_W; x++) {
    const i = (y * SPR_W + x) * 4;
    if (d[i + 3]) {
      if (!A(x + 1, y) || !A(x, y - 1)) for (let k = 0; k < 3; k++) out[i + k] = d[i + k] * 0.65 + rim[k] * 0.35;
    } else if (A(x - 1, y) || A(x + 1, y) || A(x, y - 1) || A(x, y + 1)) {
      out[i] = 8; out[i + 1] = 4; out[i + 2] = 18; out[i + 3] = 235;
    }
  }
  img.data.set(out);
  c.putImageData(img, 0, 0);
  return cv;
}

/// sx, sy = pés do personagem em unidades de jogo
// opts: look, seated, slumped, pose ('kneel' | 'sleep'), umbrella (cor), water (dentro d'água), gun, flash, noShadow, noGlow
function drawChar(c, sx, sy, L, t, moving, faceLeft, opts = {}) {
  const look = opts.look || Object.keys(LOOKS).find(k => LOOKS[k] === L);
  let pose = opts.slumped ? 'slumped' : opts.seated ? 'seated' : opts.pose ? opts.pose : moving ? (Math.floor(t * 8) % 2 ? 'walk1' : 'walk2') : 'stand';
  if (opts.umbrella && (pose === 'stand' || pose === 'walk1' || pose === 'walk2')) pose = 'u' + pose;
  const spr = getSprite(look, pose);
  const breath = !moving && !opts.slumped && Math.floor(t * 1.5) % 2 ? 0.5 : 0;
  const water = opts.water;
  if (!opts.noShadow && !L.holo && !water) {
    c.fillStyle = 'rgba(0,0,0,0.45)';
    c.beginPath(); c.ellipse(sx, sy, 5.5, 2.2, 0, 0, Math.PI * 2); c.fill();
  }
  // dentro d'água: o corpo afunda e só aparece acima da linha d'água (sy)
  const sink = water ? 9 : 0;
  const full = water || L.holo;          // recorte e transparência pedem save/restore; o resto só mexe na matriz
  const T0 = c.getTransform();
  if (full) c.save();
  if (water) { c.beginPath(); c.rect(sx - 14, sy - 40, 28, 40 - 0.6); c.clip(); }
  c.imageSmoothingEnabled = false;
  if (L.holo) {
    c.fillStyle = '#2a3a48'; c.fillRect(sx - 5, sy - 1, 10, 2);
    c.fillStyle = rgba('#38f6ff', 0.9); c.fillRect(sx - 3, sy - 1.5, 6, 0.5);
    c.globalAlpha = Math.random() < 0.05 ? 0.25 : 0.6 + 0.12 * Math.sin(t * 9);
    sy -= 3 + Math.sin(t * 2);
  }
  c.translate(Math.round(sx * 2) / 2, Math.round((sy + breath + sink) * 2) / 2);
  if (L.child) c.scale(L.child, L.child);   // criança: mesmo sprite, menor, com os pés no lugar
  if (faceLeft) c.scale(-1, 1);
  c.drawImage(spr, -SPR_W / 4, -SPR_H / 2, SPR_W / 2, SPR_H / 2);
  if (full) c.restore(); else c.setTransform(T0);
  if (water) {
    // ondulação em volta do corpo
    c.strokeStyle = 'rgba(200,240,255,0.45)'; c.lineWidth = 0.5;
    const r = (t * 0.8 + sx * 0.1) % 1;
    c.beginPath(); c.ellipse(sx, sy - 0.5, 5 + r * 3, 2 + r * 1.2, 0, 0, Math.PI * 2); c.stroke();
    c.fillStyle = 'rgba(160,220,255,0.18)';
    c.beginPath(); c.ellipse(sx, sy - 0.5, 5.5, 2.2, 0, 0, Math.PI * 2); c.fill();
  }
  if (L.holo) {
    c.save(); c.globalAlpha = 0.3; c.fillStyle = '#05030c';
    for (let y = sy - 24; y < sy; y += 1.5) c.fillRect(sx - 6, y + (t * 4) % 1.5, 12, 0.5);
    c.restore();
  }
  // guarda-chuva: o cabo sai da mão erguida (pixel (17, 14) do sprite)
  if (opts.umbrella) {
    const dir = faceLeft ? -1 : 1;
    const hx = sx + dir * 3.5, hy = sy - 17 + breath;
    const ux = sx + dir * 1.5, uy = sy - 27 + breath;
    c.strokeStyle = '#2a2a34'; c.lineWidth = 0.6;
    c.beginPath(); c.moveTo(hx, hy + 1.2); c.lineTo(ux + dir * 0.4, uy); c.stroke();
    c.fillStyle = opts.umbrella;
    c.beginPath(); c.ellipse(ux, uy, 8.5, 3.6, 0, Math.PI, 0); c.fill();
    c.fillStyle = 'rgba(0,0,0,0.25)';
    c.beginPath(); c.ellipse(ux, uy, 8.5, 1.2, 0, 0, Math.PI); c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 0.4;
    c.beginPath(); c.ellipse(ux, uy, 8.5, 3.6, 0, Math.PI, 0); c.stroke();
    for (const k of [-5, 0, 5]) { c.beginPath(); c.moveTo(ux, uy - 3.6); c.lineTo(ux + k * 1.1, uy); c.stroke(); }
    c.fillStyle = '#2a2a34'; c.fillRect(ux - 0.3, uy - 4.6, 0.6, 1.2);
  }
  // pistola na mão da frente (e clarão do disparo)
  if (opts.gun) {
    const dir = faceLeft ? -1 : 1, gx = sx + dir * 2.75, gy = sy - 8 + breath;
    c.fillStyle = '#25252e'; c.fillRect(dir > 0 ? gx : gx - 3.4, gy, 3.4, 1.1);
    c.fillStyle = '#4a4a56'; c.fillRect(dir > 0 ? gx : gx - 1.2, gy + 1.1, 1.2, 1.3);
    if (opts.flash) {
      const fx = gx + dir * 4.2, fy = gy + 0.5;
      c.save(); c.globalCompositeOperation = 'lighter';
      const g = c.createRadialGradient(fx, fy, 0, fx, fy, 4);
      g.addColorStop(0, 'rgba(255,240,180,0.95)'); g.addColorStop(0.4, 'rgba(255,170,60,0.6)'); g.addColorStop(1, 'rgba(255,120,40,0)');
      c.fillStyle = g; c.fillRect(fx - 4, fy - 4, 8, 8);
      c.restore();
    }
  }
  // brilho do implante
  if (!opts.noGlow) {
    // implante fica no pixel (6, 11) do sprite; 0,5 unidade por pixel, origem em (-5, -24)
    const seat = opts.seated || opts.slumped || pose === 'kneel' ? 6 : 0;
    const hood = L.hairStyle === 'hood';
    const lx = hood ? -5 + 11.5 * 0.5 : -5 + 6.5 * 0.5, ly = hood ? -24 + 12.5 * 0.5 : -24 + (12 + seat) * 0.5;
    const ix = sx + (faceLeft ? -lx : lx), iy = sy + ly + breath + sink;
    c.save();
    c.globalCompositeOperation = 'lighter';
    const g = c.createRadialGradient(ix, iy, 0, ix, iy, 3);
    g.addColorStop(0, rgba(L.implant, 0.55)); g.addColorStop(1, rgba(L.implant, 0));
    c.fillStyle = g; c.fillRect(ix - 3, iy - 3, 6, 6);
    c.restore();
  }
}

// personagem deitado de costas sobre um plano (cama) à altura z: cabeça para -y, pés para +y.
// (hx, hy) = posição da cabeça em tiles; len = comprimento do corpo em tiles
function drawLying(hx, hy, z, look, t, opts = {}) {
  const k = (opts.len || 1.55) / 24;              // tiles por unidade do sprite
  const ux = [16 * k, 8 * k], vy = [-16 * k, 8 * k];   // eixos: sprite u → +x do mundo, sprite v (pés) → +y
  const [ox, oy] = iso(hx, hy + 24 * k, z);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.transform(ux[0], ux[1], vy[0], vy[1], ox, oy);
  ctx.drawImage(getSprite(look, opts.pose || 'sleep'), -SPR_W / 4, -SPR_H / 2, SPR_W / 2, SPR_H / 2);
  if (opts.blanket) {
    // cobertor do peito para baixo, com dobra
    const b = opts.blanket;
    ctx.fillStyle = shade(b, 0.7); ctx.fillRect(-6.6, -10.5, 13.2, 11.5);
    ctx.fillStyle = b; ctx.fillRect(-6, -10, 12, 10.8);
    ctx.fillStyle = shade(b, 1.35); ctx.fillRect(-6, -10, 12, 1.4);
    ctx.fillStyle = shade(b, 1.15); for (let v = -7; v < 0; v += 3) ctx.fillRect(-6, v, 12, 0.5);
    ctx.fillStyle = shade(b, 0.85); ctx.fillRect(-0.8, -8, 1.6, 8);
  }
  ctx.restore();
  if (opts.zzz) {
    const [sx, sy] = iso(hx, hy, z + 6);
    ctx.fillStyle = 'rgba(200,220,255,0.8)'; ctx.font = '700 4px "Chakra Petch", sans-serif';
    for (let i = 0; i < 3; i++) {
      const ph = (t * 0.6 + i / 3) % 1;
      ctx.globalAlpha = Math.sin(ph * Math.PI);
      ctx.fillText('z', sx + 3 + ph * 6, sy - ph * 10);
    }
    ctx.globalAlpha = 1;
  }
}

// corpo deitado de costas no chão: o sprite é projetado no plano do piso,
// com a cabeça para -x e os pés para +x
function drawCorpse(wx, wy, t, look = 'arthur', blood = true) {
  const S = 0.8;                                   // corpo de ~1 tile de comprimento
  const ax = 0.894 * S, ay = 0.447 * S;            // eixos isométricos normalizados
  const toScreen = (u, v) => { const [fx, fy] = iso(wx + 0.55, wy); return [fx + u * ax + v * ax, fy - u * ay + v * ay]; };
  // poça de sangue sob a cabeça
  const [bx, by] = toScreen(0, -20);
  if (blood) {
    ctx.fillStyle = 'rgba(90,6,18,0.85)';
    ctx.beginPath(); ctx.ellipse(bx - 1, by + 1, 6, 2.8, 0.45, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(160,16,40,0.5)';
    ctx.beginPath(); ctx.ellipse(bx - 2, by + 0.5, 3.5, 1.5, 0.45, 0, Math.PI * 2); ctx.fill();
  }
  // sombra de contato
  const [mx, my] = toScreen(0, -12);
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath(); ctx.ellipse(mx, my + 0.5, 11, 4, 0.46, 0, Math.PI * 2); ctx.fill();
  const [ox, oy] = toScreen(0, 0);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.transform(ax, -ay, ax, ay, ox, oy);
  ctx.drawImage(getSprite(look, 'dead'), -SPR_W / 4, -SPR_H / 2, SPR_W / 2, SPR_H / 2);
  ctx.restore();
  // faísca no implante fundido (pixel (6, 11) do sprite)
  const [kx, ky] = toScreen(-5 + 6 * 0.5, -24 + 11 * 0.5);
  if (Math.random() < 0.4) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = '#9ff8ff';
    for (let k = 0; k < 3; k++) ctx.fillRect(kx + Math.random() * 3 - 1.5, ky + Math.random() * 3 - 1.5, 0.5, 0.5);
    ctx.restore();
  }
  ctx.fillStyle = Math.sin(t * 10) > 0 ? '#ff3355' : '#7a1020';
  ctx.fillRect(kx, ky, 1, 1);
}

// ---------- objetos ----------
function drawObject(o, t, scanner) {
  const w = o.w || 1, d = o.d || 1;
  const cx = o.x + w / 2, cy = o.y + d / 2;
  switch (o.kind) {
    case 'bed':
      box(o.x + 0.05, o.y + 0.05, w - 0.1, d - 0.1, 6, '#2d1b46');
      box(o.x + 0.1, o.y + 0.1, w - 0.2, 0.6, 3, '#d8d0e8', 6);
      box(o.x + 0.05, o.y + 0.9, w - 0.1, d - 1, 1.2, '#5a2a7a', 6);
      line([iso(o.x + 0.05, o.y + 1.4, 7.2), iso(o.x + w - 0.05, o.y + 1.4, 7.2)], 'rgba(255,255,255,0.12)', 0.4);
      break;
    case 'corpse':
      drawCorpse(cx, cy, t, o.look, o.blood !== false);
      break;
    case 'glass': {
      const [sx, sy] = iso(cx, cy);
      ctx.fillStyle = rgba('#7dff6b', 0.45);
      ctx.beginPath(); ctx.ellipse(sx, sy + 1, 3.5, 1.4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = rgba('#cfe8ff', 0.85);
      ctx.beginPath(); ctx.moveTo(sx - 1.5, sy - 3); ctx.lineTo(sx + 1.5, sy - 3); ctx.lineTo(sx + 0.3, sy - 0.8); ctx.lineTo(sx - 0.3, sy - 0.8); ctx.fill();
      ctx.fillRect(sx + 0.5, sy - 0.8, 2.5, 0.6);
      break;
    }
    case 'holotable': {
      box(o.x + 0.15, o.y + 0.15, 0.7, 0.7, 9, '#1a2a36', 0, '#38f6ff');
      const [sx, sy] = iso(cx, cy, 9);
      const fl = 0.5 + 0.3 * Math.sin(t * 7);
      const g = ctx.createLinearGradient(0, sy, 0, sy - 20);
      g.addColorStop(0, rgba('#38f6ff', 0.4 * fl + 0.15)); g.addColorStop(1, rgba('#38f6ff', 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(sx - 4, sy); ctx.lineTo(sx + 4, sy); ctx.lineTo(sx + 8, sy - 20); ctx.lineTo(sx - 8, sy - 20); ctx.fill();
      ctx.fillStyle = rgba('#ff3355', 0.9); ctx.fillRect(sx - 5, sy - 16, 6, 1.5);
      ctx.fillStyle = rgba('#38f6ff', 0.9); ctx.fillRect(sx - 5, sy - 12.5, 10, 0.6); ctx.fillRect(sx - 5, sy - 11, 7, 0.6); ctx.fillRect(sx - 5, sy - 9.5, 8, 0.6);
      ctx.fillStyle = Math.floor(t * 2) % 2 ? '#ff3355' : '#300'; ctx.fillRect(sx + 3, sy - 16, 1.5, 1.5);
      break;
    }
    case 'vent':
      box(o.x + 0.1, o.y, 0.8, 0.35, 12, '#3a3a46');
      for (let k = 0; k < 5; k++) line([iso(o.x + 0.15, o.y + 0.35, 2 + k * 2), iso(o.x + 0.85, o.y + 0.35, 2 + k * 2)], '#14141c', 0.7);
      break;
    case 'panel': {
      box(o.x + 0.3, o.y + 0.05, 0.4, 0.2, 22, '#2a2a36');
      const [sx, sy] = iso(o.x + 0.5, o.y + 0.25, 16);
      ctx.fillStyle = '#0a1018'; ctx.fillRect(sx - 2, sy - 2.5, 4, 5);
      ctx.fillStyle = Math.floor(t * 3) % 2 ? '#ff3355' : '#7a1020'; ctx.fillRect(sx - 1, sy - 1.5, 2, 1);
      ctx.fillStyle = '#38f6ff'; ctx.fillRect(sx - 1.5, sy + 0.5, 3, 0.5);
      break;
    }
    case 'lamp':
      box(o.x + 0.38, o.y + 0.38, 0.24, 0.24, 2, '#2a2a36');
      box(o.x + 0.47, o.y + 0.47, 0.06, 0.06, 22, '#3a3a48', 2);
      box(o.x + 0.3, o.y + 0.3, 0.4, 0.4, 5, '#ff4fd8', 24, '#ff9aea');
      break;
    case 'plant': {
      box(o.x + 0.3, o.y + 0.3, 0.4, 0.4, 6, '#2a2a36');
      const [sx, sy] = iso(cx, cy, 6);
      ctx.fillStyle = rgba('#7dff6b', 0.6 + 0.15 * Math.sin(t * 3 + o.x));
      for (let k = 0; k < 10; k++) {
        const a = k / 10 * Math.PI * 2 + t * 0.5;
        ctx.beginPath(); ctx.ellipse(sx + Math.cos(a) * 4, sy - 6 + Math.sin(a) * 2.5 - k * 0.6, 1.6, 0.8, a, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = rgba('#38f6ff', 0.6); ctx.fillRect(sx - 0.5, sy - 12, 1, 6);
      break;
    }
    case 'desk':
      box(o.x, o.y + 0.1, w, d - 0.2, 10, '#2a1f2e', 0, '#3a2c40');
      line([iso(o.x, o.y + d - 0.1, 8), iso(o.x + w, o.y + d - 0.1, 8)], rgba(game.roomData.neon, 0.95), 0.8);
      break;
    case 'bar':
      box(o.x, o.y + 0.1, w, d - 0.2, 11, '#1e1428', 0, '#2e2038');
      line([iso(o.x, o.y + d - 0.1, 3), iso(o.x + w, o.y + d - 0.1, 3)], '#b04cff', 0.8);
      for (let k = 0; k < 3; k++) { const [sx, sy] = iso(o.x + 0.5 + k, o.y + 0.5, 11); ctx.fillStyle = ['#7dff6b', '#ffd23f', '#38f6ff'][k]; ctx.fillRect(sx - 1, sy - 4, 2, 4); ctx.fillRect(sx - 0.5, sy - 5.5, 1, 1.5); }
      break;
    case 'terminal': {
      box(o.x + 0.2, o.y + 0.2, 0.6, 0.6, 9, '#222a36');
      const sc = o.screen || '#38f6ff';
      const [sx, sy] = iso(cx, cy, 9);
      ctx.fillStyle = '#0a0e14'; ctx.fillRect(sx - 5, sy - 10, 10, 8);
      ctx.fillStyle = rgba(sc, 0.3 + 0.15 * Math.sin(t * 5)); ctx.fillRect(sx - 4.5, sy - 9.5, 9, 7);
      ctx.fillStyle = sc;
      for (let k = 0; k < 4; k++) ctx.fillRect(sx - 3.5, sy - 8.5 + k * 1.5, 2 + ((k * 3 + Math.floor(t * 4)) % 5), 0.6);
      break;
    }
    case 'stool':
      box(o.x + 0.42, o.y + 0.42, 0.16, 0.16, 6, '#3a3a48');
      box(o.x + 0.25, o.y + 0.25, 0.5, 0.5, 2, '#b04cff', 6);
      break;
    case 'sofa':
      box(o.x + 0.1, o.y + 0.05, 0.8, d - 0.1, 5, '#3a1f4a');
      box(o.x + 0.05, o.y + 0.05, 0.25, d - 0.1, 7, '#4a2a5e', 5);
      break;
    case 'cart':
      box(o.x + 0.15, o.y + 0.2, 0.7, 0.6, 9, '#3a3a46', 0, '#5a5a66');
      box(o.x + 0.2, o.y + 0.25, 0.3, 0.25, 3, '#e8e8f0', 9);
      box(o.x + 0.55, o.y + 0.3, 0.25, 0.4, 4, '#ff6b3d', 9);
      break;
    case 'pipe':
      box(o.x + 0.25, o.y + 0.25, 0.5, 0.5, 34, '#4a3a2e');
      box(o.x + 0.2, o.y + 0.2, 0.6, 0.6, 3, '#6a5a44', 12);
      box(o.x + 0.2, o.y + 0.2, 0.6, 0.6, 3, '#6a5a44', 26);
      break;
    case 'shaft':
      box(o.x + 0.1, o.y, 0.8, 0.5, 30, '#2e302a');
      for (let k = 0; k < 8; k++) line([iso(o.x + 0.15, o.y + 0.5, 3 + k * 3.3), iso(o.x + 0.85, o.y + 0.5, 3 + k * 3.3)], '#121410', 0.7);
      break;
    case 'crate':
      box(o.x + 0.15, o.y + 0.15, 0.7, 0.7, 8, '#5a4128', 0, '#6e5032');
      line([iso(o.x + 0.15, o.y + 0.85, 4), iso(o.x + 0.85, o.y + 0.85, 4)], 'rgba(0,0,0,0.3)', 0.5);
      box(o.x + 0.3, o.y + 0.3, 0.35, 0.3, 1, '#e8e2cc', 8);
      break;
    case 'toolbox': {
      box(o.x + 0.55, o.y + 0.1, 0.3, 0.3, 28, '#4a3a2e');
      box(o.x + 0.1, o.y + 0.55, 0.3, 0.3, 28, '#4a3a2e');
      box(o.x + 0.3, o.y + 0.35, 0.45, 0.35, 5, '#8a2020');
      const [sx, sy] = iso(cx, cy, 5);
      ctx.fillStyle = '#8a93a6'; ctx.fillRect(sx - 5, sy - 2, 9, 1.5); ctx.fillRect(sx + 3, sy - 4, 2.5, 5);
      break;
    }
    case 'vending_food':
    case 'vending_drink':
      drawVending(o, t);
      break;
    case 'car':
      { const q = parkedPose(o); drawHoverCar(q.x, q.y, q.ang, t, { livery: o.livery || 'vance', parked: true, alt: q.alt }); }
      break;
    case 'lamp_post': {
      box(o.x + 0.45, o.y + 0.45, 0.1, 0.1, 30, '#2a2a34');
      box(o.x + 0.3, o.y + 0.3, 0.4, 0.4, 2, '#ffd8a0', 30, '#fff0d0');
      break;
    }
    case 'bench':
      box(o.x + 0.1, o.y + 0.25, 0.8, 0.5, 4, '#3a2a20');
      box(o.x + 0.1, o.y + 0.2, 0.8, 0.12, 8, '#4a3828', 4);
      break;
    case 'table':
      box(o.x + 0.45, o.y + 0.45, 0.1, 0.1, 8, '#2a2a34');
      box(o.x + 0.15, o.y + 0.15, 0.7, 0.7, 1.5, '#3a2a30', 8, '#4a3840');
      { const [sx, sy] = iso(o.x + 0.5, o.y + 0.5, 9.5); ctx.fillStyle = '#e8e0d0'; ctx.fillRect(sx - 1.5, sy - 2, 2, 2); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(sx - 1, sy - 4 - (t * 2) % 2, 0.5, 1.5); }
      break;
    case 'fridge':
      box(o.x + 0.15, o.y + 0.15, 0.7, 0.7, 26, '#c8ccd4', 0, '#e0e4ec');
      line([iso(o.x + 0.15, o.y + 0.85, 10), iso(o.x + 0.85, o.y + 0.85, 10)], '#8a8e98', 0.6);
      break;
    case 'water_cooler':
      box(o.x + 0.3, o.y + 0.3, 0.4, 0.4, 12, '#d8dce4');
      box(o.x + 0.33, o.y + 0.33, 0.34, 0.34, 8, '#7fd8ff', 12, '#bff0ff');
      break;
    case 'espresso':
      box(o.x + 0.2, o.y + 0.2, 0.6, 0.6, 11, '#2a2a30');
      box(o.x + 0.25, o.y + 0.25, 0.5, 0.5, 7, '#c8ccd4', 11);
      { const [sx, sy] = iso(o.x + 0.5, o.y + 0.5, 18); ctx.fillStyle = 'rgba(255,255,255,0.35)'; for (let k = 0; k < 3; k++) ctx.fillRect(sx - 1 + k, sy - 3 - ((t * 3 + k) % 3), 0.5, 1.5); }
      break;
    case 'pool': {
      const w2 = o.w || 1, d2 = o.d || 1;
      box(o.x, o.y, w2, d2, 3, '#8a9aa4', 0, '#a8b8c0');
      diamond(o.x + 0.15, o.y + 0.15, w2 - 0.3, d2 - 0.3, 3, '#3a8ab0');
      diamond(o.x + 0.25, o.y + 0.25, w2 - 0.5, d2 - 0.5, 3, rgba('#7fd8ff', 0.35 + 0.1 * Math.sin(t * 1.5)));
      // vapor
      for (let k = 0; k < 8; k++) {
        const [sx, sy] = iso(o.x + 0.5 + (k % 4) * (w2 - 1) / 3, o.y + 0.6 + Math.floor(k / 4) * (d2 - 1.2), 3);
        const up = (t * 6 + k * 3.3) % 14;
        ctx.fillStyle = `rgba(255,255,255,${0.12 * (1 - up / 14)})`;
        ctx.beginPath(); ctx.ellipse(sx + Math.sin(t + k) * 2, sy - up, 3 + up * 0.3, 1.6 + up * 0.15, 0, 0, Math.PI * 2); ctx.fill();
      }
      break;
    }
    case 'lamen': {
      const w2 = o.w || 1;
      box(o.x + 0.05, o.y + 0.2, w2 - 0.1, 0.6, 10, '#5a3020', 0, '#7a4428');
      box(o.x + 0.15, o.y + 0.3, 0.12, 0.12, 22, '#3a2018', 10);
      box(o.x + w2 - 0.27, o.y + 0.3, 0.12, 0.12, 22, '#3a2018', 10);
      box(o.x - 0.05, o.y + 0.1, w2 + 0.1, 0.8, 1.5, '#c8202a', 32, '#e83040');
      const [sx, sy] = iso(o.x + w2 / 2, o.y + 0.5, 10);
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; for (let k = 0; k < 4; k++) ctx.fillRect(sx - 4 + k * 2.5, sy - 4 - ((t * 4 + k) % 4), 0.6, 2);
      ctx.fillStyle = '#ffd23f'; ctx.font = '700 4px "Chakra Petch", sans-serif'; ctx.fillText('拉麺', sx - 4, sy - 16);
      break;
    }
    case 'fortune': {
      box(o.x + 0.2, o.y + 0.2, 0.6, 0.6, 7, '#3a1020', 0, '#5a1830');
      const [sx, sy] = iso(o.x + 0.5, o.y + 0.5, 7);
      const g = ctx.createRadialGradient(sx, sy - 3, 0, sx, sy - 3, 4);
      g.addColorStop(0, 'rgba(200,120,255,0.9)'); g.addColorStop(1, 'rgba(120,40,200,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy - 3, 2.6, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'lantern': {
      const [sx, sy] = iso(o.x + 0.5, o.y + 0.5, 34);
      const sw = Math.sin(t * 1.5 + o.x) * 0.8;
      ctx.strokeStyle = '#2a1010'; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.moveTo(sx, sy - 6); ctx.lineTo(sx + sw, sy); ctx.stroke();
      ctx.fillStyle = '#e8202a'; ctx.beginPath(); ctx.ellipse(sx + sw, sy + 2.5, 2.4, 3.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffd23f'; ctx.fillRect(sx + sw - 1.2, sy - 0.8, 2.4, 0.6); ctx.fillRect(sx + sw - 1.2, sy + 5.2, 2.4, 0.6);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(sx + sw, sy + 2.5, 0, sx + sw, sy + 2.5, 10);
      g.addColorStop(0, 'rgba(255,80,60,0.35)'); g.addColorStop(1, 'rgba(255,80,60,0)');
      ctx.fillStyle = g; ctx.fillRect(sx + sw - 10, sy - 8, 20, 20); ctx.restore();
      return;
    }
    case 'footprint': {
      if (!scanner) return;
      const [sx, sy] = iso(cx, cy);
      const a = 0.6 + 0.3 * Math.sin(t * 5 + o.x);
      ctx.fillStyle = rgba('#ff8a3d', a); ctx.beginPath(); ctx.ellipse(sx - 2.5, sy, 1.6, 0.9, 0.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = rgba('#ff3d3d', a); ctx.beginPath(); ctx.ellipse(sx + 2.5, sy + 1.5, 2.4, 1.2, 0.4, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'nanobots': {
      if (!scanner) return;
      const [sx, sy] = iso(cx, cy);
      for (let k = 0; k < 20; k++) {
        const a = k * 2.4 + t * (1 + k % 3);
        ctx.fillStyle = k % 2 ? '#38f6ff' : '#7dff6b';
        ctx.fillRect(sx + Math.cos(a) * (3 + k % 5), sy - 6 + Math.sin(a * 1.3) * 4, 0.6, 0.6);
      }
      break;
    }
    case 'puddle': {
      const n = game.roomData.neon;
      ctx.fillStyle = rgba(n, 0.12 + 0.06 * Math.sin(t * 2 + o.x * 3));
      const [sx, sy] = iso(o.x + 0.5, o.y + 0.5);
      ctx.beginPath(); ctx.ellipse(sx, sy, 9, 3.6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = rgba('#ffffff', 0.1); ctx.lineWidth = 0.4;
      const r = (t * 3 + o.x) % 1;
      ctx.beginPath(); ctx.ellipse(sx + 2, sy, r * 5, r * 2, 0, 0, Math.PI * 2); ctx.stroke();
      return;
    }
    case 'exit': {
      const pulse = 0.35 + 0.25 * Math.sin(t * 4);
      const open = !o.gate || game.act >= o.gate;
      const col = o.key === 'servico' ? (game.act >= 3 ? '#ffb347' : '#5a4a30') : (open ? '#7dff6b' : '#ff3355');
      diamond(o.x + 0.15, o.y + 0.15, 0.7, 0.7, 0, rgba(col, pulse * 0.5));
      const [sx, sy] = iso(cx, cy);
      ctx.fillStyle = rgba(col, 0.8);
      ctx.beginPath(); ctx.moveTo(sx - 2, sy - 1 + pulse * 2); ctx.lineTo(sx + 2, sy - 1 + pulse * 2); ctx.lineTo(sx, sy - 4 + pulse * 2); ctx.fill();
      break;
    }
    default:
      drawProp(o, t, scanner);   // objetos novos (props.js)
  }
}

// ---------- carros flutuantes (estilo spinner) ----------
// Cada modelo é um conjunto de prismas convexos no espaço do carro:
// f = frente (+) / trás (-), s = lado, z em unidades de altura. b = contorno da base, t = contorno do topo.
// As faces são sombreadas pela normal e só as voltadas para a câmera são desenhadas.
const CAR_MODELS = (() => {
  // contorno fechado a partir da metade direita (s >= 0), do nariz à traseira
  const loop = half => {
    const out = half.slice();
    for (let i = half.length - 1; i >= 0; i--) if (half[i][1] !== 0) out.push([half[i][0], -half[i][1]]);
    return out;
  };
  const rect = (f0, f1, s0, s1) => [[f1, s0], [f1, s1], [f0, s1], [f0, s0]];
  const pair = (part) => [part, { ...part, b: part.b.map(([f, s]) => [f, -s]), t: part.t.map(([f, s]) => [f, -s]) }];
  // perfil de carro: frente reta com cantos chanfrados (fN = nariz, fT = traseira, w = meia largura, c = chanfro)
  const shape = (fN, fT, w, c) => loop([[fN, 0], [fN, w - c], [fN - c, w], [fT + c, w], [fT, w - c], [fT, 0]]);
  const part = (id, b, t, z0, z1, col, extra = {}) => ({ id, b, t, z0, z1, col, ...extra });
  // quatro rodas (pneu escuro com aro claro por cima)
  const wheels = (fF, fR, w, r = 0.15, h = 2.8) => [
    ...pair(part('wheel', rect(fF - r, fF + r, w - 0.09, w + 0.03), rect(fF - r * 0.8, fF + r * 0.8, w - 0.08, w + 0.02), 0, h, 'tire')),
    ...pair(part('wheel', rect(fR - r, fR + r, w - 0.09, w + 0.03), rect(fR - r * 0.8, fR + r * 0.8, w - 0.08, w + 0.02), 0, h, 'tire')),
  ];
  return {
    // viatura policial: sedã alongado e baixo, com giroflex e turbinas discretas atrás das rodas
    spinner: [
      ...wheels(0.62, -0.62, 0.4),
      part('skirt', shape(1.0, -1.0, 0.4, 0.12), shape(0.99, -0.99, 0.4, 0.12), 1.0, 2.0, 'under'),
      part('body', shape(1.0, -1.0, 0.4, 0.12), shape(0.92, -0.96, 0.37, 0.14), 2.0, 4.6, 'main', { stripe: 0.45 }),
      part('cabin', shape(0.42, -0.62, 0.35, 0.1), shape(0.12, -0.5, 0.29, 0.1), 4.6, 7.4, 'glass'),
      part('roof', shape(0.12, -0.5, 0.29, 0.1), shape(0.09, -0.47, 0.27, 0.1), 7.4, 8.0, 'second'),
      ...pair(part('pod', rect(-1.02, -0.8, 0.26, 0.38), rect(-1.0, -0.82, 0.27, 0.36), 2.2, 3.8, 'metal', { thruster: true })),
      part('bar', rect(-0.3, -0.14, -0.15, 0.15), rect(-0.29, -0.15, -0.14, 0.14), 8.0, 8.9, 'lightbar'),
    ],
    // cupê esportivo (o Kestrel-7 de Vance e parte do trânsito): baixo, capô longo, cabine recuada, aerofólio
    coupe: [
      ...wheels(0.6, -0.62, 0.41, 0.17, 2.9),
      part('skirt', shape(1.0, -1.0, 0.41, 0.14), shape(0.99, -0.99, 0.41, 0.14), 0.9, 1.8, 'under'),
      part('body', shape(1.0, -1.0, 0.41, 0.14), shape(0.94, -0.97, 0.38, 0.15), 1.8, 4.0, 'main', { stripe: 0.4 }),
      part('cabin', shape(0.28, -0.6, 0.36, 0.1), shape(-0.02, -0.5, 0.29, 0.1), 4.0, 6.6, 'glass'),
      part('roof', shape(-0.02, -0.5, 0.29, 0.1), shape(-0.05, -0.47, 0.27, 0.1), 6.6, 7.1, 'main'),
      part('wing', rect(-0.98, -0.84, -0.38, 0.38), rect(-0.99, -0.86, -0.39, 0.39), 5.2, 5.8, 'second'),
      ...pair(part('strut', rect(-0.94, -0.88, 0.26, 0.3), rect(-0.94, -0.88, 0.26, 0.3), 4.0, 5.2, 'second')),
    ],
    // sedã quadrado, pesado, de rua (táxis e civis): cabine alta e porta-malas
    sedan: [
      ...wheels(0.6, -0.64, 0.42, 0.16, 3.0),
      part('skirt', shape(0.98, -0.98, 0.42, 0.1), shape(0.97, -0.97, 0.42, 0.1), 1.0, 2.0, 'under'),
      part('body', shape(0.98, -0.98, 0.42, 0.1), shape(0.95, -0.95, 0.4, 0.1), 2.0, 4.6, 'main', { stripe: 0.5 }),
      part('cabin', shape(0.42, -0.62, 0.38, 0.08), shape(0.24, -0.54, 0.33, 0.08), 4.6, 7.8, 'glass'),
      part('roof', shape(0.24, -0.54, 0.33, 0.08), shape(0.21, -0.51, 0.31, 0.08), 7.8, 8.6, 'second'),
    ],
  };
})();

const CAR_LIVERY = {
  vance:  { main: '#3e2656', second: '#24143a', under: '#141018', metal: '#2a2a34', glass: '#16394c', accent: '#ff4fd8', model: 'coupe' },
  police: { main: '#d8dde8', second: '#1c2c5a', under: '#161c2c', metal: '#2a3040', glass: '#173a52', accent: '#38a0ff', model: 'spinner', police: true },
};

// (x, y) = centro em tiles; ang = direção no mapa (0 = +x)
// opts: livery (nome ou objeto), parked (sem flutuar tanto), lights (sirene)
function drawHoverCar(x, y, ang, t, opts = {}) {
  const L = typeof opts.livery === 'string' ? CAR_LIVERY[opts.livery] : opts.livery || (opts.color ? { ...CAR_LIVERY.vance, main: opts.color, second: shade(opts.color, 0.6) } : CAR_LIVERY.vance);
  const model = CAR_MODELS[L.model || 'coupe'];
  // altura: no chão quando estacionado; em voo, alto e balançando de leve
  const alt = opts.alt !== undefined ? opts.alt : opts.parked ? 0 : CAR_FLY;
  const fl = alt + (alt > 1 ? Math.sin(t * 2.2 + x) * 0.6 : 0);
  const ca = Math.cos(ang), sa = Math.sin(ang);
  const W = (f, s) => [x + ca * f - sa * s, y + sa * f + ca * s];
  const P = (f, s, z) => { const [wx, wy] = W(f, s); return iso(wx, wy, z); };
  // sombra com o contorno do casco e brilho do repulsor no chão
  poly(ctx, model[0].b.map(([f, s]) => P(f * 1.05, s * 1.1, 0)), 'rgba(0,0,0,0.42)');
  const [gx, gy] = iso(x, y, 0);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 18);
  g.addColorStop(0, rgba(L.accent, 0.3)); g.addColorStop(1, rgba(L.accent, 0));
  ctx.fillStyle = g; ctx.fillRect(gx - 18, gy - 10, 36, 20);
  if (!opts.parked) {
    const [hx, hy] = P(3, 0, 0);
    const fg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 24);
    fg.addColorStop(0, 'rgba(255,250,220,0.24)'); fg.addColorStop(1, 'rgba(255,250,220,0)');
    ctx.fillStyle = fg; ctx.fillRect(hx - 24, hy - 14, 48, 28);
  }
  ctx.restore();

  // monta as faces de cada peça (espaço métrico: z / 16 ≈ tiles)
  const LIGHT = [0.42, -0.18, 0.89];
  const parts = model.map(pt => {
    const B = pt.b.map(([f, s]) => [...W(f, s), (fl + pt.z0) / 16]);
    const T = pt.t.map(([f, s]) => [...W(f, s), (fl + pt.z1) / 16]);
    const all = B.concat(T), n = all.length;
    const C = [0, 1, 2].map(k => all.reduce((a, p) => a + p[k], 0) / n);
    return { pt, B, T, C, depth: C[0] + C[1] + C[2] };
  }).sort((a, b) => a.pt.z0 - b.pt.z0 || a.depth - b.depth);   // peças empilhadas: de baixo para cima
  const colOf = pt => pt.col === 'lightbar' ? '#20242e' : pt.col === 'tire' ? '#101016' : pt.col === 'glass' ? shade(L.glass, 1.9) : L[pt.col] || L.main;
  for (const { pt, B, T, C } of parts) {
    const faces = [T];
    for (let i = 0; i < B.length; i++) { const j = (i + 1) % B.length; faces.push([B[i], B[j], T[j], T[i]]); }
    const base = colOf(pt);
    for (const F of faces) {
      // normal (Newell), orientada para fora da peça
      let nx = 0, ny = 0, nz = 0;
      for (let i = 0; i < F.length; i++) {
        const a = F[i], b = F[(i + 1) % F.length];
        nx += (a[1] - b[1]) * (a[2] + b[2]); ny += (a[2] - b[2]) * (a[0] + b[0]); nz += (a[0] - b[0]) * (a[1] + b[1]);
      }
      const fc = [0, 1, 2].map(k => F.reduce((s, p) => s + p[k], 0) / F.length);
      if (nx * (fc[0] - C[0]) + ny * (fc[1] - C[1]) + nz * (fc[2] - C[2]) < 0) { nx = -nx; ny = -ny; nz = -nz; }
      if (nx + ny + nz <= 1e-9) continue;              // virada para longe da câmera
      const nl = Math.hypot(nx, ny, nz) || 1;
      const lum = 0.5 + 0.55 * Math.max(0, (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) / nl);
      const S = F.map(p => iso(p[0], p[1], p[2] * 16));
      poly(ctx, S, shade(base, Math.min(1.25, lum)));
      if (pt.col === 'glass') {
        // reflexo do neon no vidro
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = rgba(L.accent, 0.35); ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(...S[0]); ctx.lineTo(...S[1]); ctx.stroke();
        ctx.fillStyle = 'rgba(180,230,255,0.08)'; ctx.beginPath(); S.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.fill();
        ctx.restore();
      } else if (F === T) {
        ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 0.35;
        ctx.beginPath(); S.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.stroke();
      } else if (pt.stripe) {
        // filete neon ao longo das laterais visíveis
        const a = S[0], b = S[1], c2 = S[2], d = S[3], k = pt.stripe;
        ctx.strokeStyle = L.accent; ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(a[0] + (d[0] - a[0]) * k, a[1] + (d[1] - a[1]) * k); ctx.lineTo(b[0] + (c2[0] - b[0]) * k, b[1] + (c2[1] - b[1]) * k); ctx.stroke();
      }
    }
    if (pt.col === 'lightbar') {
      const on = Math.floor(t * 6) % 2;
      for (const [s, col] of [[-0.08, on ? '#ff3355' : '#38a0ff'], [0.08, on ? '#38a0ff' : '#ff3355']]) {
        const [lx, ly] = P(-0.25, s, fl + pt.z1);
        ctx.fillStyle = col; ctx.fillRect(lx - 1.2, ly - 1, 2.4, 1.6);
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        const lg = ctx.createRadialGradient(lx, ly, 0, lx, ly, 14);
        lg.addColorStop(0, rgba(col, 0.55)); lg.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = lg; ctx.fillRect(lx - 14, ly - 14, 28, 28);
        ctx.restore();
      }
    }
    if (pt.id === 'body') {
      // faróis brancos na frente e lanternas vermelhas atrás (só o lado voltado para a câmera)
      const zl = fl + 3.3, wf = pt.t[1][1] * 0.75;
      for (const [f, col, glow] of [[pt.b[0][0], '#fff6d8', 'rgba(255,246,216,0.5)'], [pt.b[pt.b.length / 2 | 0][0], '#ff2a3a', 'rgba(255,42,58,0.45)']]) {
        if ((f > 0 ? ca + sa : -(ca + sa)) <= 0) continue;
        for (const sd of [-wf, wf]) {
          const [lx, ly] = P(f + (f > 0 ? 0.01 : -0.01), sd, zl);
          ctx.fillStyle = col; ctx.fillRect(lx - 1.1, ly - 0.6, 2.2, 1.2);
          ctx.save(); ctx.globalCompositeOperation = 'lighter';
          const lg = ctx.createRadialGradient(lx, ly, 0, lx, ly, 5);
          lg.addColorStop(0, glow); lg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = lg; ctx.fillRect(lx - 5, ly - 5, 10, 10);
          ctx.restore();
        }
      }
    }
    if (pt.col === 'tire') {
      // aro: um disco claro no centro da face externa da roda
      const fm = (pt.b[0][0] + pt.b[2][0]) / 2, sm = pt.b[0][1] > 0 ? Math.max(pt.b[0][1], pt.b[1][1]) : Math.min(pt.b[0][1], pt.b[1][1]);
      const [rx, ry] = P(fm, sm * 1.01, fl + (pt.z0 + pt.z1) / 2);
      ctx.fillStyle = 'rgba(150,160,180,0.55)'; ctx.beginPath(); ctx.ellipse(rx, ry, 1.1, 0.8, 0, 0, Math.PI * 2); ctx.fill();
    }
    if (pt.thruster) {
      // bocal da turbina aceso na traseira
      const ms = (pt.b[0][1] + pt.b[1][1]) / 2;
      const [tx, ty] = P(-0.99, ms, fl + (pt.z0 + pt.z1) / 2);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const tg = ctx.createRadialGradient(tx, ty, 0, tx, ty, 6);
      tg.addColorStop(0, 'rgba(160,220,255,0.9)'); tg.addColorStop(0.4, 'rgba(56,160,255,0.45)'); tg.addColorStop(1, 'rgba(56,160,255,0)');
      ctx.fillStyle = tg; ctx.fillRect(tx - 6, ty - 6, 12, 12);
      ctx.restore();
    }
  }
  // faróis e lanternas
  const zl = fl + 2.6;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const s of [-0.13, 0.13]) {
    const [fx, fy] = P(0.9, s, zl);
    ctx.fillStyle = '#fffbe8'; ctx.fillRect(fx - 1, fy - 0.5, 2, 1);
    const hg = ctx.createRadialGradient(fx, fy, 0, fx, fy, 5);
    hg.addColorStop(0, 'rgba(255,250,230,0.6)'); hg.addColorStop(1, 'rgba(255,250,230,0)');
    ctx.fillStyle = hg; ctx.fillRect(fx - 5, fy - 5, 10, 10);
  }
  ctx.restore();
  const [ra, rb] = [P(-0.97, -0.22, zl), P(-0.97, 0.22, zl)];
  ctx.strokeStyle = '#ff2a4a'; ctx.lineWidth = 0.9;
  ctx.beginPath(); ctx.moveTo(...ra); ctx.lineTo(...rb); ctx.stroke();
}

function drawRain(t, alpha = 0.4) {
  // três camadas de profundidade: perto = gotas longas, rápidas e claras; longe = finas e lentas
  const wind = -0.22 + 0.06 * Math.sin(t * 0.4);
  const area = VW * VH;
  for (const [n, len, speed, a, lw] of [[area / 2600, 5, 210, alpha * 0.45, 0.35], [area / 4200, 9, 330, alpha * 0.7, 0.5], [area / 9000, 15, 480, alpha, 0.8]]) {
    ctx.strokeStyle = `rgba(170,200,255,${a})`; ctx.lineWidth = lw;
    ctx.beginPath();
    for (let k = 0; k < n; k++) {
      const h1 = Math.sin(k * 127.1 + len) * 43758.5453, h2 = Math.sin(k * 311.7 + len) * 24634.6345;
      const r1 = h1 - Math.floor(h1), r2 = h2 - Math.floor(h2);
      const y = ((r2 * (VH + 40) + t * speed * (0.85 + r1 * 0.3)) % (VH + 40)) - 20;
      const x = ((r1 * (VW + 60) + y * -wind) % (VW + 60) + VW + 60) % (VW + 60) - 30;
      ctx.moveTo(x, y); ctx.lineTo(x + wind * len, y + len);
    }
    ctx.stroke();
  }
  // gotas batendo no chão: anel que se abre e respingos que pulam
  const nS = Math.floor(area / 1400), life = 0.45;
  ctx.lineWidth = 0.5;
  for (let k = 0; k < nS; k++) {
    const ph = t / life + k * 0.6180339;
    const cyc = Math.floor(ph), p = ph - cyc;
    const h1 = Math.sin(k * 91.7 + cyc * 17.3) * 43758.5453, h2 = Math.sin(k * 47.3 + cyc * 29.1) * 24634.6345;
    const x = (h1 - Math.floor(h1)) * VW, y = (h2 - Math.floor(h2)) * VH;
    const r = 0.6 + p * 3.2;
    ctx.strokeStyle = `rgba(190,215,255,${alpha * 1.3 * (1 - p)})`;
    ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.45, 0, 0, Math.PI * 2); ctx.stroke();
    if (p < 0.5) {
      const q = p / 0.5, up = Math.sin(q * Math.PI) * 2.6;
      ctx.fillStyle = `rgba(210,230,255,${alpha * 1.6 * (1 - q)})`;
      ctx.fillRect(x - 1.2 - q * 1.5, y - up, 0.7, 0.7);
      ctx.fillRect(x + 0.6 + q * 1.5, y - up * 0.8, 0.7, 0.7);
    }
  }
}

// ---------- iluminação ----------
function drawLighting(room, t, playerScreen, flash) {
  lctx.globalCompositeOperation = 'source-over';
  lctx.clearRect(0, 0, VW, VH);
  lctx.fillStyle = `rgba(4,2,16,${room.dark * gearDark()})`;
  lctx.fillRect(0, 0, VW, VH);
  lctx.globalCompositeOperation = 'destination-out';
  const all = room.lights.map(l => ({ ...l, s: iso(l.x, l.y, l.z) }));
  all.push({ s: [playerScreen[0], playerScreen[1] - 10], r: 42, player: true });
  for (const l of all) {
    let k = 1;
    if (l.flicker) k = Math.random() < 0.06 ? 0.2 : 0.9 + 0.1 * Math.sin(t * 20);
    const g = lctx.createRadialGradient(l.s[0], l.s[1], 0, l.s[0], l.s[1], l.r);
    g.addColorStop(0, `rgba(0,0,0,${0.95 * k})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    lctx.fillStyle = g;
    lctx.fillRect(l.s[0] - l.r, l.s[1] - l.r, l.r * 2, l.r * 2);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(lightCanvas, 0, 0, VW, VH);
  ctx.imageSmoothingEnabled = false;
  gctx.globalCompositeOperation = 'source-over';
  gctx.clearRect(0, 0, VW, VH);
  gctx.globalCompositeOperation = 'lighter';
  for (const l of all) {
    if (!l.color) continue;
    const g = gctx.createRadialGradient(l.s[0], l.s[1], 0, l.s[0], l.s[1], l.r * 0.8);
    g.addColorStop(0, rgba(l.color, 0.22));
    g.addColorStop(1, rgba(l.color, 0));
    gctx.fillStyle = g;
    gctx.fillRect(l.s[0] - l.r, l.s[1] - l.r, l.r * 2, l.r * 2);
  }
  ctx.globalCompositeOperation = 'lighter';
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(glowCanvas, 0, 0, VW, VH);
  ctx.imageSmoothingEnabled = false;
  ctx.globalCompositeOperation = 'source-over';
  if (flash > 0) { ctx.fillStyle = `rgba(180,200,255,${flash * 0.18})`; ctx.fillRect(0, 0, VW, VH); }
}

function drawVignette() {
  const g = ctx.createRadialGradient(VW / 2, VH / 2, VH * 0.35, VW / 2, VH / 2, VW * 0.65);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
}

function drawScannerOverlay(t) {
  ctx.fillStyle = 'rgba(0,60,55,0.35)';
  ctx.fillRect(0, 0, VW, VH);
  ctx.fillStyle = 'rgba(56,246,255,0.06)';
  for (let y = 0; y < VH; y += 2) ctx.fillRect(0, y, VW, 0.5);
  const sweep = (t * 90) % (VH + 40) - 20;
  const g = ctx.createLinearGradient(0, sweep - 20, 0, sweep);
  g.addColorStop(0, 'rgba(56,246,255,0)');
  g.addColorStop(1, 'rgba(56,246,255,0.18)');
  ctx.fillStyle = g;
  ctx.fillRect(0, sweep - 20, VW, 20);
}

// ---------- clicar para andar ----------
function screenToTile(sx, sy) {
  const a = (sx - OX) / TW2, b = (sy - OY) / TH2;
  return [Math.floor((a + b) / 2), Math.floor((b - a) / 2)];
}

// BFS em 8 direções, sem cortar quinas
function findPath(room, blocked, sx, sy, goalFn) {
  const W = room.w, H = room.h;
  const key = (x, y) => y * W + x;
  const prev = new Map([[key(sx, sy), null]]);
  const q = [[sx, sy]];
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  while (q.length) {
    const [x, y] = q.shift();
    if (goalFn(x, y)) {
      const path = [];
      let k = key(x, y);
      while (k !== null) { path.unshift([k % W, Math.floor(k / W)]); k = prev.get(k); }
      path.shift();
      return path;
    }
    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H || blocked(nx, ny)) continue;
      if (dx && dy && (blocked(x + dx, y) || blocked(x, y + dy))) continue;
      const k = key(nx, ny);
      if (prev.has(k)) continue;
      prev.set(k, key(x, y));
      q.push([nx, ny]);
    }
  }
  return null;
}

// ---------- ordem de desenho isométrica ----------
// Cada entidade tem uma área no chão b = [x0, y0, x1, y1]. A fica atrás de B quando
// está inteiramente antes dela em x ou em y. Um único número de profundidade falha
// com objetos grandes (cama, balcões, prédios); a ordenação topológica não.
function depthSort(ents) {
  const n = ents.length, E = 0.001;
  const behind = (a, b) => a.b[2] <= b.b[0] + E || a.b[3] <= b.b[1] + E;
  const indeg = new Array(n).fill(0), next = ents.map(() => []);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const ij = behind(ents[i], ents[j]), ji = behind(ents[j], ents[i]);
    let first = -1;
    if (ij && !ji) first = i; else if (ji && !ij) first = j;
    // ij && ji: um está à esquerda e o outro à direita na tela (separados em sentidos opostos);
    // as projeções não se sobrepõem, então não há ordem a impor (impor uma criava ciclos com móveis compridos)
    if (first < 0) continue;                                     // áreas sobrepostas: sem restrição
    const second = first === i ? j : i;
    next[first].push(second); indeg[second]++;
  }
  const ready = [], out = [], done = new Uint8Array(n);
  for (let i = 0; i < n; i++) if (!indeg[i]) ready.push(i);
  while (out.length < n) {
    if (!ready.length) {
      // ciclo: libera só o nó mais ao fundo (menor diagonal) e continua ordenando o resto
      let best = -1;
      for (let i = 0; i < n; i++) if (!done[i] && (best < 0 || ents[i].d < ents[best].d)) best = i;
      indeg[best] = 0; ready.push(best);
    }
    ready.sort((a, b) => ents[b].d - ents[a].d);
    const i = ready.pop();
    if (done[i]) continue;
    done[i] = 1;
    out.push(ents[i]);
    for (const k of next[i]) if (--indeg[k] === 0 && !done[k]) ready.push(k);
  }
  return out;
}
