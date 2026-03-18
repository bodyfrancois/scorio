import { GameConfig } from '../../core/types';

export const flip7Config: GameConfig = {
  name: 'FLIP 7',
  minPlayers: 2,
  maxPlayers: 10,
  estimatedDuration: 20,
  age:'+8',
  category: 'Cartes',
  lowestScoreWins: false,
  scoreLimit: 200,
  description: 'Le jeu Flip 7 est un petit jeu de cartes rapide, basé sur le bluff, la prise de risque et un peu de mémoire.',
  image: require('./asset/logo.png'), // ✅ image locale au module
  detailedRules: `
1. Objectif du jeu

Être le premier joueur à atteindre 200 points.

---

2. Mise en place

- 2 à 10 joueurs.
- On mélange toutes les cartes.
- Chaque joueur commence sans carte devant lui.
- On désigne un premier joueur (ou le plus courageux 😄).

---

3. Déroulement d’un tour

À ton tour, tu choisis :
- Piocher une carte, ou s’arrêter pour garder tes points

Si tu pioches : 
- Tu poses la carte devant toi
- Si c’est un chiffre : Tu continues à accumuler des points
- Si tu obtiens un doublon, tu perds tous les points du tour
- Si c’est une carte spéciale : Appliquer son effet (bonus de points, action, etc.)

Si tu t’arrêtes :
- Tu marques les points de tes cartes
- Ton score est sécurisé

---

4. FLIP 7

Si tu réussis à avoir 7 cartes différentes sans doublon : Tu fais un FLIP 7
Tu gagnes un bonus : 15 points

---

5. Fin de manche

La partie s’arrête dès qu’un joueur atteint 200 points
Le joueur avec le plus de points gagne

`,
};