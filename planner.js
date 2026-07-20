// Générateur intelligent de programme sur 6 mois (26 semaines)
// Construit une périodisation cohérente selon l'âge, l'objectif, le niveau,
// l'équipement disponible et la fréquence d'entraînement.
const PLANNER = {

  // ---------- Catalogue & équipement ----------
  inferEquipment(name) {
    const n = name.toLowerCase();
    const tags = [];
    if (n.includes('barre')) tags.push('barbell');
    if (n.includes('haltère')) tags.push('dumbbell');
    if (n.includes('banc') || n.includes('couché') || n.includes('incliné') || n.includes('assis') || n.includes('bulgares') || n.includes('hip thrust')) tags.push('bench');
    if (n.includes('crunch') || n.includes('relevé') || n.includes('dips') || n.includes('fentes')) tags.push('bodyweight');
    if (!tags.length) tags.push('dumbbell');
    return tags;
  },

  catalog() {
    return DATA.defaultExercises.map(e => ({ ...e, equipment: this.inferEquipment(e.name) }));
  },

  filterByEquipment(exos, eq) {
    return exos.filter(e => {
      const t = e.equipment;
      if (eq === 'gym' || eq === 'home_full') return true;
      if (eq === 'dumbbell_bench') return !t.includes('barbell');
      if (eq === 'dumbbell_only') return !t.includes('barbell') && !t.includes('bench');
      if (eq === 'bodyweight') return t.includes('bodyweight') && !t.includes('barbell') && !t.includes('dumbbell');
      return true;
    });
  },

  // ---------- Sélection par muscle ----------
  pickByMuscle(cat, muscle, n = 1, skip = 0) {
    const list = cat.filter(e => e.muscle === muscle);
    if (!list.length) return [];
    // Si pas assez, on boucle pour ne pas planter
    const out = [];
    for (let i = 0; i < n; i++) {
      out.push(list[(skip + i) % list.length].name);
    }
    return out;
  },

  // ---------- Modèles de séance par split ----------
  // Règles : toutes les fibres musculaires couvertes sur la semaine,
  // abdos intégrés dans chaque séance, durée max ~1h30
  // mesoOffset : décale le choix d'exercices à chaque mésocycle (rotation)
  // ageMod : adaptations genre/âge (lowerBodyEmphasis pour femmes)
  buildDayTemplates(split, cat, mesoOffset = 0, ageMod = {}) {
    const p = (m, n = 1, skip = 0) => this.pickByMuscle(cat, m, n, skip + mesoOffset);
    const lb = ageMod.lowerBodyEmphasis; // Femmes : +1 exo jambes/fessiers

    // Dédoublonnage : supprime les exercices en double dans un template
    const dedup = (arr) => [...new Set(arr)];

    const fullA = dedup([...p('Jambes', lb ? 2 : 1), ...p('Pectoraux', 1), ...p('Dos', 1), ...p('Épaules', 1), ...(lb ? [] : p('Biceps', 1)), ...p('Abdos', 1)]);
    const fullB = dedup([...p('Jambes', lb ? 2 : 1, 1), ...p('Pectoraux', 1, 1), ...p('Dos', 1, 1), ...p('Épaules', 1, 1), ...p('Triceps', 1), ...p('Mollets', 1), ...p('Abdos', 1, 1)]);

    const push = dedup([...p('Pectoraux', 2), ...p('Épaules', 2), ...p('Triceps', 2), ...p('Abdos', 1)]);
    const pull = dedup([...p('Dos', 3), ...p('Biceps', 2), ...p('Abdos', 1, 1)]);
    const legs = dedup([...p('Jambes', lb ? 4 : 3), ...p('Mollets', 1), ...p('Mollets', 1, 1), ...p('Abdos', 1), ...p('Abdos', 1, 1)]);

    const upperA = dedup([...p('Pectoraux', 2), ...p('Dos', 2), ...p('Épaules', 1), ...p('Triceps', 1), ...p('Biceps', 1), ...p('Abdos', 1)]);
    const upperB = dedup([...p('Pectoraux', 2, 1), ...p('Dos', 2, 1), ...p('Épaules', 2, 1), ...p('Triceps', 1, 1), ...p('Biceps', 1, 1), ...p('Abdos', 1, 1)]);
    const lowerA = dedup([...p('Jambes', lb ? 4 : 3), ...p('Mollets', 1), ...p('Mollets', 1, 1), ...p('Abdos', 1), ...p('Abdos', 1, 1)]);
    const lowerB = dedup([...p('Jambes', lb ? 4 : 3, 1), ...p('Mollets', 1), ...p('Mollets', 1, 1), ...p('Abdos', 1, 1), ...p('Abdos', 1, 2)]);

    if (split === 'fullbody2') return [{ name: '🏋️ Full Body A', exos: fullA }, { name: '🏋️ Full Body B', exos: fullB }];
    if (split === 'fullbody3') return [{ name: '🏋️ Full A', exos: fullA }, { name: '🏋️ Full B', exos: fullB }, { name: '🏋️ Full C', exos: dedup([...p('Jambes',lb?2:1,2),...p('Pectoraux',1),...p('Dos',1),...p('Épaules',1,1),...p('Triceps',1),...p('Abdos',1)]) }];
    if (split === 'ppl') return [{ name: '💪 Push', exos: push }, { name: '🔙 Pull', exos: pull }, { name: '🦵 Legs', exos: legs }];
    if (split === 'upper_lower') return [
      { name: '⬆️ Upper A', exos: upperA }, { name: '⬇️ Lower A', exos: lowerA },
      { name: '⬆️ Upper B', exos: upperB }, { name: '⬇️ Lower B', exos: lowerB }
    ];
    if (split === 'ppl_ul') return [
      { name: '💪 Push', exos: push }, { name: '🔙 Pull', exos: pull }, { name: '🦵 Legs', exos: legs },
      { name: '⬆️ Upper', exos: upperA }, { name: '⬇️ Lower', exos: lowerB }
    ];
    if (split === 'ppl_x2') return [
      { name: '💪 Push A', exos: push }, { name: '🔙 Pull A', exos: pull }, { name: '🦵 Legs A', exos: legs },
      { name: '💪 Push B', exos: dedup([...p('Pectoraux', 2, 1), ...p('Épaules', 2, 1), ...p('Triceps', 2, 1), ...p('Abdos', 1)]) },
      { name: '🔙 Pull B', exos: dedup([...p('Dos', 3, 1), ...p('Biceps', 2, 1), ...p('Abdos', 1, 1)]) },
      { name: '🦵 Legs B', exos: dedup([...p('Jambes', lb ? 4 : 3, 1), ...p('Mollets', 1), ...p('Mollets', 1, 1), ...p('Abdos', 1, 1)]) }
    ];
    return [{ name: 'Séance', exos: fullA }];
  },

  pickSplit(frequency, level) {
    if (frequency <= 2) return 'fullbody2';
    if (frequency === 3) return level === 'beginner' ? 'fullbody3' : 'ppl';
    if (frequency === 4) return 'upper_lower';
    if (frequency === 5) return 'ppl_ul';
    return 'ppl_x2';
  },

  // ---------- Périodisation par objectif ----------
  // Programme Masse : 24 semaines Upper/Lower avec deloads aux semaines 5, 9, 13, 17, 21
  // + 2 semaines bonus (deload final + retest) = 26 semaines
  // Phases : Adaptation → Volume → Intensité → Variation (Supersets) → Volume Élevé (Dropsets) → Pic (Rest-Pause, Giant Sets)
  goalPeriodization(goal) {
    const G = {
      masse: [
        { phase: 'Adaptation',         sets: 3, reps: '12-15', rpe: 7, tech: false, rest: '60-90',  techType: null },
        { phase: 'Volume',             sets: 4, reps: '10-12', rpe: 8, tech: false, rest: '60-120', techType: null },
        { phase: 'Intensité',          sets: 4, reps: '8-10',  rpe: 8, tech: false, rest: '90-120', techType: null },
        { phase: 'Variation',          sets: 4, reps: '8-12',  rpe: 8, tech: true,  rest: '60-120', techType: 'superset' },
        { phase: 'Volume Élevé',       sets: 4, reps: '10-12', rpe: 8, tech: true,  rest: '60-90',  techType: 'dropset' },
        { phase: 'Pic',                sets: 4, reps: '6-8',   rpe: 9, tech: true,  rest: '120-180', techType: 'rest-pause' },
      ],
      force: [
        { phase: 'Adaptation',         sets: 3, reps: '8-10',  rpe: 7, tech: false, rest: '90-120', techType: null },
        { phase: 'Volume force',       sets: 4, reps: '6-8',   rpe: 8, tech: false, rest: '120-180', techType: null },
        { phase: 'Force base',         sets: 5, reps: '5-6',   rpe: 8, tech: false, rest: '180-240', techType: null },
        { phase: 'Force max',          sets: 5, reps: '3-5',   rpe: 9, tech: false, rest: '180-300', techType: null },
        { phase: 'Pic',                sets: 4, reps: '5-6',   rpe: 9, tech: true,  rest: '180-240', techType: 'rest-pause' },
        { phase: 'Test 1RM',           sets: 3, reps: '3-5',   rpe: 9, tech: false, rest: '180-300', techType: null },
      ],
      perte_gras: [
        { phase: 'Adaptation',         sets: 3, reps: '12-15', rpe: 7, tech: false, rest: '45-60', techType: null },
        { phase: 'Volume',             sets: 3, reps: '12-15', rpe: 8, tech: false, rest: '45-60', techType: null },
        { phase: 'Densité',            sets: 4, reps: '12-15', rpe: 8, tech: true,  rest: '30-45', techType: 'superset' },
        { phase: 'Métabolique',        sets: 3, reps: '15-20', rpe: 8, tech: true,  rest: '30-45', techType: 'dropset' },
        { phase: 'Pic métabolique',    sets: 4, reps: '12-15', rpe: 9, tech: true,  rest: '30-60', techType: 'dropset' },
        { phase: 'Maintien densité',   sets: 3, reps: '12-15', rpe: 8, tech: false, rest: '45-60', techType: null },
      ],
      tonification: [
        { phase: 'Adaptation',         sets: 3, reps: '12-15', rpe: 7, tech: false, rest: '60-90', techType: null },
        { phase: 'Endurance',          sets: 3, reps: '15-20', rpe: 7, tech: false, rest: '45-60', techType: null },
        { phase: 'Hypertrophie légère',sets: 4, reps: '10-12', rpe: 8, tech: false, rest: '60-90', techType: null },
        { phase: 'Volume',             sets: 4, reps: '12-15', rpe: 8, tech: true,  rest: '60-90', techType: 'superset' },
        { phase: 'Pic',                sets: 4, reps: '10-12', rpe: 8, tech: true,  rest: '60-90', techType: 'dropset' },
        { phase: 'Maintien',           sets: 3, reps: '12-15', rpe: 7, tech: false, rest: '60-90', techType: null },
      ],
      maintien: [
        { phase: 'Maintien',           sets: 3, reps: '8-12',  rpe: 7, tech: false, rest: '60-90', techType: null },
        { phase: 'Maintien',           sets: 3, reps: '8-12',  rpe: 7, tech: false, rest: '60-90', techType: null },
        { phase: 'Stim. modérée',      sets: 3, reps: '8-12',  rpe: 8, tech: false, rest: '60-90', techType: null },
        { phase: 'Maintien',           sets: 3, reps: '8-12',  rpe: 7, tech: false, rest: '60-90', techType: null },
        { phase: 'Stim. modérée',      sets: 3, reps: '8-12',  rpe: 8, tech: false, rest: '60-90', techType: null },
        { phase: 'Maintien',           sets: 3, reps: '8-12',  rpe: 7, tech: false, rest: '60-90', techType: null },
      ],
    };
    return G[goal] || G.masse;
  },

  // ---------- Périodisation ondulée hebdomadaire (DUP) ----------
  // À l'intérieur d'un mésocycle de 4 semaines, on fait varier la zone de reps
  // pour cibler TOUTES les fibres musculaires :
  //   • heavy = reps basses → fibres rapides type II (force, recrutement neural)
  //   • base  = reps modérées → fibres mixtes IIa (hypertrophie classique)
  //   • light = reps hautes → fibres lentes type I (volume métabolique, capillarisation)
  // Les mêmes exercices sont conservés dans le mésocycle (suivi de la progression),
  // mais la charge se recalcule automatiquement via repFactor() à chaque zone.
  goalRepZones(goal) {
    return ({
      masse:        { heavy: '5-7',  base: '8-12',  light: '13-18' },
      force:        { heavy: '3-5',  base: '5-7',   light: '8-10'  },
      perte_gras:   { heavy: '8-10', base: '12-15', light: '18-25' },
      tonification: { heavy: '8-10', base: '12-15', light: '15-20' },
      maintien:     { heavy: '6-8',  base: '8-12',  light: '12-15' },
    })[goal] || { heavy: '5-7', base: '8-12', light: '13-18' };
  },

  // Zone de fibres ciblée pour une semaine donnée du mésocycle
  zoneForWeek(weekInMeso, mesoIdx, deload, isFinal) {
    if (deload || isFinal) return 'deload';
    // Mésocycle 0 (Adaptation) : pas de DUP, on reste sur la zone de base pour
    // privilégier la maîtrise technique avant d'aller chercher du lourd.
    if (mesoIdx === 0) return 'base';
    if (weekInMeso === 0) return 'heavy';
    if (weekInMeso === 1) return 'base';
    if (weekInMeso === 2) return 'light';
    return 'base';
  },

  zoneLabel(zone) {
    return ({ heavy: 'Lourd · fibres II', base: 'Hypertrophie · fibres mixtes', light: 'Volume · fibres I' })[zone] || '';
  },

  // ---------- Modificateur d'âge & genre ----------
  // Prend en compte les spécificités hormonales :
  // - Femme 45+ : périménopause/ménopause → perte osseuse, sarcopénie accélérée
  //   → Plus de travail en charge (ostéoprotection), repos allongés, récupération+++
  // - Femme < 45 : récupération légèrement plus rapide, moins de fatigue SNC
  ageModifier(age, gender) {
    const g = gender || 'male';
    // Base par âge (applicable à tous)
    let mod;
    if (age < 18)       mod = { volumeFactor: 0.85, intensityCap: 8,  restAdd: 0,  note: 'Adolescent : technique avant la charge, jamais de 1RM.' };
    else if (age <= 35) mod = { volumeFactor: 1.00, intensityCap: 10, restAdd: 0,  note: '' };
    else if (age <= 50) mod = { volumeFactor: 0.95, intensityCap: 9,  restAdd: 15, note: 'Échauffement renforcé, contrôle excentrique.' };
    else if (age <= 65) mod = { volumeFactor: 0.85, intensityCap: 8,  restAdd: 30, note: 'Charges modérées, amplitude complète, repos prolongés.' };
    else                mod = { volumeFactor: 0.75, intensityCap: 7,  restAdd: 45, note: 'Priorité mobilité, articulations, récupération.' };

    // Adaptations spécifiques genre féminin
    if (g === 'female') {
      mod.gender = 'female';
      if (age >= 45) {
        // Ménopause / périménopause : adaptations importantes
        mod.restAdd += 15; // récupération plus longue
        mod.volumeFactor = Math.max(0.70, mod.volumeFactor - 0.05);
        mod.note = (mod.note ? mod.note + ' ' : '') +
          '🦴 Ménopause : priorité charges lourdes (ostéoprotection), exercices portés, récupération allongée, travail d\'équilibre.';
        mod.menopause = true;
      } else {
        mod.note = (mod.note ? mod.note + ' ' : '') +
          'Femme : récupération SNC plus rapide, bien pour le volume. Fessiers/ischio renforcés.';
      }
      // Femmes : privilégier un peu plus le bas du corps / fessiers
      mod.lowerBodyEmphasis = true;
    }
    return mod;
  },

  // ---------- Choix de la technique d'intensification cohérente ----------
  pickTechnique(exoName) {
    const n = exoName.toLowerCase();
    if (n.includes('curl biceps')) return '21';
    if (n.includes('squat') || n.includes('fentes') || n.includes('roumain') || n.includes('goblet') || n.includes('hip thrust')) return 'tempo';
    if (n.includes('élévations') || n.includes('mollets') || n.includes('oiseau')) return 'partial';
    if (n.includes('shrug')) return 'iso-hold';
    if (n.includes('couché barre') || n.includes('rowing barre') || n.includes('soulevé de terre barre') || n.includes('militaire barre') || n.includes('dips')) return 'rest-pause';
    if (n.includes('haltères') && (n.includes('incliné') || n.includes('marteau') || n.includes('latérales'))) return 'dropset';
    if (n.includes('kickback') || n.includes('concentré') || n.includes('écarté')) return 'peak';
    if (n.includes('crunch') || n.includes('relevé')) return 'iso-hold';
    return 'negative';
  },

  // ---------- Génération ----------
  generate(params) {
    const { age, gender, goal, level, equipment, frequency } = params;

    const cat = this.filterByEquipment(this.catalog(), equipment);
    if (cat.length < 6) {
      return { error: 'Pas assez d\'exercices disponibles pour cet équipement. Ajoute des exercices ou choisis un autre matériel.' };
    }

    const split = this.pickSplit(frequency, level);
    const ageMod = this.ageModifier(age, gender);
    const periodization = this.goalPeriodization(goal);
    const repZones = this.goalRepZones(goal);

    // Durée cible : 1h30 (préférée) — 2h max par séance
    const TARGET_DURATION_S = 90 * 60;
    const MAX_DURATION_S    = 120 * 60;
    const TOLERANCE_S       = 12 * 60;
    const secPerSet = 30 + (90 + ageMod.restAdd);
    const TARGET_TOTAL_SETS = Math.floor(TARGET_DURATION_S / secPerSet);
    const MAX_TOTAL_SETS    = Math.floor(MAX_DURATION_S / secPerSet);
    const TOL_SETS          = Math.ceil(TOLERANCE_S / secPerSet);

    // ---------- Structure des semaines pour "masse" (programme Mistral) ----------
    // Deloads : semaines 5, 9, 13, 17, 21 (index 4, 8, 12, 16, 20)
    // Phases :
    //   Phase 1 Adaptation : sem 1–4 (index 0–3)
    //   Deload 1 : sem 5 (index 4)
    //   Phase 2 Volume : sem 6–8 (index 5–7)
    //   Deload 2 : sem 9 (index 8)
    //   Phase 3 Intensité : sem 10–12 (index 9–11)
    //   Deload 3 : sem 13 (index 12)
    //   Phase 4 Variation : sem 14–16 (index 13–15)
    //   Deload 4 : sem 17 (index 16)
    //   Phase 5 Volume Élevé : sem 18–20 (index 17–19)
    //   Deload 5 : sem 21 (index 20)
    //   Phase 6 Pic : sem 22–24 (index 21–23)
    //   + sem 25 deload final, sem 26 retest
    const masseWeekMap = goal === 'masse' ? this._buildMasseWeekMap() : null;

    const weeks = [];
    for (let w = 0; w < 26; w++) {
      let mesoIdx, weekInMeso, deload, isFinal;

      if (goal === 'masse') {
        // Utiliser la structure Mistral pour masse
        if (w < 24) {
          const wm = masseWeekMap[w];
          mesoIdx = wm.mesoIdx;
          weekInMeso = wm.weekInMeso;
          deload = wm.deload;
          isFinal = false;
        } else {
          mesoIdx = 5;
          weekInMeso = 3;
          deload = w === 24;
          isFinal = w === 25;
        }
      } else {
        // Logique originale pour les autres objectifs
        if (w < 24) {
          mesoIdx = Math.floor(w / 4);
          weekInMeso = w % 4;
          deload = (weekInMeso === 3) && (mesoIdx >= 1);
        } else {
          mesoIdx = 5;
          weekInMeso = 3;
          deload = w === 24;
          isFinal = w === 25;
        }
      }

      const meso = periodization[mesoIdx];
      // Zone de fibres ciblée cette semaine (DUP hebdomadaire)
      // Pour masse : pas de DUP, on reste sur 'base' (les reps sont gérées par phase)
      const zone = goal === 'masse'
        ? (deload || isFinal ? 'deload' : 'base')
        : this.zoneForWeek(weekInMeso, mesoIdx, deload, isFinal);
      const zoneLabel = (zone === 'heavy' || zone === 'light') ? ' — ' + this.zoneLabel(zone) : '';
      const phaseLabel = isFinal
        ? 'Bilan & retest'
        : meso.phase + (deload ? ' (Deload)' : zoneLabel);

      // Reps cible selon la zone
      let weekReps = meso.reps;
      if (goal === 'masse') {
        // Pour masse, on respecte les reps de la phase (pas de DUP heavy/light)
        // sauf en deload où on garde les mêmes reps mais volume réduit
        weekReps = meso.reps;
        // Phase 6 Pic : séries lourdes 6-8 + séries légères 12-15
        // On garde le reps de base, les séries légères sont gérées par les techniques
      } else {
        if (zone === 'heavy') weekReps = repZones.heavy;
        else if (zone === 'light') weekReps = repZones.light;
        else if (zone === 'base' && mesoIdx > 0) weekReps = repZones.base;
      }

      // Rotation des exercices
      const dayTemplates = this.buildDayTemplates(split, cat, mesoIdx, ageMod);
      dayTemplates.forEach(d => { d.exos = d.exos.filter(Boolean); });

      // Volume (séries) ajusté
      let setsAdj = meso.sets;
      if (goal === 'masse') {
        // Programme Mistral : deload = 2 séries, sinon selon la phase
        if (deload || isFinal) {
          setsAdj = 2;
        } else {
          setsAdj = meso.sets;
        }
      } else {
        if (deload || isFinal) {
          setsAdj = Math.max(2, meso.sets - 1);
        } else if (zone === 'heavy') {
          setsAdj = Math.max(2, meso.sets - 1);
        } else if (zone === 'light') {
          setsAdj = meso.sets + 1;
        }
      }
      // Modificateur d'âge
      setsAdj = Math.max(2, Math.round(setsAdj * ageMod.volumeFactor));

      // RPE ajusté
      let rpe;
      if (goal === 'masse') {
        // Deload : RPE 6-7 fixe (on utilise 7)
        rpe = deload ? Math.min(7, ageMod.intensityCap) : Math.min(meso.rpe, ageMod.intensityCap);
      } else {
        let rpeBase = meso.rpe;
        if (zone === 'heavy') rpeBase = meso.rpe + 1;
        else if (zone === 'light') rpeBase = Math.max(7, meso.rpe - 1);
        rpe = Math.min(rpeBase, ageMod.intensityCap) - (deload ? 1 : 0);
      }

      // Techniques d'intensification selon la phase
      const useTech = !!meso.tech && !deload && !isFinal;
      const techType = meso.techType || null;

      const days = dayTemplates.map(t => {
        let exos = t.exos;

        // Helpers partagés : détection abdos + troncage préservant la diversité musculaire.
        // Principe : quand on doit couper des exos pour respecter un cap, on retire d'abord
        // les DOUBLONS de muscle (ex : 2ᵉ exo pectoraux) plutôt que de sacrifier un muscle
        // unique de la fin de la liste (typiquement Triceps ou Biceps).
        const isAbdo = (name) => {
          const n = name.toLowerCase();
          return n.includes('crunch') || n.includes('relevé') || n.includes('releve') || n.includes('gainage') || n.includes('mountain');
        };
        const muscleOf = (name) => {
          const e = cat.find(c => c.name === name);
          return e ? e.muscle : 'Autre';
        };
        const trimPreservingMuscles = (list, targetLen) => {
          const result = [...list];
          while (result.length > targetLen) {
            const counts = {};
            result.forEach(n => { const m = muscleOf(n); counts[m] = (counts[m] || 0) + 1; });
            // Chercher, en partant de la fin, un exo dont le muscle a >1 occurrence
            let dropIdx = -1;
            for (let i = result.length - 1; i >= 0; i--) {
              if (counts[muscleOf(result[i])] > 1) { dropIdx = i; break; }
            }
            if (dropIdx === -1) break; // tous les muscles n'ont qu'1 exo : on ne peut plus couper sans en perdre un
            result.splice(dropIdx, 1);
          }
          // Fallback si un muscle unique doit sauter (deload très serré) : couper en fin
          return result.slice(0, targetLen);
        };

        if (goal === 'masse') {
          // Programme Mistral : 6-7 exercices par séance (pas de remplissage)
          // Upper : ~6 exos composés + isolation + abdos intégrés
          // Lower : ~5-6 exos + mollets + abdos/gainage
          const masseMaxExos = deload ? 5 : 7;
          if (exos.length > masseMaxExos) {
            const abdos = exos.filter(isAbdo).slice(0, 1);
            const nonAbdos = exos.filter(n => !isAbdo(n));
            const trimmed = trimPreservingMuscles(nonAbdos, masseMaxExos - abdos.length);
            exos = trimmed.concat(abdos);
          }
          // Pas de remplissage automatique pour masse
        } else {
          // Logique originale pour les autres objectifs
          const targetExos = Math.max(4, Math.floor(TARGET_TOTAL_SETS / setsAdj));
          const maxExos    = Math.max(targetExos, Math.floor(MAX_TOTAL_SETS / setsAdj));
          const cutExos    = Math.min(maxExos, targetExos + Math.ceil(TOL_SETS / setsAdj));

          if (exos.length > cutExos) {
            const abdos = exos.filter(isAbdo);
            const nonAbdos = exos.filter(n => !isAbdo(n));
            const trimmed = trimPreservingMuscles(nonAbdos, Math.max(1, cutExos - abdos.length));
            exos = trimmed.concat(abdos);
          } else if (exos.length < targetExos) {
            const existing = new Set(exos);
            const muscles = [...new Set(exos.map(muscleOf).filter(Boolean))];
            for (const m of muscles) {
              if (exos.length >= targetExos) break;
              const extras = cat.filter(c => c.muscle === m && !existing.has(c.name));
              for (const ex of extras) {
                if (exos.length >= targetExos) break;
                exos.push(ex.name);
                existing.add(ex.name);
              }
            }
          }
        }

        return {
          name: t.name,
          exercises: exos.map((name, idx) => {
            const isLastTwo = idx >= exos.length - 2;
            let tech = '';
            if (useTech && !deload) {
              if (goal === 'masse') {
                // Phase 4 (Variation) : supersets sur les 2 derniers exos
                // Phase 5 (Volume Élevé) : dropset sur le 1er exo composé
                // Phase 6 (Pic) : rest-pause sur le 2ème exo, techniques avancées
                if (techType === 'superset' && isLastTwo) {
                  tech = 'superset';
                } else if (techType === 'dropset' && idx === 0) {
                  tech = 'dropset';
                } else if (techType === 'rest-pause') {
                  if (idx === 1) tech = 'rest-pause';
                  else if (isLastTwo) tech = 'superset'; // Giant set simulé par superset
                }
              } else {
                tech = isLastTwo ? this.pickTechnique(name) : '';
              }
            }
            const exoData = cat.find(c => c.name === name);
            let reps = deload ? this.softReps(weekReps) : weekReps;
            if (exoData && exoData.isometric) {
              const baseTime = 30 + (mesoIdx * 5);
              reps = deload ? `${Math.max(20, baseTime - 10)}s` : `${baseTime}s`;
            }
            // Phase 6 Pic : séries légères (derniers exos) en 12-15 reps
            if (goal === 'masse' && mesoIdx === 5 && !deload && !isFinal && isLastTwo && !(exoData && exoData.isometric)) {
              reps = '12-15';
            }
            return {
              name,
              sets: setsAdj,
              reps,
              kg: 0,
              lastSetTechnique: tech
            };
          })
        };
      });

      // Repos recommandé pour cette semaine (masse = variable par phase)
      const restForWeek = goal === 'masse'
        ? (deload ? 90 : parseInt(meso.rest) || 90)
        : (90 + ageMod.restAdd);

      weeks.push({ weekNum: w + 1, mesoIdx, phase: phaseLabel, deload: !!deload || !!isFinal, rpe, zone, days, restRecommended: restForWeek });
    }

    const goalLabel = this.goalLabel(goal);
    const eqLabel = this.equipmentLabel(equipment);
    const startDate = new Date().toISOString();

    // Repos recommandé global (pour masse, on prend la médiane)
    const globalRest = goal === 'masse' ? 90 : (90 + ageMod.restAdd);

    const plan = {
      id: 'plan_' + Date.now(),
      isPlan: true,
      name: `🧠 Plan 6 mois — ${goalLabel}`,
      desc: `${frequency}j/sem · ${eqLabel} · ${gender === 'female' ? '♀' : '♂'} ${age} ans · niveau ${this.levelLabel(level)}${ageMod.note ? ' · ' + ageMod.note : ''}`,
      params,
      ageMod,
      startDate,
      restRecommended: globalRest,
      weeks,
      weekProgress: 0,
      completedDays: {},
      days: weeks[0].days
    };
    return { plan };
  },

  // ---------- Structure des semaines Masse (programme Mistral) ----------
  // Mapping semaine globale → phase + deload
  _buildMasseWeekMap() {
    const map = [];
    // Phase 1 Adaptation : semaines 1–4 (index 0–3), mesoIdx=0
    for (let i = 0; i < 4; i++) map.push({ mesoIdx: 0, weekInMeso: i, deload: false });
    // Deload 1 : semaine 5 (index 4), mesoIdx=0
    map.push({ mesoIdx: 0, weekInMeso: 0, deload: true });
    // Phase 2 Volume : semaines 6–8 (index 5–7), mesoIdx=1
    for (let i = 0; i < 3; i++) map.push({ mesoIdx: 1, weekInMeso: i, deload: false });
    // Deload 2 : semaine 9 (index 8), mesoIdx=1
    map.push({ mesoIdx: 1, weekInMeso: 0, deload: true });
    // Phase 3 Intensité : semaines 10–12 (index 9–11), mesoIdx=2
    for (let i = 0; i < 3; i++) map.push({ mesoIdx: 2, weekInMeso: i, deload: false });
    // Deload 3 : semaine 13 (index 12), mesoIdx=2
    map.push({ mesoIdx: 2, weekInMeso: 0, deload: true });
    // Phase 4 Variation : semaines 14–16 (index 13–15), mesoIdx=3
    for (let i = 0; i < 3; i++) map.push({ mesoIdx: 3, weekInMeso: i, deload: false });
    // Deload 4 : semaine 17 (index 16), mesoIdx=3
    map.push({ mesoIdx: 3, weekInMeso: 0, deload: true });
    // Phase 5 Volume Élevé : semaines 18–20 (index 17–19), mesoIdx=4
    for (let i = 0; i < 3; i++) map.push({ mesoIdx: 4, weekInMeso: i, deload: false });
    // Deload 5 : semaine 21 (index 20), mesoIdx=4
    map.push({ mesoIdx: 4, weekInMeso: 0, deload: true });
    // Phase 6 Pic : semaines 22–24 (index 21–23), mesoIdx=5
    for (let i = 0; i < 3; i++) map.push({ mesoIdx: 5, weekInMeso: i, deload: false });
    return map; // 24 entrées (index 0–23)
  },

  // Reps assouplies pour deload : prendre la borne basse
  softReps(reps) {
    if (!reps || !reps.includes('-')) return reps;
    const [lo] = reps.split('-');
    return lo + '-' + lo;
  },

  // ---------- Calcul du poids cible par rapport au defaultKg utilisateur ----------
  // defaultKg est supposé être le poids de travail "8-10 reps" à RPE 8 (~75% 1RM).
  // On ajuste selon : plage de reps, deload, et RPE cible de la semaine.
  repFactor(reps) {
    if (!reps) return 0.72;
    if (reps === '21') return 0.45;
    const hi = parseInt(String(reps).replace(/\/jambe/, '').split('-').pop()) || 10;
    if (hi <= 5) return 0.90;
    if (hi <= 6) return 0.85;
    if (hi <= 8) return 0.80;
    if (hi <= 10) return 0.75;
    if (hi <= 12) return 0.72;
    if (hi <= 15) return 0.65;
    if (hi <= 20) return 0.60;
    return 0.55;
  },

  // Facteur d'ajustement RPE : le defaultKg correspond à RPE 8.
  // Si le RPE cible est différent, on ajuste (~4% par point de RPE)
  rpeFactor(targetRpe) {
    if (!targetRpe) return 1;
    const diff = targetRpe - 8; // RPE 8 = référence
    return 1 + (diff * 0.04); // +4% par point au-dessus, -4% en dessous
  },

  computeTargetKg(defaultKg, reps, deload, targetRpe) {
    if (!defaultKg) return 0;
    const ratio = this.repFactor(reps) / 0.75; // 8-10 reps comme référence
    const rpeAdj = this.rpeFactor(targetRpe);
    const factor = ratio * rpeAdj * (deload ? 0.80 : 1);
    // Arrondi au demi-kilo le plus proche
    return Math.max(0, Math.round(defaultKg * factor * 2) / 2);
  },

  // ---------- Calcul de la semaine en cours ----------
  // Priorité : override manuel ◀▶ > avancement par complétion > legacy date-based
  currentWeekIdx(plan) {
    const clamp = (n) => Math.max(0, Math.min(25, n));
    if (plan.manualWeekIdx != null) return clamp(plan.manualWeekIdx);
    if (plan.weekProgress != null) return clamp(plan.weekProgress);
    // Fallback : ancienne logique date-based (compatibilité avec plans créés avant)
    const start = new Date(plan.startDate).getTime();
    const diff = (Date.now() - start) / (7 * 24 * 3600 * 1000);
    return clamp(Math.floor(diff));
  },

  // ---------- Libellés ----------
  goalLabel(g) {
    return ({ masse: 'Prise de masse', force: 'Force', perte_gras: 'Perte de gras', tonification: 'Tonification', maintien: 'Maintien' })[g] || g;
  },
  equipmentLabel(e) {
    return ({ gym: 'Salle complète', home_full: 'Maison (barre + haltères + banc)', dumbbell_bench: 'Haltères + banc', dumbbell_only: 'Haltères seuls', bodyweight: 'Poids du corps' })[e] || e;
  },
  levelLabel(l) {
    return ({ beginner: 'débutant', intermediate: 'intermédiaire', advanced: 'avancé' })[l] || l;
  },
};

























