import { GameConfig } from '../../core/types';

export const petanqueConfig: GameConfig = {
  name: 'PÉTANQUE',
  minPlayers: 2,
  maxPlayers: 6,
  estimatedDuration: 45,
  age: '+7',
  category: 'Extérieur',
  lowestScoreWins: false,
  scoreLimit: 13,
  scoreMin: 0,
  scoreMax: 9,
  scoreStep: 1,
  scoreInputMode: 'stepper',
  teamsToggle: true,
  exclusiveRoundScoring: true,
  image: require('./asset/logo.png'),
  description: 'Lancez vos boules le plus près du cochonnet. La première équipe à atteindre 13 points remporte la partie.',
  detailedRules: `
1. Objectif du jeu

Être la première équipe à atteindre 13 points en plaçant ses boules le plus près du cochonnet (le « but »).

---

2. Formations

- 1 contre 1 : 3 boules chacun
- 2 contre 2 (doublette) : 3 boules chacun
- 3 contre 3 (triplette) : 2 boules chacun

---

3. Début de manche

L'équipe qui tire au sort commence. Un joueur trace un cercle au sol (35–50 cm) et lance le cochonnet à 6–10 mètres. Le même joueur lance la première boule.

Les pieds ne doivent pas sortir du cercle avant que la boule ait touché le sol.

---

4. Déroulement

C'est toujours l'équipe qui ne mène pas qui joue. Elle peut :
- Pointer : placer sa boule plus près du cochonnet.
- Tirer : déloger une boule adverse.

Quand une équipe n'a plus de boules, l'autre joue toutes les siennes.

---

5. Décompte des points

À la fin de la manche, une seule équipe marque :
- Elle marque 1 point par boule mieux placée que la meilleure boule adverse.
- L'autre équipe marque 0 point.

Exemple : l'équipe A a 3 boules plus proches que la meilleure boule de l'équipe B → l'équipe A marque 3 points.

---

6. Manche suivante

L'équipe qui a marqué récupère le cochonnet et lance la manche suivante.

---

7. Fin de partie

La première équipe à atteindre 13 points remporte la partie.
`,
};
