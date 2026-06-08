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
