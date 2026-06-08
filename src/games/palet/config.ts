import { GameConfig } from '../../core/types';

export const paletConfig: GameConfig = {
  name: 'PALET',
  minPlayers: 2,
  maxPlayers: 4,
  estimatedDuration: 30,
  age: '+7',
  category: 'Extérieur',
  lowestScoreWins: false,
  scoreLimit: 13,
  scoreMin: 0,
  scoreMax: 6,
  scoreStep: 1,
  scoreInputMode: 'stepper',
  teamsToggle: true,
  exclusiveRoundScoring: true,
  image: require('./asset/logo.png'), // ✅ image locale au module
  description: 'Jeu traditionnel breton où les joueurs lancent des palets métalliques sur une planche pour se rapprocher du maître.',
  detailedRules: `
1. Objectif du jeu

Être le premier joueur ou la première équipe à atteindre 11 ou 13 points en plaçant ses palets le plus près du « maître » (petit palet cible).

---

2. Matériel

- Une planche de jeu (plaque en bois ou en ardoise)
- Des palets (disques métalliques ou en bois), généralement 6 par joueur ou équipe
- Un maître (petit palet servant de cible, placé au centre de la planche)

---

3. Déroulement d'une manche

- Au début de chaque manche, le maître est posé au centre de la planche.
- Chaque joueur (ou équipe) lance ses palets à tour de rôle vers le maître.
- Un palet n'est valable que s'il atterrit directement sur la planche sans toucher le sol au préalable, et s'il reste sur la planche.

---

4. Décompte des points

Après que tous les palets ont été lancés :

- On identifie le palet le plus proche du maître parmi tous les joueurs.
- Le joueur (ou l'équipe) possédant ce palet marque autant de points qu'il a de palets placés plus près du maître que le palet le plus proche adverse.
- L'autre joueur ou équipe marque 0 point pour cette manche.
- Entrez 0 pour le joueur qui ne marque pas.

Exemple : l'équipe A a 3 palets plus proches que le meilleur palet de l'équipe B → l'équipe A marque 3 points.

---

5. Fin de partie

La partie se termine dès qu'un joueur ou une équipe atteint ou dépasse le score limite (11 ou 13 points selon la partie).

Le joueur ou l'équipe avec le score le plus élevé est déclaré(e) vainqueur(e).
`,
};
