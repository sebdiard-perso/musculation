const DATA = {
  techniques: {
    'rest-pause': { emoji: '⏱️', label: 'Rest-Pause', color: '#e94560',
      desc: 'Max de reps, repos 15s, repartir au max, repos 15s, une dernière fois',
      detail: { principe: 'Prolonger une série au-delà de l\'échec en intercalant de micro-repos. Permet d\'accumuler plus de volume sur un même poids.', execution: '1. Faire le max de reps jusqu\'à l\'échec\n2. Poser la barre, repos 15 secondes\n3. Reprendre et faire le max de reps\n4. Repos 15 secondes\n5. Dernière série au max', usage: 'Exercices polyarticulaires lourds : développé couché, squat, rowing barre, dips.', conseil: 'Utiliser un poids que tu peux faire 6-8 reps normalement. Avoir un pareur sur les exercices avec barre. Ne pas utiliser sur le soulevé de terre.' } },
    '21': { emoji: '🔥', label: 'Méthode 21', color: '#f0a500',
      desc: '7 reps moitié basse + 7 reps moitié haute + 7 reps complètes',
      detail: { principe: 'Travailler le muscle sur différentes portions du mouvement pour un stress mécanique maximal. 21 reps au total sans pause.', execution: '1. 7 reps sur la moitié basse (de bas jusqu\'au milieu)\n2. 7 reps sur la moitié haute (du milieu jusqu\'en haut)\n3. 7 reps sur l\'amplitude complète', usage: 'Curls biceps uniquement (haltères ou barre). Parfait en dernière série pour finir les biceps.', conseil: 'Prendre 40-50% de ton poids habituel. La brûlure est intense, c\'est normal. Ne pas tricher avec l\'élan.' } },
    'peak': { emoji: '💠', label: 'Peak Contraction', color: '#4ecca3',
      desc: 'Maintenir 2-3s en contraction maximale sur chaque rep',
      detail: { principe: 'Maximiser le temps sous tension en maintenant la position de contraction maximale. Recrute plus de fibres musculaires.', execution: '1. Exécuter le mouvement normalement\n2. En haut du mouvement, SERRER le muscle au maximum\n3. Tenir 2-3 secondes en contractant fort\n4. Redescendre lentement', usage: 'Exercices d\'isolation : kickback triceps, élévations latérales, rowing un bras, crunch, shrug.', conseil: 'Baisser le poids de 20% par rapport à d\'habitude. La qualité de la contraction prime sur la charge.' } },
    'dropset': { emoji: '⬇️', label: 'Drop Set', color: '#c77dff',
      desc: 'Enchaîner sans repos en baissant le poids de 20-30% à chaque fois (3 paliers)',
      detail: { principe: 'Aller au-delà de l\'échec en réduisant la charge immédiatement. Provoque un afflux sanguin massif (pump) et un stress métabolique élevé.', execution: '1. Faire le max de reps avec ton poids normal\n2. SANS REPOS, baisser le poids de 20-30%\n3. Faire le max de reps\n4. Baisser encore de 20-30%, faire le max', usage: 'Idéal avec haltères (changement rapide) : développé incliné, curl marteau, élévations.', conseil: 'Préparer les haltères à l\'avance. Maximum 1 drop set par exercice. Pas sur les exercices lourds avec barre.' } },
    'negative': { emoji: '🔻', label: 'Négatives lentes', color: '#ff6b6b',
      desc: 'Phase excentrique (descente) très lente sur 4-5 secondes',
      detail: { principe: 'Le muscle est plus fort en excentrique qu\'en concentrique. Ralentir la descente crée plus de micro-lésions = plus de croissance.', execution: '1. Monter le poids normalement (1-2s)\n2. Redescendre TRÈS LENTEMENT sur 4-5 secondes\n3. Contrôler chaque centimètre de la descente\n4. Répéter', usage: 'Composés moyens : développé militaire, soulevé de terre roumain, fentes.', conseil: 'Garder le même poids que d\'habitude ou légèrement plus lourd. Attention aux courbatures le lendemain !' } },
    'superset': { emoji: '⚡', label: 'Superset', color: '#ffd166',
      desc: "Enchaîner immédiatement avec l'exercice suivant sans repos",
      detail: { principe: 'Enchaîner deux exercices sans repos pour augmenter l\'intensité et gagner du temps.', execution: '1. Terminer ta série de l\'exercice A\n2. SANS REPOS, passer directement à l\'exercice B\n3. Repos normal après les deux exercices', usage: 'Biceps/Triceps, Pectoraux/Dos, ou deux exercices du même muscle (pré-fatigue).', conseil: 'Préparer les deux postes à l\'avance. Baisser légèrement les poids car la fatigue s\'accumule.' } },
    'tempo': { emoji: '🎵', label: 'Tempo 4-1-2-1', color: '#06d6a0',
      desc: '4s descente, 1s pause bas, 2s montée, 1s pause haut',
      detail: { principe: 'Contrôler chaque phase du mouvement avec un tempo précis. Augmente le temps sous tension et améliore la connexion muscle-cerveau.', execution: '1. Descendre sur 4 secondes\n2. Pause 1 seconde en bas\n3. Monter sur 2 secondes\n4. Pause 1 seconde en haut\n5. Chaque rep dure ~8 secondes', usage: 'Exercices de jambes (fentes, squat, goblet squat) et exercices où le contrôle est important.', conseil: 'Baisser le poids de 30-40%. 8 reps en tempo = 64 secondes sous tension. Compter à voix haute aide.' } },
    'iso-hold': { emoji: '✊', label: 'Iso Hold', color: '#118ab2',
      desc: 'Tenir la position la plus dure 10-15s après la dernière rep',
      detail: { principe: 'La contraction isométrique recrute des fibres musculaires différentes. Excellent pour la force statique et la définition.', execution: '1. Faire toutes tes reps normalement\n2. Sur la DERNIÈRE rep, tenir la position la plus dure\n3. Maintenir 10-15 secondes en contractant au maximum\n4. Relâcher lentement', usage: 'Shrug (tenir en haut), mollets (tenir sur la pointe), crunch (tenir en contraction), relevé de jambes.', conseil: 'Respirer pendant le maintien ! Ne pas bloquer la respiration. La brûlure est normale.' } },
    'partial': { emoji: '✂️', label: 'Partielles', color: '#ef476f',
      desc: "Après l'échec, continuer avec des demi-reps jusqu'au max",
      detail: { principe: 'Quand tu ne peux plus faire de rep complète, le muscle peut encore travailler sur une amplitude réduite. Permet d\'épuiser totalement les fibres.', execution: '1. Faire tes reps normales jusqu\'à l\'échec\n2. Continuer avec des DEMI-REPS (moitié du mouvement)\n3. Puis des QUARTS de reps si possible\n4. Arrêter quand tu ne peux plus bouger', usage: 'Élévations latérales, mollets, curl concentré, tout exercice d\'isolation.', conseil: 'Uniquement sur la dernière série. Ne pas utiliser sur les exercices lourds avec barre (risque de blessure).' } },
  },

  descriptions: {
    'Développé couché barre': { muscles: 'Pectoraux, deltoïdes antérieurs, triceps', exec: 'Allongé sur le banc, pieds au sol. Descendre la barre au niveau des tétons, coudes à 45°. Pousser en contractant les pecs. Ne pas cambrer excessivement.' },
    'Développé incliné haltères': { muscles: 'Haut des pectoraux, deltoïdes antérieurs', exec: 'Banc incliné à 30-45°. Descendre les haltères de chaque côté de la poitrine, coudes ouverts. Remonter en rapprochant les haltères sans les cogner.' },
    'Écarté couché haltères': { muscles: 'Pectoraux (étirement), deltoïdes antérieurs', exec: 'Allongé, bras légèrement fléchis. Ouvrir les bras en arc de cercle jusqu\'à sentir l\'étirement. Remonter en serrant les pecs. Ne pas tendre les bras complètement.' },
    'Soulevé de terre barre': { muscles: 'Dos complet, ischio-jambiers, fessiers, trapèzes', exec: 'Pieds largeur hanches, barre contre les tibias. Dos droit, pousser le sol avec les pieds. Garder la barre proche du corps. Ne jamais arrondir le dos.' },
    'Rowing barre buste penché': { muscles: 'Dorsaux, rhomboïdes, trapèzes, biceps', exec: 'Buste penché à 45°, dos droit. Tirer la barre vers le nombril en serrant les omoplates. Contrôler la descente. Ne pas utiliser l\'élan.' },
    'Rowing un bras haltère': { muscles: 'Grand dorsal, rhomboïdes, biceps', exec: 'Un genou et une main sur le banc. Tirer l\'haltère vers la hanche en gardant le coude proche du corps. Serrer l\'omoplate en haut.' },
    'Shrug haltères (trapèzes)': { muscles: 'Trapèzes supérieurs', exec: 'Debout, haltères le long du corps. Monter les épaules vers les oreilles sans plier les coudes. Tenir 1-2s en haut. Descendre lentement.' },
    'Développé militaire barre': { muscles: 'Deltoïdes (surtout antérieurs), triceps, trapèzes', exec: 'Debout ou assis, barre au niveau des clavicules. Pousser au-dessus de la tête en gardant le tronc gainé. Ne pas cambrer le dos.' },
    'Élévations latérales haltères': { muscles: 'Deltoïdes latéraux (moyens)', exec: 'Debout, légère flexion des coudes. Monter les bras sur les côtés jusqu\'à l\'horizontale. Petits doigts légèrement plus hauts que les pouces. Contrôler la descente.' },
    'Élévations frontales haltères': { muscles: 'Deltoïdes antérieurs', exec: 'Debout, bras le long du corps. Monter un bras devant soi jusqu\'à l\'horizontale, bras quasi tendu. Alterner ou faire les deux en même temps.' },
    'Oiseau haltères (arrière épaule)': { muscles: 'Deltoïdes postérieurs, rhomboïdes', exec: 'Buste penché à 90°, bras pendants. Écarter les bras sur les côtés en serrant les omoplates. Coudes légèrement fléchis. Contrôler le mouvement.' },
    'Curl biceps haltères': { muscles: 'Biceps brachial, brachial antérieur', exec: 'Debout, coudes collés au corps. Monter les haltères en supination (paumes vers le haut). Ne pas balancer le corps. Contrôler la descente.' },
    'Curl marteau haltères': { muscles: 'Brachial, brachio-radial, biceps', exec: 'Comme le curl classique mais paumes face à face (prise neutre). Excellent pour l\'épaisseur du bras. Ne pas balancer.' },
    'Curl concentré haltère': { muscles: 'Biceps (pic)', exec: 'Assis, coude calé contre l\'intérieur de la cuisse. Monter l\'haltère en contractant le biceps au maximum en haut. Mouvement lent et contrôlé.' },
    'Dips sur banc (triceps)': { muscles: 'Triceps, deltoïdes antérieurs, pectoraux', exec: 'Mains sur le bord du banc, pieds au sol ou surélevés. Descendre en pliant les coudes vers l\'arrière. Remonter en poussant. Plus les pieds sont loin, plus c\'est dur.' },
    'Kickback haltère triceps': { muscles: 'Triceps (longue portion)', exec: 'Buste penché, coude fixé à 90° le long du corps. Tendre le bras vers l\'arrière en contractant le triceps. Seul l\'avant-bras bouge.' },
    'Extension haltère au-dessus tête': { muscles: 'Triceps (longue portion)', exec: 'Assis ou debout, un haltère tenu à deux mains derrière la tête. Tendre les bras vers le haut. Coudes pointés vers le plafond, ne pas les écarter.' },
    'Squat barre': { muscles: 'Quadriceps, fessiers, ischio-jambiers, lombaires', exec: 'Barre sur les trapèzes, pieds largeur épaules. Descendre en poussant les fesses en arrière, genoux dans l\'axe des pieds. Descendre au moins à la parallèle. Dos droit.' },
    'Fentes haltères': { muscles: 'Quadriceps, fessiers, ischio-jambiers', exec: 'Haltères le long du corps. Faire un grand pas en avant, descendre le genou arrière vers le sol. Le genou avant ne dépasse pas la pointe du pied. Alterner les jambes.' },
    'Soulevé de terre roumain haltères': { muscles: 'Ischio-jambiers, fessiers, lombaires', exec: 'Debout, haltères devant les cuisses. Descendre en poussant les fesses en arrière, jambes quasi tendues. Sentir l\'étirement des ischios. Dos toujours droit.' },
    'Goblet squat haltère': { muscles: 'Quadriceps, fessiers', exec: 'Tenir un haltère verticalement contre la poitrine. Squatter profond, coudes entre les genoux. Excellent pour apprendre la technique du squat.' },
    'Mollets debout barre': { muscles: 'Mollets (gastrocnémiens, soléaire)', exec: 'Barre sur les trapèzes, pointes des pieds sur une marche. Monter sur la pointe des pieds le plus haut possible. Descendre lentement en étirant. Amplitude complète.' },
    'Mollets debout haltère': { muscles: 'Mollets (gastrocnémiens, soléaire)', exec: 'Un haltère dans une main, pointe du pied sur une marche, autre main en appui. Monter sur la pointe le plus haut possible. Descendre lentement. Faire chaque jambe.' },
    'Développé couché haltères': { muscles: 'Pectoraux, deltoïdes antérieurs, triceps', exec: 'Allongé sur le banc plat, haltères au-dessus de la poitrine. Descendre les haltères de chaque côté, coudes à 45°. Pousser en contractant les pecs. Amplitude complète.' },
    'Développé épaules haltères assis': { muscles: 'Deltoïdes (antérieurs et latéraux), triceps', exec: 'Assis sur le banc, dossier droit. Haltères au niveau des oreilles, coudes à 90°. Pousser au-dessus de la tête sans verrouiller. Contrôler la descente.' },
    'Fentes bulgares haltères': { muscles: 'Quadriceps, fessiers, ischio-jambiers', exec: 'Pied arrière sur le banc, haltères le long du corps. Descendre le genou arrière vers le sol. Garder le buste droit. Plus efficace que les fentes classiques pour les fessiers.' },
    'Crunch': { muscles: 'Grand droit de l\'abdomen', exec: 'Allongé, genoux fléchis, mains derrière la tête. Enrouler le buste en décollant les épaules. Ne pas tirer sur la nuque. Expirer en montant, contrôler la descente.' },
    'Relevé de jambes couché': { muscles: 'Abdominaux inférieurs, psoas', exec: 'Allongé sur le banc ou au sol. Monter les jambes tendues jusqu\'à la verticale. Descendre lentement sans toucher le sol. Garder le bas du dos plaqué.' },
    'Crunch inversé': { muscles: 'Abdominaux inférieurs', exec: 'Allongé, genoux fléchis. Enrouler le bassin vers le haut en soulevant les fesses du sol. Contracter les abdos bas. Redescendre lentement sans élan.' },
    'Gainage planche': { muscles: 'Grand droit, transverse, obliques', exec: 'En appui sur les avant-bras et les pointes de pieds. Corps aligné de la tête aux talons. Serrer les abdos et les fessiers. Ne pas cambrer ni relever les fesses. Tenir le temps indiqué.' },
    'Mountain climber': { muscles: 'Abdominaux, psoas, cardio', exec: 'Position de pompe, bras tendus. Ramener un genou vers la poitrine en alternance, rapidement. Garder le dos plat et le gainage constant. Rythme soutenu.' },
  },

  defaultExercises: [
    { id: 1, name: 'Développé couché barre', muscle: 'Pectoraux', video: 'https://www.youtube.com/watch?v=rT7DgCr-3pg', mode: 'barbell' },
    { id: 2, name: 'Développé incliné haltères', muscle: 'Pectoraux', video: 'https://www.youtube.com/watch?v=8iPEnn-ltC8', mode: 'bilateral' },
    { id: 3, name: 'Écarté couché haltères', muscle: 'Pectoraux', video: 'https://www.youtube.com/watch?v=eozdVDA78K0', mode: 'bilateral' },
    { id: 4, name: 'Soulevé de terre barre', muscle: 'Dos', video: 'https://www.youtube.com/watch?v=op9kVnSso6Q', mode: 'barbell' },
    { id: 5, name: 'Rowing barre buste penché', muscle: 'Dos', video: 'https://www.youtube.com/watch?v=T3N-TO4reLQ', mode: 'barbell' },
    { id: 6, name: 'Rowing un bras haltère', muscle: 'Dos', video: 'https://www.youtube.com/watch?v=pYcpY20QaE8', mode: 'unilateral' },
    { id: 7, name: 'Shrug haltères (trapèzes)', muscle: 'Dos', video: 'https://www.youtube.com/watch?v=cJRVVxmytaM', mode: 'bilateral' },
    { id: 8, name: 'Développé militaire barre', muscle: 'Épaules', video: 'https://www.youtube.com/watch?v=2yjwXTZQDDI', mode: 'barbell' },
    { id: 9, name: 'Élévations latérales haltères', muscle: 'Épaules', video: 'https://www.youtube.com/watch?v=3VcKaXpzqRo', mode: 'bilateral' },
    { id: 10, name: 'Élévations frontales haltères', muscle: 'Épaules', video: 'https://www.youtube.com/watch?v=gzDe-ELmhTE', mode: 'alternated' },
    { id: 11, name: 'Oiseau haltères (arrière épaule)', muscle: 'Épaules', video: 'https://www.youtube.com/watch?v=ttvfGg9d76c', mode: 'bilateral' },
    { id: 12, name: 'Curl biceps haltères', muscle: 'Biceps', video: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo', mode: 'bilateral' },
    { id: 13, name: 'Curl marteau haltères', muscle: 'Biceps', video: 'https://www.youtube.com/watch?v=zC3nLlEvin4', mode: 'alternated' },
    { id: 14, name: 'Curl concentré haltère', muscle: 'Biceps', video: 'https://www.youtube.com/watch?v=Jvj2wV0vOYU', mode: 'unilateral' },
    { id: 15, name: 'Dips sur banc (triceps)', muscle: 'Triceps', video: 'https://www.youtube.com/watch?v=6kALZikXxLc', mode: 'bilateral' },
    { id: 16, name: 'Kickback haltère triceps', muscle: 'Triceps', video: 'https://www.youtube.com/watch?v=6SS6K3lAwZ8', mode: 'unilateral' },
    { id: 17, name: 'Extension haltère au-dessus tête', muscle: 'Triceps', video: 'https://www.youtube.com/watch?v=_gsUck-7M74', mode: 'bilateral' },
    { id: 18, name: 'Squat barre', muscle: 'Jambes', video: 'https://www.youtube.com/watch?v=ultWZbUMPL8', mode: 'barbell' },
    { id: 19, name: 'Fentes haltères', muscle: 'Jambes', video: 'https://www.youtube.com/watch?v=D7KaRcUTQeE', mode: 'alternated' },
    { id: 20, name: 'Soulevé de terre roumain haltères', muscle: 'Jambes', video: 'https://www.youtube.com/watch?v=2SHsk9AzdjA', mode: 'bilateral' },
    { id: 21, name: 'Goblet squat haltère', muscle: 'Jambes', video: 'https://www.youtube.com/watch?v=MeIiIdhvXT4', mode: 'bilateral' },
    { id: 22, name: 'Mollets debout barre', muscle: 'Mollets', video: 'https://www.youtube.com/watch?v=gwLzBJYoWlI', mode: 'barbell' },
    { id: 23, name: 'Crunch', muscle: 'Abdos', video: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU', mode: 'bilateral' },
    { id: 24, name: 'Relevé de jambes couché', muscle: 'Abdos', video: 'https://www.youtube.com/watch?v=JB2oyawG9KI', mode: 'bilateral' },
    { id: 29, name: 'Crunch inversé', muscle: 'Abdos', video: 'https://www.youtube.com/watch?v=hyv14e2QDq0', mode: 'bilateral' },
    { id: 30, name: 'Gainage planche', muscle: 'Abdos', video: 'https://www.youtube.com/watch?v=ASdvN_XEl_c', mode: 'bilateral' },
    { id: 31, name: 'Mountain climber', muscle: 'Abdos', video: 'https://www.youtube.com/watch?v=nmwgirgXLYM', mode: 'bilateral' },
    { id: 25, name: 'Développé couché haltères', muscle: 'Pectoraux', video: 'https://www.youtube.com/watch?v=VmB1G1K7v94' },
    { id: 26, name: 'Développé épaules haltères assis', muscle: 'Épaules', video: 'https://www.youtube.com/watch?v=qEwKCR5JCog' },
    { id: 27, name: 'Mollets debout haltère', muscle: 'Mollets', video: 'https://www.youtube.com/watch?v=gwLzBJYoWlI' },
    { id: 28, name: 'Fentes bulgares haltères', muscle: 'Jambes', video: 'https://www.youtube.com/watch?v=2C-uNgKwPLE' },
  ],

  // PROGRAMMES COHÉRENTS — techniques adaptées au type d'exercice
  // rest-pause → composés lourds | dropset → isolation haltères | negative → composés moyens
  // peak → isolation contraction | iso-hold → statique | tempo → jambes contrôle
  // 21 → curls uniquement | partial → isolation fin de série
  programs: [
    {
      id: 'ppl', name: 'Push / Pull / Legs', desc: '3 jours, idéal pour intermédiaires. Rotation : Push → Pull → Legs → repos → repeat.',
      days: [
        { name: '💪 Push (Poussée)', exercises: [
          { name: 'Développé couché barre', sets: 4, reps: '8-10', lastSetTechnique: 'rest-pause' },
          { name: 'Développé incliné haltères', sets: 3, reps: '10-12', lastSetTechnique: 'dropset' },
          { name: 'Développé militaire barre', sets: 3, reps: '8-10', lastSetTechnique: 'negative' },
          { name: 'Élévations latérales haltères', sets: 4, reps: '12-15', lastSetTechnique: 'partial' },
          { name: 'Dips sur banc (triceps)', sets: 3, reps: '10-12', lastSetTechnique: 'rest-pause' },
          { name: 'Kickback haltère triceps', sets: 3, reps: '12-15', lastSetTechnique: 'peak' },
        ]},
        { name: '🔙 Pull (Tirage)', exercises: [
          { name: 'Soulevé de terre barre', sets: 4, reps: '5-6' },
          { name: 'Rowing barre buste penché', sets: 4, reps: '8-10', lastSetTechnique: 'rest-pause' },
          { name: 'Rowing un bras haltère', sets: 3, reps: '10-12', lastSetTechnique: 'peak' },
          { name: 'Shrug haltères (trapèzes)', sets: 3, reps: '12-15', lastSetTechnique: 'iso-hold' },
          { name: 'Curl biceps haltères', sets: 3, reps: '10-12', lastSetTechnique: '21' },
          { name: 'Curl marteau haltères', sets: 3, reps: '10-12', lastSetTechnique: 'dropset' },
        ]},
        { name: '🦵 Legs (Jambes)', exercises: [
          { name: 'Squat barre', sets: 4, reps: '6-8', lastSetTechnique: 'rest-pause' },
          { name: 'Fentes haltères', sets: 3, reps: '10-12/jambe', lastSetTechnique: 'tempo' },
          { name: 'Soulevé de terre roumain haltères', sets: 3, reps: '10-12', lastSetTechnique: 'negative' },
          { name: 'Mollets debout barre', sets: 4, reps: '15-20', lastSetTechnique: 'iso-hold' },
          { name: 'Crunch', sets: 3, reps: '15-20', lastSetTechnique: 'peak' },
        ]},
      ]
    },
    {
      id: 'fullbody', name: 'Full Body', desc: '3×/semaine (lun-mer-ven), parfait pour débutants. Alterner séance A et B.',
      days: [
        { name: '🏋️ Séance A', exercises: [
          { name: 'Squat barre', sets: 3, reps: '8-10', lastSetTechnique: 'rest-pause' },
          { name: 'Développé couché barre', sets: 3, reps: '8-10', lastSetTechnique: 'negative' },
          { name: 'Rowing barre buste penché', sets: 3, reps: '8-10', lastSetTechnique: 'peak' },
          { name: 'Développé militaire barre', sets: 3, reps: '10-12' },
          { name: 'Curl biceps haltères', sets: 2, reps: '10-12', lastSetTechnique: '21' },
          { name: 'Crunch', sets: 3, reps: '15-20' },
        ]},
        { name: '🏋️ Séance B', exercises: [
          { name: 'Soulevé de terre barre', sets: 3, reps: '5-6' },
          { name: 'Développé incliné haltères', sets: 3, reps: '10-12', lastSetTechnique: 'dropset' },
          { name: 'Rowing un bras haltère', sets: 3, reps: '10-12', lastSetTechnique: 'peak' },
          { name: 'Fentes haltères', sets: 3, reps: '10-12/jambe', lastSetTechnique: 'tempo' },
          { name: 'Élévations latérales haltères', sets: 3, reps: '12-15', lastSetTechnique: 'partial' },
          { name: 'Dips sur banc (triceps)', sets: 2, reps: '10-12', lastSetTechnique: 'rest-pause' },
        ]},
      ]
    },
    {
      id: 'halteresbanc', name: 'Haltères & Banc — RPE', desc: '4 jours/sem (lun-mar-jeu-ven). Upper/Lower avec haltères + banc uniquement. Progression par RPE sur 4 semaines (S1-2: RPE 7-8, S3: RPE 8-9, S4: deload RPE 6-7 poids -20%).',
      days: [
        { name: '⬆️ Upper A (Force)', exercises: [
          { name: 'Développé couché haltères', sets: 4, reps: '8-10', lastSetTechnique: 'negative' },
          { name: 'Développé incliné haltères', sets: 3, reps: '10-12', lastSetTechnique: 'negative' },
          { name: 'Écarté couché haltères', sets: 3, reps: '12-15', lastSetTechnique: 'tempo' },
          { name: 'Rowing un bras haltère', sets: 4, reps: '8-10', lastSetTechnique: 'negative' },
          { name: 'Shrug haltères (trapèzes)', sets: 3, reps: '12-15', lastSetTechnique: 'iso-hold' },
          { name: 'Développé épaules haltères assis', sets: 3, reps: '8-10', lastSetTechnique: 'negative' },
          { name: 'Élévations latérales haltères', sets: 3, reps: '12-15', lastSetTechnique: 'tempo' },
          { name: 'Oiseau haltères (arrière épaule)', sets: 3, reps: '12-15', lastSetTechnique: 'negative' },
          { name: 'Curl biceps haltères', sets: 3, reps: '10-12', lastSetTechnique: 'negative' },
          { name: 'Extension haltère au-dessus tête', sets: 3, reps: '10-12', lastSetTechnique: 'negative' },
        ]},
        { name: '⬇️ Lower A (Force)', exercises: [
          { name: 'Goblet squat haltère', sets: 4, reps: '10-12', lastSetTechnique: 'tempo' },
          { name: 'Fentes bulgares haltères', sets: 3, reps: '10-12/jambe', lastSetTechnique: 'negative' },
          { name: 'Soulevé de terre roumain haltères', sets: 4, reps: '10-12', lastSetTechnique: 'negative' },
          { name: 'Mollets debout haltère', sets: 4, reps: '15-20', lastSetTechnique: 'negative' },
          { name: 'Crunch', sets: 3, reps: '15-20', lastSetTechnique: 'tempo' },
          { name: 'Relevé de jambes couché', sets: 3, reps: '15-20', lastSetTechnique: 'tempo' },
        ]},
        { name: '⬆️ Upper B (Volume)', exercises: [
          { name: 'Développé incliné haltères', sets: 3, reps: '12-15', lastSetTechnique: 'tempo' },
          { name: 'Développé couché haltères', sets: 3, reps: '12-15', lastSetTechnique: 'tempo' },
          { name: 'Écarté couché haltères', sets: 3, reps: '15-20', lastSetTechnique: 'negative' },
          { name: 'Rowing un bras haltère', sets: 3, reps: '12-15', lastSetTechnique: 'tempo' },
          { name: 'Shrug haltères (trapèzes)', sets: 3, reps: '15-20', lastSetTechnique: 'negative' },
          { name: 'Développé épaules haltères assis', sets: 3, reps: '12-15', lastSetTechnique: 'tempo' },
          { name: 'Élévations latérales haltères', sets: 4, reps: '15-20', lastSetTechnique: 'negative' },
          { name: 'Oiseau haltères (arrière épaule)', sets: 3, reps: '15-20', lastSetTechnique: 'tempo' },
          { name: 'Curl marteau haltères', sets: 3, reps: '12-15', lastSetTechnique: 'negative' },
          { name: 'Kickback haltère triceps', sets: 3, reps: '12-15', lastSetTechnique: 'tempo' },
        ]},
        { name: '⬇️ Lower B (Volume)', exercises: [
          { name: 'Fentes bulgares haltères', sets: 4, reps: '12-15/jambe', lastSetTechnique: 'tempo' },
          { name: 'Goblet squat haltère', sets: 3, reps: '15-20', lastSetTechnique: 'negative' },
          { name: 'Soulevé de terre roumain haltères', sets: 3, reps: '15-20', lastSetTechnique: 'tempo' },
          { name: 'Fentes haltères', sets: 3, reps: '12-15/jambe', lastSetTechnique: 'negative' },
          { name: 'Mollets debout haltère', sets: 4, reps: '20-25', lastSetTechnique: 'tempo' },
          { name: 'Crunch', sets: 3, reps: '20-25', lastSetTechnique: 'negative' },
          { name: 'Relevé de jambes couché', sets: 3, reps: '15-20', lastSetTechnique: 'tempo' },
        ]},
      ]
    }
  ],

  // Paliers de progression par groupe musculaire
  weightIncrements: {
    'Pectoraux': 2.5,   // gros composés
    'Dos': 2.5,         // gros composés
    'Jambes': 2.5,      // gros composés
    'Épaules': 2,       // composés moyens
    'Biceps': 1,        // isolation
    'Triceps': 1,       // isolation
    'Mollets': 1,       // isolation
    'Abdos': 0,         // pas de poids généralement
  },
};
