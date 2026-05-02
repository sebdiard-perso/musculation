const ANIMATIONS = {
  // Chaque animation est une fonction qui retourne un SVG animé
  // Le bonhomme est vu de profil ou de face selon l'exercice

  _stick(paths, w = 120, h = 120) {
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
  },

  // Couleurs
  _c: { body: '#eee', bar: '#e94560', bench: '#0f3460', weight: '#f0a500', muscle: '#4ecca3' },

  'Développé couché barre'() {
    return this._stick(`
      <!-- Banc -->
      <rect x="20" y="68" width="70" height="8" rx="3" fill="${this._c.bench}"/>
      <rect x="30" y="76" width="6" height="20" fill="${this._c.bench}"/>
      <rect x="74" y="76" width="6" height="20" fill="${this._c.bench}"/>
      <!-- Corps allongé -->
      <circle cx="75" cy="58" r="8" fill="${this._c.body}"/>
      <line x1="67" y1="58" x2="35" y2="62" stroke="${this._c.body}" stroke-width="3" stroke-linecap="round"/>
      <!-- Jambes -->
      <line x1="35" y1="62" x2="28" y2="80" stroke="${this._c.body}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="28" y1="80" x2="25" y2="96" stroke="${this._c.body}" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Barre animée -->
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-18;0,0" dur="2s" repeatCount="indefinite"/>
        <!-- Bras -->
        <line x1="60" y1="58" x2="60" y2="42" stroke="${this._c.body}" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="75" y1="55" x2="75" y2="42" stroke="${this._c.body}" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Barre -->
        <line x1="45" y1="42" x2="90" y2="42" stroke="${this._c.bar}" stroke-width="3" stroke-linecap="round"/>
        <!-- Poids -->
        <rect x="45" y="36" width="5" height="12" rx="1" fill="${this._c.weight}"/>
        <rect x="85" y="36" width="5" height="12" rx="1" fill="${this._c.weight}"/>
      </g>
    `, 120, 100);
  },

  'Développé incliné haltères'() {
    return this._stick(`
      <!-- Banc incliné -->
      <polygon points="30,85 80,85 80,45 70,45" fill="${this._c.bench}"/>
      <!-- Corps -->
      <circle cx="72" cy="38" r="7" fill="${this._c.body}"/>
      <line x1="68" y1="44" x2="45" y2="72" stroke="${this._c.body}" stroke-width="3" stroke-linecap="round"/>
      <line x1="45" y1="72" x2="35" y2="90" stroke="${this._c.body}" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Haltères animés -->
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;-5,-20;0,0" dur="2s" repeatCount="indefinite"/>
        <line x1="62" y1="42" x2="55" y2="28" stroke="${this._c.body}" stroke-width="2.5"/>
        <rect x="51" y="24" width="8" height="5" rx="2" fill="${this._c.weight}"/>
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;5,-20;0,0" dur="2s" repeatCount="indefinite"/>
        <line x1="76" y1="40" x2="83" y2="26" stroke="${this._c.body}" stroke-width="2.5"/>
        <rect x="79" y="22" width="8" height="5" rx="2" fill="${this._c.weight}"/>
      </g>
    `, 120, 100);
  },

  'Écarté couché haltères'() {
    return this._stick(`
      <rect x="20" y="55" width="70" height="7" rx="3" fill="${this._c.bench}"/>
      <circle cx="70" cy="46" r="7" fill="${this._c.body}"/>
      <line x1="63" y1="48" x2="35" y2="52" stroke="${this._c.body}" stroke-width="3" stroke-linecap="round"/>
      <line x1="35" y1="52" x2="28" y2="72" stroke="${this._c.body}" stroke-width="2.5"/>
      <!-- Bras qui s'ouvrent/ferment -->
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0,60,46;-35,60,46;0,60,46" dur="2.5s" repeatCount="indefinite"/>
        <line x1="60" y1="46" x2="40" y2="46" stroke="${this._c.body}" stroke-width="2.5"/>
        <rect x="36" y="43" width="6" height="6" rx="2" fill="${this._c.weight}"/>
      </g>
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0,76,44;35,76,44;0,76,44" dur="2.5s" repeatCount="indefinite"/>
        <line x1="76" y1="44" x2="96" y2="44" stroke="${this._c.body}" stroke-width="2.5"/>
        <rect x="93" y="41" width="6" height="6" rx="2" fill="${this._c.weight}"/>
      </g>
    `, 120, 90);
  },

  'Soulevé de terre barre'() {
    return this._stick(`
      <!-- Sol -->
      <line x1="10" y1="105" x2="110" y2="105" stroke="#333" stroke-width="2"/>
      <g>
        <animateTransform attributeName="transform" type="rotate" values="45,60,105;0,60,105;45,60,105" dur="2.5s" repeatCount="indefinite"/>
        <!-- Corps penché → droit -->
        <circle cx="60" cy="30" r="8" fill="${this._c.body}"/>
        <line x1="60" y1="38" x2="60" y2="65" stroke="${this._c.body}" stroke-width="3" stroke-linecap="round"/>
        <!-- Bras -->
        <line x1="60" y1="48" x2="60" y2="78" stroke="${this._c.body}" stroke-width="2.5"/>
        <!-- Barre -->
        <line x1="40" y1="78" x2="80" y2="78" stroke="${this._c.bar}" stroke-width="3"/>
        <rect x="38" y="73" width="5" height="10" rx="1" fill="${this._c.weight}"/>
        <rect x="77" y="73" width="5" height="10" rx="1" fill="${this._c.weight}"/>
      </g>
      <!-- Jambes fixes -->
      <line x1="55" y1="85" x2="50" y2="105" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="65" y1="85" x2="70" y2="105" stroke="${this._c.body}" stroke-width="2.5"/>
    `, 120, 110);
  },

  'Rowing barre buste penché'() {
    return this._stick(`
      <line x1="10" y1="105" x2="110" y2="105" stroke="#333" stroke-width="2"/>
      <!-- Corps penché fixe -->
      <circle cx="70" cy="30" r="7" fill="${this._c.body}"/>
      <line x1="70" y1="37" x2="50" y2="60" stroke="${this._c.body}" stroke-width="3" stroke-linecap="round"/>
      <line x1="50" y1="60" x2="45" y2="85" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="45" y1="85" x2="40" y2="105" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="50" y1="60" x2="60" y2="85" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="60" y1="85" x2="65" y2="105" stroke="${this._c.body}" stroke-width="2.5"/>
      <!-- Barre tirée vers le ventre -->
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,15;0,0;0,15" dur="2s" repeatCount="indefinite"/>
        <line x1="58" y1="50" x2="55" y2="65" stroke="${this._c.body}" stroke-width="2.5"/>
        <line x1="65" y1="45" x2="62" y2="65" stroke="${this._c.body}" stroke-width="2.5"/>
        <line x1="40" y1="65" x2="78" y2="65" stroke="${this._c.bar}" stroke-width="3"/>
        <rect x="38" y="60" width="5" height="10" rx="1" fill="${this._c.weight}"/>
        <rect x="75" y="60" width="5" height="10" rx="1" fill="${this._c.weight}"/>
      </g>
    `, 120, 110);
  },

  'Rowing un bras haltère'() {
    return this._stick(`
      <!-- Banc -->
      <rect x="15" y="60" width="50" height="6" rx="3" fill="${this._c.bench}"/>
      <!-- Main + genou sur banc -->
      <circle cx="75" cy="35" r="7" fill="${this._c.body}"/>
      <line x1="75" y1="42" x2="55" y2="58" stroke="${this._c.body}" stroke-width="3"/>
      <line x1="40" y1="58" x2="35" y2="58" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="55" y1="58" x2="50" y2="80" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="50" y1="80" x2="55" y2="100" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="55" y1="58" x2="40" y2="66" stroke="${this._c.body}" stroke-width="2.5"/>
      <!-- Bras qui tire -->
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,18;0,0;0,18" dur="2s" repeatCount="indefinite"/>
        <line x1="68" y1="48" x2="72" y2="62" stroke="${this._c.body}" stroke-width="2.5"/>
        <rect x="68" y="60" width="8" height="5" rx="2" fill="${this._c.weight}"/>
      </g>
    `, 110, 105);
  },

  'Shrug haltères (trapèzes)'() {
    return this._stick(`
      <line x1="10" y1="110" x2="110" y2="110" stroke="#333" stroke-width="2"/>
      <circle cx="60" cy="20" r="8" fill="${this._c.body}"/>
      <line x1="60" y1="28" x2="60" y2="65" stroke="${this._c.body}" stroke-width="3"/>
      <line x1="55" y1="65" x2="50" y2="90" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="50" y1="90" x2="48" y2="110" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="65" y1="65" x2="70" y2="90" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="70" y1="90" x2="72" y2="110" stroke="${this._c.body}" stroke-width="2.5"/>
      <!-- Épaules + haltères qui montent -->
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-10;0,0" dur="1.5s" repeatCount="indefinite"/>
        <line x1="52" y1="35" x2="38" y2="65" stroke="${this._c.body}" stroke-width="2.5"/>
        <line x1="68" y1="35" x2="82" y2="65" stroke="${this._c.body}" stroke-width="2.5"/>
        <rect x="34" y="62" width="8" height="6" rx="2" fill="${this._c.weight}"/>
        <rect x="78" y="62" width="8" height="6" rx="2" fill="${this._c.weight}"/>
        <!-- Trapèzes highlight -->
        <ellipse cx="52" cy="30" rx="4" ry="6" fill="${this._c.muscle}" opacity="0.3"/>
        <ellipse cx="68" cy="30" rx="4" ry="6" fill="${this._c.muscle}" opacity="0.3"/>
      </g>
    `, 120, 115);
  },

  'Développé militaire barre'() {
    return this._stick(`
      <line x1="10" y1="110" x2="110" y2="110" stroke="#333" stroke-width="2"/>
      <circle cx="60" cy="22" r="8" fill="${this._c.body}"/>
      <line x1="60" y1="30" x2="60" y2="65" stroke="${this._c.body}" stroke-width="3"/>
      <line x1="55" y1="65" x2="50" y2="90" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="50" y1="90" x2="48" y2="110" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="65" y1="65" x2="70" y2="90" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="70" y1="90" x2="72" y2="110" stroke="${this._c.body}" stroke-width="2.5"/>
      <!-- Barre poussée au-dessus -->
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,20;0,0;0,20" dur="2s" repeatCount="indefinite"/>
        <line x1="52" y1="32" x2="40" y2="10" stroke="${this._c.body}" stroke-width="2.5"/>
        <line x1="68" y1="32" x2="80" y2="10" stroke="${this._c.body}" stroke-width="2.5"/>
        <line x1="30" y1="10" x2="90" y2="10" stroke="${this._c.bar}" stroke-width="3"/>
        <rect x="28" y="5" width="5" height="10" rx="1" fill="${this._c.weight}"/>
        <rect x="87" y="5" width="5" height="10" rx="1" fill="${this._c.weight}"/>
      </g>
    `, 120, 115);
  },

  'Élévations latérales haltères'() {
    return this._stick(`
      <line x1="10" y1="110" x2="110" y2="110" stroke="#333" stroke-width="2"/>
      <circle cx="60" cy="20" r="8" fill="${this._c.body}"/>
      <line x1="60" y1="28" x2="60" y2="65" stroke="${this._c.body}" stroke-width="3"/>
      <line x1="55" y1="65" x2="50" y2="90" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="50" y1="90" x2="48" y2="110" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="65" y1="65" x2="70" y2="90" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="70" y1="90" x2="72" y2="110" stroke="${this._c.body}" stroke-width="2.5"/>
      <!-- Bras qui montent latéralement -->
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0,52,35;-70,52,35;0,52,35" dur="2.5s" repeatCount="indefinite"/>
        <line x1="52" y1="35" x2="30" y2="55" stroke="${this._c.body}" stroke-width="2.5"/>
        <rect x="26" y="52" width="7" height="5" rx="2" fill="${this._c.weight}"/>
      </g>
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0,68,35;70,68,35;0,68,35" dur="2.5s" repeatCount="indefinite"/>
        <line x1="68" y1="35" x2="90" y2="55" stroke="${this._c.body}" stroke-width="2.5"/>
        <rect x="87" y="52" width="7" height="5" rx="2" fill="${this._c.weight}"/>
      </g>
    `, 120, 115);
  },

  'Curl biceps haltères'() {
    return this._stick(`
      <line x1="10" y1="110" x2="110" y2="110" stroke="#333" stroke-width="2"/>
      <circle cx="60" cy="20" r="8" fill="${this._c.body}"/>
      <line x1="60" y1="28" x2="60" y2="65" stroke="${this._c.body}" stroke-width="3"/>
      <line x1="55" y1="65" x2="50" y2="90" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="50" y1="90" x2="48" y2="110" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="65" y1="65" x2="70" y2="90" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="70" y1="90" x2="72" y2="110" stroke="${this._c.body}" stroke-width="2.5"/>
      <!-- Bras curl -->
      <line x1="52" y1="35" x2="42" y2="50" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="68" y1="35" x2="78" y2="50" stroke="${this._c.body}" stroke-width="2.5"/>
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0,42,50;-120,42,50;0,42,50" dur="2s" repeatCount="indefinite"/>
        <line x1="42" y1="50" x2="42" y2="70" stroke="${this._c.body}" stroke-width="2.5"/>
        <rect x="38" y="67" width="8" height="5" rx="2" fill="${this._c.weight}"/>
      </g>
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0,78,50;120,78,50;0,78,50" dur="2s" repeatCount="indefinite"/>
        <line x1="78" y1="50" x2="78" y2="70" stroke="${this._c.body}" stroke-width="2.5"/>
        <rect x="74" y="67" width="8" height="5" rx="2" fill="${this._c.weight}"/>
      </g>
    `, 120, 115);
  },

  'Squat barre'() {
    return this._stick(`
      <line x1="10" y1="110" x2="110" y2="110" stroke="#333" stroke-width="2"/>
      <g>
        <animate attributeName="opacity" values="1" dur="2.5s" repeatCount="indefinite"/>
        <!-- Tête -->
        <circle cx="60" cy="15" r="7" fill="${this._c.body}">
          <animate attributeName="cy" values="15;35;15" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <!-- Tronc -->
        <line x1="60" y1="22" x2="60" y2="55" stroke="${this._c.body}" stroke-width="3">
          <animate attributeName="y1" values="22;42;22" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="y2" values="55;70;55" dur="2.5s" repeatCount="indefinite"/>
        </line>
        <!-- Cuisse G -->
        <line x1="55" y1="55" x2="45" y2="80" stroke="${this._c.body}" stroke-width="2.5">
          <animate attributeName="y1" values="55;70;55" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="x2" values="45;38;45" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="y2" values="80;85;80" dur="2.5s" repeatCount="indefinite"/>
        </line>
        <!-- Tibia G -->
        <line x1="45" y1="80" x2="48" y2="110" stroke="${this._c.body}" stroke-width="2.5">
          <animate attributeName="x1" values="45;38;45" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="y1" values="80;85;80" dur="2.5s" repeatCount="indefinite"/>
        </line>
        <!-- Cuisse D -->
        <line x1="65" y1="55" x2="75" y2="80" stroke="${this._c.body}" stroke-width="2.5">
          <animate attributeName="y1" values="55;70;55" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="x2" values="75;82;75" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="y2" values="80;85;80" dur="2.5s" repeatCount="indefinite"/>
        </line>
        <!-- Tibia D -->
        <line x1="75" y1="80" x2="72" y2="110" stroke="${this._c.body}" stroke-width="2.5">
          <animate attributeName="x1" values="75;82;75" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="y1" values="80;85;80" dur="2.5s" repeatCount="indefinite"/>
        </line>
        <!-- Barre sur trapèzes -->
        <line x1="35" y1="22" x2="85" y2="22" stroke="${this._c.bar}" stroke-width="3">
          <animate attributeName="y1" values="22;42;22" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="y2" values="22;42;22" dur="2.5s" repeatCount="indefinite"/>
        </line>
        <rect x="30" y="17" width="6" height="10" rx="1" fill="${this._c.weight}">
          <animate attributeName="y" values="17;37;17" dur="2.5s" repeatCount="indefinite"/>
        </rect>
        <rect x="84" y="17" width="6" height="10" rx="1" fill="${this._c.weight}">
          <animate attributeName="y" values="17;37;17" dur="2.5s" repeatCount="indefinite"/>
        </rect>
      </g>
    `, 120, 115);
  },

  'Crunch'() {
    return this._stick(`
      <!-- Sol -->
      <line x1="5" y1="85" x2="115" y2="85" stroke="#333" stroke-width="2"/>
      <!-- Jambes pliées fixes -->
      <line x1="70" y1="78" x2="85" y2="60" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="85" y1="60" x2="85" y2="78" stroke="${this._c.body}" stroke-width="2.5"/>
      <!-- Tronc qui se relève -->
      <line x1="70" y1="78" x2="35" y2="78" stroke="${this._c.body}" stroke-width="3">
        <animate attributeName="x2" values="35;45;35" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="y2" values="78;62;78" dur="2s" repeatCount="indefinite"/>
      </line>
      <!-- Tête -->
      <circle cx="30" cy="72" r="7" fill="${this._c.body}">
        <animate attributeName="cx" values="30;42;30" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="72;55;72" dur="2s" repeatCount="indefinite"/>
      </circle>
      <!-- Abdos highlight -->
      <ellipse cx="55" cy="75" rx="8" ry="4" fill="${this._c.muscle}" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/>
      </ellipse>
    `, 120, 95);
  },

  // Fallback générique pour les exercices sans animation spécifique
  _default(name) {
    return `<svg viewBox="0 0 120 80" width="120" height="80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="25" r="10" fill="${this._c.body}"/>
      <line x1="60" y1="35" x2="60" y2="55" stroke="${this._c.body}" stroke-width="3"/>
      <line x1="45" y1="45" x2="75" y2="45" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="55" y1="55" x2="48" y2="75" stroke="${this._c.body}" stroke-width="2.5"/>
      <line x1="65" y1="55" x2="72" y2="75" stroke="${this._c.body}" stroke-width="2.5"/>
      <text x="60" y="78" text-anchor="middle" fill="#888" font-size="6">Animation à venir</text>
    </svg>`;
  },

  get(name) {
    if (typeof this[name] === 'function') return this[name]();
    return this._default(name);
  }
};
