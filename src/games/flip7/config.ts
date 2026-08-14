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
  translations: {
    fr: {
      name: 'Flip 7',
      description: 'Le jeu Flip 7 est un petit jeu de cartes rapide, basé sur le bluff, la prise de risque et un peu de mémoire.',
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

3. Déroulement d'un tour

À ton tour, tu choisis :
- Piocher une carte, ou s'arrêter pour garder tes points

Si tu pioches :
- Tu poses la carte devant toi
- Si c'est un chiffre : Tu continues à accumuler des points
- Si tu obtiens un doublon, tu perds tous les points du tour
- Si c'est une carte spéciale : Appliquer son effet (bonus de points, action, etc.)

Si tu t'arrêtes :
- Tu marques les points de tes cartes
- Ton score est sécurisé

---

4. FLIP 7

Si tu réussis à avoir 7 cartes différentes sans doublon : Tu fais un FLIP 7
Tu gagnes un bonus : 15 points

---

5. Fin de manche

La partie s'arrête dès qu'un joueur atteint 200 points
Le joueur avec le plus de points gagne

`,
    },
    en: {
      name: 'Flip 7',
      description: 'Flip 7 is a fast, small card game based on bluffing, risk-taking, and a bit of memory.',
      detailedRules: `
1. Goal of the game

Be the first player to reach 200 points.

---

2. Setup

- 2 to 10 players.
- Shuffle all the cards.
- Each player starts with no cards in front of them.
- Choose a starting player (or the bravest one 😄).

---

3. How a turn works

On your turn, you choose to:
- Draw a card, or stop to keep your points

If you draw:
- You place the card in front of you
- If it's a number: You keep accumulating points
- If you get a duplicate, you lose all the points from this turn
- If it's a special card: Apply its effect (points bonus, action, etc.)

If you stop:
- You score the points from your cards
- Your score is locked in

---

4. FLIP 7

If you manage to get 7 different cards with no duplicates: You make a FLIP 7
You earn a bonus: 15 points

---

5. End of round

The game ends as soon as a player reaches 200 points
The player with the most points wins

`,
    },
  },
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