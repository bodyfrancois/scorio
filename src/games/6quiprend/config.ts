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
  detailedRules: `
Le but de ce jeu de cartes est d'avoir le moins de têtes de bœuf à la fin de la partie. Les cartes ont 2 valeurs, une valeur numérique (de 1 à 104) et une valeur de 1 à 7 représenté par des « têtes de bœufs ».  

Chaque manche débute avec 4 cartes tirées au hasard qui formeront 4 rangées. Lors de chaque manche, chaque joueur reçoit 10 cartes au hasard, il y aura donc 10 tours par manche. Les joueurs choisissent ensuite une carte parmi les dix et la posent face cachée. Elles seront placées plus tard dans une des 4 rangée de la plus petite à la plus grande.

Au bout d’un moment certaines rangées contiendront 5 cartes et lorsque l’un des joueurs pose sa carte en sixième place il prend les 5 cartes et pose la sienne à la première place. Lorsqu’un joueur pose une carte plus petite que celles déjà présentes sur la table il ramasse la rangée de son choix (normalement celle qui contient le moins de tête de bœuf).

A la fin de chaque manche chacun note son total sur un bloc de score et si personne n’a atteint 66 têtes de bœuf une nouvelle manche commence. La partie prend fin quand un des joueurs a atteint les 66 têtes de bœuf.
`,
};