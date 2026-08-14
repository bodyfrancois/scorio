import { GameConfig } from '../../core/types';

export const sixquiprendConfig: GameConfig = {
  name: '6 QUI PREND',
  minPlayers: 2,
  maxPlayers: 10,
  estimatedDuration: 20,
  age:'+7',
  category: 'Jeu de cartes',
  lowestScoreWins: false,
  scoreLimit: 66,
  description: 'Jeu de cartes rapide où il faut éviter de récupérer des cartes pour avoir le moins de points possible.',
  image: require('./asset/logo.png'), // ✅ image locale au module
  translations: {
    fr: {
      name: '6 qui prend',
      description: 'Jeu de cartes rapide où il faut éviter de récupérer des cartes pour avoir le moins de points possible.',
      detailedRules: `
1. Objectif du jeu

Le but de ce jeu de cartes est d'avoir le moins de têtes de bœuf à la fin de la partie. Les cartes ont 2 valeurs, une valeur numérique (de 1 à 104) et une valeur de 1 à 7 représenté par des « têtes de bœufs ».

--

2. Manches et tours

Chaque manche débute avec 4 cartes tirées au hasard qui formeront 4 rangées. Lors de chaque manche, chaque joueur reçoit 10 cartes au hasard, il y aura donc 10 tours par manche. Les joueurs choisissent ensuite une carte parmi les dix et la posent face cachée. Elles seront placées plus tard dans une des 4 rangée de la plus petite à la plus grande.

Au bout d'un moment certaines rangées contiendront 5 cartes et lorsque l'un des joueurs pose sa carte en sixième place il prend les 5 cartes et pose la sienne à la première place. Lorsqu'un joueur pose une carte plus petite que celles déjà présentes sur la table il ramasse la rangée de son choix (normalement celle qui contient le moins de tête de bœuf).

---

3. Phase de Fin

A la fin de chaque manche chacun note son total sur un bloc de score et si personne n'a atteint 66 têtes de bœuf une nouvelle manche commence. La partie prend fin quand un des joueurs a atteint les 66 têtes de bœuf.
`,
    },
    en: {
      name: 'Take 6!',
      description: 'A fast card game where you must avoid picking up cards to keep your point total as low as possible.',
      detailedRules: `
1. Goal of the game

The goal of this card game is to have the fewest bull's heads at the end of the game. Cards have 2 values: a numeric value (from 1 to 104) and a value from 1 to 7 represented by "bull's heads".

--

2. Rounds and turns

Each round begins with 4 cards drawn at random to form 4 rows. In each round, each player is dealt 10 random cards, so there will be 10 turns per round. Players then each choose one of their ten cards and place it face down. The cards are later placed in one of the 4 rows, from lowest to highest.

Eventually some rows will contain 5 cards, and when a player plays a card as the sixth in a row, they take all 5 cards and place their card as the first in a new row. When a player plays a card lower than all the cards already on the table, they must pick up the row of their choice (usually the one with the fewest bull's heads).

---

3. End Phase

At the end of each round, everyone records their total on a scorepad, and if no one has reached 66 bull's heads, a new round begins. The game ends when a player reaches 66 bull's heads.
`,
    },
  },
  detailedRules: `
1. Objectif du jeu

Le but de ce jeu de cartes est d'avoir le moins de têtes de bœuf à la fin de la partie. Les cartes ont 2 valeurs, une valeur numérique (de 1 à 104) et une valeur de 1 à 7 représenté par des « têtes de bœufs ».  

--

2. Manches et tours

Chaque manche débute avec 4 cartes tirées au hasard qui formeront 4 rangées. Lors de chaque manche, chaque joueur reçoit 10 cartes au hasard, il y aura donc 10 tours par manche. Les joueurs choisissent ensuite une carte parmi les dix et la posent face cachée. Elles seront placées plus tard dans une des 4 rangée de la plus petite à la plus grande.

Au bout d’un moment certaines rangées contiendront 5 cartes et lorsque l’un des joueurs pose sa carte en sixième place il prend les 5 cartes et pose la sienne à la première place. Lorsqu’un joueur pose une carte plus petite que celles déjà présentes sur la table il ramasse la rangée de son choix (normalement celle qui contient le moins de tête de bœuf).

---

3. Phase de Fin

A la fin de chaque manche chacun note son total sur un bloc de score et si personne n’a atteint 66 têtes de bœuf une nouvelle manche commence. La partie prend fin quand un des joueurs a atteint les 66 têtes de bœuf.
`,
};