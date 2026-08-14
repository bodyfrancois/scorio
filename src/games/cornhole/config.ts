import { GameConfig } from '../../core/types';

export const cornholeConfig: GameConfig = {
  name: 'CORNHOLE',
  minPlayers: 2,
  maxPlayers: 2,
  estimatedDuration: 20,
  age: '+7',
  category: 'Extérieur',
  lowestScoreWins: false,
  scoreLimit: 21,
  scoreMin: 0,
  scoreMax: 12,
  scoreStep: 1,
  scoreInputMode: 'stepper',
  teamsToggle: true,
  description: 'Lancez vos sacs sur la planche adverse : dans le trou (3 pts) ou sur la planche (1 pt). Seul l\'écart de points est comptabilisé (cancellation scoring).',
  image: require('./asset/logo.png'), // ✅ image locale au module
  translations: {
    fr: {
      name: 'Cornhole',
      description: "Lancez vos sacs sur la planche adverse : dans le trou (3 pts) ou sur la planche (1 pt). Seul l'écart de points est comptabilisé (cancellation scoring).",
      detailedRules: `
1. Objectif du jeu

Être le premier joueur ou la première équipe à atteindre 21 points avec au moins 2 points d'avance.

---

2. Configuration

2 joueurs : chaque joueur dispose de 4 sacs de sa couleur. Les joueurs se font face à environ 8 mètres (6–7 m pour les débutants).

4 joueurs : deux équipes de 2. Les partenaires se placent face à face, de chaque côté des planches opposées. Chaque équipe dispose de 4 sacs de sa couleur.

---

3. Valeur des sacs

- Dans le trou : 3 points
- Sur la planche : 1 point
- Hors planche ou touche le sol avant la planche : 0 point (sac retiré)

---

4. Cancellation scoring (annulation)

À chaque manche, les deux équipes (ou joueurs) comparent leurs points bruts. Seule la différence est conservée.

Exemple : Équipe A = 5 pts, Équipe B = 8 pts → Équipe B marque 3 pts (8 − 5). Équipe A marque 0 pts.

Entrez dans l'application les points bruts réalisés par chaque équipe sur la manche. L'application calcule automatiquement l'écart.

---

5. Interactions entre sacs

- Votre sac pousse un sac adverse dans le trou → l'adversaire marque 3 pts pour ce sac.
- Votre sac pousse un sac adverse hors de la planche → l'adversaire perd 1 pt pour ce sac.

---

6. Ordre de jeu

L'équipe (ou le joueur) en tête au score lance en premier à la manche suivante. En cas d'égalité, celui qui lançait en second à la manche précédente commence.

---

7. Fin de partie

La partie se termine dès qu'une équipe ou un joueur atteint 21 points avec au moins 2 points d'écart sur l'adversaire.

Si les deux équipes sont à égalité ou à moins de 2 points d'écart après qu'une équipe a atteint 21, on continue jusqu'à obtenir cet écart.
`,
    },
    en: {
      name: 'Cornhole',
      description: "Toss your bags onto the opponent's board: through the hole (3 pts) or onto the board (1 pt). Only the point difference counts (cancellation scoring).",
      detailedRules: `
1. Goal of the game

Be the first player or team to reach 21 points with at least a 2-point lead.

---

2. Setup

2 players: each player gets 4 bags in their color. Players stand facing each other, boards set about 27 feet apart — the regulation cornhole distance (feel free to move them closer for beginners).

4 players: two teams of 2. Partners stand facing each other, one at each board. Each team has 4 bags in their color.

---

3. Bag values

- Through the hole: 3 points
- On the board: 1 point
- Off the board, or touches the ground before landing on the board: 0 points (bag removed)

---

4. Cancellation scoring

At the end of each round, both teams (or players) compare their raw points. Only the difference is kept.

Example: Team A scores 5 pts, Team B scores 8 pts → Team B scores 3 pts (8 − 5). Team A scores 0 pts.

Enter each team's raw points for the round into the app — it works out the difference automatically.

---

5. Bag interactions

- If your bag knocks an opponent's bag into the hole, they score 3 points for that bag.
- If your bag knocks an opponent's bag off the board, they lose 1 point for that bag.

---

6. Turn order

Whoever is leading throws first in the next round. In case of a tie, whoever threw second in the previous round throws first.

---

7. End of game

The game ends as soon as a team or player reaches 21 points with at least a 2-point lead over their opponent.

If both teams are tied or within 2 points of each other after someone reaches 21, play continues until that lead is achieved.
`,
    },
  },
  detailedRules: `
1. Objectif du jeu

Être le premier joueur ou la première équipe à atteindre 21 points avec au moins 2 points d'avance.

---

2. Configuration

2 joueurs : chaque joueur dispose de 4 sacs de sa couleur. Les joueurs se font face à environ 8 mètres (6–7 m pour les débutants).

4 joueurs : deux équipes de 2. Les partenaires se placent face à face, de chaque côté des planches opposées. Chaque équipe dispose de 4 sacs de sa couleur.

---

3. Valeur des sacs

- Dans le trou : 3 points
- Sur la planche : 1 point
- Hors planche ou touche le sol avant la planche : 0 point (sac retiré)

---

4. Cancellation scoring (annulation)

À chaque manche, les deux équipes (ou joueurs) comparent leurs points bruts. Seule la différence est conservée.

Exemple : Équipe A = 5 pts, Équipe B = 8 pts → Équipe B marque 3 pts (8 − 5). Équipe A marque 0 pts.

Entrez dans l'application les points bruts réalisés par chaque équipe sur la manche. L'application calcule automatiquement l'écart.

---

5. Interactions entre sacs

- Votre sac pousse un sac adverse dans le trou → l'adversaire marque 3 pts pour ce sac.
- Votre sac pousse un sac adverse hors de la planche → l'adversaire perd 1 pt pour ce sac.

---

6. Ordre de jeu

L'équipe (ou le joueur) en tête au score lance en premier à la manche suivante. En cas d'égalité, celui qui lançait en second à la manche précédente commence.

---

7. Fin de partie

La partie se termine dès qu'une équipe ou un joueur atteint 21 points avec au moins 2 points d'écart sur l'adversaire.

Si les deux équipes sont à égalité ou à moins de 2 points d'écart après qu'une équipe a atteint 21, on continue jusqu'à obtenir cet écart.
`,
};
