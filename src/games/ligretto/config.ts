import { GameConfig } from '../../core/types';

export const ligrettoConfig: GameConfig = {
  name: 'LIGRETTO',
  minPlayers: 2,
  maxPlayers: 4,
  estimatedDuration: 10,
  age:'+8',
  category: 'Jeu de cartes',
  lowestScoreWins: false,
  roundLimit: 10,
  description: 'Un  jeu de cartes turbulent qui ne devrait manquer chez aucun amateur de jeux. Fascinant, divertissant et incroyablement simple!',
  image: require('./asset/logo.png'), // ✅ image locale au module
  translations: {
    fr: {
      name: 'Ligretto',
      description: 'Un  jeu de cartes turbulent qui ne devrait manquer chez aucun amateur de jeux. Fascinant, divertissant et incroyablement simple!',
      detailedRules: `
1. Objectif du jeu

Après avoir reçu un jeu de 40 cartes de même motif, chaque joueur constitue son Ligretto (paquet de 10 cartes, à l’envers, empilé devant soi avec les chiffres vers le haut) ainsi que sa série (ce sont les 3 cartes côté à côte, chiffres vers le haut) à droite du Ligretto.

Le joueur garde dans sa main les cartes qui lui restent.

---

2. Manches et tours

Le jeu commence lorsqu’un joueur prononce « LIGRETTO » : il faut alors poser au plus vite un 1 si on en possède un.
Cette carte peut être dans le Ligretto, dans la série ou même dans la main.
Il faut alors tirer rapidement 3 cartes qui sont dans sa main, à l’envers, les empiler jusqu’à trouver le chiffre.

Pendant ce temps les autres joueurs jouent de la même façon, les cartes montent et l’on peut alors mettre d’autres chiffres, et cela jusqu’à 10.

---

3. Phase de Fin

La partie se termine quand un joueur a fini son paquet de Ligretto il dit alors : « LIGRETTO STOP ». Il faut ensuite compter les points.
`,
    },
    en: {
      name: 'Ligretto',
      description: 'A boisterous card game that no game lover should be without. Fascinating, entertaining, and incredibly simple!',
      detailedRules: `
1. Goal of the game

After receiving a 40-card deck of matching pattern, each player builds their Ligretto pile (a stack of 10 cards, face down, stacked in front of them with the numbers facing up) as well as their row (3 cards side by side, numbers facing up) to the right of the Ligretto pile.

The player keeps the remaining cards in their hand.

---

2. Rounds and turns

The game starts when a player calls out "LIGRETTO": everyone must then play a 1 as quickly as possible if they have one.
This card can be in the Ligretto pile, in the row, or even in the hand.
Players must then quickly flip 3 cards from their hand, face down, stacking them until they find the right number.

Meanwhile the other players play the same way, the numbers climb, and other numbers can then be played, all the way up to 10.

---

3. End phase

The game ends when a player finishes their Ligretto pile; they then call out "LIGRETTO STOP." Points are then counted.
`,
    },
  },
  detailedRules: `
1. Objectif du jeu

Après avoir reçu un jeu de 40 cartes de même motif, chaque joueur constitue son Ligretto (paquet de 10 cartes, à l’envers, empilé devant soi avec les chiffres vers le haut) ainsi que sa série (ce sont les 3 cartes côté à côte, chiffres vers le haut) à droite du Ligretto. 

Le joueur garde dans sa main les cartes qui lui restent. 

---

2. Manches et tours

Le jeu commence lorsqu’un joueur prononce « LIGRETTO » : il faut alors poser au plus vite un 1 si on en possède un. 
Cette carte peut être dans le Ligretto, dans la série ou même dans la main. 
Il faut alors tirer rapidement 3 cartes qui sont dans sa main, à l’envers, les empiler jusqu’à trouver le chiffre. 

Pendant ce temps les autres joueurs jouent de la même façon, les cartes montent et l’on peut alors mettre d’autres chiffres, et cela jusqu’à 10. 

---

3. Phase de Fin

La partie se termine quand un joueur a fini son paquet de Ligretto il dit alors : « LIGRETTO STOP ». Il faut ensuite compter les points.
`,
};