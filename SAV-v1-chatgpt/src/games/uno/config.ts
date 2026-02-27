import { GameConfig } from '../../core/types';

export const unoConfig: GameConfig = {
  name: 'UNO',
  minPlayers: 2,
  maxPlayers: 10,
  estimatedDuration: 20,
  age:'+5',
  category: 'Cartes',
  description: 'Jeu de cartes rapide et stratégique.',
  image: require('./asset/logo.png'), // ✅ image locale au module
  detailedRules: `Chaque joueur commence avec 7 cartes.
Le but est de se débarrasser de toutes ses cartes.
Les cartes spéciales permettent d'inverser le jeu,
faire piocher un adversaire ou changer de couleur.
Le premier joueur à atteindre 500 points gagne.
`,
};