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
  translations: {
    fr: {
      name: '5 Rois',
      description: "Les 5 Rois est un jeu de cartes inspiré du Rami. Le but est d’avoir le moins de points possible à la fin de la partie en réalisant des combinaisons et en se débarrassant de ses cartes.",
      detailedRules: `
1. Objectif du jeu

Le but du jeu est d’avoir le moins de points possible à la fin de la partie. Les joueurs réalisent des combinaisons de cartes pour se débarrasser de leurs cartes et marquer le moins de points possible.

---

2. Les cartes

Le plateau est constitué de deux jeux de cartes contenant chacun cinq couleurs: Étoiles , Coeurs , Trèfles , Piques , Carreaux

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
    },
    en: {
      name: '5 Kings',
      description: "5 Kings is a card game inspired by Rummy. The goal is to have as few points as possible at the end of the game by forming combinations and getting rid of your cards.",
      detailedRules: `
1. Goal of the game

The goal of the game is to have as few points as possible at the end of the game. Players form card combinations to get rid of their cards and score as few points as possible.

---

2. The cards

The set is made up of two decks of cards, each containing five suits: Stars, Hearts, Clubs, Spades, Diamonds

Each suit has 11 cards: 3 to 10, Jack (J), Queen (Q) and King (K), plus 6 Jokers complete the deck.
Each card is worth the number shown on it, and
Kings = 13, Queens = 12, Jacks = 11, Jokers = 50

The current Bonus is worth 20. The Bonus changes from one deal to the next: each deal, it is the card whose value equals the number of cards dealt to each player. So when three cards are dealt, the 3s are the Bonus, when four cards are dealt, the 4s are the Bonus, and so on, until the final deal when the Kings (K) become the Bonus in turn.

---

3. Combinations

- Run: at least 3 cards of the same suit with consecutive values (e.g. 4, 5, 6 of hearts)
- Set: at least 3 cards of the same value but different suits (e.g. Jack of hearts, Jack of diamonds, Jack of clubs)
- Any card in a run can be replaced by a Joker or a Bonus card, regardless of its suit. A run can contain as many Jokers and Bonus cards as possible (and they can be placed next to each other). Jokers and Bonus cards
replace any card.
---

4. Playing a round

The player seated to the dealer's left plays first, then play continues clockwise. Each player starts by taking a card from the top of the draw pile or the top of the discard pile, then discards one card face up onto the discard pile. A player can only lay combinations on the table by exposing all of their cards at once, or, on their turn, once another player has gone out.

Once a player goes out, the other players get one more turn. Each player may then take a card from the draw pile or the discard pile. They lay down any runs and sets they were able to form, discard a card onto the discard pile, and count the penalty points for the cards remaining in their hand. You cannot add cards onto other players' runs or sets.

The value of exposed cards does not count; only the cards remaining in hand are scored. Points are recorded and totaled on the score sheet. The number of cards dealt increases by one each round, and the Bonus card changes as described above.

The game continues until the eleventh deal, when the Kings become the Bonus. The winner is the player with the lowest total score after this final deal.


---

5. End of round and end of the game

- The round ends when a player has laid down all of their cards. The other players count the points of the cards remaining in their hand.
- After 11 rounds, the player with the lowest total score wins the game.

`,
    },
  },
  detailedRules: `
1. Objectif du jeu

Le but du jeu est d’avoir le moins de points possible à la fin de la partie. Les joueurs réalisent des combinaisons de cartes pour se débarrasser de leurs cartes et marquer le moins de points possible.

--- 

2. Les cartes

Le plateau est constitué de deux jeux de cartes contenant chacun cinq couleurs: Étoiles , Coeurs , Trèfles , Piques , Carreaux

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