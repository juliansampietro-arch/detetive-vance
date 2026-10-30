// ============================================================
// Objetos de cenário novos: casa, delegacia, casa de banho, perícia e cidade
// (chamado por drawObject para os tipos que o engine.js não desenha)
// ============================================================

// texto pequeno centralizado (unidades de jogo)
function propText(txt, sx, sy, size, col, font = '"Chakra Petch", sans-serif') {
  ctx.font = `700 ${size}px ${font}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = col; ctx.fillText(T(txt), sx, sy);
  ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
}
function glow(sx, sy, r, col, a = 0.5) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
  g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.fillRect(sx - r, sy - r, r * 2, r * 2);
  ctx.restore();
}
// painel vertical (parede fina) ao longo de x (em y fixo) ou de y (em x fixo)
function panel(x0, y0, x1, y1, z0, z1, fill) {
  poly(ctx, [iso(x0, y0, z0), iso(x1, y1, z0), iso(x1, y1, z1), iso(x0, y0, z1)], fill);
}

function drawProp(o, t, S) {
  const w = o.w || 1, d = o.d || 1, cx = o.x + w / 2, cy = o.y + d / 2;
  switch (o.kind) {
    case 'block': case 'shopfront': return;

    // ---------------- interiores ----------------
    case 'partition': {
      // divisória de vidro fosco com caixilho
      const along = o.axis === 'y';
      const x0 = along ? o.x + 0.5 : o.x, y0 = along ? o.y : o.y + 0.5;
      const x1 = along ? x0 : o.x + w, y1 = along ? o.y + d : y0;
      const H = o.h || 22;
      panel(x0, y0, x1, y1, 0, H, 'rgba(150,200,255,0.10)');
      panel(x0, y0, x1, y1, 7, 15, 'rgba(200,225,255,0.16)');
      panel(x0, y0, x1, y1, 0, 1.2, '#2a3040');
      line([iso(x0, y0, H), iso(x1, y1, H)], '#5a6478', 0.8);
      line([iso(x0, y0, 15), iso(x1, y1, 15)], rgba(o.neon || '#38a0ff', 0.6), 0.4);
      const n = Math.round(along ? d : w);
      for (let k = 0; k <= n; k++) {
        const px2 = along ? x0 : x0 + k, py2 = along ? y0 + k : y0;
        line([iso(px2, py2, 0), iso(px2, py2, H)], '#5a6478', 0.6);
      }
      return;
    }
    case 'chair': {
      box(o.x + 0.3, o.y + 0.3, 0.06, 0.06, 6, '#2a2a34'); box(o.x + 0.64, o.y + 0.64, 0.06, 0.06, 6, '#2a2a34');
      box(o.x + 0.25, o.y + 0.25, 0.5, 0.5, 1.2, o.col || '#4a3a5a', 6);
      if (o.face === 'e') box(o.x + 0.22, o.y + 0.25, 0.1, 0.5, 9, shade(o.col || '#4a3a5a', 0.85), 6);
      else box(o.x + 0.25, o.y + 0.22, 0.5, 0.1, 9, shade(o.col || '#4a3a5a', 0.85), 6);
      return;
    }
    case 'armchair':
      box(o.x + 0.12, o.y + 0.12, 0.76, 0.76, 5, o.col || '#5a2a3a');
      box(o.x + 0.1, o.y + 0.1, 0.22, 0.8, 11, shade(o.col || '#5a2a3a', 0.8), 0);
      return;
    case 'tv': {
      box(o.x + 0.2, o.y + 0.3, 0.6, 0.4, 7, '#1a1a22');
      const sx0 = o.face === 'e';
      const a = sx0 ? [o.x + 0.55, o.y + 0.1] : [o.x + 0.1, o.y + 0.55], b2 = sx0 ? [o.x + 0.55, o.y + 0.9] : [o.x + 0.9, o.y + 0.55];
      panel(a[0], a[1], b2[0], b2[1], 7, 21, '#0a0a10');
      const k = 0.25 + 0.15 * Math.sin(t * 3) + (Math.random() < 0.03 ? 0.2 : 0);
      panel(a[0] + (sx0 ? 0.01 : 0.04), a[1] + (sx0 ? 0.04 : 0.01), b2[0] + (sx0 ? 0.01 : -0.04), b2[1] + (sx0 ? -0.04 : 0.01), 8, 20, rgba('#38f6ff', k));
      const [mx, my] = iso((a[0] + b2[0]) / 2, (a[1] + b2[1]) / 2, 14);
      glow(mx, my, 16, '#38a0ff', 0.25);
      return;
    }
    case 'rug':
      diamond(o.x + 0.1, o.y + 0.1, w - 0.2, d - 0.2, 0, o.col || '#3a1838');
      diamond(o.x + 0.25, o.y + 0.25, w - 0.5, d - 0.5, 0, shade(o.col || '#3a1838', 1.3));
      return;
    case 'counter':
      box(o.x + 0.02, o.y + 0.08, w - 0.04, d - 0.12, 10, o.col || '#3a3440', 0, o.top || '#c8c4bc');
      return;
    case 'stove': {
      box(o.x + 0.02, o.y + 0.08, w - 0.04, d - 0.12, 10, '#2a2a30', 0, '#141418');
      for (const [ox, oy] of [[0.3, 0.3], [0.7, 0.3], [0.3, 0.68], [0.7, 0.68]]) {
        const [bx, by] = iso(o.x + ox, o.y + oy, 10);
        ctx.strokeStyle = o.on ? (Math.random() < 0.5 ? '#ff8a3d' : '#ff4a2a') : '#3a3a44'; ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.ellipse(bx, by, 2.2, 1.1, 0, 0, Math.PI * 2); ctx.stroke();
      }
      const [px2, py2] = iso(o.x + 0.3, o.y + 0.68, 10);
      ctx.fillStyle = '#4a4a54'; ctx.beginPath(); ctx.ellipse(px2, py2 - 1, 3, 1.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#26262c'; ctx.fillRect(px2 + 2.5, py2 - 1.6, 4, 0.8);
      if (o.on) {
        ctx.fillStyle = o.food || '#e8c060'; ctx.beginPath(); ctx.ellipse(px2, py2 - 1.4, 2.1, 0.9, 0, 0, Math.PI * 2); ctx.fill();
        glow(px2, py2, 9, '#ff8a3d', 0.45);
        for (let k = 0; k < 4; k++) {
          const up = (t * 9 + k * 4) % 14;
          ctx.fillStyle = `rgba(255,255,255,${0.3 * (1 - up / 14)})`;
          ctx.beginPath(); ctx.ellipse(px2 + Math.sin(t * 3 + k) * 2, py2 - 3 - up, 1.5 + up * 0.25, 1 + up * 0.12, 0, 0, Math.PI * 2); ctx.fill();
        }
        if (Math.random() < 0.5) { ctx.fillStyle = '#ffd23f'; ctx.fillRect(px2 + Math.random() * 4 - 2, py2 - 3 - Math.random() * 3, 0.5, 0.5); }
      }
      return;
    }
    case 'sink': {
      box(o.x + 0.02, o.y + 0.08, w - 0.04, d - 0.12, 10, o.col || '#3a3440', 0, o.top || '#c8c4bc');
      diamond(o.x + 0.2, o.y + 0.22, 0.6, 0.5, 10, '#8a9aa4');
      diamond(o.x + 0.26, o.y + 0.28, 0.48, 0.38, 10, '#5a6a74');
      box(o.x + 0.45, o.y + 0.1, 0.1, 0.1, 5, '#c8ccd4', 10);
      return;
    }
    case 'basin': {   // pia de banheiro sobre coluna
      box(o.x + 0.38, o.y + 0.25, 0.24, 0.24, 9, '#e0e4ea');
      box(o.x + 0.15, o.y + 0.08, 0.7, 0.55, 3, '#e8ecf0', 9);
      diamond(o.x + 0.25, o.y + 0.15, 0.5, 0.38, 12, '#a8b8c4');
      box(o.x + 0.45, o.y + 0.08, 0.08, 0.08, 4, '#c8ccd4', 12);
      return;
    }
    case 'toilet': {
      box(o.x + 0.08, o.y + 0.25, 0.25, 0.5, 13, '#e8ecf0');
      box(o.x + 0.3, o.y + 0.3, 0.5, 0.4, 6, '#e0e4ea');
      const [sx, sy] = iso(o.x + 0.55, o.y + 0.5, 6);
      ctx.fillStyle = '#c8d4dc'; ctx.beginPath(); ctx.ellipse(sx, sy, 3.6, 1.8, 0, 0, Math.PI * 2); ctx.fill();
      return;
    }
    case 'shower': {
      // box de vidro com chuveiro no alto; o ocupante é desenhado entre o fundo e o vidro
      diamond(o.x + 0.05, o.y + 0.05, 0.9, 0.9, 0.5, '#d8e0e6');
      diamond(o.x + 0.42, o.y + 0.42, 0.16, 0.16, 0.6, '#6a7a84');
      box(o.x + 0.45, o.y + 0.02, 0.1, 0.1, 3, '#c8ccd4', 30);
      const [hx, hy] = iso(o.x + 0.5, o.y + 0.2, 30);
      ctx.fillStyle = '#c8ccd4'; ctx.beginPath(); ctx.ellipse(hx, hy, 2.4, 1, 0, 0, Math.PI * 2); ctx.fill();
      // paredes do box (fundo) com azulejo mais claro
      panel(o.x + 0.02, o.y + 0.02, o.x + 0.98, o.y + 0.02, 0, 30, 'rgba(200,225,240,0.25)');
      panel(o.x + 0.02, o.y + 0.02, o.x + 0.02, o.y + 0.98, 0, 30, 'rgba(180,205,225,0.25)');
      if (o.occupant) o.occupant();
      if (o.on) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = 'rgba(170,220,255,0.75)'; ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let k = 0; k < 11; k++) {
          const ox = (k - 5) * 0.55, ph = (t * 45 + k * 7) % 7;
          for (let j = 0; j < 3; j++) { const y0 = hy + 1 + ph + j * 8; ctx.moveTo(hx + ox * (1 + j * 0.25), y0); ctx.lineTo(hx + ox * (1.1 + j * 0.25), y0 + 4); }
        }
        ctx.stroke();
        ctx.restore();
      }
      if (o.on) for (let k = 0; k < 5; k++) {
        const up = (t * 5 + k * 3) % 16;
        const [vx, vy] = iso(o.x + 0.3 + k * 0.1, o.y + 0.6, 8 + up);
        ctx.fillStyle = `rgba(255,255,255,${0.16 * (1 - up / 16)})`;
        ctx.beginPath(); ctx.ellipse(vx, vy, 3 + up * 0.2, 1.6, 0, 0, Math.PI * 2); ctx.fill();
      }
      // vidro fosco na frente e na lateral
      panel(o.x + 0.02, o.y + 0.98, o.x + 0.98, o.y + 0.98, 0, 28, 'rgba(150,200,235,0.2)');
      panel(o.x + 0.02, o.y + 0.98, o.x + 0.98, o.y + 0.98, 1, 12, 'rgba(170,205,230,0.7)');
      panel(o.x + 0.98, o.y + 0.02, o.x + 0.98, o.y + 0.98, 0, 28, 'rgba(150,200,235,0.2)');
      panel(o.x + 0.98, o.y + 0.02, o.x + 0.98, o.y + 0.98, 1, 12, 'rgba(170,205,230,0.7)');
      line([iso(o.x + 0.02, o.y + 0.98, 28), iso(o.x + 0.98, o.y + 0.98, 28), iso(o.x + 0.98, o.y + 0.02, 28)], '#6a7c8a', 0.8);
      line([iso(o.x + 0.98, o.y + 0.98, 0), iso(o.x + 0.98, o.y + 0.98, 28)], '#6a7c8a', 0.8);
      line([iso(o.x + 0.02, o.y + 0.98, 0), iso(o.x + 0.02, o.y + 0.98, 28)], '#6a7c8a', 0.6);
      return;
    }
    case 'bookshelf': {
      box(o.x + 0.05, o.y + 0.1, w - 0.1, d - 0.2, 28, '#2a1e18');
      const cols = ['#a83a3a', '#3a6aa8', '#c8a040', '#4a8a5a', '#8a4aa8', '#d8d0c0'];
      for (let r = 0; r < 4; r++) for (let k = 0; k < 7 * w; k++) {
        const u = o.x + 0.1 + k * 0.13, z = 3 + r * 6.5;
        if (u > o.x + w - 0.1) break;
        const [a1, a2] = iso(u, o.y + d - 0.1, z), hh = 4 + ((k * 3 + r) % 3);
        ctx.fillStyle = cols[(k * 5 + r * 3) % 6]; ctx.fillRect(a1, a2 - hh, 1.6, hh);
      }
      return;
    }
    case 'gondola': {
      // gôndola de loja: estante dupla com fileiras de produtos coloridos e etiqueta da cor da seção
      box(o.x + 0.1, o.y + 0.2, w - 0.2, d - 0.4, 20, '#3a3a44', 0, '#5a5a66');
      const cols = ['#ff3355', '#38f6ff', '#ffd23f', '#7dff6b', '#ff8a3d', '#f0f0f0', '#b04cff'];
      for (let r = 0; r < 3; r++) {
        const z = 2.5 + r * 6;
        line([iso(o.x + 0.1, o.y + d - 0.2, z), iso(o.x + w - 0.1, o.y + d - 0.2, z)], o.col || '#7dff6b', 0.6);
        for (let k = 0; k < 9 * w; k++) {
          const u = o.x + 0.15 + k * 0.1;
          if (u > o.x + w - 0.15) break;
          const [a1, a2] = iso(u, o.y + d - 0.2, z + 0.6), hh = 2.5 + ((k * 7 + r) % 3);
          ctx.fillStyle = cols[(k * 3 + r * 5) % cols.length]; ctx.fillRect(a1, a2 - hh, 1.2, hh);
        }
      }
      return;
    }
    case 'arara': {
      // arara de roupas: dois postes, uma barra e peças penduradas
      const [l0, l1] = [iso(o.x + 0.15, o.y + 0.5, 0), iso(o.x + w - 0.15, o.y + 0.5, 0)];
      const [t0, t1] = [iso(o.x + 0.15, o.y + 0.5, 24), iso(o.x + w - 0.15, o.y + 0.5, 24)];
      line([l0, t0], '#9aa0aa', 0.8); line([l1, t1], '#9aa0aa', 0.8); line([t0, t1], '#c8ccd4', 0.8);
      const cols = ['#2a3a5a', '#a83a3a', '#2a2a2a', '#c8a040', '#3a6a4a', '#5a3a6a', '#d8d0c0'];
      for (let k = 0; k < 6 * w; k++) {
        const u = o.x + 0.25 + k * 0.17;
        if (u > o.x + w - 0.25) break;
        const [hx, hy] = iso(u, o.y + 0.5, 23);
        ctx.fillStyle = cols[k % cols.length];
        ctx.fillRect(hx - 1.6, hy, 3.2, 9 + (k % 3) * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(hx - 1.6, hy, 0.8, 9);
      }
      return;
    }
    case 'vitrine': {
      // balcão-vitrine: base escura, tampo de vidro iluminado e objetos brilhando dentro
      box(o.x + 0.05, o.y + 0.15, w - 0.1, d - 0.3, 8, '#22222c', 0, '#2e2e3a');
      box(o.x + 0.08, o.y + 0.18, w - 0.16, d - 0.36, 7, rgba(o.col || '#38f6ff', 0.10), 8, rgba(o.col || '#38f6ff', 0.18));
      for (let k = 0; k < 4 * w; k++) {
        const u = o.x + 0.3 + k * 0.4;
        if (u > o.x + w - 0.2) break;
        const [gx, gy] = iso(u, o.y + 0.5, 10);
        glow(gx, gy, 4, o.col || '#38f6ff', 0.35 + 0.15 * Math.sin(t * 2 + k));
        ctx.fillStyle = k % 2 ? '#f0f0f0' : (o.col || '#38f6ff'); ctx.fillRect(gx - 1, gy - 1, 2, 1.4);
      }
      return;
    }
    case 'filing':
      box(o.x + 0.15, o.y + 0.15, 0.7, 0.7, 16, '#5a6270', 0, '#6a7280');
      for (let k = 0; k < 3; k++) line([iso(o.x + 0.15, o.y + 0.85, 4 + k * 5), iso(o.x + 0.85, o.y + 0.85, 4 + k * 5)], '#2a3038', 0.6);
      return;
    case 'lockers': {
      // fileira de armários metálicos encostada na parede (ao longo de y ou de x)
      box(o.x + 0.05, o.y + 0.05, w - 0.1, d - 0.1, 28, o.col || '#4a5a6a', 0, shade(o.col || '#4a5a6a', 1.2));
      const alongY = d > w, n = Math.round(alongY ? d : w);
      for (let k = 0; k < n * 2; k++) {
        const u = k / 2 + 0.25;
        const p0 = alongY ? [o.x + w - 0.05, o.y + k / 2] : [o.x + k / 2, o.y + d - 0.05];
        line([iso(p0[0], p0[1], 1), iso(p0[0], p0[1], 27)], 'rgba(0,0,0,0.35)', 0.4);
        const pv = alongY ? [o.x + w - 0.05, o.y + u] : [o.x + u, o.y + d - 0.05];
        for (let v = 0; v < 3; v++) line([iso(pv[0], pv[1], 22 - v), iso(alongY ? pv[0] : pv[0] + 0.15, alongY ? pv[1] + 0.15 : pv[1], 22 - v)], 'rgba(0,0,0,0.45)', 0.35);
        const [kx, ky] = iso(pv[0], pv[1], 14);
        ctx.fillStyle = '#ffd23f'; ctx.fillRect(kx - 0.3, ky, 0.6, 0.6);
      }
      return;
    }
    case 'monitor_desk': {   // mesa do hacker com três monitores e teclado iluminado
      box(o.x + 0.05, o.y + 0.15, w - 0.1, d - 0.3, 7, '#1a1c22', 0, '#2a2e36');
      const along = w >= d;
      for (let k = 0; k < 3; k++) {
        const f = 0.2 + k * (Math.max(w, d) - 0.4) / 2, col = ['#7dff6b', '#38f6ff', '#7dff6b'][k];
        const px = along ? o.x + f : o.x + 0.25, py = along ? o.y + 0.25 : o.y + f;
        box(px - 0.02, py - 0.02, 0.04, 0.04, 3, '#2a2a30', 7);
        const a = iso(along ? px - 0.32 : px, along ? py : py - 0.32, 10), b = iso(along ? px + 0.32 : px, along ? py : py + 0.32, 10), c = iso(along ? px + 0.32 : px, along ? py : py + 0.32, 17), e = iso(along ? px - 0.32 : px, along ? py : py - 0.32, 17);
        poly(ctx, [a, b, c, e], '#0a0c10');
        ctx.save(); ctx.globalAlpha = 0.85; poly(ctx, [[a[0] + 0.4, a[1] - 0.5], [b[0] - 0.4, b[1] - 0.5], [c[0] - 0.4, c[1] + 0.5], [e[0] + 0.4, e[1] + 0.5]], shade(col, 0.35));
        for (let r = 0; r < 4; r++) { const y0 = a[1] - 1.5 - r * 1.5, len = 2 + ((Math.sin(r * 2 + k + Math.floor(t * 3)) + 1) * 1.6); line([[a[0] + 1, y0 + (b[1] - a[1]) * 0.15], [a[0] + 1 + len, y0 + (b[1] - a[1]) * 0.15 * (1 + len / 6)]], col, 0.5); }
        ctx.restore();
        const [gx, gy] = iso(px, py, 14); glow(gx, gy, 14, col, 0.22);
      }
      const [kx, ky] = iso(o.x + w / 2, o.y + d - 0.35, 7.1);
      ctx.fillStyle = '#ff4fd8'; ctx.fillRect(kx - 4, ky - 0.4, 8, 0.8);
      return;
    }
    case 'server_rack': {    // rack de servidores com LEDs piscando
      box(o.x + 0.15, o.y + 0.15, 0.7, 0.7, 30, '#14161c', 0, '#1e2028');
      for (let r = 0; r < 9; r++) for (let k = 0; k < 4; k++) {
        const on = Math.sin(t * (3 + k) + r * 1.7 + o.y * 3) > 0.2;
        if (!on) continue;
        const [lx, ly] = iso(o.x + 0.25 + k * 0.14, o.y + 0.86, 3 + r * 3);
        ctx.fillStyle = ['#7dff6b', '#38f6ff', '#ffd23f', '#ff3355'][(r + k) % 4]; ctx.fillRect(lx, ly, 0.8, 0.6);
      }
      return;
    }
    case 'android_bench': {  // bancada com a androide inacabada deitada: cabeça, tronco, braços e pernas articulados
      const along = w >= d, len = (along ? w : d) - 0.3;
      // pés de metal e tampo
      for (const [fx, fy] of [[0.15, 0.2], [w - 0.25, 0.2], [0.15, d - 0.3], [w - 0.25, d - 0.3]]) box(o.x + fx, o.y + fy, 0.1, 0.1, 6, '#1a1c22');
      box(o.x + 0.05, o.y + 0.1, w - 0.1, d - 0.2, 1.2, '#3a404a', 6, '#4a525e');
      // P(f, s, z): f = posição ao longo do corpo (0 = cabeça), s = deslocamento lateral em tiles
      const ox = o.x + 0.15, oy = o.y + d / 2, px = o.x + w / 2, py = o.y + 0.15;
      const P = (f, s, z = 8) => along ? iso(ox + f * len, oy + s, z) : iso(px + s, py + f * len, z);
      const limb = (pts, wd, col) => { ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.stroke(); };
      const joint = (p, r = 0.9) => { ctx.fillStyle = '#5a6070'; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill(); };
      const SKIN = '#e6e2ea', SKIN2 = '#c8c4d0';
      // pernas
      for (const s of [-0.11, 0.11]) {
        const hip = P(0.56, s * 0.8, 8.4), knee = P(0.76, s, 8.3), foot = P(0.96, s * 1.1, 8.6);
        limb([hip, knee], 2.3, SKIN2); limb([knee, foot], 2, SKIN); joint(knee);
        ctx.fillStyle = SKIN2; ctx.beginPath(); ctx.ellipse(foot[0], foot[1] - 0.6, 1.1, 1.4, 0, 0, Math.PI * 2); ctx.fill();
      }
      // braços ao lado do corpo
      for (const s of [-0.24, 0.24]) {
        const sh = P(0.2, s * 0.8, 8.6), el = P(0.38, s, 8.3), hand = P(0.54, s * 0.95, 8.3);
        limb([sh, el], 1.6, SKIN2); limb([el, hand], 1.4, SKIN); joint(el, 0.7);
        ctx.fillStyle = SKIN2; ctx.beginPath(); ctx.arc(hand[0], hand[1], 0.9, 0, Math.PI * 2); ctx.fill();
      }
      // tronco: ombros largos, cintura fina, quadril
      const torso = [P(0.17, -0.2, 9), P(0.17, 0.2, 9), P(0.4, 0.13, 9.2), P(0.56, 0.17, 8.8), P(0.56, -0.17, 8.8), P(0.4, -0.13, 9.2)];
      poly(ctx, torso, SKIN);
      line([P(0.3, -0.16, 9.2), P(0.3, 0.16, 9.2)], '#a8a4b0', 0.4);
      line([P(0.47, -0.13, 9.1), P(0.47, 0.13, 9.1)], '#a8a4b0', 0.4);
      line([P(0.17, 0, 9), P(0.56, 0, 9)], '#b8b4c0', 0.3);
      // peito aberto, com o encaixe vazio
      const [cx2, cy2] = P(0.28, 0, 9.4);
      ctx.fillStyle = '#0a0a10'; ctx.beginPath(); ctx.ellipse(cx2, cy2, 2.2, 1.3, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#8a8a96'; ctx.lineWidth = 0.4; ctx.stroke();
      const lit = game.flags && game.flags.credencial;
      glow(cx2, cy2, 7, lit ? '#38f6ff' : '#ff4fd8', lit ? 0.6 : 0.3);
      // pescoço mecânico e cabeça
      const nk = P(0.13, 0, 9.2), hd = P(0.1, 0, 8.6);
      limb([nk, P(0.17, 0, 9)], 1.2, '#4a505c');
      ctx.fillStyle = SKIN; ctx.beginPath(); ctx.ellipse(hd[0], hd[1], 2.3, 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#a8a4b0'; ctx.lineWidth = 0.3; ctx.beginPath(); ctx.arc(hd[0], hd[1], 2, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();   // emenda do crânio
      ctx.fillStyle = lit ? '#38f6ff' : '#2a2a34'; ctx.fillRect(hd[0] - 1.4, hd[1] - 0.3, 1, 0.5); ctx.fillRect(hd[0] + 0.4, hd[1] - 0.3, 1, 0.5);   // olhos
      if (lit) glow(hd[0], hd[1], 4, '#38f6ff', 0.4);
      // cabos coloridos saindo do peito e caindo pela beirada da bancada
      ctx.lineWidth = 0.5; ctx.lineCap = 'butt';
      for (const [col, dx] of [['#ff3355', -3], ['#38f6ff', 0.5], ['#ffd23f', 3.5]]) { ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(cx2 + dx * 0.3, cy2); ctx.quadraticCurveTo(cx2 + dx, cy2 + 5, cx2 + dx * 1.6, cy2 + 11); ctx.stroke(); }
      return;
    }
    case 'fence': {          // cerca de arame com arame farpado, ao longo de x (axis 'x') ou de y
      const ax = o.axis !== 'y', x0 = o.x, y0 = o.y, x1 = ax ? o.x + w : o.x, y1 = ax ? o.y : o.y + d;
      panel(x0, y0, x1, y1, 0, 16, 'rgba(110,110,120,0.16)');
      const n = Math.round((ax ? w : d) * 4);
      for (let k = 0; k <= n; k++) { const f = k / n, X = x0 + (x1 - x0) * f, Y = y0 + (y1 - y0) * f; line([iso(X, Y, 0), iso(X, Y, 16)], k % 4 ? 'rgba(140,140,150,0.35)' : '#4a4a52', k % 4 ? 0.25 : 0.8); }
      for (const z of [2, 8, 14, 16]) line([iso(x0, y0, z), iso(x1, y1, z)], 'rgba(150,150,160,0.5)', 0.3);
      for (let k = 0; k < n * 2; k++) { const f = (k + 0.5) / (n * 2), [bx, by] = iso(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, 17 + (k % 2)); ctx.fillStyle = '#8a8a90'; ctx.fillRect(bx - 0.4, by - 0.4, 0.8, 0.8); }
      return;
    }
    case 'junk_gate': {      // portão do ferro-velho: dois postes e uma placa de chapa enferrujada iluminada
      const ax = o.axis !== 'y', x1 = ax ? o.x + w : o.x, y1 = ax ? o.y : o.y + d;
      box(o.x - 0.08, o.y - 0.08, 0.16, 0.16, 26, '#3a3a40'); box(x1 - 0.08, y1 - 0.08, 0.16, 0.16, 26, '#3a3a40');
      panel(o.x, o.y, x1, y1, 20, 27, '#5a3a20');
      for (let k = 0; k < 5; k++) { const f = 0.1 + k * 0.2; line([iso(o.x + (x1 - o.x) * f, o.y + (y1 - o.y) * f, 20), iso(o.x + (x1 - o.x) * f, o.y + (y1 - o.y) * f, 27)], '#3a2410', 0.4); }
      const [sx, sy] = iso((o.x + x1) / 2, (o.y + y1) / 2, 23.5);
      const on = Math.sin(t * 7) > -0.85;
      if (on) glow(sx, sy, 22, '#ffb347', 0.35);
      propText(o.text || 'FERRO-VELHO', sx, sy, 3.2, on ? '#ffd8a0' : '#6a4a2a');
      return;
    }
    case 'tires': {          // pilha de pneus
      const n = o.n || 4;
      for (let k = 0; k < n; k++) {
        const [sx, sy] = iso(cx + Math.sin(k * 2.3 + o.x) * 0.06, cy, k * 2.2);
        ctx.fillStyle = '#121214'; ctx.beginPath(); ctx.ellipse(sx, sy - 1, 4.2, 2.4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1e1e22'; ctx.fillRect(sx - 4.2, sy - 2.2, 8.4, 1.3);
        ctx.fillStyle = '#060608'; ctx.beginPath(); ctx.ellipse(sx, sy - 2.2, 2, 1.1, 0, 0, Math.PI * 2); ctx.fill();
      }
      return;
    }
    case 'barrel': {         // tambor de metal enferrujado (às vezes com fogo)
      const col = o.col || '#6a3a1e';
      const [bx, by] = iso(cx, cy, 0);
      ctx.fillStyle = shade(col, 0.7); ctx.fillRect(bx - 2.6, by - 8, 5.2, 8);
      ctx.fillStyle = col; ctx.fillRect(bx - 2.6, by - 8, 2.6, 8);
      ctx.fillStyle = shade(col, 1.25); ctx.beginPath(); ctx.ellipse(bx, by - 8, 2.6, 1.3, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = shade(col, 0.5); ctx.fillRect(bx - 2.6, by - 5.6, 5.2, 0.5); ctx.fillRect(bx - 2.6, by - 2.6, 5.2, 0.5);
      if (o.fire) {
        for (let k = 0; k < 4; k++) { const h = 3 + 2 * Math.sin(t * 9 + k * 1.7); ctx.fillStyle = k % 2 ? '#ffd23f' : '#ff6a2a'; ctx.beginPath(); ctx.moveTo(bx - 2 + k * 1.3, by - 8); ctx.lineTo(bx - 1.4 + k * 1.3, by - 8 - h); ctx.lineTo(bx - 0.8 + k * 1.3, by - 8); ctx.fill(); }
        glow(bx, by - 10, 20, '#ff8a3d', 0.4);
      }
      return;
    }
    case 'container': {      // contêiner de carga amassado
      const col = o.col || '#7a3a22';
      box(o.x + 0.05, o.y + 0.05, w - 0.1, d - 0.1, 18, col, 0, shade(col, 1.2));
      const ax = w >= d;
      for (let k = 1; k < 10; k++) { const f = k / 10; const [a, b] = ax ? [[o.x + w * f, o.y + d - 0.05], [o.x + w * f, o.y + d - 0.05]] : [[o.x + w - 0.05, o.y + d * f], [o.x + w - 0.05, o.y + d * f]]; line([iso(...a, 1), iso(...b, 17)], shade(col, 0.7), 0.4); }
      if (o.text) { const [sx, sy] = ax ? iso(cx, o.y + d - 0.05, 10) : iso(o.x + w - 0.05, cy, 10); propText(o.text, sx, sy, 2.6, 'rgba(240,230,210,0.55)'); }
      return;
    }
    case 'crane': {          // guindaste com eletroímã segurando uma carcaça
      box(o.x + 0.1, o.y + 0.1, w - 0.2, d - 0.2, 8, '#c8901a', 0, '#e0a828');
      box(cx - 0.12, cy - 0.12, 0.24, 0.24, 52, '#b07c14', 8);
      const [tx, ty] = iso(cx, cy, 60), arm = iso(cx + (o.reach || 2.5), cy - 0.3, 64);
      ctx.strokeStyle = '#d09a20'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(...arm); ctx.stroke();
      ctx.lineWidth = 0.4; for (let k = 0; k < 6; k++) { const f = k / 6, g = (k + 1) / 6; ctx.beginPath(); ctx.moveTo(tx + (arm[0] - tx) * f, ty + (arm[1] - ty) * f); ctx.lineTo(tx + (arm[0] - tx) * g, ty + (arm[1] - ty) * g + 2); ctx.stroke(); }
      const sway = Math.sin(t * 0.8) * 1.5, mz = arm[1] + 26;
      line([arm, [arm[0] + sway, mz]], '#2a2a2a', 0.4);
      ctx.fillStyle = '#2a2a30'; ctx.beginPath(); ctx.ellipse(arm[0] + sway, mz + 1, 3.5, 1.8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#4a3a2a'; ctx.fillRect(arm[0] + sway - 5, mz + 2.5, 10, 3.5); ctx.fillStyle = '#2a201a'; ctx.fillRect(arm[0] + sway - 5, mz + 5, 10, 1);
      const blink = Math.sin(t * 3) > 0.6; if (blink) { glow(...arm, 6, '#ff3355', 0.6); }
      return;
    }
    case 'car_stack': {      // pilha de carros prensados: blocos achatados, cada um de uma cor, desalinhados
      const CC = ['#5a2020', '#2a4a6a', '#6a6a30', '#3a3026', '#2a5a4a', '#7a5a3a', '#4a3a5a', '#8a8a90'];
      const n = o.n || 4, hh = 6;
      for (let k = 0; k < n; k++) {
        const r = Math.sin((o.x * 7 + o.y * 3 + k) * 12.9898) * 0.5, col = CC[(o.x + o.y * 3 + k * 5) % CC.length];
        const ox = r * 0.25, oy = -r * 0.2, z = k * hh;
        box(o.x + 0.08 + ox, o.y + 0.1 + oy, w - 0.25, d - 0.25, hh - 0.6, col, z, shade(col, 1.3));
        box(o.x + 0.3 + ox, o.y + 0.35 + oy, w - 0.7, d - 0.75, 0.8, '#1a2026', z + hh - 0.6, '#2a3a44');   // vidros esmagados
        const [px, py] = iso(o.x + w - 0.2 + ox, o.y + 0.4 + oy, z + 2);
        ctx.fillStyle = k % 2 ? 'rgba(255,220,150,0.25)' : '#111'; ctx.fillRect(px - 1, py - 1, 2, 1.2);              // farol quebrado
      }
      return;
    }
    case 'scrap': {          // monte de sucata: chapas, peças de robô, pneus e fios
      const rng = k => (Math.sin((o.x * 13 + o.y * 7 + k) * 12.9898) * 43758.5453) % 1;
      // monte em degraus que afunila para cima, coberto de peças; quanto maior a base, mais alto
      const H = 8 + Math.min(w, d) * 7, layers = 4;
      for (let l = 0; l < layers; l++) {
        const ins = 0.12 + l * Math.min(w, d) * 0.11;
        box(o.x + ins, o.y + ins, w - ins * 2, d - ins * 2, H / layers, ['#2a2622', '#322c26', '#2e2a28', '#36302a'][l], l * H / layers, '#3a3430');
      }
      const COLS = ['#5a4a3a', '#6a6a70', '#4a3a2a', '#7a5a3a', '#3a4a5a', '#8a3a2a', '#5a6a5a', '#9a9aa4'];
      const nItems = Math.round(10 + w * d * 6);
      for (let k = 0; k < nItems; k++) {
        const r1 = Math.abs(rng(k)), r2 = Math.abs(rng(k + 97)), r3 = Math.abs(rng(k + 211));
        const lvl = r3 * 0.9, ins = 0.12 + lvl * layers * Math.min(w, d) * 0.11;
        const x = o.x + ins + r1 * Math.max(0.05, w - ins * 2 - 0.35), y = o.y + ins + r2 * Math.max(0.05, d - ins * 2 - 0.3), z = lvl * H;
        const col = COLS[k % COLS.length];
        box(x, y, 0.15 + r2 * 0.3, 0.12 + r1 * 0.25, 1 + r1 * 3, col, z, shade(col, 1.25));
      }
      // peças espetadas: barras, um pneu e um braço robótico perto do topo
      for (let k = 0; k < 3 + w * d; k++) {
        const r1 = Math.abs(rng(k + 300)), r2 = Math.abs(rng(k + 400));
        const [a0, b0] = iso(o.x + 0.3 + r1 * (w - 0.6), o.y + 0.3 + r2 * (d - 0.6), H * (0.3 + r2 * 0.5));
        line([[a0, b0], [a0 + (r1 - 0.5) * 8, b0 - 4 - r2 * 6]], k % 2 ? '#7a7a84' : '#5a3a2a', 0.5);
      }
      const [sx, sy] = iso(cx, cy, H - 1);
      ctx.strokeStyle = '#8a8a90'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(sx - 3, sy); ctx.lineTo(sx + 1, sy - 5); ctx.lineTo(sx + 3, sy - 4); ctx.stroke();   // braço robótico
      ctx.fillStyle = '#141414'; ctx.beginPath(); ctx.ellipse(sx + 4, sy + 3, 2, 1.2, 0.3, 0, Math.PI * 2); ctx.fill();                                   // pneu
      if (game.flags && (game.flags.sucata || []).includes(o.pile)) { ctx.fillStyle = 'rgba(255,179,71,0.8)'; ctx.fillRect(sx - 0.5, sy - 10, 1, 3); }   // já revirado
      return;
    }
    case 'chabudai': {   // mesa baixa de madeira laqueada, com bule e xícaras
      box(o.x + 0.2, o.y + 0.2, 0.08, 0.08, 4, '#1a0e08'); box(o.x + w - 0.28, o.y + d - 0.28, 0.08, 0.08, 4, '#1a0e08');
      box(o.x + 0.08, o.y + 0.08, w - 0.16, d - 0.16, 1.2, '#3a1a10', 4, '#5a2a18');
      const [sx, sy] = iso(cx, cy, 5.2);
      ctx.fillStyle = '#2a3a2a'; ctx.beginPath(); ctx.ellipse(sx, sy - 1, 1.6, 1.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f0ece0'; ctx.fillRect(sx - 4, sy, 1.4, 1); ctx.fillRect(sx + 2.6, sy - 0.4, 1.4, 1);
      ctx.fillStyle = '#7da850'; ctx.fillRect(sx - 3.8, sy, 1, 0.4); ctx.fillRect(sx + 2.8, sy - 0.4, 1, 0.4);
      return;
    }
    case 'zabuton': {    // almofada de chão (seiza)
      box(o.x + 0.18, o.y + 0.18, 0.64, 0.64, 1.1, shade(o.col || '#6a2a3a', 0.75), 0, o.col || '#6a2a3a');
      diamond(o.x + 0.3, o.y + 0.3, 0.4, 0.4, 1.15, shade(o.col || '#6a2a3a', 1.15));
      return;
    }
    case 'andon': {      // luminária de papel com moldura de madeira
      box(o.x + 0.3, o.y + 0.3, 0.4, 0.4, 2, '#2a1a0c');
      box(o.x + 0.32, o.y + 0.32, 0.36, 0.36, 12, '#f0dcb0', 2, '#f8e8c0');
      for (const z of [2, 8, 14]) box(o.x + 0.3, o.y + 0.3, 0.4, 0.4, 0.6, '#2a1a0c', z);
      const [sx, sy] = iso(cx, cy, 9); glow(sx, sy, 22, '#ffb860', 0.35);
      return;
    }
    case 'chagama': {    // braseiro com a chaleira de ferro da cerimônia, soltando vapor
      box(o.x + 0.2, o.y + 0.2, 0.6, 0.6, 3, '#3a2a20', 0, '#1a1410');
      const [sx, sy] = iso(cx, cy, 3); glow(sx, sy, 8, '#ff6a20', 0.4);
      ctx.fillStyle = '#2a2a2e'; ctx.beginPath(); ctx.ellipse(sx, sy - 3, 3.2, 2.6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#3a3a40'; ctx.fillRect(sx - 1, sy - 6.4, 2, 1);
      ctx.fillStyle = 'rgba(230,230,240,0.25)';
      for (let k = 0; k < 3; k++) { const ph = (t * 0.6 + k / 3) % 1; ctx.beginPath(); ctx.arc(sx + Math.sin(ph * 6 + k) * 1.5, sy - 8 - ph * 10, 1 + ph * 2, 0, Math.PI * 2); ctx.fill(); }
      return;
    }
    case 'byobu': {      // biombo dobrável pintado (montanhas e um galho florido)
      const n = Math.max(w, d) * 3, alongY = d > w;
      for (let k = 0; k < n; k++) {
        const f0 = k / 3, f1 = (k + 1) / 3, z = 18, off = k % 2 ? 0.08 : 0;
        const A = alongY ? [o.x + 0.5 + off, o.y + f0] : [o.x + f0, o.y + 0.5 + off], Bp = alongY ? [o.x + 0.5 + (0.08 - off), o.y + f1] : [o.x + f1, o.y + 0.5 + (0.08 - off)];
        const a0 = iso(A[0], A[1], 0), b0 = iso(Bp[0], Bp[1], 0), a1 = iso(A[0], A[1], z), b1 = iso(Bp[0], Bp[1], z);
        poly(ctx, [a0, b0, b1, a1], k % 2 ? '#d8c088' : '#e8d098');
        ctx.strokeStyle = '#2a1a0c'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(...a0); ctx.lineTo(...a1); ctx.lineTo(...b1); ctx.lineTo(...b0); ctx.stroke();
        const m = [(a1[0] + b1[0]) / 2, (a1[1] + b1[1]) / 2 + 6];
        ctx.fillStyle = 'rgba(60,70,60,0.5)'; ctx.beginPath(); ctx.moveTo(m[0] - 2.5, m[1] + 3); ctx.lineTo(m[0], m[1] - 1.5); ctx.lineTo(m[0] + 2.5, m[1] + 3); ctx.fill();
        if (k === 1) { ctx.fillStyle = '#f8f0f0'; ctx.fillRect(m[0] - 1.6, m[1] - 4, 0.9, 0.9); ctx.fillRect(m[0] + 0.6, m[1] - 3.2, 0.9, 0.9); }
      }
      return;
    }
    case 'bonsai': {     // bonsai num suporte baixo de madeira
      box(o.x + 0.25, o.y + 0.25, 0.5, 0.5, 5, '#3a2414', 0, '#4a2e18');
      box(o.x + 0.35, o.y + 0.35, 0.3, 0.3, 1.5, '#3a3a44', 5);
      const [sx, sy] = iso(cx, cy, 6.5);
      ctx.strokeStyle = '#4a3018'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + 2, sy - 3, sx - 1, sy - 6); ctx.stroke();
      for (const [dx, dy, r] of [[-2.5, -6, 2.2], [1.5, -7.5, 2.4], [-0.5, -9, 1.8]]) { ctx.fillStyle = '#2f5a2a'; ctx.beginPath(); ctx.ellipse(sx + dx, sy + dy, r * 1.3, r * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#4a7a3a'; ctx.beginPath(); ctx.ellipse(sx + dx - 0.4, sy + dy - 0.4, r * 0.8, r * 0.45, 0, 0, Math.PI * 2); ctx.fill(); }
      return;
    }
    case 'getabako': {   // sapateira de cubículos
      box(o.x + 0.05, o.y + 0.1, w - 0.1, d - 0.2, 16, '#6a4a2a', 0, '#7a5a3a');
      const alongY = d > w;
      for (let r = 0; r < 3; r++) for (let k = 0; k < 3 * Math.max(w, d); k++) {
        const p0 = alongY ? [o.x + w - 0.1, o.y + 0.15 + k * 0.32] : [o.x + 0.15 + k * 0.32, o.y + d - 0.1];
        const a1 = iso(p0[0], p0[1], 2 + r * 4.8), b1 = iso(alongY ? p0[0] : p0[0] + 0.22, alongY ? p0[1] + 0.22 : p0[1], 5.5 + r * 4.8);
        ctx.fillStyle = '#2a1a10'; ctx.fillRect(Math.min(a1[0], b1[0]), b1[1], Math.abs(b1[0] - a1[0]), a1[1] - b1[1]);
      }
      return;
    }
    case 'maneki': {   // gato da sorte acenando
      box(o.x + 0.35, o.y + 0.35, 0.3, 0.3, 5, '#c8202a');
      const [sx, sy] = iso(cx, cy, 5);
      ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.ellipse(sx, sy - 4, 2.6, 3.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(sx, sy - 8.5, 2.3, 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(sx - 2, sy - 11, 1, 1.5); ctx.fillRect(sx + 1, sy - 11, 1, 1.5);
      const wv = Math.sin(t * 5) * 1.2;
      ctx.fillRect(sx + 2, sy - 9 + wv, 1.2, 3);
      ctx.fillStyle = '#c8202a'; ctx.fillRect(sx - 1.5, sy - 6.6, 3, 0.6);
      ctx.fillStyle = '#141018'; ctx.fillRect(sx - 1.2, sy - 9, 0.6, 0.5); ctx.fillRect(sx + 0.6, sy - 9, 0.6, 0.5);
      return;
    }
    case 'sauna_bench': {
      const H = o.h || 6;
      box(o.x + 0.02, o.y + 0.06, w - 0.04, d - 0.12, H, '#7a5430', 0, '#9a6c3e');
      for (let k = 1; k < 4; k++) line([iso(o.x + 0.02, o.y + 0.06 + (d - 0.12) * k / 4, H), iso(o.x + w - 0.02, o.y + 0.06 + (d - 0.12) * k / 4, H)], 'rgba(0,0,0,0.3)', 0.35);
      return;
    }
    case 'sauna_stove': {
      box(o.x + 0.15, o.y + 0.15, 0.7, 0.7, 10, '#3a3a40');
      const [sx, sy] = iso(cx, cy, 10);
      for (let k = 0; k < 9; k++) { ctx.fillStyle = ['#6a6a70', '#5a5a60', '#7a7a80'][k % 3]; ctx.beginPath(); ctx.ellipse(sx - 4 + (k % 3) * 4, sy - 1 + Math.floor(k / 3) * 1.4 - 1.4, 2, 1.3, 0, 0, Math.PI * 2); ctx.fill(); }
      glow(sx, sy, 14, '#ff6a2a', 0.35 + 0.08 * Math.sin(t * 4));
      const burst = o.steam > 0 ? 1 : 0.35;
      for (let k = 0; k < 6; k++) {
        const up = (t * 7 + k * 3) % 20;
        ctx.fillStyle = `rgba(255,255,255,${0.2 * burst * (1 - up / 20)})`;
        ctx.beginPath(); ctx.ellipse(sx + Math.sin(t + k) * 3, sy - 2 - up, 2.5 + up * 0.35, 1.4 + up * 0.15, 0, 0, Math.PI * 2); ctx.fill();
      }
      return;
    }
    case 'bucket': {
      box(o.x + 0.35, o.y + 0.35, 0.3, 0.3, 4, '#8a5a30', 0, '#3a6a8a');
      const [sx, sy] = iso(cx, cy, 4);
      ctx.strokeStyle = '#6a4020'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + 3, sy - 5); ctx.stroke();
      return;
    }
    case 'wash_stool':
      box(o.x + 0.32, o.y + 0.32, 0.36, 0.36, 3, '#c8d0d8');
      box(o.x + 0.62, o.y + 0.15, 0.24, 0.24, 2.5, '#d8a040');
      return;
    case 'onsen': {
      // piscina de pedra: borda, água animada e vapor (desenhada rente ao chão)
      const cold = o.cold;
      diamond(o.x - 0.12, o.y - 0.12, w + 0.24, d + 0.24, 0, '#4a4440');
      diamond(o.x, o.y, w, d, 0, cold ? '#1a4a6a' : '#1e5a6e');
      const wave = 0.08 + 0.04 * Math.sin(t * 1.4);
      diamond(o.x + 0.1, o.y + 0.1, w - 0.2, d - 0.2, 0, rgba(cold ? '#7fd8ff' : '#9fe8ff', wave + 0.12));
      ctx.strokeStyle = 'rgba(220,250,255,0.18)'; ctx.lineWidth = 0.35;
      for (let k = 0; k < w * d * 0.6; k++) {
        const fx = o.x + 0.3 + ((k * 0.61) % (w - 0.6)), fy = o.y + 0.3 + ((k * 0.37) % (d - 0.6));
        const [sx, sy] = iso(fx, fy), r = (t * 0.5 + k * 0.17) % 1;
        ctx.globalAlpha = 1 - r; ctx.beginPath(); ctx.ellipse(sx, sy, 2 + r * 4, 1 + r * 2, 0, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // pedras da borda
      for (let k = 0; k < (w + d) * 2; k++) {
        const per = (k / ((w + d) * 2)) * 2 * (w + d);
        const [px2, py2] = per < w ? [o.x + per, o.y - 0.06] : per < w + d ? [o.x + w + 0.06, o.y + per - w] : per < 2 * w + d ? [o.x + 2 * w + d - per, o.y + d + 0.06] : [o.x - 0.06, o.y + 2 * (w + d) - per];
        const [sx, sy] = iso(px2, py2, 0);
        ctx.fillStyle = (k % 3) ? '#5a5450' : '#6a6460';
        ctx.beginPath(); ctx.ellipse(sx, sy - 0.6, 3.2, 1.6, 0, 0, Math.PI * 2); ctx.fill();
      }
      if (!cold) for (let k = 0; k < Math.ceil(w * d / 2); k++) {
        const fx = o.x + 0.4 + ((k * 1.3) % (w - 0.8)), fy = o.y + 0.4 + ((k * 0.7) % (d - 0.8));
        const [sx, sy] = iso(fx, fy, 0);
        const up = (t * 5 + k * 2.9) % 18;
        ctx.fillStyle = `rgba(255,255,255,${0.12 * (1 - up / 18)})`;
        ctx.beginPath(); ctx.ellipse(sx + Math.sin(t + k) * 2, sy - up, 4 + up * 0.3, 2 + up * 0.12, 0, 0, Math.PI * 2); ctx.fill();
      }
      return;
    }
    case 'rock': {
      const [sx, sy] = iso(cx, cy, 0);
      ctx.fillStyle = '#4a4a50'; ctx.beginPath(); ctx.ellipse(sx, sy - 3, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#5e5e66'; ctx.beginPath(); ctx.ellipse(sx - 1.5, sy - 4.5, 4.5, 3, -0.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(125,255,107,0.18)'; ctx.beginPath(); ctx.ellipse(sx + 2, sy - 6, 2.5, 1, 0, 0, Math.PI * 2); ctx.fill();
      return;
    }
    case 'bamboo': {
      box(o.x + 0.25, o.y + 0.25, 0.5, 0.5, 4, '#3a3028');
      for (let k = 0; k < 5; k++) {
        const bx = o.x + 0.35 + (k % 3) * 0.15, by = o.y + 0.35 + Math.floor(k / 3) * 0.2;
        const [a1, a2] = iso(bx, by, 4), H = 30 + (k * 7) % 12, sw = Math.sin(t * 1.2 + k) * 0.6;
        ctx.strokeStyle = '#4a8a3a'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(a1, a2); ctx.lineTo(a1 + sw, a2 - H); ctx.stroke();
        for (let j = 6; j < H; j += 6) { ctx.fillStyle = '#2a5a24'; ctx.fillRect(a1 + sw * j / H - 0.6, a2 - j, 1.2, 0.4); }
        ctx.fillStyle = 'rgba(80,160,70,0.8)';
        for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.ellipse(a1 + sw + (j - 1) * 2.5, a2 - H + j * 3, 2.6, 0.9, (j - 1) * 0.6, 0, Math.PI * 2); ctx.fill(); }
      }
      return;
    }
    case 'stone_lantern': {   // tōrō
      box(o.x + 0.3, o.y + 0.3, 0.4, 0.4, 3, '#6a6660');
      box(o.x + 0.42, o.y + 0.42, 0.16, 0.16, 9, '#7a7670', 3);
      box(o.x + 0.3, o.y + 0.3, 0.4, 0.4, 5, '#6a6660', 12);
      const [sx, sy] = iso(cx, cy, 14);
      ctx.fillStyle = '#ffb347'; ctx.fillRect(sx - 1.5, sy - 1, 3, 2);
      glow(sx, sy, 12, '#ffb347', 0.4);
      box(o.x + 0.2, o.y + 0.2, 0.6, 0.6, 2, '#5a5650', 17);
      box(o.x + 0.42, o.y + 0.42, 0.16, 0.16, 2, '#5a5650', 19);
      return;
    }

    // ---------------- delegacia e perícia ----------------
    case 'holo_map': {
      box(o.x + 0.1, o.y + 0.1, w - 0.2, d - 0.2, 8, '#1a2232', 0, '#22304a');
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 9; k++) {
        const bx = o.x + 0.25 + (k % 3) * (w - 0.5) / 3, by = o.y + 0.25 + Math.floor(k / 3) * (d - 0.5) / 3;
        const hh = 3 + ((k * 7) % 5) * 2;
        const a1 = iso(bx, by, 9), b1 = iso(bx, by, 9 + hh);
        ctx.strokeStyle = rgba(k === 4 ? '#ff4fd8' : '#38f6ff', 0.55 + 0.2 * Math.sin(t * 3 + k)); ctx.lineWidth = 0.5;
        ctx.strokeRect(a1[0] - 1.5, b1[1], 3, a1[1] - b1[1]);
      }
      ctx.restore();
      return;
    }
    case 'lab_bench': {
      box(o.x + 0.02, o.y + 0.08, w - 0.04, d - 0.12, 10, '#c8d0d8', 0, '#e8eef2');
      for (let k = 0; k < w * 3; k++) {
        const [vx, vy] = iso(o.x + 0.2 + k * 0.3, o.y + 0.4, 10);
        const col = ['#7dff6b', '#38f6ff', '#ff4fd8', '#ffd23f'][k % 4];
        ctx.fillStyle = '#d8e8f0'; ctx.fillRect(vx - 0.5, vy - 4, 1, 4);
        ctx.fillStyle = col; ctx.fillRect(vx - 0.5, vy - 2, 1, 2);
      }
      const [mx, my] = iso(o.x + w - 0.35, o.y + 0.5, 10);
      ctx.fillStyle = '#2a2a34'; ctx.fillRect(mx - 1, my - 7, 2, 7); ctx.fillRect(mx - 2, my - 1, 4, 1); ctx.fillRect(mx - 0.5, my - 9, 2.5, 2.5);
      return;
    }
    case 'evidence_locker':
      box(o.x + 0.1, o.y + 0.15, w - 0.2, 0.7, 24, '#4a5260', 0, '#5a6270');
      { const [kx, ky] = iso(o.x + w - 0.3, o.y + 0.85, 14); ctx.fillStyle = Math.floor(t * 2) % 2 ? '#7dff6b' : '#2a5a24'; ctx.fillRect(kx - 0.6, ky, 1.2, 1); }
      return;
    case 'coffee_machine': {
      box(o.x + 0.02, o.y + 0.08, w - 0.04, d - 0.12, 10, '#3a3440', 0, '#8a8478');
      box(o.x + 0.25, o.y + 0.2, 0.5, 0.45, 9, '#2a2a30', 10);
      const [sx, sy] = iso(o.x + 0.5, o.y + 0.65, 12);
      ctx.fillStyle = '#ff3355'; ctx.fillRect(sx - 0.4, sy - 5, 0.8, 0.8);
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; for (let k = 0; k < 3; k++) ctx.fillRect(sx - 1 + k, sy - 8 - ((t * 3 + k) % 3), 0.5, 1.5);
      return;
    }
    case 'int_table': {
      box(o.x + 0.1, o.y + 0.2, w - 0.2, d - 0.4, 8, '#5a6270', 0, '#7a8290');
      const [lx, ly] = iso(cx, cy, 40);
      ctx.fillStyle = '#2a2a34'; ctx.fillRect(lx - 3, ly, 6, 1.5);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createLinearGradient(0, ly, 0, ly + 34);
      g.addColorStop(0, 'rgba(255,240,200,0.18)'); g.addColorStop(1, 'rgba(255,240,200,0.02)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(lx - 2.5, ly + 1.5); ctx.lineTo(lx + 2.5, ly + 1.5); ctx.lineTo(lx + 14, ly + 34); ctx.lineTo(lx - 14, ly + 34); ctx.fill();
      ctx.restore();
      return;
    }
    case 'marker': {   // plaquinha amarela numerada da perícia
      const [sx, sy] = iso(o.x + (o.ox || 0.5), o.y + (o.oy || 0.5), 0);
      ctx.fillStyle = '#d8b020'; ctx.beginPath(); ctx.moveTo(sx - 1.8, sy); ctx.lineTo(sx + 1.8, sy); ctx.lineTo(sx + 0.8, sy - 4); ctx.lineTo(sx - 0.8, sy - 4); ctx.fill();
      ctx.fillStyle = '#ffd23f'; ctx.fillRect(sx - 1.4, sy - 3.6, 2.2, 3.2);
      propText(String(o.n || 1), sx - 0.3, sy - 2, 2.6, '#141018');
      return;
    }
    case 'floodlight': {
      const [sx, sy] = iso(cx, cy, 0);
      ctx.strokeStyle = '#3a3a44'; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(sx - 3, sy + 1); ctx.lineTo(sx, sy - 20); ctx.lineTo(sx + 3, sy + 1); ctx.moveTo(sx, sy + 1.5); ctx.lineTo(sx, sy - 20); ctx.stroke();
      ctx.fillStyle = '#2a2a34'; ctx.fillRect(sx - 3.5, sy - 25, 7, 5);
      ctx.fillStyle = '#fffbe8'; ctx.fillRect(sx - 3, sy - 24.4, 6, 3.8);
      glow(sx, sy - 22, 26, '#fff4d0', 0.35);
      return;
    }
    case 'forensic_kit': {
      box(o.x + 0.15, o.y + 0.3, 0.7, 0.45, 4, '#c8a020', 0, '#3a3a44');
      for (let k = 0; k < 4; k++) { const [vx, vy] = iso(o.x + 0.25 + k * 0.15, o.y + 0.5, 4); ctx.fillStyle = ['#38f6ff', '#e8e8f0', '#ff4fd8', '#7dff6b'][k]; ctx.fillRect(vx - 0.4, vy - 2, 0.8, 2); }
      return;
    }
    case 'cot':   // banco de cela
      box(o.x + 0.05, o.y + 0.2, w - 0.1, 0.6, 5, '#4a4e56', 0, '#5a5e66');
      return;

    // ---------------- rua ----------------
    case 'trash':
      box(o.x + 0.33, o.y + 0.33, 0.34, 0.34, 9, '#2a3a34', 0, '#1a2420');
      { const [sx, sy] = iso(cx, cy, 6); ctx.fillStyle = '#7dff6b'; ctx.fillRect(sx - 1, sy, 2, 0.5); }
      return;
    case 'hydrant':
      box(o.x + 0.4, o.y + 0.4, 0.2, 0.2, 7, '#c8202a', 0, '#ffd23f');
      box(o.x + 0.34, o.y + 0.44, 0.32, 0.12, 2, '#a81a22', 4);
      return;
    case 'semaforo': {
      const cx = o.x + 0.5, cy = o.y + 0.5, L = CITY.light(o.ns), P = CITY.pedSignal(o.ns);
      box(cx - 0.05, cy - 0.05, 0.1, 0.1, 40, '#2a2a32', 0, '#3a3a44');
      // braço para dentro da rua (no eixo dos carros que ele controla)
      const ex = cx + (o.ns ? 0 : (CITY.tile(o.x + 1, o.y) === CITY.T.ROAD || CITY.tile(o.x + 1, o.y) === CITY.T.CROSS ? 1.4 : -1.4));
      const ey = cy + (o.ns ? (CITY.tile(o.x, o.y + 1) === CITY.T.ROAD || CITY.tile(o.x, o.y + 1) === CITY.T.CROSS ? 1.4 : -1.4) : 0);
      line([iso(cx, cy, 38), iso(ex, ey, 38)], '#2a2a32', 0.9);
      box(ex - 0.16, ey - 0.16, 0.32, 0.32, 11, '#14141a', 29, '#1e1e26');
      const lamps = [['r', '#ff2a3a', 37.5], ['y', '#ffc23a', 34.2], ['g', '#3aff8a', 30.9]];
      for (const [k, col, z] of lamps) {
        const [px, py] = iso(ex + 0.13, ey + 0.13, z), on = L === k;
        ctx.fillStyle = on ? col : rgba(col, 0.18); ctx.fillRect(px - 1.3, py - 1.3, 2.6, 2.6);
        if (on) { ctx.fillStyle = rgba(col, 0.3); ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill(); }
      }
      // boneco dos pedestres, na altura dos olhos
      box(cx + 0.06, cy - 0.1, 0.16, 0.2, 5, '#14141a', 18);
      const [qx, qy] = iso(cx + 0.22, cy, 20.5);
      const walkOn = P === 'walk' || (P === 'flash' && Math.floor(t * 3) % 2);
      ctx.fillStyle = walkOn ? '#5affb0' : P === 'stop' ? '#ff4a3a' : 'rgba(90,255,176,0.15)';
      ctx.fillRect(qx - 0.6, qy - 1.6, 1.2, 1.2); ctx.fillRect(qx - 0.4, qy - 0.3, 0.8, 1.8);
      break;
    }
    case 'tree': {
      box(o.x + 0.15, o.y + 0.15, 0.7, 0.7, 4, '#2a2a30', 0, '#1a2a1e');
      box(o.x + 0.45, o.y + 0.45, 0.1, 0.1, 14, '#3a2a1e', 4);
      const [sx, sy] = iso(cx, cy, 20);
      ctx.fillStyle = o.col || '#1e4a34';
      for (const [ox, oy, r] of [[0, 0, 7], [-4, 2, 5], [4, 2, 5], [0, -4, 5]]) { ctx.beginPath(); ctx.ellipse(sx + ox, sy + oy, r, r * 0.8, 0, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = rgba(o.glow || '#7dff6b', 0.18 + 0.08 * Math.sin(t * 2 + o.x));
      ctx.beginPath(); ctx.ellipse(sx - 2, sy - 3, 4, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      return;
    }
    case 'kiosk': {
      box(o.x + 0.1, o.y + 0.1, 0.8, 0.8, 16, '#2a2234', 0, '#3a2e48');
      box(o.x + 0.05, o.y + 0.05, 0.9, 0.9, 1.5, o.col || '#ff4fd8', 22, shade(o.col || '#ff4fd8', 1.2));
      box(o.x + 0.45, o.y + 0.45, 0.1, 0.1, 6, '#2a2a34', 16);
      const [sx, sy] = iso(o.x + 0.5, o.y + 0.9, 8);
      ctx.fillStyle = rgba('#38f6ff', 0.4 + 0.2 * Math.sin(t * 4)); ctx.fillRect(sx - 4, sy - 6, 7, 5);
      for (let k = 0; k < 3; k++) { ctx.fillStyle = '#e8f0ff'; ctx.fillRect(sx - 3.5, sy - 5.2 + k * 1.4, 3 + ((k * 3 + Math.floor(t * 2)) % 3), 0.5); }
      return;
    }
    case 'phone': {
      box(o.x + 0.3, o.y + 0.3, 0.4, 0.4, 2, '#2a2a34');
      box(o.x + 0.46, o.y + 0.46, 0.08, 0.08, 18, '#3a3a48', 2);
      const [sx, sy] = iso(cx, cy, 22);
      ctx.fillStyle = rgba('#7dff6b', 0.25 + 0.1 * Math.sin(t * 3)); ctx.fillRect(sx - 3, sy - 6, 6, 8);
      propText('FONE', sx, sy - 2, 2.2, '#7dff6b');
      return;
    }
    case 'bollard': {
      box(o.x + 0.42, o.y + 0.42, 0.16, 0.16, 6, '#3a3a44', 0, '#ffd23f');
      return;
    }
    case 'cone': {
      const [sx, sy] = iso(cx, cy, 0);
      ctx.fillStyle = '#ff6b1a'; ctx.beginPath(); ctx.moveTo(sx - 2, sy); ctx.lineTo(sx + 2, sy); ctx.lineTo(sx, sy - 6); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.fillRect(sx - 1.1, sy - 3.2, 2.2, 0.8);
      return;
    }
    case 'tape': {   // fita de isolamento da polícia entre estacas
      const along = o.axis === 'y';
      const x0 = along ? o.x + 0.5 : o.x, y0 = along ? o.y : o.y + 0.5, x1 = along ? x0 : o.x + w, y1 = along ? o.y + d : y0;
      const n = Math.round(along ? d : w);
      for (let k = 0; k <= n; k++) box((along ? x0 : x0 + k) - 0.04, (along ? y0 + k : y0) - 0.04, 0.08, 0.08, 9, '#3a3a44');
      const a1 = iso(x0, y0, 8), b1 = iso(x1, y1, 8);
      ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(...a1); ctx.lineTo(...b1); ctx.stroke();
      ctx.strokeStyle = '#141018'; ctx.lineWidth = 0.9; ctx.setLineDash([1.2, 2.4]); ctx.beginPath(); ctx.moveTo(...a1); ctx.lineTo(...b1); ctx.stroke(); ctx.setLineDash([]);
      return;
    }
    case 'planter':
      box(o.x + 0.1, o.y + 0.1, w - 0.2, d - 0.2, 5, '#3a3440', 0, '#1e3a24');
      for (let k = 0; k < 4 * w * d; k++) { const [fx, fy] = iso(o.x + 0.2 + (k * 0.37) % (w - 0.4), o.y + 0.2 + (k * 0.53) % (d - 0.4), 5); ctx.fillStyle = ['#ff4fd8', '#ffd23f', '#38f6ff'][k % 3]; ctx.fillRect(fx - 0.5, fy - 1.5, 1, 1); }
      return;
    case 'fountain': {
      diamond(o.x + 0.05, o.y + 0.05, w - 0.1, d - 0.1, 0, '#3a3a48');
      box(o.x + 0.15, o.y + 0.15, w - 0.3, d - 0.3, 3, '#4a4a58', 0, '#1e4a6a');
      box(cx - 0.15, cy - 0.15, 0.3, 0.3, 8, '#5a5a6a', 3);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const [sx, sy] = iso(cx, cy, 11);
      for (let k = 0; k < 8; k++) {
        const a = k / 8 * Math.PI * 2 + t * 0.6, r = 9;
        ctx.strokeStyle = rgba(k % 2 ? '#38f6ff' : '#ff4fd8', 0.45); ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + Math.cos(a) * r * 0.6, sy - 9 + Math.sin(a) * 2, sx + Math.cos(a) * r, sy + 8 + Math.sin(a) * r * 0.5); ctx.stroke();
      }
      ctx.restore();
      return;
    }
    case 'manhole': {
      const [sx, sy] = iso(cx, cy, 0);
      ctx.fillStyle = '#22222a'; ctx.beginPath(); ctx.ellipse(sx, sy, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#3a3a44'; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.ellipse(sx, sy, 3.5, 1.7, 0, 0, Math.PI * 2); ctx.stroke();
      for (let k = 0; k < 3; k++) {
        const up = (t * 6 + k * 5) % 16;
        ctx.fillStyle = `rgba(255,255,255,${0.14 * (1 - up / 16)})`;
        ctx.beginPath(); ctx.ellipse(sx + Math.sin(t * 2 + k) * 2, sy - up, 3 + up * 0.3, 1.5 + up * 0.1, 0, 0, Math.PI * 2); ctx.fill();
      }
      return;
    }
    case 'holo_ad': {
      box(o.x + 0.45, o.y + 0.45, 0.1, 0.1, 24, '#2a2a34');
      const [sx, sy] = iso(cx, cy, 34);
      const col = o.col || '#ff4fd8', flick = Math.random() < 0.04 ? 0.3 : 1;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = flick;
      ctx.fillStyle = rgba(col, 0.25); ctx.fillRect(sx - 9, sy - 9, 18, 12);
      ctx.strokeStyle = rgba(col, 0.8); ctx.lineWidth = 0.5; ctx.strokeRect(sx - 9, sy - 9, 18, 12);
      propText(o.text || 'NEO', sx, sy - 3, 4, col);
      ctx.restore();
      return;
    }
    case 'police_car':
      drawHoverCar(o.cx, o.cy, o.ang || 0, t, { livery: 'police', parked: true });
      return;
    case 'taxi':
      drawHoverCar(o.cx, o.cy, o.ang || 0, t, { livery: { main: '#e8b020', second: '#2a2210', under: '#1a1610', metal: '#2a2a30', glass: '#1a3040', accent: '#ffd23f', model: 'sedan' }, parked: true });
      return;

    // ---------------- Chinatown ----------------
    case 'paifang': {
      // portal chinês: dois pilares vermelhos, vigas e telhado verde de beirais curvos
      const along = o.axis === 'y', L2 = along ? d : w;
      const P = (u, z) => along ? iso(o.x + 0.5, o.y + u, z) : iso(o.x + u, o.y + 0.5, z);
      for (const u of [0.5, L2 - 0.5]) {
        const [px2, py2] = along ? [o.x + 0.5, o.y + u] : [o.x + u, o.y + 0.5];
        box(px2 - 0.22, py2 - 0.22, 0.44, 0.44, 3, '#6a6660');
        box(px2 - 0.14, py2 - 0.14, 0.28, 0.28, 34, '#b81a24', 3);
      }
      const beam = (z0, z1, col) => poly(ctx, [P(0.2, z0), P(L2 - 0.2, z0), P(L2 - 0.2, z1), P(0.2, z1)], col);
      beam(26, 29, '#8a1018'); beam(31, 35, '#b81a24');
      line([P(0.2, 33), P(L2 - 0.2, 33)], '#ffd23f', 0.5);
      // placa com o nome
      const [sx, sy] = P(L2 / 2, 30);
      ctx.fillStyle = '#141018'; ctx.fillRect(sx - 7, sy - 4, 14, 6);
      ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 0.4; ctx.strokeRect(sx - 7, sy - 4, 14, 6);
      propText(o.text || '中華街', sx, sy - 1, 4, '#ffd23f', 'sans-serif');
      // telhado: duas águas com beirais levantados
      const eave = (z, ext, col) => {
        const a = P(-ext, z + 2), b = P(L2 + ext, z + 2), c = P(L2 + ext - 0.4, z + 6), e = P(-ext + 0.4, z + 6);
        poly(ctx, [a, b, c, e], col);
        ctx.fillStyle = col; ctx.fillRect(a[0] - 1, a[1] - 3, 1.2, 3); ctx.fillRect(b[0], b[1] - 3, 1.2, 3);
      };
      eave(35, 0.5, '#1e5a3a'); eave(39, 0.2, '#2a7a4a');
      line([P(-0.3, 45), P(L2 + 0.3, 45)], '#e8c040', 0.7);
      for (const u of [0.6, L2 - 0.6]) { const [lx, ly] = P(u, 24); ctx.fillStyle = '#e8202a'; ctx.beginPath(); ctx.ellipse(lx, ly + 2, 2.2, 3, 0, 0, Math.PI * 2); ctx.fill(); glow(lx, ly + 2, 8, '#ff3355', 0.4); }
      return;
    }
    case 'lion': {   // leão de pedra guardião
      box(o.x + 0.2, o.y + 0.2, 0.6, 0.6, 5, '#6a6660', 0, '#7a7670');
      const [sx, sy] = iso(cx, cy, 5);
      ctx.fillStyle = '#8a8478';
      ctx.beginPath(); ctx.ellipse(sx, sy - 4, 3.6, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(sx + (o.flip ? -1 : 1), sy - 10, 3.2, 3, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#6a6458'; for (let k = 0; k < 5; k++) ctx.fillRect(sx - 3 + k * 1.4 + (o.flip ? -1 : 1), sy - 13, 0.9, 1.6);
      ctx.fillStyle = '#c8202a'; ctx.fillRect(sx - 1 + (o.flip ? -1 : 1), sy - 9, 2, 0.6);
      ctx.fillStyle = '#141018'; ctx.fillRect(sx - 1.2 + (o.flip ? -1 : 1), sy - 11, 0.6, 0.6); ctx.fillRect(sx + 0.8 + (o.flip ? -1 : 1), sy - 11, 0.6, 0.6);
      return;
    }
    case 'lantern_line': {
      // varal de lanternas atravessando a rua, no alto
      const along = o.axis === 'y', L2 = along ? d : w;
      const P = (u, z) => along ? iso(o.x + 0.5, o.y + u, z) : iso(o.x + u, o.y + 0.5, z);
      const a = P(0, 40), b = P(L2, 40), m = P(L2 / 2, 34);
      ctx.strokeStyle = '#2a1010'; ctx.lineWidth = 0.4;
      ctx.beginPath(); ctx.moveTo(...a); ctx.quadraticCurveTo(m[0], m[1] - 3, ...b); ctx.stroke();
      const n = Math.max(2, Math.round(L2 * 1.5));
      for (let k = 1; k < n; k++) {
        const u = k / n, sag = 4 * u * (1 - u) * 6;
        const [lx, ly] = P(u * L2, 40 - sag);
        const sw = Math.sin(t * 1.5 + k) * 0.6;
        ctx.fillStyle = o.col && k % 2 ? o.col : '#e8202a';
        ctx.beginPath(); ctx.ellipse(lx + sw, ly + 3, 1.8, 2.4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffd23f'; ctx.fillRect(lx + sw - 0.9, ly + 0.5, 1.8, 0.5);
        glow(lx + sw, ly + 3, 6, '#ff5a3a', 0.3);
      }
      return;
    }
    case 'incense': {   // grande incensário de bronze
      box(o.x + 0.2, o.y + 0.2, 0.6, 0.6, 2, '#6a6660');
      box(o.x + 0.25, o.y + 0.25, 0.5, 0.5, 7, '#8a6a2a', 2, '#4a3418');
      const [sx, sy] = iso(cx, cy, 9);
      for (let k = 0; k < 5; k++) { ctx.fillStyle = '#c8202a'; ctx.fillRect(sx - 2 + k, sy - 5 - (k % 2), 0.4, 5); ctx.fillStyle = '#ffb347'; ctx.fillRect(sx - 2 + k, sy - 5.4 - (k % 2), 0.4, 0.5); }
      for (let k = 0; k < 4; k++) {
        const up = (t * 4 + k * 4) % 18;
        ctx.fillStyle = `rgba(220,220,240,${0.16 * (1 - up / 18)})`;
        ctx.beginPath(); ctx.ellipse(sx + Math.sin(t * 1.5 + k + up * 0.2) * 3, sy - 7 - up, 1.5 + up * 0.2, 1 + up * 0.1, 0, 0, Math.PI * 2); ctx.fill();
      }
      return;
    }
    case 'koi': {   // laguinho de carpas
      diamond(o.x + 0.05, o.y + 0.05, w - 0.1, d - 0.1, 0, '#5a5450');
      diamond(o.x + 0.18, o.y + 0.18, w - 0.36, d - 0.36, 0, '#0e2a36');
      diamond(o.x + 0.3, o.y + 0.3, w - 0.6, d - 0.6, 0, '#12343f');
      // carpas: corpo afilado, cauda que ondula, nadadeiras e manchas; nadam em curvas lentas, meio submersas
      const KOI = [['#f4f0e8', '#e8501e'], ['#ff7a1e', '#f4f0e8'], ['#f4f0e8', '#1a1a1a'], ['#ffb02e', '#ffe08a'], ['#e8401a', '#f4f0e8']];
      for (let k = 0; k < 5; k++) {
        const sp = 0.22 + k * 0.05, a = t * sp * (k % 2 ? -1 : 1) + k * 1.3;
        const rr = (Math.min(w, d) / 2 - 0.45) * (0.55 + 0.4 * Math.sin(t * 0.13 + k * 2.1));
        const pos = aa => iso(cx + Math.cos(aa) * rr, cy + Math.sin(aa) * rr * (d / w), 0);
        const [fx, fy] = pos(a), [gx, gy] = pos(a + 0.05 * (k % 2 ? -1 : 1));
        const hd = Math.atan2(gy - fy, gx - fx), sw = Math.sin(t * 6 + k) * 0.35, L = 2.6;
        ctx.save(); ctx.translate(fx, fy); ctx.rotate(hd); ctx.scale(2.2, 2.2);
        ctx.globalAlpha = 0.25; ctx.fillStyle = '#000';   // sombra no fundo
        ctx.beginPath(); ctx.ellipse(0.4, 0.6, L * 0.5, 0.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.85;
        const [base, spot] = KOI[k];
        ctx.fillStyle = base;   // cauda
        ctx.beginPath(); ctx.moveTo(-L * 0.4, 0); ctx.lineTo(-L * 0.75, -0.55 + sw); ctx.lineTo(-L * 0.65, sw * 0.5); ctx.lineTo(-L * 0.75, 0.55 + sw); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(L * 0.5, 0);   // corpo afilado
        ctx.quadraticCurveTo(L * 0.2, -0.6, -L * 0.42, sw * 0.3); ctx.quadraticCurveTo(L * 0.2, 0.6, L * 0.5, 0); ctx.fill();
        ctx.fillStyle = spot;
        ctx.beginPath(); ctx.ellipse(L * 0.1, -0.1, 0.45, 0.28, 0.3, 0, Math.PI * 2); ctx.fill();
        if (k % 2 === 0) { ctx.beginPath(); ctx.ellipse(-L * 0.15, 0.1, 0.3, 0.2, 0, 0, Math.PI * 2); ctx.fill(); }
        ctx.globalAlpha = 0.55; ctx.fillStyle = base;   // nadadeiras peitorais
        ctx.beginPath(); ctx.ellipse(L * 0.18, -0.55, 0.35, 0.14, -0.6 + sw * 0.4, 0, Math.PI * 2); ctx.ellipse(L * 0.18, 0.55, 0.35, 0.14, 0.6 - sw * 0.4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      // reflexo da água por cima e anéis da chuva
      ctx.globalAlpha = 0.18; diamond(o.x + 0.3, o.y + 0.3, w - 0.6, d - 0.6, 0.1, '#6ab8d0'); ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(200,235,255,0.35)'; ctx.lineWidth = 0.3;
      for (let k = 0; k < 3; k++) {
        const ph = (t * 0.7 + k * 0.37) % 1, rx = cx + Math.sin(k * 5.1 + Math.floor(t * 0.7 + k * 0.37) * 2.3) * (w / 2 - 0.5), ry = cy + Math.cos(k * 3.7 + Math.floor(t * 0.7 + k * 0.37) * 1.7) * (d / 2 - 0.5);
        const [px, py] = iso(rx, ry, 0.1);
        ctx.globalAlpha = 1 - ph; ctx.beginPath(); ctx.ellipse(px, py, 0.5 + ph * 3, (0.5 + ph * 3) / 2, 0, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      return;
    }
    case 'mahjong': {
      box(o.x + 0.15, o.y + 0.15, 0.7, 0.7, 7, '#3a2a20', 0, '#1e6a3a');
      for (let k = 0; k < 12; k++) {
        const side = k % 4, j = Math.floor(k / 4) - 1;
        const [tx2, ty2] = iso(cx + (side === 0 ? -0.22 : side === 1 ? 0.22 : j * 0.1), cy + (side === 2 ? -0.22 : side === 3 ? 0.22 : j * 0.1), 7);
        ctx.fillStyle = '#f0ece0'; ctx.fillRect(tx2 - 0.6, ty2 - 1, 1.2, 1);
      }
      return;
    }
    case 'banner': {
      box(o.x + 0.45, o.y + 0.45, 0.1, 0.1, 30, '#3a2a20');
      const [sx, sy] = iso(cx, cy, 28);
      const sw = Math.sin(t * 1.3 + o.x) * 0.6;
      ctx.fillStyle = o.col || '#c8202a'; ctx.fillRect(sx + 0.6, sy, 5 + sw, 18);
      ctx.fillStyle = '#ffd23f';
      const txt = o.text || '福';
      for (let k = 0; k < txt.length; k++) propText(txt[k], sx + 3.1 + sw / 2, sy + 4 + k * 5, 4, '#ffd23f', 'sans-serif');
      return;
    }
    case 'shrine': {
      box(o.x + 0.2, o.y + 0.2, 0.6, 0.6, 10, '#8a1018', 0, '#b81a24');
      box(o.x + 0.12, o.y + 0.12, 0.76, 0.76, 2, '#1e5a3a', 14, '#2a7a4a');
      box(o.x + 0.3, o.y + 0.3, 0.4, 0.4, 4, '#2a1010', 10);
      const [sx, sy] = iso(cx, cy, 11);
      for (const k of [-1.5, 1.5]) { ctx.fillStyle = '#ffd23f'; ctx.fillRect(sx + k - 0.3, sy - 2, 0.6, 2); glow(sx + k, sy - 2.5, 5, '#ffb347', 0.5); }
      return;
    }
    case 'stall': {
      // barraca de feira: balcão, estacas, toldo listrado e mercadorias
      const col = o.col || '#c8202a';
      box(o.x + 0.05, o.y + 0.15, w - 0.1, d - 0.3, 9, '#5a3a24', 0, '#7a5232');
      for (const [px2, py2] of [[o.x + 0.08, o.y + 0.18], [o.x + w - 0.12, o.y + 0.18], [o.x + 0.08, o.y + d - 0.22], [o.x + w - 0.12, o.y + d - 0.22]]) box(px2, py2, 0.05, 0.05, 24, '#3a2a20', 9);
      const goods = o.goods || 'fruit';
      for (let k = 0; k < Math.round(w * d * 5); k++) {
        const [gx, gy] = iso(o.x + 0.2 + (k * 0.31) % (w - 0.4), o.y + 0.3 + (k * 0.47) % (d - 0.6), 9);
        if (goods === 'fruit') { ctx.fillStyle = ['#ff6a2a', '#ffd23f', '#7dff6b', '#ff3355'][k % 4]; ctx.beginPath(); ctx.arc(gx, gy - 0.8, 0.9, 0, Math.PI * 2); ctx.fill(); }
        else if (goods === 'fish') { ctx.fillStyle = k % 2 ? '#9ab0c0' : '#c8d8e0'; ctx.beginPath(); ctx.ellipse(gx, gy - 0.5, 1.8, 0.6, 0.3, 0, Math.PI * 2); ctx.fill(); }
        else if (goods === 'dumpling') { ctx.fillStyle = '#8a6a3a'; ctx.beginPath(); ctx.ellipse(gx, gy - 1, 2, 1, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#f0e8d8'; ctx.beginPath(); ctx.ellipse(gx, gy - 1.6, 1.4, 0.7, 0, 0, Math.PI * 2); ctx.fill(); }
        else if (goods === 'lanterns') { ctx.fillStyle = k % 2 ? '#e8202a' : '#ffd23f'; ctx.beginPath(); ctx.ellipse(gx, gy - 1.5, 1.1, 1.5, 0, 0, Math.PI * 2); ctx.fill(); }
        else if (goods === 'tech') { ctx.fillStyle = ['#38f6ff', '#ff4fd8', '#7dff6b'][k % 3]; ctx.fillRect(gx - 1, gy - 1.5, 2, 1.2); }
        else if (goods === 'duck') { ctx.fillStyle = '#a8501a'; ctx.beginPath(); ctx.ellipse(gx, gy - 4, 1.2, 2.2, 0, 0, Math.PI * 2); ctx.fill(); }
      }
      if (goods === 'dumpling') for (let k = 0; k < 3; k++) {
        const [vx, vy] = iso(cx, cy, 10), up = (t * 5 + k * 4) % 12;
        ctx.fillStyle = `rgba(255,255,255,${0.2 * (1 - up / 12)})`; ctx.beginPath(); ctx.ellipse(vx + k * 2 - 2, vy - 2 - up, 2 + up * 0.2, 1, 0, 0, Math.PI * 2); ctx.fill();
      }
      // toldo inclinado com listras
      const z1 = 33, z0 = 29;
      const A = iso(o.x - 0.05, o.y + 0.05, z1), B = iso(o.x + w + 0.05, o.y + 0.05, z1), C = iso(o.x + w + 0.05, o.y + d + 0.05, z0), D = iso(o.x - 0.05, o.y + d + 0.05, z0);
      poly(ctx, [A, B, C, D], col);
      const n = Math.max(3, Math.round(w * 3));
      for (let k = 0; k < n; k += 2) {
        const u0 = k / n, u1 = (k + 1) / n, L = (p, q, u) => [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u];
        poly(ctx, [L(A, B, u0), L(A, B, u1), L(D, C, u1), L(D, C, u0)], '#f0e8d8');
      }
      line([D, C], shade(col, 0.6), 0.6);
      if (o.sign) { const [sx, sy] = iso(cx, o.y + d + 0.05, z0 - 3); propText(o.sign, sx, sy, 3.6, '#ffd23f', 'sans-serif'); }
      return;
    }
    default:
      ecoProp(o, t, w, d, cx, cy) || s7Prop(o, t, w, d, cx, cy) || paulistaProp(o, t, w, d, cx, cy);   // objetos do caso 2 (eco.js) e do Sector 7 (sector7.js)
  }
}
