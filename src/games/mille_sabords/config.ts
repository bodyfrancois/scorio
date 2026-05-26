import { GameConfig } from '../../core/types';

export const milleSabordsConfig: GameConfig = {
  name: 'MILLE SABORDS',
  minPlayers: 2,
  maxPlayers: 5,
  lowestScoreWins: false,
  estimatedDuration: 30,
  age: '+8',
  category: 'Dés',
  scoreLimit: 6000,
  scoreInputMode: 'stepper',
  scoreStep: 100,
  description: "Jeu de dés et de prise de risque très amusant sur le thème des pirates",
  image: require('./asset/logo.png'), // ✅ image locale au module
  detailedRules: `
  1. Objectif du jeu

Dans Mille Sabords, vous incarnez un pirate qui doit faire le plus de butin possible en lançant des dés.
À votre tour, vous lancez les 6 dés et vous devez faire des combinaisons pour marquer des points. 
Vous pouvez décider de continuer à lancer les dés restants pour augmenter votre score, mais attention : si vous ne faites aucune combinaison à un lancer, vous perdez tous les points accumulés pendant ce tour !

  ---

  2. Manches et tours

Le jeu se joue en plusieurs manches. À chaque manche, les joueurs jouent à tour de rôle dans le sens des aiguilles d’une montre.
À votre tour, vous lancez les dés et vous marquez des points en fonction des combinaisons obtenues (voir ci-dessous). 
Après chaque lancer, si vous avez marqué des points, vous pouvez choisir de relancer les dés restants pour essayer d’augmenter votre score. 
Cependant, si à un lancer vous n’obtenez aucune combinaison, vous perdez tous les points accumulés pendant ce tour et votre tour se termine immédiatement.

--- 

  3. Combinaisons et points

Voici les différentes combinaisons et leur valeur en points :

- 1 : 100 points
- 5 : 50 points
- Trois dés identiques (autres que 1 ou 5) : valeur du dé x 100 points (ex : trois 4 = 400 points)
- Trois 1 : 1000 points
- Quatre dés identiques : double de la valeur des trois dés identiques (ex : quatre 4 = 800 points)
- Cinq dés identiques : triple de la valeur des trois dés identiques (ex : cinq 4 = 1200 points)
- Six dés identiques : quadruple de la valeur des trois dés identiques (ex : six 4 = 1600 points)

---

  4. Fin de la partie

La partie se termine lorsqu’un joueur atteint ou dépasse le score limite (6000 points par défaut). 
Le joueur avec le score le plus élevé à la fin de la partie est déclaré vainqueur. 

`,
};
