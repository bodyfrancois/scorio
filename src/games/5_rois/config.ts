import { GameConfig } from '../../core/types';

export const fiveKingConfig: GameConfig = {
  name: '5 ROIS',
  minPlayers: 2,
  maxPlayers: 7,
  lowestScoreWins: true,
  estimatedDuration: 30,
  age: '+8',
  category: 'Cartes',
  description: "Les 5 Rois est un jeu de cartes inspiré du Rami. Le but est d’avoir le moins de points possible à la fin de la partie en réalisant des combinaisons et en se débarrassant de ses cartes.",
  quickActions: [],
  image: require('./asset/logo.png'),
  detailedRules: `
1. Objectif du jeu

Le but du jeu est d’avoir le moins de points possible à la fin de la partie. Les joueurs réalisent des combinaisons de cartes pour se débarrasser de leurs cartes et marquer le moins de points possible.

--- 

2. Les cartes

Le plateau est constitué de deux jeux Carreauxrtes contenant chacun cinq couleurs: Étoiles , Coeurs , Trèfles , Piques , Carreaux

Chaque couleur comporte 11 cartes: 3 à 10, Valet (J), Dame (Q) et Roi (K) et 6 Jokers complètent le jeu. 
Chaque carte vaut le nombre qu’elle porte, et les
Rois = 13, Dames = 12, Valets = 11, Jokers = 50

le Bonus actuel vaut 20. Le Bonus change d’une donne à l’autre, et à chaque donne c’est la carte dont la valeur est égale le nombre de cartes distribuées à chacun. Ainsi, quand trois cartes sont distribuées, les 3 sont le Bonus, quand 4 cartes sont distribuées, les 4 sont les Bonus, et ainsi de suite, jusqu’à la dernière donne où les Rois (K) deviennent Bonus à leur tour. 

---

3. Combinaisons

- Suite : au moins 3 cartes de la même couleur avec des valeurs consécutives (ex : 4, 5, 6 de cœur)
- Famille : au moins 3 cartes de même valeur mais de couleurs différentes (ex : Valet de cœur, Valet de carreau, Valet de trèfle)
- N’importe quelle carte de la suite peut être remplacée par un Joker ou un Bonus, quelle que soit la couleur de celui–
ci. Il peut y avoir autant de Jokers et de Bonus que possible dans une suite (et ils peuvent être placés côte à côte). Les
Jokers et les Bonus remplacent n’importe quelle carte.
---

4. Déroulement d'une manche

Le joueur assis à gauche du donneur joue le premier, et ainsi de suite, dans le sens horaire. Chaque joueur commence par prendre une carte du dessus de la pioche ou du dessus de la défausse, puis rejette une sur la défausse, face visible. Un joueur ne peut déposer des combinaisons sur la table qu’en exposant la totalité de ses cartes, ou à son tour, lorsqu’un joueur a exposé.

Quand un joueur expose, les autres joueurs ont encore un tour de jeu. Chaque joueur peut alors prendre une carte de la pioche ou de la défausse. Il pose alors les suites et les familles qu’il a pu former, rejette une carte sur la défausse et compte les points de pénalité correspondants aux cartes lui restant en main. On ne peut pas placer de cartes sur les suites ou familles des autres joueurs. 

La valeur des cartes exposées ne compte pas, seules les cartes restant en main seront comptabilisées. Les points sont inscrits et totalisés sur la feuille de scores. La distribution des cartes sera augmenté d’une à chaque donne et la carte Bonus change comme décrit plus haut. 

La partie continue jusqu’à la onzième donne, les Rois étant alors le Bonus. Le gagnant est celui–ci qui, après cette dernière donne, totalise le plus bas score. 


---

5. Fin de la manche et fin de la partie

- La manche se termine lorsqu'un joueur a posé toutes ses cartes. Les autres joueurs comptent les points des cartes restantes dans leur main.
- Après 11 manches, le joueur avec le total de points le plus bas gagne la partie.

`,
};