// ============================================================
// Introduções animadas (uma por caso): cinco cenas desenhadas em tempo real
// ============================================================

const Intro = (() => {
  const W = 640, H = 360;            // espaço virtual das cenas
  let cv, c, raf = 0, idx = 0, sceneStart = 0, done = null, running = false;

  const ease = x => x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x);
  const lerp = (a, b, k) => a + (b - a) * k;

  // gerador determinístico para a cidade não "tremer" entre quadros
  function seeded(seed) { return () => (seed = (seed * 9301 + 49297) % 233280) / 233280; }

  // cada camada da cidade é desenhada uma única vez numa imagem; por quadro só desliza
  const LW = W * 2 + 80, LS = 2;   // largura da faixa e escala da imagem
  function makeLayer(seed, minH, maxH, minW, maxW, col, light) {
    const r = seeded(seed);
    const img = document.createElement('canvas');
    img.width = LW * LS; img.height = (maxH + 10) * LS;
    const g = img.getContext('2d');
    g.scale(LS, LS);
    const base = maxH + 10;
    let x = 0;
    while (x < LW) {
      const w = minW + r() * (maxW - minW), h = minH + r() * (maxH - minH);
      g.fillStyle = col; g.fillRect(x, base - h, w, h);
      const cols = Math.floor(w / 5), rows = Math.floor(h / 7);
      for (let rr = 1; rr < rows; rr++) for (let k = 0; k < cols; k++) {
        const v = r();
        if (v > 0.45) continue;
        g.globalAlpha = light * (v < 0.06 ? 1 : 0.6);
        g.fillStyle = v < 0.05 ? '#7fd8ff' : '#ffcf8a';
        g.fillRect(x + 2 + k * 5, base - h + rr * 7, 2, 3);
      }
      g.globalAlpha = 1;
      if (r() < 0.22) {
        const sc = ['#ff4fd8', '#38f6ff', '#ffd23f', '#7dff6b'][Math.floor(r() * 4)];
        g.globalAlpha = 0.25; g.fillStyle = sc; g.fillRect(x + w * 0.4 - 3, base - h + 7, 10, 32);
        g.globalAlpha = 0.9; g.fillRect(x + w * 0.4, base - h + 10, 4, 26);
        g.globalAlpha = 1;
      }
      x += w + 2 + r() * 10;
    }
    return { img, h: base };
  }
  const city = [
    makeLayer(11, 90, 190, 26, 60, '#140a2a', 0.25),
    makeLayer(23, 60, 160, 30, 70, '#1c0f36', 0.5),
    makeLayer(37, 40, 130, 36, 90, '#241443', 0.9),
  ];
  const rainDrops = Array.from({ length: 160 }, () => [Math.random() * W, Math.random() * H, 6 + Math.random() * 6]);

  function drawLayer(L, offset, baseY, dim = 1) {
    const x0 = -(((offset % LW) + LW) % LW);
    c.globalAlpha = dim;
    for (const x of [x0, x0 + LW]) if (x < W && x + LW > 0) c.drawImage(L.img, x, baseY - L.h, LW, L.h);
    c.globalAlpha = 1;
  }

  function sky(top = '#1a0630', mid = '#3a0f45') {
    const g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, top); g.addColorStop(0.6, mid); g.addColorStop(1, '#0a0418');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    const h = c.createRadialGradient(W / 2, H * 0.85, 10, W / 2, H * 0.85, W * 0.7);
    h.addColorStop(0, 'rgba(255,79,216,0.25)'); h.addColorStop(1, 'rgba(255,79,216,0)');
    c.fillStyle = h; c.fillRect(0, 0, W, H);
  }

  function rain(t, alpha = 0.35, speed = 1) {
    c.strokeStyle = `rgba(160,190,255,${alpha})`; c.lineWidth = 1;
    c.beginPath();
    for (const d of rainDrops) {
      const y = (d[1] + t * 420 * speed) % (H + 20) - 10, x = (d[0] - t * 60 * speed) % W;
      const xx = x < 0 ? x + W : x;
      c.moveTo(xx, y); c.lineTo(xx - 2, y + d[2]);
    }
    c.stroke();
  }

  function flash(t, at) {
    const k = Math.max(0, 1 - Math.abs(t - at) * 6);
    if (k > 0) { c.fillStyle = `rgba(200,210,255,${k * 0.35})`; c.fillRect(0, 0, W, H); if (Math.abs(t - at) < 0.03) Sound.thunder(); }
  }

  function cars(t) {
    for (let k = 0; k < 5; k++) {
      const x = ((t * (40 + k * 18) + k * 170) % (W + 120)) - 60, y = 70 + k * 28;
      const col = k % 2 ? '#ff3355' : '#ffffff';
      const g = c.createLinearGradient(x - 40, 0, x, 0);
      g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, col);
      c.fillStyle = g; c.fillRect(x - 40, y, 40, 1.5);
      c.fillStyle = col; c.fillRect(x, y - 1, 4, 3);
    }
  }

  // ---------- cenas ----------
  const sceneCity = label => function (t, p) {
    sky();
    drawLayer(city[0], t * 6, H * 0.78, 1);
    cars(t);
    drawLayer(city[1], t * 14 + 200, H * 0.88, 1);
    drawLayer(city[2], t * 28 + 500, H + 10, 1);
    const fog = c.createLinearGradient(0, H * 0.6, 0, H);
    fog.addColorStop(0, 'rgba(60,20,80,0)'); fog.addColorStop(1, 'rgba(60,20,80,0.55)');
    c.fillStyle = fog; c.fillRect(0, 0, W, H);
    rain(t);
    flash(t, 2.6);
    title(t, label, 0.4);
  };

  const sceneTower = (sign, glowCol, onCol) => function (t, p) {
    sky('#12041f', '#2a0a38');
    drawLayer(city[0], 100, H * 0.9, 0.6);
    const cam = lerp(170, 0, ease(p * 1.2));
    c.save(); c.translate(0, cam);
    const cx = W / 2;
    // feixes de holofote
    for (const s of [-1, 1]) {
      const a = Math.sin(t * 0.8 + s) * 0.35 + s * 0.25;
      c.save(); c.translate(cx, 30); c.rotate(a);
      const g = c.createLinearGradient(0, 0, 0, -300);
      g.addColorStop(0, 'rgba(180,200,255,0.18)'); g.addColorStop(1, 'rgba(180,200,255,0)');
      c.fillStyle = g; c.beginPath(); c.moveTo(-3, 0); c.lineTo(3, 0); c.lineTo(40, -300); c.lineTo(-40, -300); c.fill();
      c.restore();
    }
    // torre com recuos
    const tiers = [[150, 120, H + 200], [120, 60, 120], [90, 30, 60]];
    for (const [w, top, bottom] of tiers) {
      const g = c.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0);
      g.addColorStop(0, '#2a1440'); g.addColorStop(0.5, '#1a0c2c'); g.addColorStop(1, '#0e0618');
      c.fillStyle = g; c.fillRect(cx - w / 2, top, w, bottom - top);
      c.fillStyle = '#38f6ff'; c.globalAlpha = 0.7;
      c.fillRect(cx - w / 2, top, 1.5, bottom - top); c.fillRect(cx + w / 2 - 1.5, top, 1.5, bottom - top);
      c.globalAlpha = 1;
    }
    const r = seeded(5);
    for (let y = 70; y < H + 200; y += 9) for (let x = cx - 70; x < cx + 70; x += 8) {
      const v = r();
      if (y < 120 && Math.abs(x - cx) > 55) continue;
      if (v < 0.3) { c.fillStyle = v < 0.04 ? '#7fd8ff' : '#ffcf8a'; c.globalAlpha = 0.7; c.fillRect(x, y, 3, 4); }
    }
    c.globalAlpha = 1;
    // letreiro
    const on = !(t > 3.1 && t < 3.25) && !(t > 3.4 && t < 3.45);
    c.font = '700 26px "Chakra Petch", sans-serif'; c.textAlign = 'center';
    c.save();
    if (on) { c.shadowColor = glowCol; c.shadowBlur = 18; c.fillStyle = onCol; } else c.fillStyle = '#2a1a40';
    c.fillText(sign, cx, 22);
    c.restore();
    c.restore();
    rain(t, 0.4);
    flash(t, 4.4);
  };

  function sceneSuite(t, p) {
    c.save();
    const z = 1 + ease(p) * 0.14;
    c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2);
    c.fillStyle = '#07040f'; c.fillRect(0, 0, W, H);
    // janela panorâmica
    const wx = 40, wy = 20, ww = W - 80, wh = 230;
    const g = c.createLinearGradient(0, wy, 0, wy + wh);
    g.addColorStop(0, '#1a0a30'); g.addColorStop(1, '#3a1040');
    c.fillStyle = g; c.fillRect(wx, wy, ww, wh);
    c.save(); c.beginPath(); c.rect(wx, wy, ww, wh); c.clip();
    drawLayer(city[1], 300, wy + wh + 20, 0.8);
    // bokeh
    const r = seeded(9);
    for (let k = 0; k < 40; k++) {
      const x = wx + r() * ww, y = wy + r() * wh, rad = 3 + r() * 8;
      c.fillStyle = ['rgba(255,79,216,0.18)', 'rgba(56,246,255,0.15)', 'rgba(255,200,120,0.15)'][k % 3];
      c.beginPath(); c.arc(x, y, rad, 0, Math.PI * 2); c.fill();
    }
    rain(t, 0.3, 0.4);
    c.restore();
    c.fillStyle = '#05030a';
    for (let k = 0; k <= 4; k++) c.fillRect(wx + k * ww / 4 - 2, wy, 4, wh);
    c.fillRect(wx, wy + 150, ww, 3);
    // chão
    const f = c.createLinearGradient(0, wy + wh, 0, H);
    f.addColorStop(0, '#140a22'); f.addColorStop(1, '#05030a');
    c.fillStyle = f; c.fillRect(0, wy + wh, W, H - wy - wh);
    // mesa holográfica e cone de luz
    const hx = 470, hy = 280;
    c.fillStyle = '#0c1a24'; c.fillRect(hx - 30, hy, 60, 30);
    const cone = c.createLinearGradient(0, hy, 0, hy - 110);
    cone.addColorStop(0, 'rgba(56,246,255,0.35)'); cone.addColorStop(1, 'rgba(56,246,255,0)');
    c.fillStyle = cone; c.beginPath(); c.moveTo(hx - 25, hy); c.lineTo(hx + 25, hy); c.lineTo(hx + 50, hy - 110); c.lineTo(hx - 50, hy - 110); c.fill();
    if (Math.floor(t * 2) % 2) {
      c.save(); c.font = '700 30px "Chakra Petch", sans-serif'; c.textAlign = 'center';
      c.shadowColor = '#ff3355'; c.shadowBlur = 16; c.fillStyle = '#ff5a75';
      c.fillText('23:15', hx, hy - 50); c.restore();
    }
    // silhueta: Arthur caído no chão
    const sx = 250, sy = 300;
    c.fillStyle = 'rgba(90,6,18,0.7)';
    c.beginPath(); c.ellipse(sx - 95, sy + 4, 38, 9, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#020104';
    c.beginPath(); c.ellipse(sx - 85, sy - 8, 17, 15, 0, 0, Math.PI * 2); c.fill();       // cabeça
    c.beginPath(); c.roundRect(sx - 70, sy - 22, 85, 30, 10); c.fill();                    // tronco
    c.beginPath(); c.roundRect(sx + 10, sy - 14, 85, 20, 7); c.fill();                     // pernas
    c.fillRect(sx + 88, sy - 26, 12, 32);                                                   // sapatos
    c.beginPath(); c.moveTo(sx - 40, sy - 18); c.lineTo(sx - 25, sy - 62); c.lineTo(sx - 14, sy - 58); c.lineTo(sx - 26, sy - 16); c.fill(); // braço esticado
    c.strokeStyle = 'rgba(255,79,216,0.5)'; c.lineWidth = 1.5;
    c.beginPath(); c.ellipse(sx - 85, sy - 8, 17, 15, 0, Math.PI * 1.05, Math.PI * 1.9); c.stroke();
    c.beginPath(); c.moveTo(sx - 70, sy - 22); c.lineTo(sx + 95, sy - 14); c.stroke();
    if (Math.random() < 0.5) {
      c.fillStyle = '#9ff8ff';
      for (let k = 0; k < 4; k++) c.fillRect(sx - 100 + Math.random() * 10, sy - 14 + Math.random() * 10, 2, 2);
    }
    // taça no chão
    c.fillStyle = 'rgba(125,255,107,0.5)'; c.beginPath(); c.ellipse(sx + 90, sy + 22, 14, 4, 0, 0, Math.PI * 2); c.fill();
    c.restore();
  }

  const sceneSuspects = who => function (t, p) {
    c.fillStyle = '#06030e'; c.fillRect(0, 0, W, H);
    for (let k = 0; k < 6; k++) { c.fillStyle = 'rgba(176,76,255,0.05)'; c.fillRect(k * 120 + Math.sin(t + k) * 10, 0, 30, H); }
    who.forEach(([look, name, role], i) => {
      const k = ease((t - 0.5 - i * 1.1) / 0.8);
      if (k <= 0) return;
      const gap = W / who.length, x = gap / 2 + i * gap, s = who.length > 4 ? 4.6 : 5.4;
      const L = LOOKS[look];
      c.save();
      c.globalAlpha = k;
      const glow = c.createRadialGradient(x, 130, 10, x, 130, 100);
      glow.addColorStop(0, rgba(L.implant, 0.35)); glow.addColorStop(1, rgba(L.implant, 0));
      c.fillStyle = glow; c.fillRect(x - 110, 40, 220, 220);
      c.imageSmoothingEnabled = false;
      c.filter = 'brightness(0.7) contrast(1.1)';
      c.drawImage(getSprite(look, 'stand'), 0, 2, SPR_W, 30, x - SPR_W * s / 2, 48 + (1 - k) * 30, SPR_W * s, 30 * s);
      c.filter = 'none';
      c.textAlign = 'center';
      c.font = '700 13px "Chakra Petch", sans-serif'; c.fillStyle = L.implant === '#ffffff' ? '#fff' : L.implant;
      c.fillText(T(name).toUpperCase(), x, 236);
      c.font = '400 12px Inter, sans-serif'; c.fillStyle = '#a9a3c8';
      c.fillText(T(role), x, 252);
      c.restore();
    });
  };

  const sceneVance = (l1, l2) => function (t, p) {
    c.fillStyle = '#05030a'; c.fillRect(0, 0, W, H);
    const cx = W / 2;
    // luz de dentro do elevador
    const back = c.createRadialGradient(cx, 170, 10, cx, 170, 240);
    back.addColorStop(0, 'rgba(160,240,255,0.55)'); back.addColorStop(0.5, 'rgba(56,120,200,0.2)'); back.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = back; c.fillRect(cx - 160, 0, 320, H);
    // Vance
    const s = 6, spr = getSprite(I18N.gender === 'f' ? 'vance_f' : 'vance', 'stand');
    c.save(); c.imageSmoothingEnabled = false;
    c.filter = `brightness(${0.5 + ease((t - 1.5) / 2) * 0.5})`;
    c.drawImage(spr, cx - SPR_W * s / 2, 40, SPR_W * s, SPR_H * s);
    c.restore(); c.filter = 'none';
    // portas abrindo
    const open = ease((t - 0.6) / 1.8) * 130;
    const door = c.createLinearGradient(0, 0, 0, H);
    door.addColorStop(0, '#3a4258'); door.addColorStop(1, '#1a1e2a');
    c.fillStyle = door;
    c.fillRect(cx - 130 - open, 0, 130, H); c.fillRect(cx + open, 0, 130, H);
    c.fillStyle = 'rgba(255,255,255,0.08)'; c.fillRect(cx - 2 - open, 0, 2, H); c.fillRect(cx + open, 0, 2, H);
    c.fillStyle = '#05030a'; c.fillRect(0, 0, cx - 130, H); c.fillRect(cx + 130, 0, cx - 130, H);
    c.fillStyle = '#7dff6b'; c.fillRect(cx - 10, 8, 20, 4);
    // título
    const k = ease((t - 4.2) / 1.2);
    if (k > 0) {
      c.save(); c.globalAlpha = k; c.textAlign = 'center';
      c.fillStyle = 'rgba(5,3,12,0.6)'; c.fillRect(0, 120, W, 100);
      c.font = '700 22px "Chakra Petch", sans-serif'; c.fillStyle = '#f0eaff'; c.shadowColor = '#b04cff'; c.shadowBlur = 14;
      c.fillText(T(l1), cx, 160);
      c.font = '700 40px "Chakra Petch", sans-serif'; c.fillStyle = '#ff7ae2'; c.shadowColor = '#ff4fd8'; c.shadowBlur = 22;
      c.fillText(T(l2), cx, 202);
      c.restore();
    }
  };

  // caso 2: o laboratório blindado, Kaelen caído no chão e o manifesto em loop no monitor
  function sceneLab(t, p) {
    c.save();
    const z = 1 + ease(p) * 0.14;
    c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2);
    c.fillStyle = '#05070c'; c.fillRect(0, 0, W, H);
    // parede de servidores com LEDs
    const r = seeded(31);
    for (let x = 20; x < W - 20; x += 46) {
      c.fillStyle = '#0c1018'; c.fillRect(x, 30, 40, 200);
      for (let y = 40; y < 220; y += 8) if (r() < 0.5) { c.fillStyle = ['#38f6ff', '#7dff6b', '#ff3355'][Math.floor(r() * 3)]; c.globalAlpha = 0.35 + 0.4 * Math.abs(Math.sin(t * 3 + x + y)); c.fillRect(x + 4 + r() * 30, y, 2, 2); }
      c.globalAlpha = 1;
    }
    // monitor principal com o manifesto
    const mx = 250, my = 70, mw = 150, mh = 90;
    c.fillStyle = '#020306'; c.fillRect(mx - 6, my - 6, mw + 12, mh + 12);
    const glitch = Math.random() < 0.12;
    c.fillStyle = glitch ? '#2a0610' : '#04140a'; c.fillRect(mx, my, mw, mh);
    c.save(); c.font = '700 11px "Chakra Petch", sans-serif'; c.textAlign = 'center';
    c.shadowColor = glitch ? '#ff3355' : '#7dff6b'; c.shadowBlur = 10; c.fillStyle = glitch ? '#ff5a75' : '#9dff8a';
    ['NÓS SOMOS OS', 'DESCONECTADOS', '22:31:00'].forEach((ln, i) => c.fillText(T(ln), mx + mw / 2 + (glitch ? (Math.random() - 0.5) * 6 : 0), my + 28 + i * 20));
    c.restore();
    const cone = c.createLinearGradient(0, my + mh, 0, H);
    cone.addColorStop(0, 'rgba(125,255,107,0.12)'); cone.addColorStop(1, 'rgba(125,255,107,0)');
    c.fillStyle = cone; c.beginPath(); c.moveTo(mx, my + mh); c.lineTo(mx + mw, my + mh); c.lineTo(mx + mw + 90, H); c.lineTo(mx - 90, H); c.fill();
    // porta blindada com a trava quântica vermelha
    c.fillStyle = '#10141e'; c.fillRect(500, 60, 90, 170);
    c.strokeStyle = '#38f6ff'; c.globalAlpha = 0.5; c.strokeRect(500, 60, 90, 170); c.globalAlpha = 1;
    c.fillStyle = Math.floor(t * 2) % 2 ? '#ff3355' : '#7a1020'; c.fillRect(540, 140, 10, 10);
    // chão
    const f = c.createLinearGradient(0, 230, 0, H);
    f.addColorStop(0, '#0e1220'); f.addColorStop(1, '#030407');
    c.fillStyle = f; c.fillRect(0, 230, W, H - 230);
    // cadeira de interface vazia, com o cabo caindo até o chão
    c.fillStyle = '#1a1e2a'; c.fillRect(380, 190, 50, 60); c.fillRect(372, 245, 66, 12); c.fillRect(400, 257, 8, 30);
    c.strokeStyle = '#38f6ff'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(405, 195); c.quadraticCurveTo(360, 230, 300, 302); c.stroke();
    // Kaelen caído no chão
    const sx = 230, sy = 305;
    c.fillStyle = '#020104';
    c.beginPath(); c.ellipse(sx + 70, sy - 6, 15, 13, 0, 0, Math.PI * 2); c.fill();       // cabeça
    c.beginPath(); c.roundRect(sx - 20, sy - 18, 82, 26, 9); c.fill();                     // tronco
    c.beginPath(); c.roundRect(sx - 100, sy - 12, 84, 18, 7); c.fill();                    // pernas
    c.fillRect(sx - 110, sy - 22, 12, 28);                                                  // sapatos
    c.beginPath(); c.moveTo(sx + 20, sy - 14); c.lineTo(sx + 2, sy - 52); c.lineTo(sx - 9, sy - 48); c.lineTo(sx + 8, sy - 12); c.fill(); // braço esticado
    c.strokeStyle = 'rgba(56,246,255,0.45)'; c.lineWidth = 1.5;
    c.beginPath(); c.ellipse(sx + 70, sy - 6, 15, 13, 0, Math.PI * 1.05, Math.PI * 1.9); c.stroke();
    c.beginPath(); c.moveTo(sx - 100, sy - 12); c.lineTo(sx + 62, sy - 18); c.stroke();
    // faíscas na porta neural queimada
    if (Math.random() < 0.6) { c.fillStyle = '#9ff8ff'; for (let k = 0; k < 5; k++) c.fillRect(sx + 80 + Math.random() * 10, sy - 14 + Math.random() * 10, 2, 2); }
    const g = c.createRadialGradient(sx + 84, sy - 8, 2, sx + 84, sy - 8, 40);
    g.addColorStop(0, 'rgba(255,51,85,0.35)'); g.addColorStop(1, 'rgba(255,51,85,0)');
    c.fillStyle = g; c.fillRect(sx + 40, sy - 50, 90, 90);
    c.restore();
  }

  function title(t, text, at) {
    const k = ease((t - at) / 0.8) * (1 - ease((t - at - 3.5) / 0.8));
    if (k <= 0) return;
    c.save(); c.globalAlpha = k; c.textAlign = 'left';
    c.font = '700 13px "Chakra Petch", sans-serif'; c.fillStyle = '#38f6ff'; c.shadowColor = '#38f6ff'; c.shadowBlur = 8;
    c.fillText(text, 36, 66); c.restore();
  }

  const SETS = {};
  SETS.alvorada = [
    { dur: 7, draw: sceneCity('SECTOR 4 · 2085'), text: 'Sector 4, 2085. Uma tempestade de dados isolou a zona alta da megacidade. Nada voa. Só os carros flutuantes ainda rasgam as ruas, a dois metros do chão.' },
    { dur: 7, draw: sceneTower('ALVORADA', '#ff4fd8', '#ff9aea'), text: 'No topo da cidade, o Hotel Grand Alvorada: luxo decadente, implantes obsoletos e segredos demais para um só prédio.' },
    { dur: 7.5, draw: sceneSuite, text: 'Meia-noite. Suíte 404. Arthur Pendelton, magnata da biotecnologia, jaz morto no chão da suíte. A porta estava trancada por dentro.' },
    { dur: 6.5, draw: sceneSuspects([['evelyn', 'Evelyn Pendelton', 'A esposa'], ['victor', 'Victor Rossi', 'O gerente'], ['helena', 'Dra. Helena Souza', 'A pesquisadora'], ['tomas', 'Tomás Bruno', 'O camareiro']]), text: 'Quatro pessoas tinham motivos. Nenhuma tinha como entrar.' },
    { dur: 7.5, draw: sceneVance('O SILÊNCIO DO', 'HOTEL ALVORADA'), text: 'Detetive Vance. Ex-investigador corporativo. Agora trabalha sozinho, e a verdade é a única coisa que ainda o interessa.' },
  ];
  SETS.eco = [
    { dur: 7, draw: sceneCity('NEO-SAMPA · 2085'), text: 'Neo-Sampa, 2085. O que um dia foi São Paulo virou uma colcha de retalhos de 300 andares: picos de vidro lá em cima, subníveis de lama lá embaixo. E a chuva ácida não para.' },
    { dur: 7, draw: sceneTower('SYNAPSE', '#38f6ff', '#9ff8ff'), text: 'No 220º andar da Neo-Sampa Tower, a Synapse Corp vende a única coisa que ninguém deveria poder comprar: a eternidade.' },
    { dur: 7.5, draw: sceneLab, text: 'Kaelen Voss, engenheiro de segurança neural, está morto no chão de um laboratório blindado. A consciência, apagada. Nenhum sinal entrou. Nenhum sinal saiu.' },
    { dur: 7.5, draw: sceneSuspects([['lyra', 'Lyra Vance', 'A executiva'], ['maya', 'Dra. Maya Lin', 'A neurocirurgiã'], ['zero', 'Zero', 'O hacker'], ['dante', 'Dante Rossi', 'O corretor'], ['rig7', 'RIG-7', 'O robô']]), text: 'Cinco suspeitos. Uma executiva, uma médica, um hacker, um corretor... e um robô de limpeza.' },
    { dur: 7.5, draw: sceneVance('O ECO DOS', 'DADOS MORTOS'), text: 'Um dia depois do caso Alvorada, o telefone toca de novo. O Detetive Vance pega o aerotrem para o alto da cidade.' },
  ];
  let SCENES = SETS.alvorada, setId = 'alvorada';

  function frame(now) {
    if (!running) return;
    const rect = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    const cw = Math.round(rect.width * dpr), ch = Math.round(rect.height * dpr);
    if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; }
    const sc = Math.max(cw / W, ch / H);
    c.setTransform(sc, 0, 0, sc, (cw - W * sc) / 2, (ch - H * sc) / 2);
    c.fillStyle = '#000'; c.fillRect(-W, -H, W * 3, H * 3);
    const s = SCENES[idx], t = (now - sceneStart) / 1000;
    // cena realista opcional: img/intro/<n>.jpg, com zoom lento
    const ph = photo(setId === 'alvorada' ? `img/intro/${idx + 1}.jpg` : `img/intro/${setId}_${idx + 1}.jpg`);
    if (ph) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.imageSmoothingEnabled = true; drawCover(c, ph, cv.width, cv.height, 1 + 0.08 * Math.min(1, t / s.dur)); c.restore(); }
    else s.draw(t, Math.min(1, t / s.dur));
    // transição pelo preto
    const fade = Math.max(1 - t / 0.7, 1 - (s.dur - t) / 0.7, 0);
    if (fade > 0) { c.fillStyle = `rgba(0,0,0,${Math.min(1, fade)})`; c.fillRect(-W, -H, W * 3, H * 3); }
    // vinheta
    const v = c.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, W * 0.7);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.6)');
    c.fillStyle = v; c.fillRect(0, 0, W, H);
    // legenda digitada
    const chars = Math.floor(Math.max(0, t - 0.6) * 38);
    $('intro-caption').textContent = T(s.text).slice(0, chars);
    if (t >= s.dur) next();
    raf = requestAnimationFrame(frame);
  }

  function next() {
    idx++;
    if (idx >= SCENES.length) return finish();
    sceneStart = performance.now();
  }

  function finish() {
    running = false;
    cancelAnimationFrame(raf);
    hide('intro');
    const d = done; done = null;
    if (d) d();
  }

  function play(onDone, startIdx = 0, offset = 0, set = 'alvorada') {
    setId = SETS[set] ? set : 'alvorada'; SCENES = SETS[setId];
    cv = $('intro-canvas'); c = cv.getContext('2d');
    done = onDone; idx = startIdx; running = true;
    sceneStart = performance.now() - offset * 1000;
    show('intro');
    Sound.setMusic('intro');
    raf = requestAnimationFrame(frame);
  }

  // toque avança a cena; o botão pula tudo
  function bind() {
    $('intro').addEventListener('click', e => { if (e.target.id !== 'intro-skip' && running) next(); });
    $('intro-skip').addEventListener('click', e => { e.stopPropagation(); if (running) finish(); });
  }

  return { play, bind, isRunning: () => running, skip: () => running && finish(), next: () => running && next() };
})();
