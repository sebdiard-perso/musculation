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
    if (n.includes('banc') || n.includes('couché') || n.includes('incliné') || n.includes('assis') || n.includes('bulgares')) tags.push('bench');
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
  buildDayTemplates(split, cat) {
    const p = (m, n = 1, skip = 0) => this.pickByMuscle(cat, m, n, skip);

    const fullA = [...p('Jambes', 1), ...p('Pectoraux', 1), ...p('Dos', 1), ...p('Épaules', 1), ...p('Biceps', 1), ...p('Abdos', 1)];
    const fullB = [...p('Jambes', 1, 1), ...p('Pectoraux', 1, 1), ...p('Dos', 1, 1), ...p('Épaules', 1, 1), ...p('Triceps', 1), ...p('Mollets', 1)];

    const push = [...p('Pectoraux', 2), ...p('Épaules', 2), ...p('Triceps', 2)];
    const pull = [...p('Dos', 3), ...p('Biceps', 2)];
    const legs = [...p('Jambes', 3), ...p('Mollets', 1), ...p('Abdos', 1)];

    const upperA = [...p('Pectoraux', 2), ...p('Dos', 2), ...p('Épaules', 1), ...p('Biceps', 1), ...p('Triceps', 1)];
    const upperB = [...p('Pectoraux', 2, 1), ...p('Dos', 2, 1), ...p('Épaules', 2, 1), ...p('Biceps', 1, 1), ...p('Triceps', 1, 1)];
    const lowerA = [...p('Jambes', 3), ...p('Mollets', 1), ...p('Abdos', 1)];
    const lowerB = [...p('Jambes', 3, 1), ...p('Mollets', 1), ...p('Abdos', 1, 1)];

    if (split === 'fullbody2') return [{ name: '🏋️ Full Body A', exos: fullA }, { name: '🏋️ Full Body B', exos: fullB }];
    if (split === 'fullbody3') return [{ name: '🏋️ Full A', exos: fullA }, { name: '🏋️ Full B', exos: fullB }, { name: '🏋️ Full C', exos: [...p('Jambes',1,2),...p('Pectoraux',1),...p('Dos',1),...p('Épaules',1,1),...p('Triceps',1),...p('Abdos',1)] }];
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
      { name: '💪 Push B', exos: [...p('Pectoraux', 2, 1), ...p('Épaules', 2, 1), ...p('Triceps', 2, 1)] },
      { name: '🔙 Pull B', exos: [...p('Dos', 3, 1), ...p('Biceps', 2, 1)] },
      { name: '🦵 Legs B', exos: [...p('Jambes', 3, 1), ...p('Mollets', 1), ...p('Abdos', 1, 1)] }
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
  // 6 mésocycles de 4 semaines (24) + 2 semaines test/deload final = 26 semaines
  goalPeriodization(goal) {
    const G = {
      masse: [
        { phase: 'Adaptation',         sets: 3, reps: '10-12', rpe: 7, tech: false },
        { phase: 'Hypertrophie base',  sets: 4, reps: '8-12',  rpe: 8, tech: false },
        { phase: 'Hypertrophie+',      sets: 4, reps: '8-10',  rpe: 8, tech: true  },
        { phase: 'Force-volume',       sets: 4, reps: '6-8',   rpe: 8, tech: false },
        { phase: 'Pic intensité',      sets: 4, reps: '8-10',  rpe: 9, tech: true  },
        { phase: 'Spécialisation',     sets: 4, reps: '10-12', rpe: 9, tech: true  },
      ],
      force: [
        { phase: 'Adaptation',         sets: 3, reps: '8-10',  rpe: 7, tech: false },
        { phase: 'Volume force',       sets: 4, reps: '6-8',   rpe: 8, tech: false },
        { phase: 'Force base',         sets: 5, reps: '5-6',   rpe: 8, tech: false },
        { phase: 'Force max',          sets: 5, reps: '3-5',   rpe: 9, tech: false },
        { phase: 'Pic',                sets: 4, reps: '5-6',   rpe: 9, tech: true  },
        { phase: 'Test 1RM',           sets: 3, reps: '3-5',   rpe: 9, tech: false },
      ],
      perte_gras: [
        { phase: 'Adaptation',         sets: 3, reps: '12-15', rpe: 7, tech: false },
        { phase: 'Volume',             sets: 3, reps: '12-15', rpe: 8, tech: false },
        { phase: 'Densité',            sets: 4, reps: '12-15', rpe: 8, tech: true  },
        { phase: 'Métabolique',        sets: 3, reps: '15-20', rpe: 8, tech: true  },
        { phase: 'Pic métabolique',    sets: 4, reps: '12-15', rpe: 9, tech: true  },
        { phase: 'Maintien densité',   sets: 3, reps: '12-15', rpe: 8, tech: false },
      ],
      tonification: [
        { phase: 'Adaptation',         sets: 3, reps: '12-15', rpe: 7, tech: false },
        { phase: 'Endurance',          sets: 3, reps: '15-20', rpe: 7, tech: false },
        { phase: 'Hypertrophie légère',sets: 4, reps: '10-12', rpe: 8, tech: false },
        { phase: 'Volume',             sets: 4, reps: '12-15', rpe: 8, tech: true  },
        { phase: 'Pic',                sets: 4, reps: '10-12', rpe: 8, tech: true  },
        { phase: 'Maintien',           sets: 3, reps: '12-15', rpe: 7, tech: false },
      ],
      maintien: [
        { phase: 'Maintien',           sets: 3, reps: '8-12',  rpe: 7, tech: false },
        { phase: 'Maintien',           sets: 3, reps: '8-12',  rpe: 7, tech: false },
        { phase: 'Stim. modérée',      sets: 3, reps: '8-12',  rpe: 8, tech: false },
        { phase: 'Maintien',           sets: 3, reps: '8-12',  rpe: 7, tech: false },
        { phase: 'Stim. modérée',      sets: 3, reps: '8-12',  rpe: 8, tech: false },
        { phase: 'Maintien',           sets: 3, reps: '8-12',  rpe: 7, tech: false },
      ],
    };
    return G[goal] || G.masse;
  },

  // ---------- Modificateur d'âge ----------
  ageModifier(age) {
    if (age < 18)   return { volumeFactor: 0.85, intensityCap: 8,  restAdd: 0,  note: 'Adolescent : technique avant la charge, jamais de 1RM.' };
    if (age <= 35)  return { volumeFactor: 1.00, intensityCap: 10, restAdd: 0,  note: '' };
    if (age <= 50)  return { volumeFactor: 0.95, intensityCap: 9,  restAdd: 15, note: 'Échauffement renforcé, contrôle excentrique.' };
    if (age <= 65)  return { volumeFactor: 0.85, intensityCap: 8,  restAdd: 30, note: 'Charges modérées, amplitude complète, repos prolongés.' };
    return            { volumeFactor: 0.75, intensityCap: 7,  restAdd: 45, note: 'Priorité mobilité, articulations, récupération.' };
  },

  // ---------- Choix de la technique d'intensification cohérente ----------
  pickTechnique(exoName) {
    const n = exoName.toLowerCase();
    if (n.includes('curl biceps')) return '21';
    if (n.includes('squat') || n.includes('fentes') || n.includes('roumain') || n.includes('goblet')) return 'tempo';
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
    const { age, goal, level, equipment, frequency } = params;

    const cat = this.filterByEquipment(this.catalog(), equipment);
    if (cat.length < 6) {
      return { error: 'Pas assez d\'exercices disponibles pour cet équipement. Ajoute des exercices ou choisis un autre matériel.' };
    }

    const split = this.pickSplit(frequency, level);
    const dayTemplates = this.buildDayTemplates(split, cat);
    const ageMod = this.ageModifier(age);
    const periodization = this.goalPeriodization(goal);

    // Vérifier que chaque jour a au moins 4 exos (sinon rebalance)
    dayTemplates.forEach(d => { d.exos = d.exos.filter(Boolean); });

    const weeks = [];
    for (let w = 0; w < 26; w++) {
      // Mésocycle 0..5 → 6×4=24 semaines; semaines 24-25 = deload + retest
      let mesoIdx, weekInMeso, deload, isFinal;
      if (w < 24) {
        mesoIdx = Math.floor(w / 4);
        weekInMeso = w % 4;
        deload = (weekInMeso === 3) && (mesoIdx >= 1); // deload semaine 4 des mésocycles 2 à 6
      } else {
        mesoIdx = 5;
        weekInMeso = 3;
        deload = w === 24; // semaine 25 = deload
        isFinal = w === 25; // semaine 26 = retest / consolidation
      }
      const meso = periodization[mesoIdx];
      const phaseLabel = isFinal ? 'Bilan & retest' : meso.phase + (deload ? ' (Deload)' : '');

      // Volume modulé : semaine 1 base, semaine 2 +1 série, semaine 3 +2 séries, semaine 4 deload (si applicable)
      let setsAdj = meso.sets;
      if (!deload && !isFinal) {
        if (weekInMeso === 1) setsAdj = meso.sets;            // base
        else if (weekInMeso === 2) setsAdj = meso.sets + 1;   // surcharge volume
        else if (weekInMeso === 0) setsAdj = Math.max(2, meso.sets - 1); // accumulation douce
      } else if (deload) {
        setsAdj = Math.max(2, meso.sets - 1);
      }
      // Modificateur d'âge
      setsAdj = Math.max(2, Math.round(setsAdj * ageMod.volumeFactor));

      const rpe = Math.min(meso.rpe, ageMod.intensityCap) - (deload ? 1 : 0);
      const useTech = !!meso.tech && !deload && !isFinal;

      const days = dayTemplates.map(t => ({
        name: t.name,
        exercises: t.exos.map((name, idx) => {
          const isLastTwo = idx >= t.exos.length - 2;
          const tech = useTech && isLastTwo ? this.pickTechnique(name) : '';
          return {
            name,
            sets: setsAdj,
            reps: deload ? this.softReps(meso.reps) : meso.reps,
            kg: 0,
            lastSetTechnique: tech
          };
        })
      }));

      weeks.push({ weekNum: w + 1, mesoIdx, phase: phaseLabel, deload: !!deload || !!isFinal, rpe, days });
    }

    const goalLabel = this.goalLabel(goal);
    const eqLabel = this.equipmentLabel(equipment);
    const startDate = new Date().toISOString();

    const plan = {
      id: 'plan_' + Date.now(),
      isPlan: true,
      name: `🧠 Plan 6 mois — ${goalLabel}`,
      desc: `${frequency}j/sem · ${eqLabel} · ${age} ans · niveau ${this.levelLabel(level)}${ageMod.note ? ' · ' + ageMod.note : ''}`,
      params,
      ageMod,
      startDate,
      restRecommended: 90 + ageMod.restAdd,
      weeks,
      // Avancement par complétion : weekProgress augmente quand toutes les séances
      // de la semaine courante sont marquées comme faites dans completedDays.
      weekProgress: 0,
      completedDays: {},
      // days = synchronisé avec la semaine en cours (mis à jour dynamiquement)
      days: weeks[0].days
    };
    return { plan };
  },

  // Reps assouplies pour deload : prendre la borne basse
  softReps(reps) {
    if (!reps || !reps.includes('-')) return reps;
    const [lo] = reps.split('-');
    return lo + '-' + lo;
  },

  // ---------- Calcul du poids cible par rapport au defaultKg utilisateur ----------
  // defaultKg est supposé être le poids de travail "8-10 reps" (~75% 1RM).
  // On déduit un facteur d'ajustement selon la plage de reps de la semaine.
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

  // Calcule le poids cible pour un exercice donné en fonction du defaultKg
  // de l'utilisateur, des reps de la semaine et de l'état deload.
  computeTargetKg(defaultKg, reps, deload) {
    if (!defaultKg) return 0;
    const ratio = this.repFactor(reps) / 0.75; // 8-10 reps comme référence
    const factor = ratio * (deload ? 0.80 : 1);
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




