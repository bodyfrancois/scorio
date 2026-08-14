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
  translations: {
    fr: {
      name: 'Pétanque',
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
    },
    en: {
      name: 'Pétanque',
      description: 'Throw your boules as close as possible to the jack. The first team to reach 13 points wins the game.',
      detailedRules: `
1. Goal of the game

Be the first team to reach 13 points by placing your boules closest to the jack (the target ball).

---

2. Formations

- 1 vs 1: 3 boules each
- 2 vs 2 (doubles): 3 boules each
- 3 vs 3 (triples): 2 boules each

---

3. Starting a round

The team that wins the toss starts. A player draws a circle on the ground (35–50 cm across) and throws the jack 6–10 meters away. The same player throws the first boule.

Feet must not leave the circle before the boule has touched the ground.

---

4. Gameplay

The team that is not currently leading always plays next. They can:
- Point: place their boule closer to the jack.
- Shoot: knock an opponent's boule out of the way.

When a team has no boules left, the other team throws all of theirs.

---

5. Scoring

At the end of the round, only one team scores:
- They score 1 point for each of their boules that is closer to the jack than the opponent's best boule.
- The other team scores 0 points.

Example: Team A has 3 boules closer than Team B's best boule → Team A scores 3 points.

---

6. Next round

The team that scored picks up the jack and starts the next round.

---

7. End of game

The first team to reach 13 points wins the game.
`,
    },
  },
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
