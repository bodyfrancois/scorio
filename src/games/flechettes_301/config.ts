import { GameConfig } from '../../core/types';

export const flechettes301Config: GameConfig = {
  name: 'FLÉCHETTES 301',
  minPlayers: 2,
  maxPlayers: 4,
  estimatedDuration: 20,
  age: '+7',
  category: 'Sport',
  lowestScoreWins: true,
  scoreMin: 0,
  scoreMax: 180,
  scoreInputMode: 'keypad',
  quickActionGroups: [
    {
      label: 'Centre',
      actions: [
        { label: 'BULL', value: 50, maxCount: 3 },
        { label: 'DEMI', value: 25, maxCount: 3 },
      ],
    },
    {
      label: 'Triple',
      actions: Array.from({ length: 20 }, (_, i) => ({
        label: String(20 - i),
        value: (20 - i) * 3,
        maxCount: 3,
      })),
    },
    {
      label: 'Double',
      actions: Array.from({ length: 20 }, (_, i) => ({
        label: String(20 - i),
        value: (20 - i) * 2,
        maxCount: 3,
      })),
    },
  ],
  description: 'Jeu de fléchettes classique : partez de 301 points et descendez à exactement 0 pour gagner.',
  image: require('./asset/logo.png'), // ✅ image locale au module
  translations: {
    fr: {
      name: 'Fléchettes 301',
      description: 'Jeu de fléchettes classique : partez de 301 points et descendez à exactement 0 pour gagner.',
      detailedRules: `
1. Objectif du jeu

Être le premier joueur à réduire son score à exactement 0. Tous les joueurs commencent avec 301 points.

---

2. Déroulement d'un tour

À chaque tour, un joueur lance 3 fléchettes. Le total des points marqués est soustrait à son score actuel.

Saisir dans l'application le total des 3 fléchettes pour ce tour.

---

3. BUST (dépassement)

Si votre score descend en dessous de 0, c'est un BUST :
- Votre tour s'arrête immédiatement (même si vous n'avez pas lancé vos 3 fléchettes).
- Votre score revient au total que vous aviez avant ce tour.
- L'application détecte automatiquement le BUST et ignore le score saisi.

---

4. Zones spéciales

Utilisez les raccourcis de zones pour ajouter rapidement les points correspondants :

- BULL (bullseye central) : 50 points
- DEMI-BULL (anneau extérieur) : 25 points
- T20 (triple 20) : 60 points
- T19 (triple 19) : 57 points

Entrez d'abord le reste de votre score au clavier, puis appuyez sur la zone concernée pour l'ajouter.

---

5. Fin de partie

Le premier joueur qui atteint exactement 0 remporte la partie.
`,
    },
    en: {
      name: 'Darts 301',
      description: 'Classic darts game: start from 301 points and count down to exactly 0 to win.',
      detailedRules: `
1. Goal of the game

Be the first player to reduce your score to exactly 0. All players start with 301 points.

---

2. How a turn works

On each turn, a player throws 3 darts. The total points scored is subtracted from their current score.

Enter the total of the 3 darts for that turn into the app.

---

3. BUST (overshoot)

If your score would drop below 0, that's a BUST:
- Your turn ends immediately (even if you haven't thrown all 3 darts).
- Your score reverts to what it was before this turn.
- The app automatically detects the BUST and ignores the entered score.

---

4. Special zones

Use the zone shortcuts to quickly add the corresponding points:

- BULL (center bullseye): 50 points
- OUTER BULL (outer ring): 25 points
- T20 (triple 20): 60 points
- T19 (triple 19): 57 points

First enter the rest of your score on the keypad, then tap the relevant zone to add it.

---

5. End of game

The first player to reach exactly 0 wins the game.
`,
    },
  },
  detailedRules: `
1. Objectif du jeu

Être le premier joueur à réduire son score à exactement 0. Tous les joueurs commencent avec 301 points.

---

2. Déroulement d'un tour

À chaque tour, un joueur lance 3 fléchettes. Le total des points marqués est soustrait à son score actuel.

Saisir dans l'application le total des 3 fléchettes pour ce tour.

---

3. BUST (dépassement)

Si votre score descend en dessous de 0, c'est un BUST :
- Votre tour s'arrête immédiatement (même si vous n'avez pas lancé vos 3 fléchettes).
- Votre score revient au total que vous aviez avant ce tour.
- L'application détecte automatiquement le BUST et ignore le score saisi.

---

4. Zones spéciales

Utilisez les raccourcis de zones pour ajouter rapidement les points correspondants :

- BULL (bullseye central) : 50 points
- DEMI-BULL (anneau extérieur) : 25 points
- T20 (triple 20) : 60 points
- T19 (triple 19) : 57 points

Entrez d'abord le reste de votre score au clavier, puis appuyez sur la zone concernée pour l'ajouter.

---

5. Fin de partie

Le premier joueur qui atteint exactement 0 remporte la partie.
`,
};
