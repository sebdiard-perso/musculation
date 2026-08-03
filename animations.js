/* =========================================================================
   ANIMATIONS — figures anatomiques articulées
   -------------------------------------------------------------------------
   Chaque exercice est décrit par 2 (ou 3) POSES.
   Une pose = les positions ECRAN des articulations : hip, sh, hd, el, wr,
   kn, an, toe (+ variantes "F" pour les membres du côté opposé).
   Le moteur :
     - déduit la direction de chaque os (atan2 entre parent et enfant)
     - impose une longueur d'os constante (le squelette reste cohérent)
     - émet des groupes SVG animés translate(origine) + rotate(angle)
   Repère local d'un os : +x = vers l'articulation enfant, +y = face ventrale.
   ========================================================================= */

const ANIMATIONS = {

  _c: {
    skin: '#f2c9a0', skinSh: '#d9a87e', skinFar: '#c08f68',
    shirt: '#4d7cc7', shirtFar: '#2f4f85', shirtSh: '#3a63a6',
    short: '#2c3550', shortFar: '#1e2438',
    shoe: '#1f2536', hair: '#40301f',
    line: '#141824',
    metal: '#9aa3ba', metalDark: '#5a6178',
    hot: '#4ecca3',
    gear: '#333a4f',
    bench: '#39415a', benchTop: '#4a5470',
    floor: '#2b3247',
  },

  // longueurs d'os (px)
  L: { torso: 34, head: 14, arm: 24, fore: 22, thigh: 30, shin: 29, foot: 13 },

  // ---------------------------------------------------------------- outils
  _r(v) { return Math.round(v * 10) / 10; },

  _ang(a, b) { return Math.atan2(-(b[1] - a[1]), b[0] - a[0]) * 180 / Math.PI; },

  _step(o, deg, len) {
    const r = deg * Math.PI / 180;
    return [o[0] + len * Math.cos(r), o[1] - len * Math.sin(r)];
  },

  // cinématique directe : positions imposées par les longueurs d'os
  _solve(p) {
    const L = this.L, A = this._ang.bind(this), S = this._step.bind(this);
    const g = (k, fb) => p[k] || fb;

    const hip = p.hip;
    const aTorso = A(hip, p.sh);
    const sh = S(hip, aTorso, L.torso);
    const aNeck = A(p.sh, g('hd', [p.sh[0], p.sh[1] - 14]));
    const hd = S(sh, aNeck, L.head);

    const aArm = A(p.sh, p.el);
    const el = S(sh, aArm, L.arm);
    const aFore = A(p.el, p.wr);
    const wr = S(el, aFore, L.fore);

    const elFa = g('elF', p.el), wrFa = g('wrF', p.wr);
    const aArmF = A(p.sh, elFa);
    const elF = S(sh, aArmF, L.arm);
    const aForeF = A(elFa, wrFa);
    const wrF = S(elF, aForeF, L.fore);

    const aThigh = A(hip, p.kn);
    const kn = S(hip, aThigh, L.thigh);
    const aShin = A(p.kn, p.an);
    const an = S(kn, aShin, L.shin);
    const toeA = g('toe', [p.an[0] + 13, p.an[1]]);
    const aFoot = A(p.an, toeA);
    const toe = S(an, aFoot, L.foot);

    const knFa = g('knF', p.kn), anFa = g('anF', p.an), toeFa = g('toeF', toeA);
    const aThighF = A(hip, knFa);
    const knF = S(hip, aThighF, L.thigh);
    const aShinF = A(knFa, anFa);
    const anF = S(knF, aShinF, L.shin);
    const aFootF = A(anFa, toeFa);
    const toeF = S(anF, aFootF, L.foot);

    return {
      pos: { hip, sh, hd, el, wr, elF, wrF, kn, an, toe, knF, anF, toeF },
      ang: {
        torso: aTorso, neck: aNeck, arm: aArm, fore: aFore, armF: aArmF,
        foreF: aForeF, thigh: aThigh, shin: aShin, foot: aFoot,
        thighF: aThighF, shinF: aShinF, footF: aFootF,
      },
    };
  },

  // évite les tours complets lors de l'interpolation SMIL
  _unwrap(list) {
    const out = [list[0]];
    for (let i = 1; i < list.length; i++) {
      let v = list[i];
      while (v - out[i - 1] > 180) v -= 360;
      while (v - out[i - 1] < -180) v += 360;
      out.push(v);
    }
    return out;
  },

  _splines(n) { return Array(n).fill('0.42 0 0.58 1').join(';'); },

  // os animé : <g translate><g rotate>…contenu local…</g></g>
  _bone(frames, posKey, angKey, dur, content) {
    const tr = frames.map(f => `${this._r(f.pos[posKey][0])},${this._r(f.pos[posKey][1])}`).join(';');
    const rt = this._unwrap(frames.map(f => -f.ang[angKey])).map(v => this._r(v)).join(';');
    const n = frames.length - 1;
    const sp = this._splines(n);
    const kt = frames.map((_, i) => this._r(i / n)).join(';');
    return `<g><animateTransform attributeName="transform" type="translate" values="${tr}" keyTimes="${kt}" calcMode="spline" keySplines="${sp}" dur="${dur}s" repeatCount="indefinite" additive="sum"/>` +
      `<g><animateTransform attributeName="transform" type="rotate" values="${rt}" keyTimes="${kt}" calcMode="spline" keySplines="${sp}" dur="${dur}s" repeatCount="indefinite" additive="sum"/>` +
      content + `</g></g>`;
  },

  // point fixe animé (sans rotation) : suit une articulation
  _track(frames, posKey, dur, content) {
    const tr = frames.map(f => `${this._r(f.pos[posKey][0])},${this._r(f.pos[posKey][1])}`).join(';');
    const n = frames.length - 1;
    const kt = frames.map((_, i) => this._r(i / n)).join(';');
    return `<g><animateTransform attributeName="transform" type="translate" values="${tr}" keyTimes="${kt}" calcMode="spline" keySplines="${this._splines(n)}" dur="${dur}s" repeatCount="indefinite" additive="sum"/>${content}</g>`;
  },

  // ------------------------------------------------------------ morphologie
  // membre : trait épais à bouts ronds (contour + chair), léger galbe
  _seg(len, w0, w1, far) {
    const c = this._c;
    const fill = far ? c.skinFar : c.skin;
    const mid = len * 0.52;
    return `<path d="M0,0 L${this._r(mid)},0" stroke="${c.line}" stroke-width="${w0 + 2.6}" stroke-linecap="round" fill="none"/>` +
      `<path d="M${this._r(len * 0.46)},0 L${this._r(len)},0" stroke="${c.line}" stroke-width="${w1 + 2.6}" stroke-linecap="round" fill="none"/>` +
      `<path d="M0,0 L${this._r(mid)},0" stroke="${fill}" stroke-width="${w0}" stroke-linecap="round" fill="none"/>` +
      `<path d="M${this._r(len * 0.46)},0 L${this._r(len)},0" stroke="${fill}" stroke-width="${w1}" stroke-linecap="round" fill="none"/>`;
  },

  // segment habillé (manche / cuissard)
  _segDressed(len, w0, w1, far, color, colorFar, cover) {
    const c = this._c;
    return this._seg(len, w0, w1, far) +
      `<path d="M0,0 L${this._r(len * cover)},0" stroke="${c.line}" stroke-width="${w0 + 2.6}" stroke-linecap="round" fill="none"/>` +
      `<path d="M0,0 L${this._r(len * cover)},0" stroke="${far ? colorFar : color}" stroke-width="${w0 + 0.6}" stroke-linecap="round" fill="none"/>`;
  },

  _torso(far) {
    const c = this._c, L = this.L.torso;
    const back = -1, front = 1; // +y = ventral
    const p = (x, y) => `${this._r(x)},${this._r(y)}`;
    // hanche(0) -> taille(0.5L) -> poitrine(L)
    const d = `M${p(1, front * 9.2)} L${p(L * 0.5, front * 7.4)} L${p(L * 0.9, front * 11)} L${p(L, front * 9)}` +
      ` L${p(L, back * 9.4)} L${p(L * 0.9, back * 11.4)} L${p(L * 0.5, back * 8.4)} L${p(1, back * 9.4)} Z`;
    return `<path d="${d}" fill="${far ? c.shirtFar : c.shirt}" stroke="${c.line}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="${d}" fill="${far ? c.shirtFar : c.shirt}" stroke="${far ? c.shirtFar : c.shirt}" stroke-width="2.6" stroke-linejoin="round"/>` +
      // short
      `<path d="M${p(-1, front * 9.6)} L${p(9, front * 9)} L${p(9, back * 9.4)} L${p(-1, back * 9.8)} Z"
         fill="${c.short}" stroke="${c.line}" stroke-width="4.6" stroke-linejoin="round"/>` +
      `<path d="M${p(-1, front * 9.6)} L${p(9, front * 9)} L${p(9, back * 9.4)} L${p(-1, back * 9.8)} Z"
         fill="${c.short}" stroke="${c.short}" stroke-width="2.2" stroke-linejoin="round"/>` +
      // pli de la poitrine / dorsal
      `<path d="M${p(L * 0.82, front * 8.6)} C${p(L * 0.6, front * 4)} ${p(L * 0.5, front * 2)} ${p(L * 0.46, front * 0.5)}"
         fill="none" stroke="${c.shirtSh}" stroke-width="1.6" stroke-linecap="round" opacity="0.85"/>`;
  },

  // tête : +x = axe du cou vers le crâne, +y = face
  _head() {
    const c = this._c, H = this.L.head;
    return `<g transform="translate(${H},0)">` +
      // cou
      `<path d="M${-H + 2},0 L-1,0" stroke="${c.line}" stroke-width="9.4" stroke-linecap="round"/>` +
      `<path d="M${-H + 2},0 L-1,0" stroke="${c.skinSh}" stroke-width="6.8" stroke-linecap="round"/>` +
      // crâne (légèrement ovale, front vers +y)
      `<ellipse cx="0" cy="1" rx="9.4" ry="8.4" fill="${c.skin}" stroke="${c.line}" stroke-width="1.8"/>` +
      // cheveux à l'arrière (-y) et sur le dessus (+x)
      `<path d="M-9.2,-2 A9.4,8.4 0 0 1 4,-7.6 L4,-4.6 A6.6,6 0 0 0 -6.2,-1.2 Z" fill="${c.hair}"/>` +
      `<path d="M2.4,-7.4 A9.4,8.4 0 0 1 6.6,3.2 L3.9,3.2 A6.8,6 0 0 0 1.2,-4.8 Z" fill="${c.hair}"/>` +
      // nez
      `<path d="M-0.6,7.6 L2.6,9.4 L-1.2,9.9" fill="${c.skin}" stroke="${c.line}" stroke-width="1.2" stroke-linejoin="round"/>` +
      // oeil
      `<circle cx="0.6" cy="5.4" r="1.1" fill="${c.line}"/>` +
      `</g>`;
  },

  _hand(far) {
    const c = this._c;
    return `<circle cx="0" cy="0" r="4.2" fill="${far ? c.skinFar : c.skin}" stroke="${c.line}" stroke-width="1.5"/>`;
  },

  // pied : +x = vers les orteils, +y = plante ? non : +y = face ventrale (dessus du pied)
  _foot(far) {
    const c = this._c, F = this.L.foot;
    return `<path d="M0,-1 L${F - 1},-2.6 A3,3 0 0 1 ${F + 1},0.6 L${F},4 L-1.5,4.4 A4,4 0 0 1 -2,-0.6 Z"
      fill="${c.shoe}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round" opacity="${far ? 0.75 : 1}"/>`;
  },

  // --------------------------------------------------------------- matériel
  _dumbbell(far) {
    const c = this._c;
    const m = far ? c.metalDark : c.metal;
    return `<g>` +
      `<rect x="-2.2" y="-11" width="4.4" height="22" rx="1.6" fill="${m}" stroke="${c.line}" stroke-width="1.3"/>` +
      `<rect x="-5.4" y="-16" width="10.8" height="7" rx="2.4" fill="${m}" stroke="${c.line}" stroke-width="1.5"/>` +
      `<rect x="-5.4" y="9" width="10.8" height="7" rx="2.4" fill="${m}" stroke="${c.line}" stroke-width="1.5"/>` +
      `</g>`;
  },

  // en vue de profil, une barre se lit comme un disque
  _plate(r = 13) {
    const c = this._c;
    return `<g>` +
      `<circle cx="0" cy="0" r="${r}" fill="${c.gear}" stroke="${c.line}" stroke-width="2"/>` +
      `<circle cx="0" cy="0" r="${r * 0.62}" fill="none" stroke="${c.metalDark}" stroke-width="1.6"/>` +
      `<circle cx="0" cy="0" r="3.4" fill="${c.metal}" stroke="${c.line}" stroke-width="1.2"/>` +
      `</g>`;
  },

  _kettle() {
    const c = this._c;
    return `<g><path d="M-6,-8 A6,7 0 0 1 6,-8" fill="none" stroke="${c.metalDark}" stroke-width="3"/>` +
      `<path d="M0,-4 A9,9 0 1 0 0.01,-4 Z" fill="${c.gear}" stroke="${c.line}" stroke-width="1.6"/></g>`;
  },

  // ------------------------------------------------------------------ décor
  _floorProp(y = 138) {
    const c = this._c;
    return `<rect x="0" y="${y}" width="180" height="4" rx="2" fill="${c.floor}"/>`;
  },

  _benchProp(x, y, w, h = 9) {
    const c = this._c;
    const legs = `<rect x="${x + 5}" y="${y + h}" width="6" height="${142 - y - h}" fill="${c.bench}"/>` +
      `<rect x="${x + w - 11}" y="${y + h}" width="6" height="${142 - y - h}" fill="${c.bench}"/>`;
    return legs + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3.5" fill="${c.benchTop}" stroke="${c.line}" stroke-width="1.6"/>`;
  },

  _inclineProp(x1, y1, x2, y2, w) {
    const c = this._c;
    return `<path d="M${x1},${y1} L${x2},${y2}" stroke="${c.benchTop}" stroke-width="${w}" stroke-linecap="round"/>` +
      `<path d="M${x1},${y1} L${x2},${y2}" stroke="${c.line}" stroke-width="${w + 2}" stroke-linecap="round" opacity="0.35"/>`;
  },

  _boxProp(x, y, w, h) {
    const c = this._c;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2.5" fill="${c.bench}" stroke="${c.line}" stroke-width="1.6"/>`;
  },

  _backrestProp(x, y, x2, y2) {
    const c = this._c;
    return `<path d="M${x},${y} L${x2},${y2}" stroke="${c.benchTop}" stroke-width="10" stroke-linecap="round"/>`;
  },

  _props(list) {
    if (!list) return '';
    return list.map(p => {
      const [t, ...a] = p;
      if (t === 'floor') return this._floorProp(a[0]);
      if (t === 'bench') return this._benchProp(a[0], a[1], a[2], a[3]);
      if (t === 'incline') return this._inclineProp(a[0], a[1], a[2], a[3], a[4]);
      if (t === 'box') return this._boxProp(a[0], a[1], a[2], a[3]);
      if (t === 'back') return this._backrestProp(a[0], a[1], a[2], a[3]);
      return '';
    }).join('');
  },

  // --------------------------------------------------------------- highlight
  _glow(frames, posKey, dur, rx, ry) {
    const c = this._c;
    return this._track(frames, posKey, dur,
      `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${c.hot}" opacity="0.18">
         <animate attributeName="opacity" values="0.1;0.45;0.1" dur="${dur}s" repeatCount="indefinite"/>
       </ellipse>`);
  },

  _arrow(d, dur) {
    const c = this._c;
    return `<path d="${d}" fill="none" stroke="${c.hot}" stroke-width="2.6" stroke-linecap="round"
      marker-end="url(#anim-arrow)" opacity="0.9">
      <animate attributeName="opacity" values="0.15;0.95;0.15" dur="${dur}s" repeatCount="indefinite"/></path>`;
  },

  // ------------------------------------------------------------------ rendu
  _build(def) {
    const dur = def.dur || 3;
    const c = this._c;
    // cycle aller-retour
    const poses = def.poses;
    const cycle = poses.concat(poses.slice(0, -1).reverse());
    const frames = cycle.map(p => this._solve(p));

    const held = def.hold ? this._gear(def.hold, false) : '';
    const heldF = def.holdF === 'none' ? '' : (def.holdF ? this._gear(def.holdF, true) : (def.hold === 'dumbbell' || def.hold === 'kettle' ? this._gear(def.hold, true) : ''));

    const B = (posKey, angKey, content) => this._bone(frames, posKey, angKey, dur, content);

    // (les os enfants sont posés en absolu, pas en hiérarchie)
    const parts = [];
    parts.push(this._props(def.props));

    // jambe opposée
    parts.push(B('hip', 'thighF', this._segDressed(this.L.thigh, 10.5, 7, true, c.short, c.shortFar, 0.4)));
    parts.push(B('knF', 'shinF', this._seg(this.L.shin, 7, 5, true)));
    parts.push(B('anF', 'footF', this._foot(true)));
    // bras opposé
    parts.push(B('sh', 'armF', this._segDressed(this.L.arm, 8, 6, true, c.shirtFar, c.shirtFar, 0.45)));
    parts.push(B('elF', 'foreF', this._seg(this.L.fore, 6, 4.6, true) +
      `<g transform="translate(${this.L.fore},0)">${this._hand(true)}${heldF}</g>`));

    const nearArm = B('sh', 'arm', this._segDressed(this.L.arm, 8.4, 6.2, false, c.shirt, c.shirt, 0.45)) +
      B('el', 'fore', this._seg(this.L.fore, 6.4, 4.8, false) +
        `<g transform="translate(${this.L.fore},0)">${this._hand(false)}${held}</g>`);

    // buste + tête
    if (def.armBehind) parts.push(nearArm);
    parts.push(B('hip', 'torso', this._torso(false)));
    if (def.onBack) parts.push(B('hip', 'torso', `<g transform="translate(${this.L.torso * 0.88},-11)">${this._gear(def.onBack, false)}</g>`));
    if (def.onFront) parts.push(B('hip', 'torso', `<g transform="translate(${this.L.torso * 0.7},11)">${this._gear(def.onFront, false)}</g>`));
    parts.push(B('sh', 'neck', this._head()));

    // jambe proche
    parts.push(B('hip', 'thigh', this._segDressed(this.L.thigh, 11, 7.4, false, c.short, c.short, 0.42)));
    parts.push(B('kn', 'shin', this._seg(this.L.shin, 7.4, 5.2, false)));
    parts.push(B('an', 'foot', this._foot(false)));
    // bras proche
    if (!def.armBehind) parts.push(nearArm);

    if (def.glow) parts.push(this._glow(frames, def.glow[0], dur, def.glow[1], def.glow[2]));
    if (def.arrow) parts.push(this._arrow(def.arrow, dur));

    const vb = def.vb || '0 0 176 148';
    return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animation de l'exercice">
      <defs><marker id="anim-arrow" markerWidth="7" markerHeight="7" refX="4.5" refY="3.5" orient="auto">
        <path d="M0,0 L7,3.5 L0,7 Z" fill="${c.hot}"/></marker></defs>
      ${parts.join('\n')}
    </svg>`;
  },

  _gear(kind, far) {
    if (kind === 'dumbbell') return this._dumbbell(far);
    if (kind === 'plate') return this._plate(13);
    if (kind === 'plateS') return this._plate(10);
    if (kind === 'kettle') return this._kettle();
    return '';
  },

  // ===================================================================== DÉFS
  E: {

    // ------------------------------------------------------------ PECTORAUX
    'Développé couché barre': {
      dur: 3, hold: 'plate', holdF: 'none',
      props: [['floor', 138], ['bench', 44, 94, 84]],
      glow: ['sh', 12, 8],
      arrow: 'M40,64 L40,40',
      poses: [
        { hip: [100, 86], sh: [66, 86], hd: [52, 86], el: [90, 96], wr: [70, 72], elF: [88, 97], wrF: [70, 74], kn: [126, 104], an: [122, 134], toe: [135, 134] },
        { hip: [100, 86], sh: [66, 86], hd: [52, 86], el: [66, 62], wr: [66, 40], elF: [66, 63], wrF: [66, 41], kn: [126, 104], an: [122, 134], toe: [135, 134] },
      ],
    },

    'Développé couché haltères': {
      dur: 3, hold: 'dumbbell',
      props: [['floor', 138], ['bench', 44, 94, 84]],
      glow: ['sh', 12, 8],
      arrow: 'M40,64 L40,40',
      poses: [
        { hip: [100, 86], sh: [66, 86], hd: [52, 86], el: [92, 98], wr: [72, 74], elF: [86, 99], wrF: [66, 76], kn: [126, 104], an: [122, 134], toe: [135, 134] },
        { hip: [100, 86], sh: [66, 86], hd: [52, 86], el: [66, 62], wr: [68, 40], elF: [66, 63], wrF: [62, 41], kn: [126, 104], an: [122, 134], toe: [135, 134] },
      ],
    },

    'Développé incliné haltères': {
      dur: 3, hold: 'dumbbell',
      props: [['floor', 138], ['bench', 88, 100, 46], ['incline', 96, 100, 58, 66, 11]],
      glow: ['sh', 12, 8],
      arrow: 'M36,58 L36,34',
      poses: [
        { hip: [98, 96], sh: [70, 72], hd: [60, 62], el: [92, 84], wr: [74, 66], elF: [90, 85], wrF: [72, 68], kn: [126, 106], an: [122, 134], toe: [135, 134] },
        { hip: [98, 96], sh: [70, 72], hd: [60, 62], el: [74, 50], wr: [78, 28], elF: [72, 51], wrF: [74, 29], kn: [126, 106], an: [122, 134], toe: [135, 134] },
      ],
    },

    'Écarté couché haltères': {
      dur: 3.2, hold: 'dumbbell',
      props: [['floor', 138], ['bench', 44, 94, 84]],
      glow: ['sh', 13, 8],
      arrow: 'M118,44 Q100,32 82,40',
      poses: [
        { hip: [100, 86], sh: [66, 86], hd: [52, 86], el: [86, 74], wr: [106, 64], elF: [48, 76], wrF: [28, 66], kn: [126, 104], an: [122, 134], toe: [135, 134] },
        { hip: [100, 86], sh: [66, 86], hd: [52, 86], el: [68, 62], wr: [72, 40], elF: [64, 63], wrF: [60, 41], kn: [126, 104], an: [122, 134], toe: [135, 134] },
      ],
    },

    // ------------------------------------------------------------------ DOS
    'Soulevé de terre barre': {
      dur: 3.4, hold: 'plate', holdF: 'none',
      props: [['floor', 138]],
      glow: ['hip', 12, 9],
      arrow: 'M140,116 L140,70',
      poses: [
        { hip: [66, 94], sh: [92, 74], hd: [104, 64], el: [95, 94], wr: [97, 118], kn: [92, 112], an: [82, 138], toe: [95, 138], knF: [90, 113], anF: [80, 138], toeF: [93, 138] },
        { hip: [78, 80], sh: [78, 46], hd: [78, 32], el: [81, 70], wr: [85, 94], kn: [81, 110], an: [83, 138], toe: [96, 138], knF: [79, 111], anF: [81, 138], toeF: [94, 138] },
      ],
    },

    'Rowing barre buste penché': {
      dur: 3, hold: 'plate', holdF: 'none',
      props: [['floor', 138]],
      glow: ['sh', 12, 9],
      arrow: 'M136,116 L136,86',
      poses: [
        { hip: [72, 86], sh: [104, 66], hd: [116, 58], el: [110, 88], wr: [112, 112], kn: [80, 114], an: [76, 138], toe: [89, 138], knF: [78, 115], anF: [74, 138], toeF: [87, 138] },
        { hip: [72, 86], sh: [104, 66], hd: [116, 58], el: [88, 80], wr: [102, 88], kn: [80, 114], an: [76, 138], toe: [89, 138], knF: [78, 115], anF: [74, 138], toeF: [87, 138] },
      ],
    },

    'Rowing un bras haltère': {
      dur: 3, hold: 'dumbbell', holdF: 'none',
      props: [['floor', 138], ['bench', 92, 102, 52]],
      glow: ['sh', 11, 8],
      arrow: 'M56,118 L56,90',
      poses: [
        { hip: [66, 88], sh: [98, 70], hd: [110, 62], el: [96, 92], wr: [94, 116], elF: [106, 84], wrF: [112, 102], kn: [72, 114], an: [68, 138], toe: [81, 138], knF: [70, 115], anF: [66, 138], toeF: [79, 138] },
        { hip: [66, 88], sh: [98, 70], hd: [110, 62], el: [80, 82], wr: [94, 90], elF: [106, 84], wrF: [112, 102], kn: [72, 114], an: [68, 138], toe: [81, 138], knF: [70, 115], anF: [66, 138], toeF: [79, 138] },
      ],
    },

    'Shrug haltères (trapèzes)': {
      dur: 2.4, hold: 'dumbbell',
      props: [['floor', 138]],
      glow: ['sh', 12, 7],
      arrow: 'M118,58 L118,42',
      poses: [
        { hip: [80, 84], sh: [80, 50], hd: [80, 36], el: [83, 74], wr: [86, 96], elF: [77, 74], wrF: [74, 96], kn: [80, 112], an: [80, 138], toe: [93, 138], knF: [78, 113], anF: [78, 138], toeF: [91, 138] },
        { hip: [80, 76], sh: [80, 42], hd: [80, 30], el: [83, 66], wr: [86, 88], elF: [77, 66], wrF: [74, 88], kn: [80, 108], an: [80, 138], toe: [93, 138], knF: [78, 109], anF: [78, 138], toeF: [91, 138] },
      ],
    },

    // -------------------------------------------------------------- ÉPAULES
    'Développé militaire barre': {
      dur: 3, vb: '0 -20 176 168', hold: 'plate', holdF: 'none',
      props: [['floor', 138]],
      glow: ['sh', 12, 8],
      arrow: 'M124,54 L124,22',
      poses: [
        { hip: [80, 79], sh: [80, 45], hd: [80, 31], el: [90, 66], wr: [74, 50], elF: [88, 67], wrF: [73, 52], kn: [80, 109], an: [80, 138], toe: [93, 138], knF: [78, 110], anF: [78, 138], toeF: [91, 138] },
        { hip: [80, 79], sh: [80, 45], hd: [80, 31], el: [80, 22], wr: [80, 0], elF: [78, 23], wrF: [78, 1], kn: [80, 109], an: [80, 138], toe: [93, 138], knF: [78, 110], anF: [78, 138], toeF: [91, 138] },
      ],
    },

    'Développé épaules haltères assis': {
      dur: 3, vb: '0 -14 176 162', hold: 'dumbbell',
      props: [['floor', 138], ['bench', 58, 108, 58], ['back', 62, 108, 56, 66]],
      glow: ['sh', 12, 8],
      arrow: 'M126,72 L126,40',
      poses: [
        { hip: [84, 104], sh: [80, 70], hd: [80, 56], el: [90, 90], wr: [74, 74], elF: [88, 91], wrF: [72, 76], kn: [112, 108], an: [108, 136], toe: [121, 136], knF: [110, 109], anF: [106, 136], toeF: [119, 136] },
        { hip: [84, 104], sh: [80, 70], hd: [80, 56], el: [80, 46], wr: [82, 24], elF: [78, 47], wrF: [76, 25], kn: [112, 108], an: [108, 136], toe: [121, 136], knF: [110, 109], anF: [106, 136], toeF: [119, 136] },
      ],
    },

    'Développé Arnold haltères': {
      dur: 3.2, vb: '0 -14 176 162', hold: 'dumbbell',
      props: [['floor', 138], ['bench', 58, 108, 58], ['back', 62, 108, 56, 66]],
      glow: ['sh', 12, 8],
      arrow: 'M126,72 L126,40',
      poses: [
        { hip: [84, 104], sh: [80, 70], hd: [80, 56], el: [94, 84], wr: [88, 62], elF: [92, 85], wrF: [86, 64], kn: [112, 108], an: [108, 136], toe: [121, 136], knF: [110, 109], anF: [106, 136], toeF: [119, 136] },
        { hip: [84, 104], sh: [80, 70], hd: [80, 56], el: [80, 46], wr: [82, 24], elF: [78, 47], wrF: [76, 25], kn: [112, 108], an: [108, 136], toe: [121, 136], knF: [110, 109], anF: [106, 136], toeF: [119, 136] },
      ],
    },

    'Élévations latérales haltères': {
      dur: 3, hold: 'dumbbell',
      props: [['floor', 138]],
      glow: ['sh', 12, 7],
      arrow: 'M126,88 L126,54',
      poses: [
        { hip: [80, 80], sh: [80, 46], hd: [80, 32], el: [83, 70], wr: [86, 92], elF: [77, 70], wrF: [74, 92], kn: [80, 110], an: [80, 138], toe: [93, 138], knF: [78, 111], anF: [78, 138], toeF: [91, 138] },
        { hip: [80, 80], sh: [80, 46], hd: [80, 32], el: [102, 52], wr: [124, 48], elF: [58, 52], wrF: [36, 48], kn: [80, 110], an: [80, 138], toe: [93, 138], knF: [78, 111], anF: [78, 138], toeF: [91, 138] },
      ],
    },

    'Élévations frontales haltères': {
      dur: 3, hold: 'dumbbell',
      props: [['floor', 138]],
      glow: ['sh', 12, 7],
      arrow: 'M126,92 L126,56',
      poses: [
        { hip: [80, 80], sh: [80, 46], hd: [80, 32], el: [100, 54], wr: [120, 48], elF: [80, 70], wrF: [82, 92], kn: [80, 110], an: [80, 138], toe: [93, 138], knF: [78, 111], anF: [78, 138], toeF: [91, 138] },
        { hip: [80, 80], sh: [80, 46], hd: [80, 32], el: [82, 70], wr: [84, 92], elF: [98, 55], wrF: [118, 49], kn: [80, 110], an: [80, 138], toe: [93, 138], knF: [78, 111], anF: [78, 138], toeF: [91, 138] },
      ],
    },

    'Oiseau haltères (arrière épaule)': {
      dur: 3, hold: 'dumbbell',
      props: [['floor', 138]],
      glow: ['sh', 12, 8],
      arrow: 'M142,96 Q150,80 138,70',
      poses: [
        { hip: [72, 86], sh: [104, 66], hd: [116, 58], el: [106, 86], wr: [108, 108], elF: [102, 87], wrF: [104, 109], kn: [80, 114], an: [76, 138], toe: [89, 138], knF: [78, 115], anF: [74, 138], toeF: [87, 138] },
        { hip: [72, 86], sh: [104, 66], hd: [116, 58], el: [124, 74], wr: [144, 80], elF: [86, 74], wrF: [66, 80], kn: [80, 114], an: [76, 138], toe: [89, 138], knF: [78, 115], anF: [74, 138], toeF: [87, 138] },
      ],
    },

    // --------------------------------------------------------------- BICEPS
    'Curl biceps haltères': {
      dur: 2.8, hold: 'dumbbell',
      props: [['floor', 138]],
      glow: ['el', 10, 7],
      arrow: 'M118,92 Q130,74 116,58',
      poses: [
        { hip: [80, 80], sh: [80, 46], hd: [80, 32], el: [83, 70], wr: [86, 92], elF: [77, 70], wrF: [80, 92], kn: [80, 110], an: [80, 138], toe: [93, 138], knF: [78, 111], anF: [78, 138], toeF: [91, 138] },
        { hip: [80, 80], sh: [80, 46], hd: [80, 32], el: [83, 70], wr: [102, 58], elF: [77, 70], wrF: [96, 58], kn: [80, 110], an: [80, 138], toe: [93, 138], knF: [78, 111], anF: [78, 138], toeF: [91, 138] },
      ],
    },

    'Curl marteau haltères': {
      dur: 2.8, hold: 'dumbbell',
      props: [['floor', 138]],
      glow: ['el', 10, 7],
      arrow: 'M118,92 Q130,74 116,58',
      poses: [
        { hip: [80, 80], sh: [80, 46], hd: [80, 32], el: [83, 70], wr: [102, 58], elF: [77, 70], wrF: [80, 92], kn: [80, 110], an: [80, 138], toe: [93, 138], knF: [78, 111], anF: [78, 138], toeF: [91, 138] },
        { hip: [80, 80], sh: [80, 46], hd: [80, 32], el: [83, 70], wr: [86, 92], elF: [77, 70], wrF: [96, 58], kn: [80, 110], an: [80, 138], toe: [93, 138], knF: [78, 111], anF: [78, 138], toeF: [91, 138] },
      ],
    },

    'Curl concentré haltère': {
      dur: 3, hold: 'dumbbell', holdF: 'none',
      props: [['floor', 138], ['bench', 52, 106, 60]],
      glow: ['el', 10, 7],
      arrow: 'M128,126 Q142,108 126,92',
      poses: [
        { hip: [84, 102], sh: [70, 72], hd: [62, 62], el: [100, 100], wr: [104, 122], elF: [74, 94], wrF: [96, 102], kn: [112, 104], an: [108, 134], toe: [121, 134], knF: [110, 105], anF: [106, 134], toeF: [119, 134] },
        { hip: [84, 102], sh: [70, 72], hd: [62, 62], el: [100, 100], wr: [92, 82], elF: [74, 94], wrF: [96, 102], kn: [112, 104], an: [108, 134], toe: [121, 134], knF: [110, 105], anF: [106, 134], toeF: [119, 134] },
      ],
    },

    // -------------------------------------------------------------- TRICEPS
    'Dips sur banc (triceps)': {
      dur: 3, vb: '0 0 176 148',
      props: [['floor', 138], ['bench', 24, 96, 50]],
      glow: ['el', 10, 7],
      arrow: 'M32,60 L32,84',
      poses: [
        { hip: [104, 90], sh: [80, 58], hd: [86, 48], el: [63, 75], wr: [70, 96], elF: [65, 76], wrF: [72, 97], kn: [125, 111], an: [146, 132], toe: [159, 132], knF: [123, 112], anF: [144, 133], toeF: [157, 133] },
        { hip: [104, 108], sh: [80, 76], hd: [86, 66], el: [60, 76], wr: [70, 96], elF: [62, 77], wrF: [72, 97], kn: [134, 106], an: [146, 132], toe: [159, 132], knF: [132, 107], anF: [144, 133], toeF: [157, 133] },
      ],
    },

    'Kickback haltère triceps': {
      dur: 2.8, hold: 'dumbbell', holdF: 'none',
      props: [['floor', 138]],
      glow: ['el', 10, 7],
      arrow: 'M48,102 L34,86',
      poses: [
        { hip: [72, 86], sh: [104, 66], hd: [116, 58], el: [86, 76], wr: [86, 98], elF: [104, 86], wrF: [96, 106], kn: [80, 114], an: [76, 138], toe: [89, 138], knF: [78, 115], anF: [74, 138], toeF: [87, 138] },
        { hip: [72, 86], sh: [104, 66], hd: [116, 58], el: [86, 76], wr: [64, 82], elF: [104, 86], wrF: [96, 106], kn: [80, 114], an: [76, 138], toe: [89, 138], knF: [78, 115], anF: [74, 138], toeF: [87, 138] },
      ],
    },

    'Extension haltère au-dessus tête': {
      dur: 3, vb: '0 -22 176 170', hold: 'dumbbell', holdF: 'none',
      props: [['floor', 138]],
      glow: ['el', 10, 7],
      arrow: 'M112,4 L112,-18',
      poses: [
        { hip: [80, 79], sh: [80, 45], hd: [80, 31], el: [80, 22], wr: [60, 32], elF: [78, 23], wrF: [58, 33], kn: [80, 109], an: [80, 138], toe: [93, 138], knF: [78, 110], anF: [78, 138], toeF: [91, 138] },
        { hip: [80, 79], sh: [80, 45], hd: [80, 31], el: [80, 22], wr: [82, 0], elF: [78, 23], wrF: [80, 1], kn: [80, 109], an: [80, 138], toe: [93, 138], knF: [78, 110], anF: [78, 138], toeF: [91, 138] },
      ],
    },

    // ----------------------------------------------------------- BAS DU CORPS
    'Squat barre': {
      dur: 3.4, onBack: 'plate', armBehind: true,
      props: [['floor', 138]],
      glow: ['kn', 11, 8],
      arrow: 'M148,68 L148,104',
      poses: [
        { hip: [80, 80], sh: [80, 46], hd: [80, 32], el: [72, 68], wr: [62, 48], elF: [74, 69], wrF: [64, 50], kn: [80, 110], an: [80, 138], toe: [93, 138], knF: [78, 111], anF: [78, 138], toeF: [91, 138] },
        { hip: [70, 102], sh: [77, 69], hd: [80, 56], el: [70, 90], wr: [60, 68], elF: [74, 91], wrF: [64, 70], kn: [98, 110], an: [84, 138], toe: [97, 138], knF: [96, 111], anF: [82, 138], toeF: [95, 138] },
      ],
    },

    'Goblet squat haltère': {
      dur: 3.4, hold: 'dumbbell', holdF: 'none',
      props: [['floor', 138]],
      glow: ['kn', 11, 8],
      arrow: 'M148,68 L148,104',
      poses: [
        { hip: [80, 80], sh: [80, 46], hd: [80, 32], el: [88, 68], wr: [92, 54], elF: [86, 69], wrF: [90, 55], kn: [80, 110], an: [80, 138], toe: [93, 138], knF: [78, 111], anF: [78, 138], toeF: [91, 138] },
        { hip: [66, 104], sh: [76, 70], hd: [78, 56], el: [84, 90], wr: [90, 76], elF: [82, 91], wrF: [88, 77], kn: [96, 112], an: [84, 138], toe: [97, 138], knF: [94, 113], anF: [82, 138], toeF: [95, 138] },
      ],
    },

    'Fentes haltères': {
      dur: 3.4, hold: 'dumbbell',
      props: [['floor', 138]],
      glow: ['kn', 11, 8],
      arrow: 'M150,72 L150,104',
      poses: [
        { hip: [80, 84], sh: [80, 50], hd: [80, 36], el: [83, 74], wr: [86, 96], elF: [77, 74], wrF: [74, 96], kn: [92, 112], an: [96, 138], toe: [109, 138], knF: [68, 112], anF: [60, 138], toeF: [73, 138] },
        { hip: [80, 100], sh: [80, 66], hd: [80, 52], el: [83, 90], wr: [86, 112], elF: [77, 90], wrF: [74, 112], kn: [100, 116], an: [96, 138], toe: [109, 138], knF: [64, 124], anF: [54, 136], toeF: [66, 138] },
      ],
    },

    'Fentes marchées haltères': {
      dur: 3.4, hold: 'dumbbell',
      props: [['floor', 138]],
      glow: ['kn', 11, 8],
      arrow: 'M28,58 L52,58',
      poses: [
        { hip: [74, 84], sh: [74, 50], hd: [74, 36], el: [77, 74], wr: [80, 96], elF: [71, 74], wrF: [68, 96], kn: [84, 112], an: [88, 138], toe: [101, 138], knF: [64, 112], anF: [60, 138], toeF: [73, 138] },
        { hip: [86, 98], sh: [86, 64], hd: [86, 50], el: [89, 88], wr: [92, 110], elF: [83, 88], wrF: [80, 110], kn: [106, 116], an: [104, 138], toe: [117, 138], knF: [68, 122], anF: [56, 136], toeF: [68, 138] },
      ],
    },

    'Fentes bulgares haltères': {
      dur: 3.4, hold: 'dumbbell',
      props: [['floor', 138], ['box', 24, 110, 46, 8]],
      glow: ['kn', 11, 8],
      arrow: 'M152,76 L152,106',
      poses: [
        { hip: [96, 82], sh: [96, 48], hd: [96, 34], el: [99, 72], wr: [102, 94], elF: [93, 72], wrF: [90, 94], kn: [104, 110], an: [106, 138], toe: [119, 138], knF: [84, 112], anF: [56, 112], toeF: [40, 104] },
        { hip: [96, 98], sh: [96, 64], hd: [96, 50], el: [99, 88], wr: [102, 110], elF: [93, 88], wrF: [90, 110], kn: [114, 116], an: [106, 138], toe: [119, 138], knF: [80, 128], anF: [52, 116], toeF: [38, 106] },
      ],
    },

    'Soulevé de terre roumain haltères': {
      dur: 3.4, hold: 'dumbbell',
      props: [['floor', 138]],
      glow: ['kn', 11, 9],
      arrow: 'M144,110 L144,74',
      poses: [
        { hip: [80, 80], sh: [80, 46], hd: [80, 32], el: [83, 70], wr: [86, 92], elF: [77, 70], wrF: [80, 92], kn: [80, 110], an: [80, 138], toe: [93, 138], knF: [78, 111], anF: [78, 138], toeF: [91, 138] },
        { hip: [70, 84], sh: [100, 66], hd: [112, 58], el: [102, 86], wr: [104, 108], elF: [98, 87], wrF: [100, 109], kn: [76, 112], an: [78, 138], toe: [91, 138], knF: [74, 113], anF: [76, 138], toeF: [89, 138] },
      ],
    },

    'Hip Thrust haltère': {
      dur: 3, hold: 'plate', holdF: 'none',
      props: [['floor', 138], ['bench', 28, 94, 48]],
      glow: ['hip', 12, 9],
      arrow: 'M148,120 L148,96',
      poses: [
        { hip: [92, 122], sh: [58, 90], hd: [46, 82], el: [62, 104], wr: [82, 114], elF: [60, 105], wrF: [80, 115], kn: [112, 106], an: [116, 134], toe: [129, 134], knF: [110, 107], anF: [114, 134], toeF: [127, 134] },
        { hip: [94, 100], sh: [58, 90], hd: [44, 86], el: [62, 98], wr: [84, 100], elF: [60, 99], wrF: [82, 101], kn: [116, 104], an: [116, 134], toe: [129, 134], knF: [114, 105], anF: [114, 134], toeF: [127, 134] },
      ],
    },

    'Mollets debout barre': {
      dur: 2.2, vb: '0 -14 176 162', onBack: 'plate', armBehind: true,
      props: [['floor', 138], ['box', 62, 122, 54, 12]],
      glow: ['an', 9, 7],
      arrow: 'M148,108 L148,86',
      poses: [
        { hip: [80, 68], sh: [80, 34], hd: [80, 20], el: [72, 56], wr: [62, 36], elF: [74, 57], wrF: [64, 38], kn: [80, 98], an: [78, 128], toe: [92, 122], knF: [78, 99], anF: [76, 128], toeF: [90, 122] },
        { hip: [80, 58], sh: [80, 24], hd: [80, 10], el: [72, 46], wr: [62, 26], elF: [74, 47], wrF: [64, 28], kn: [80, 88], an: [76, 112], toe: [90, 120], knF: [78, 89], anF: [74, 112], toeF: [88, 120] },
      ],
    },

    'Mollets debout haltère': {
      dur: 2.2, vb: '0 -14 176 162', hold: 'dumbbell',
      props: [['floor', 138], ['box', 62, 122, 54, 12]],
      glow: ['an', 9, 7],
      arrow: 'M148,108 L148,86',
      poses: [
        { hip: [80, 68], sh: [80, 34], hd: [80, 20], el: [83, 58], wr: [86, 80], elF: [77, 58], wrF: [74, 80], kn: [80, 98], an: [78, 128], toe: [92, 122], knF: [78, 99], anF: [76, 128], toeF: [90, 122] },
        { hip: [80, 58], sh: [80, 24], hd: [80, 10], el: [83, 48], wr: [86, 70], elF: [77, 48], wrF: [74, 70], kn: [80, 88], an: [76, 112], toe: [90, 120], knF: [78, 89], anF: [74, 112], toeF: [88, 120] },
      ],
    },

    'Mollets assis haltère': {
      dur: 2.2, hold: 'dumbbell', holdF: 'none',
      props: [['floor', 136], ['bench', 46, 104, 56]],
      glow: ['an', 9, 7],
      arrow: 'M142,124 L142,104',
      poses: [
        { hip: [74, 100], sh: [74, 66], hd: [74, 52], el: [80, 88], wr: [100, 96], elF: [72, 90], wrF: [96, 98], kn: [106, 102], an: [112, 130], toe: [125, 130], knF: [104, 103], anF: [110, 131], toeF: [123, 131] },
        { hip: [74, 100], sh: [74, 66], hd: [74, 52], el: [80, 88], wr: [100, 96], elF: [72, 90], wrF: [96, 98], kn: [106, 102], an: [110, 120], toe: [125, 130], knF: [104, 103], anF: [108, 121], toeF: [123, 131] },
      ],
    },

    // ------------------------------------------------------------- ABDOMINAUX
    'Crunch': {
      dur: 3,
      props: [['floor', 136]],
      glow: ['hip', 12, 9],
      arrow: 'M40,108 Q30,94 44,84',
      poses: [
        { hip: [92, 122], sh: [58, 122], hd: [45, 121], el: [62, 108], wr: [50, 114], elF: [60, 109], wrF: [48, 115], kn: [114, 104], an: [126, 128], toe: [139, 130], knF: [112, 105], anF: [124, 129], toeF: [137, 131] },
        { hip: [92, 122], sh: [64, 108], hd: [56, 98], el: [66, 96], wr: [56, 102], elF: [64, 97], wrF: [54, 103], kn: [114, 104], an: [126, 128], toe: [139, 130], knF: [112, 105], anF: [124, 129], toeF: [137, 131] },
      ],
    },

    'Crunch inversé': {
      dur: 3,
      props: [['floor', 136]],
      glow: ['hip', 12, 9],
      arrow: 'M124,120 Q126,100 106,90',
      poses: [
        { hip: [92, 124], sh: [58, 124], hd: [45, 124], el: [62, 132], wr: [80, 133], elF: [60, 133], wrF: [78, 134], kn: [110, 106], an: [128, 122], toe: [141, 120], knF: [108, 107], anF: [126, 123], toeF: [139, 121] },
        { hip: [88, 118], sh: [56, 124], hd: [43, 125], el: [60, 132], wr: [78, 133], elF: [58, 133], wrF: [76, 134], kn: [92, 96], an: [72, 86], toe: [62, 78], knF: [90, 97], anF: [70, 87], toeF: [60, 79] },
      ],
    },

    'Relevé de jambes couché': {
      dur: 3.2,
      props: [['floor', 136]],
      glow: ['hip', 12, 9],
      arrow: 'M148,120 Q152,96 130,80',
      poses: [
        { hip: [90, 124], sh: [56, 124], hd: [43, 124], el: [60, 132], wr: [78, 133], elF: [58, 133], wrF: [76, 134], kn: [118, 126], an: [146, 124], toe: [156, 118], knF: [116, 127], anF: [144, 125], toeF: [154, 119] },
        { hip: [90, 124], sh: [56, 124], hd: [43, 124], el: [60, 132], wr: [78, 133], elF: [58, 133], wrF: [76, 134], kn: [98, 100], an: [100, 70], toe: [110, 62], knF: [96, 101], anF: [98, 71], toeF: [108, 63] },
      ],
    },

    'Gainage planche': {
      dur: 4,
      props: [['floor', 136]],
      glow: ['hip', 13, 9],
      arrow: 'M92,88 L92,74',
      poses: [
        { hip: [88, 112], sh: [50, 108], hd: [37, 106], el: [48, 130], wr: [70, 132], elF: [46, 131], wrF: [68, 133], kn: [116, 120], an: [136, 130], toe: [144, 136], knF: [114, 121], anF: [134, 131], toeF: [142, 137] },
        { hip: [88, 116], sh: [50, 108], hd: [37, 106], el: [48, 130], wr: [70, 132], elF: [46, 131], wrF: [68, 133], kn: [116, 122], an: [136, 130], toe: [144, 136], knF: [114, 123], anF: [134, 131], toeF: [142, 137] },
      ],
    },

    'Mountain climber': {
      dur: 1.6,
      props: [['floor', 136]],
      glow: ['hip', 12, 9],
      arrow: 'M60,116 L84,116',
      poses: [
        { hip: [92, 108], sh: [54, 96], hd: [42, 90], el: [52, 114], wr: [50, 132], elF: [50, 115], wrF: [48, 133], kn: [116, 120], an: [138, 132], toe: [150, 134], knF: [96, 116], anF: [116, 128], toeF: [128, 130] },
        { hip: [92, 108], sh: [54, 96], hd: [42, 90], el: [52, 114], wr: [50, 132], elF: [50, 115], wrF: [48, 133], kn: [82, 112], an: [64, 122], toe: [52, 126], knF: [116, 122], anF: [138, 132], toeF: [150, 134] },
      ],
    },
  },

  _default(name) {
    const c = this._c;
    return `<svg viewBox="0 0 176 148" xmlns="http://www.w3.org/2000/svg">
      <text x="88" y="78" text-anchor="middle" fill="${c.metal}" font-size="11" font-family="system-ui">${(name || 'Exercice').slice(0, 24)}</text>
    </svg>`;
  },

  get(name) {
    const def = this.E[name];
    if (!def) return this._default(name);
    try { return this._build(def); }
    catch (e) { console.warn('animation error', name, e); return this._default(name); }
  },
};
