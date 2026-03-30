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
  detailedRules: `
1. Objectif du jeu

Après avoir reçu un jeu de 40 cartes de même motif, chaque joueur constitue son Ligretto (paquet de 10 cartes, à l’envers, empilé devant soi avec les chiffres vers le haut) ainsi que sa série (ce sont les 3 cartes côté à côte, chiffres vers le haut) à droite du Ligretto. 

Le joueur garde dans sa main les cartes qui lui restent. 

Le jeu commence lorsqu’un joueur prononce « LIGRETTO » : il faut alors poser au plus vite un 1 si on en possède un. 
Cette carte peut être dans le Ligretto, dans la série ou même dans la main. 
Il faut alors tirer rapidement 3 cartes qui sont dans sa main, à l’envers, les empiler jusqu’à trouver le chiffre. 

Pendant ce temps les autres joueurs jouent de la même façon, les cartes montent et l’on peut alors mettre d’autres chiffres, et cela jusqu’à 10. La partie se termine quand un joueur a fini son paquet de Ligretto il dit alors : « LIGRETTO STOP ». 

Il faut ensuite compter les points.
`,
};