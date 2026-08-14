import { GameConfig } from '../../core/types';

export const hiloConfig: GameConfig = {
  name: 'HILO',
  minPlayers: 2,
  maxPlayers: 6,
  estimatedDuration: 20,
  age:'+5',
  category: 'Jeu de cartes',
  lowestScoreWins: true,
  scoreLimit: 100,
  description: 'Hilo est un jeu de cartes où il faut obtenir le moins de points possible en remplaçant intelligemment ses cartes.',
  image: require('./asset/logo.png'), // ✅ image locale au module
  translations: {
    fr: {
      name: 'Hilo',
      description: 'Hilo est un jeu de cartes où il faut obtenir le moins de points possible en remplaçant intelligemment ses cartes.',
      detailedRules: `
1. Mise en place :

- Se joue de 2 à 6 joueurs avec un jeu Hilo
- Chaque joueur reçoit 9 cartes face cachée
- Les cartes sont disposées en grille de 3 x 3 devant chaque joueur
- Chaque joueur retourne 2 cartes de son choix face visible
- Le reste des cartes forme une pioche
- La première carte de la pioche est retournée pour former la défausse

---

2. But du jeu :

- Avoir le moins de points possible à la fin de la manche
- La partie se joue généralement en plusieurs manches

---

3. Déroulement d'un tour :

Le joueur actif choisit :
  - soit de piocher une carte face cachée
  - soit de prendre la carte visible de la défausse

Après avoir pris une carte, il a deux options :
  - échanger cette carte avec une carte de sa grille (face cachée ou visible)
  - la carte remplacée est alors défaussée
  - la nouvelle carte est posée face visible
  - ou refuser la carte : il la défausse puis doit retourner une carte face cachée de sa grille

---

4. Valeur des cartes :

- Les cartes ont des valeurs positives ou négatives (selon le jeu)
- Certaines cartes peuvent valoir beaucoup de points, d'autres en retirent

---

5. Règle des colonnes :

- Si un joueur réussit à aligner 3 cartes identiques dans une colonne : il peut les retirer immédiatement ces cartes ne comptent plus (0 point)

---

6. Fin de manche :

- Lorsqu'un joueur a révélé toutes ses cartes, il déclenche la fin
- Les autres joueurs jouent encore un dernier tour

---

7. Comptage des points :

- Chaque joueur additionne les points de ses cartes restantes
- Les cartes retirées (colonnes complètes) valent 0

---

8. Fin de partie :

- On joue plusieurs manches
- Le joueur avec le moins de points gagne

---

9. Conseils :

- Mémoriser les cartes retournées est essentiel
- Prendre des risques au bon moment peut réduire fortement le score
- Essayer de compléter des colonnes identiques est une stratégie clé
`,
    },
    en: {
      name: 'Hilo',
      description: 'Hilo is a card game where you try to get the fewest points possible by cleverly swapping out your cards.',
      detailedRules: `
1. Setup:

- Played by 2 to 6 players with a Hilo deck
- Each player receives 9 face-down cards
- The cards are arranged in a 3x3 grid in front of each player
- Each player flips 2 cards of their choice face up
- The rest of the cards form a draw pile
- The top card of the draw pile is flipped over to start the discard pile

---

2. Goal of the game:

- Have as few points as possible at the end of the round
- The game is usually played over several rounds

---

3. How a turn works:

The active player chooses to either:
  - draw a face-down card, or
  - take the face-up card from the discard pile

After taking a card, they have two options:
  - swap this card with a card in their grid (face down or face up)
  - the replaced card is then discarded
  - the new card is placed face up
  - or refuse the card: discard it, then flip one face-down card in their grid face up

---

4. Card values:

- Cards have positive or negative values (depending on the deck)
- Some cards can be worth a lot of points, others remove points

---

5. Column rule:

- If a player manages to line up 3 identical cards in a column, they can remove them immediately - these cards no longer count (0 points)

---

6. End of round:

- When a player has revealed all their cards, they trigger the end
- The other players each get one last turn

---

7. Scoring:

- Each player adds up the points on their remaining cards
- Removed cards (completed columns) are worth 0

---

8. End of game:

- Several rounds are played
- The player with the fewest points wins

---

9. Tips:

- Remembering flipped cards is essential
- Taking risks at the right moment can greatly reduce your score
- Trying to complete matching columns is a key strategy
`,
    },
  },
  detailedRules: `
1. Mise en place :

- Se joue de 2 à 6 joueurs avec un jeu Hilo
- Chaque joueur reçoit 9 cartes face cachée
- Les cartes sont disposées en grille de 3 x 3 devant chaque joueur
- Chaque joueur retourne 2 cartes de son choix face visible
- Le reste des cartes forme une pioche
- La première carte de la pioche est retournée pour former la défausse

---

2. But du jeu :

- Avoir le moins de points possible à la fin de la manche
- La partie se joue généralement en plusieurs manches

---

3. Déroulement d’un tour :

Le joueur actif choisit :
  - soit de piocher une carte face cachée
  - soit de prendre la carte visible de la défausse

Après avoir pris une carte, il a deux options :
  - échanger cette carte avec une carte de sa grille (face cachée ou visible)
  - la carte remplacée est alors défaussée
  - la nouvelle carte est posée face visible
  - ou refuser la carte : il la défausse puis doit retourner une carte face cachée de sa grille

---

4. Valeur des cartes :

- Les cartes ont des valeurs positives ou négatives (selon le jeu)
- Certaines cartes peuvent valoir beaucoup de points, d’autres en retirent

---

5. Règle des colonnes :

- Si un joueur réussit à aligner 3 cartes identiques dans une colonne : il peut les retirer immédiatement ces cartes ne comptent plus (0 point)

---

6. Fin de manche :

- Lorsqu’un joueur a révélé toutes ses cartes, il déclenche la fin
- Les autres joueurs jouent encore un dernier tour

---

7. Comptage des points :

- Chaque joueur additionne les points de ses cartes restantes
- Les cartes retirées (colonnes complètes) valent 0

---

8. Fin de partie :

- On joue plusieurs manches
- Le joueur avec le moins de points gagne

---

9. Conseils :

- Mémoriser les cartes retournées est essentiel
- Prendre des risques au bon moment peut réduire fortement le score
- Essayer de compléter des colonnes identiques est une stratégie clé
`,
};